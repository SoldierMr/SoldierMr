$(document).ready(function() {
    var officeDetails = officeDetails || {};
    officeDetails.prototype = {
        // 滚动穿透
        modalHelper: (function(bodyCls) {
            var scrollTop;
            return {
                afterOpen: function() {
                    scrollTop = document.scrollingElement.scrollTop;
                    document.body.classList.add(bodyCls);
                    document.body.style.top = -scrollTop + 'px';
                },
                beforeClose: function() {
                    document.body.classList.remove(bodyCls);
                    // scrollTop lost after set position:fixed, restore it back.
                    document.scrollingElement.scrollTop = scrollTop;
                }
            };
        })('modal-open'),
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 轮播图
        carousel: (function() {
            var carousel = new Swiper('.carousel', {
                direction: "horizontal", //横向滑动                
                loop: true, //形成环路（即：可以从最后一张图跳转到第一张图
                pagination: ".swiper-pagination",
                paginationType: 'fraction',
                autoplay: 3000 // 每隔3秒自动播放
            });
        })(),
        // 返回栏变化
        windowScroll: (function() {
            // 防止多次触发
            var stop = true;
            $(window).on("scroll", function() {
                if ($(this).scrollTop() > 100) {
                    if (stop) {
                        $(".office-details > .top-fixed").addClass('bg-fff bb-ddd').html('<a href="javascript:history.go(-1)" class="return-icon ml15"></a><span class="f16 c-333 absolute translateHalf">写字楼详情</span>');
                        stop = false;
                    }
                } else {
                    if (!stop) {
                        $(".office-details > .top-fixed").removeClass('bg-fff bb-ddd').html('<a href="javascript:history.go(-1)" class="return-white-icon ml15"></a>');
                        stop = true;
                    }
                }
            })
        })(),
        // 分享转发
        forwarding: (function() {
            $(".forwarding").click(function() {
                soshm.popIn({
                    sites: ['weixin', 'weixintimeline', 'weibo', 'qzone', 'qq']
                });
            });
        })(),
        // 推荐店铺
        recommendHouse: (function() {
            var fontSize = 20 * (document.documentElement.clientWidth / 320);
            var recommendHouse = new Swiper('.recommend-house', {
                slidesPerView: 1.825,
                spaceBetween: 0.6 * fontSize, // slide之间的距离
                slidesOffsetBefore: 0.6 * fontSize, // 设定slide与左边框的预设偏移量
                slidesOffsetAfter: 0.6 * fontSize, // 设定slide与右边框的预设偏移量
                freeMode: true
            });
        })(),
        // 关注
        follow: (function() {
            $(".follow").click(function(event) {
                var _this = officeDetails,
                    stop = true;
                event.preventDefault();
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "/fang/like",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            "sn": "942"
                        },
                        success: function(data) {
                            stop = true;
                            if (data.result == "10000") {
                                if (data.val == "add") {
                                    $(".follow").html('<i class="icon heart-icon"></i>已关注');
                                } else {
                                    $(".follow").html('<i class="icon heart-fine-icon"></i>关注');
                                }
                            } else if (data.result == "30000") {
                                window.location.href = "/login.html";
                            } else {
                                _this.prototype.layerFun("操作失败，请刷新页面");
                            }
                        },
                        error: function() {
                            _this.prototype.layerFun("关注失败，请刷新页面");
                        }
                    });
                }
            });
        })(),
        // 地图
        map: (function() {
            // 创建地图实例
            var map = new BMap.Map("map");
            // 获取经纬度
            var longitude = $("#map").attr("data-longitude"), // 经度
                latitude = $("#map").attr("data-latitude"); // 纬度
            // 创建点坐标
            var point = new BMap.Point(longitude, latitude);
            // 初始化地图，设置中心点坐标和地图级别
            map.centerAndZoom(point, 15);
        })(),
        // 预约看房弹出
        yuyuePop: (function() {
            $(".yuyue-house-btn").click(function(event) {
                $(".yuyue-pop").show();
                officeDetails.prototype.modalHelper.afterOpen();
            });
        })(),
        // 预约看房隐藏
        yuyueHide: (function() {
            $(".close-yuyue").click(function(event) {
                officeDetails.prototype.modalHelper.beforeClose();
                $(".yuyue-pop").hide();
            });
        })(),
        // 选择预约时间
        selectDate: (function() {
            var calendar = new datePicker();
            calendar.init({
                'trigger': '#yuyue-time',
                /*按钮选择器，用于触发弹出插件*/
                'type': 'datetime',
                /*模式：date日期；datetime日期时间；time时间；ym年月；*/
                'minDate': '1900-1-1',
                /*最小日期*/
                'maxDate': '2100-12-31',
                /*最大日期*/
                'onSubmit': function() { /*确认时触发事件*/
                    var theSelectData = calendar.value;
                    $("#yuyue-time").val(theSelectData);
                },
                'onClose': function() { /*取消时触发事件*/ }
            });
        })(),
        // 提交
        yuyueSubmit: (function() {
            $(".yuyue-submit-btn").click(function() {
                var _this = officeDetails,
                    userName = $("#user-name").val(),
                    userPhone = $("#user-phone").val(),
                    yuyueTime = $("#yuyue-time").val();

                if (!userName) {
                    _this.prototype.layerFun("请输入联系人姓名！");
                } else if (!userPhone) {
                    _this.prototype.layerFun("请输入联系人手机号！");
                } else if (!yuyueTime) {
                    _this.prototype.layerFun("请选择看房时间！");
                } else {
                    $.ajax({
                        url: "",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            userName: userName,
                            userPhone: userPhone,
                            yuyueTime: yuyueTime
                        },
                        success: function(json) {
                            $(".yuyue-pop").hide();
                            _this.prototype.layerFun("预约成功！");
                        },
                        error: function() {
                            _this.prototype.layerFun("加载失败");
                        }
                    });
                }
            });
        })()
    };
});