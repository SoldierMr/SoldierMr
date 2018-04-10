$(document).ready(function() {
    var xqDetails = xqDetails || {};
    xqDetails.prototype = {
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
                        $(".xq-details > .top-fixed").addClass('bg-fff bb-ddd').html('<a href="javascript:history.go(-1)" class="return-icon ml15"></a><span class="f16 c-333 absolute translateHalf">小区详情</span>');
                        stop = false;
                    }
                } else {
                    if (!stop) {
                        $(".xq-details > .top-fixed").removeClass('bg-fff bb-ddd').html('<a href="javascript:history.go(-1)" class="return-white-icon ml15"></a>');
                        stop = true;
                    }
                }
            })
        })(),
        // tabs切换 - 在租房源，小区信息
        tabsSwitch: (function() {
            $(".tabs .tab").click(function() {
                $(".tabs .tab").eq($(this).index()).addClass("active").siblings().removeClass("active");
                $(".tab-content").hide().eq($(this).index()).show();
            });
        })(),
        // 推荐小区
        recommendHouse: (function() {
            var fontSize = 20 * (document.documentElement.clientWidth / 320),
                recommendHouse = new Swiper('.recommend-house', {
                slidesPerView: 1.825,
                spaceBetween: 0.6 * fontSize, // slide之间的距离
                slidesOffsetBefore: 0.6 * fontSize, // 设定slide与左边框的预设偏移量
                slidesOffsetAfter: 0.6 * fontSize, // 设定slide与右边框的预设偏移量
                freeMode: true,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper 
                observeParents: true //修改swiper的父元素时，自动初始化swiper 
            });
        })(),
        // 小区详情弹出
        xqPop: (function() {
            $(".xq").click(function() {
                $(".xq-pop").show();
                xqDetails.prototype.modalHelper.afterOpen();
            });
        })(),
        // 小区详情隐藏
        xqHide: (function() {
            $(".close-xq").click(function() {
                xqDetails.prototype.modalHelper.beforeClose();
                $(".xq-pop").hide();
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
        })()
    };
});