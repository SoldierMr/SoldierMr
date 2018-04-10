$(document).ready(function() {
    var sale = sale || {};
    sale.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 催促
        urge: (function() {
            $(document).on('click', '.urge', function() {
                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                    },
                    success: function(json) {
                        sale.prototype.layerFun("催促成功");
                    },
                    error: function() {
                        sale.prototype.layerFun("催促失败，请刷新页面");
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
            var _this = sale,
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
            });
        })(),
        // 获取list item
        getTemplate: function(data) {
            // 如果已经评价
            if (data.ispingjia) {
                return '<a href="after_sale_details.html" class="my-box" data-id="' + data.id + '">' +
                    '<div class="house-box">' +
                    '<div class="img-box">' +
                    '<img src="' + data.src + '" />' +
                    '</div>' +
                    '<div class="house-info flex-equal">' +
                    '<p class="f14 c-333 oneEllipsis">' + data.title + '</p>' +
                    '<p class="f14 c-333 flex-grow3">' + data.addr + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="order-info">' +
                    '<p class="f12 mb4 flex"><span class="c-999">问题描述：</span><span class="c-333 flex-hang">' + data.problem + '</span></p>' +
                    '<p class="f12 mb4"><span class="c-999">申请时间：</span><span class="c-333">' + data.supply_time + '</span></p>' +
                    '<p class="f12 mt12"><span class="c-999">处理时间：</span><span class="c-333">' + data.handle_time + '</span></p>' +
                    '<p class="f12 mb4"><span class="c-999">评价：</span><span class="c-3fabfa">' + data.pingjia + '</span></p>' +
                    '</div>' +
                    '</a>';
            } else {
                return '<a href="after_sale_details.html" class="my-box" data-id="' + data.id + '">' +
                    '<div href="' + data.house_href + '" class="house-box">' +
                    '<div class="img-box">' +
                    '<img src="' + data.src + '" />' +
                    '</div>' +
                    '<div class="house-info flex-equal">' +
                    '<p class="f14 c-333 oneEllipsis">' + data.title + '</p>' +
                    '<p class="f14 c-333 flex-grow3">' + data.addr + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="order-info">' +
                    '<p class="f12 mb4 flex"><span class="c-999">问题描述：</span><span class="c-333 flex-hang">' + data.problem + '</span></p>' +
                    '<p class="f12 mb4"><span class="c-999">申请时间：</span><span class="c-333">' + data.supply_time + '</span></p>' +
                    '<p class="f12 mt12"><span class="c-999">处理时间：</span><span class="c-333">' + data.handle_time + '</span></p>' +
                    '</div>' +
                    '<object class="btns flex">' +
                    '<a href="' + data.href + '" class="flex-right">我要补充</a>' +
                    '</object>' +
                    '</a>';
            }
        }
    };
});