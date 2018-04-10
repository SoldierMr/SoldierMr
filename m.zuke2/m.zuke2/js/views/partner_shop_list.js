$(document).ready(function() {
    var partnerShopList = partnerShopList || {};
    partnerShopList.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 分享转发
        forwarding: (function() {
            $(".forwarding").click(function() {
                soshm.popIn({
                    sites: ['weixin', 'weixintimeline', 'weibo', 'qzone', 'qq']
                });
            });
        })(),
        // 关注
        follow: (function() {
            $(".follow").click(function(event) {
                var _this = partnerShopList,
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
            var _this = partnerShopList,
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
                            url: "/shop/item",
                            type: "GET",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: $("#district").val(),
                                region: $("#region").val(),
                                line: $("#line").val(), // 地铁线路
                                station: $("#station").val(), // 地铁站台
                                rentstart: $("#rentstart").val(),
                                rentend: $("#rentend").val(),
                                squarestart: $("#squarestart").val(), // 小面积
                                squareend: $("#squareend").val(),// 大面积
                                characteristic: $("#characteristic").val(), // 特色
                                search: $("#search").val(),
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
            var type = '';
            type += data.room_square + 'm²/' + data.house_floor + data.house_total_floor + '层';

            var characteristic = '';
            if (data.zufang_characteristic != '' && data.zufang_characteristic != null && data.zufang_characteristic != 'undefined') {
                var zufang_characteristic = eval('(' + data.zufang_characteristic + ')');
                $.each(zufang_characteristic, function(index, value) {
                    characteristic += '<span class="list-note list-note-type' + (index + 1) + '">' + value + '</span>';
                    if (index == 2) return false;
                });
            }

            return '<a href="/fang/' + data.lease_id + '.html" class="list-item plr12">' +
                '<div class="list-img">' +
                '<img src="' + data.lease_image + '" alt="商铺图片" />' +
                '</div>' +
                '<div class="list-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.lease_title + '</p>' +
                '<p class="clearfix"><span class="f12 c-999 left">' + type + '</span><span class="c-ff5555 f14 right">' + parseInt(data.fee_rent) + '元/月</span></p>' +
                '<p class="flex"><i class="icon location-icon"></i><span class="f12 c-999 oneEllipsis">' + data.community_name + '</span></p>' +
                '<p class="list-notes">' + characteristic + '</p>' +
                '</div>' +
                '</a>';
        }
    };
});