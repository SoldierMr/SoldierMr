$(document).ready(function() {
    var shopList = shopList || {};
    shopList.prototype = {
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
        // 弹出搜索框
        searchPop: (function() {
            $(".list-search-icon").click(function() {
                $(".search-fixed").removeClass('hide').addClass('flex');
            });
        })(),
        // 隐藏搜索框
        searchHide: (function() {
            $(".search-hide").click(function() {
                $(".search-fixed").removeClass('flex').addClass('hide');
            });
        })(),
        // 搜素
        search: (function() {
            $(".search-btn").click(function() {
                window.location.href = "/shop?search=" + encodeURIComponent($("#search").val());
            });
        })(),
        // 删除选中房源
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
                    shopList.prototype.layerFun("请选择商铺！");
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
                        shopList.prototype.layerFun("删除失败，请刷新页面");
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
            var _this = shopList,
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
                            data: {
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
                                // 图片懒加载
                                $("img[src][data-src]").scrollLoading();
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
            var type = "";
            type += data.room_square + 'm² | ' + data.house_floor + data.house_total_floor + '层';

            return '<div class="flex plr12">' +
                '<div class="flex align-items-center checkbox-wrap">' +
                '<span class="checkbox">' +
                '<!-- 传入对应房源的id.. -->' +
                '<input type="checkbox" id="' + data.house_id + '">' +
                '<label for="' + data.house_id + '"></label>' +
                '</span>' +
                '</div>' +
                '<a href="house_details.html" class="list-item">' +
                '<div class="list-img">' +
                '<img src="images/lazyload-default.png" data-src="' + data.lease_image + '" alt="房源图片" />' +
                '</div>' +
                '<div class="list-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.lease_title + '</p>' +
                '<p class="f12 c-999">' + type + '</p>' +
                '<p class="flex"><i class="icon location-icon"></i><span class="f12 c-999">' + data.community_name + '</span></p>' +
                '<p class="c-ff5555 f14">' + parseInt(data.fee_rent) + '元/月</p>' +
                '</div>' +
                '</a>' +
                '</div>';
        }
    };
});