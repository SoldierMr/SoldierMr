$(document).ready(function() {
    var partnerList = partnerList || {};
    partnerList.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 推荐房源
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
        // 管理关注
        manageFollow: (function() {
            var that,
                fontSize = 20 * (document.documentElement.clientWidth / 320);
            $(".list-item").width(fontSize * 14.8);
            $(".list-item").parent().width($(".list-item").parent().width());
            $(".list-item").parent().height($(".list-item").parent().height());

            // 管理
            $(".manage-btn").click(function(event) {
                that = $(this);
                if (that.html() == "管理") {
                    $(".list-item").css({
                        position: 'absolute',
                        left: fontSize * 1.45
                    });
                    $(".checkbox-wrap").removeClass('hide').addClass('flex');
                    $(".del").show();
                    that.html("取消");
                } else {
                    $(".list-item").css({
                        position: 'absolute',
                        left: 0
                    });
                    $(".checkbox-wrap").removeClass('flex').addClass('hide');
                    $(".del").hide();
                    that.html("管理");
                }
            });
        })(),
        // 删除选中关注
        delHouse: (function() {
            var that,
                houseId,
                idArr = [];
            $(".del").click(function() {
                // 初始化
                idArr = [];
                $("input[type='checkbox']").each(function(index, el) {
                    that = $(el);
                    if (that.is(':checked')) {
                        idArr.push(that.attr("id"));
                    }
                });
                if (!idArr.length) {
                    partnerList.prototype.layerFun("请选择房源！");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    data: {
                        idArr: idArr
                    },
                    success: function(json) {
                        window.location.href = '';
                    },
                    error: function() {
                        partnerList.prototype.layerFun("取消关注失败，请刷新页面");
                    }
                });
            });
        })(),
        //检测滚动条是否滚动到页面底部
        isScrollToPageBottom: function() {
            var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var fontSize = 20 * (document.documentElement.clientWidth / 320);
            return pageHeight - viewportHeight - scrollHeight < 1.5 * fontSize;
        },
        // 无限加载
        windowScroll: (function() {
            var _this = partnerList,
                page = 1,
                stop = true, //触发开关，防止多次调用事件
                content = '';
            $(window).on("scroll", function() {
                //当内容滚动到底部时加载新的内容 当距离最底部1.5rem时开始加载
                if (_this.prototype.isScrollToPageBottom()) {
                    if (stop == true) {
                        stop = false;
                        // 显示加载动画
                        $(".loading-box").addClass('loading-icon');
                        // 页码+1
                        page = parseInt(page) + 1;
                        $.ajax({
                            url: "/partner/item",
                            type: "GET",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                page: page
                            },
                            success: function(json) {
                                // 加载成功后隐藏加载动画
                                $(".loading-box").removeClass('loading-icon');
                                content = '';
                                // 遍历数据
                                $.each(json, function(index, value) {
                                    content += _this.prototype.getTemplate(value);
                                });
                                // 将数据插入加载动画前面
                                $(".list-box > .loading-box").before(content);
                                stop = true; // 重置触发开关
                            },
                            error: function() {
                                _this.prototype.layerFun("加载失败，请刷新页面");
                            }
                        });
                    }
                }
            })
        })(),
        // 获取list item
        getTemplate: function(data) {
            return '<div class="relative flex hidden list-item-box">' +
                '<div class="hide align-items-center checkbox-wrap">' +
                '<span class="checkbox">' +
                '<input type="checkbox" id="c1">' +
                '<label for="c1"></label>' +
                '</span>' +
                '</div>' +
                '<a href="/ageent/' + data.lease_id + '.html" class="list-item plr12">' +
                '<div class="list-img partner-list-item">' +
                '<img src="' + data.lease_image + '" alt="头像" />' +
                '</div>' +
                '<div class="list-info partner-list-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.name + '</p>' +
                '<p class="f10">' +
                '<span class="c-333">专业能力：</span><span class="c-3fabfa">' + data.fen + '</span><span class="c-333"> 分</span>' +
                '<span class="c-333 ml8">响应速度：</span><span class="c-3fabfa">' + data.fen + '</span><span class="c-333"> 分</span>' +
                '<span class="c-333 ml8">服务态度：</span><span class="c-3fabfa">' + data.fen + '</span><span class="c-333"> 分</span>' +
                '</p>' +
                '<p class="f10"><span class="c-333">在租房源 </span><span class="c-ff5555">' + data.num + '</span><span class="c-333"> 套</span></p>' +
                '<div class="house-box flex space-between">' +
                '<object class="more"><a href="' + data.more + '">更多</a></object>' +
                '<object class="house-item-object">' +
                '<a href="/fang/' + data.lease_id + '.html" class="house-item">' +
                '<div class="house-img">' +
                '<img src="' + data.lease_image + '" alt="房源图片" />' +
                '<p class="house-addr">' + data.lease_title + '</p>' +
                '<i class="icon authentication-icon"></i>' +
                '</div>' +
                '<p class="flex align-items-center"><span class="c-999 f10">' + data.room_square + 'm²</span><span class="f12 c-ff5555 flex-right">' + parseInt(data.fee_rent) + '元/月</span></p>' +
                '</a>' +
                '</object>' +
                '<object class="house-item-object">' +
                '<a href="/fang/' + data.lease_id + '.html" class="house-item">' +
                '<div class="house-img">' +
                '<img src="' + data.lease_image + '" alt="房源图片" />' +
                '<p class="house-addr">' + data.lease_title + '</p>' +
                '<i class="icon authentication-icon"></i>' +
                '</div>' +
                '<p class="flex align-items-center"><span class="c-999 f10">' + data.room_square + 'm²</span><span class="f12 c-ff5555 flex-right">' + parseInt(data.fee_rent) + '元/月</span></p>' +
                '</a>' +
                '</object>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</div>;'
        }
    };
});