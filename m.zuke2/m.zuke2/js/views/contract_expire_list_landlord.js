$(document).ready(function() {
    var contract = contract || {};
    contract.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 删除
        delContract: (function() {
            var that,
                id,
                thatParent;
            $(document).on('click', '.contract .del', function(event) {
                event.preventDefault();
                var that = $(this);
                thatParent = that.parents('.my-box');
                id = thatParent.attr("data-id");
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        id: id
                    },
                    success: function(data) {
                        thatParent.remove();
                    },
                    error: function() {
                        contract.prototype.layerFun("删除失败，请刷新页面");
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
            var _this = contract,
                page = 1,
                stop = true, //触发开关，防止多次调用事件
                content = '';
            $(window).on("scroll", function() {
                //当内容滚动到底部时加载新的内容 当距离最底部1.5rem时开始加载
                if (_this.prototype.isScrollToPageBottom()) {
                    if (stop) {
                        stop = false;
                        // 显示加载动画
                        $(".loading-box").addClass('loading-icon');
                        // 页码+1
                        page = parseInt(page) + 1;
                        $.ajax({
                            url: "",
                            type: "GET",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
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
            return '<div class="my-box" data-id="' + data.id + '">' +
                '<div class="house-num">' +
                '<p class="f12"><span class="c-999">房源编号：</span><span class="c-333">' + data.num + '</span></p>' +
                '</div>' +
                '<a href="' + data.house_href + '" class="house-box relative">' +
                '<div class="img-box">' +
                '<img src="' + data.src + '" />' +
                '</div>' +
                '<div class="house-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.title + '</p>' +
                '<p class="f14 c-333">' + data.addr + '</p>' +
                '<p class="c-ff5555 f14 flex-bottom">' + parseInt(data.fee_rent) + '元/月</p>' +
                '</div>' +
                '<i class="icon daoqi-icon"></i></a>' +
                '<div class="order-info">' +
                '<p class="f12 mb4"><span class="c-999">租期：</span><span class="c-333">' + data.start_time + '</span><span class="c-999"> 到 </span><span class="c-333">' + data.end_time + '</span></p>' +
                '<p class="f12 mb4"><span class="c-999">下次付租日期：</span><span class="c-333">' + data.rent_time + '</span></p>' +
                '</div>' +
                '<div class="btns flex">' +
                '<div class="flex-right">' +
                '<div class="flex flex-right"><a class="del">删除</a><a href="contract_shop_edit.html">续签</a></div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    };
});