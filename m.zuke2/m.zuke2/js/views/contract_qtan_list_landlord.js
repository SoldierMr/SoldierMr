$(document).ready(function() {
    var yuyue = yuyue || {};
    yuyue.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
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
            var _this = yuyue,
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
            // 如果是word类型
            if (data.type == "word") {
                return '<div class="my-box" data-id="' + data.id + '">' +
                    '<div class="house-top flex align-items-center">' +
                    '<p class="f12"><span class="c-999">房源编号：</span><span class="c-333">' + data.num + '</span></p>' +
                    '<span class="flex-right f12 c-ff7d2f">' + data.tip + '</span>' +
                    '</div>' +
                    '<div class="house-box">' +
                    '<div class="img-box word-icon"></div>' +
                    '<div class="house-info flex-equal">' +
                    '<p class="f14 c-333 oneEllipsis">' + data.word_name + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="order-info">' +
                    '<p class="f12 mb4"><span class="c-999">租客：</span><span class="c-333">' + data.name + '</span></p>' +
                    '<p class="f12"><span class="c-999">联系电话：</span><span class="c-333">' + data.phone + '</span></p>' +
                    '</div>' +
                    '<div class="btns flex">' +
                    '<a href="" class="flex-right">查看</a>' +
                    '</div>' +
                    '</div>';
            } else {
                return '<div class="my-box" data-id="' + data.id + '">' +
                    '<div class="house-num">' +
                    '<p class="f12"><span class="c-999">房源编号：</span><span class="c-333">' + data.num + '</span></p>' +
                    '<span class="flex-right f12 c-ff7d2f">' + data.tip + '</span>' +
                    '</div>' +
                    '<a href="' + data.house_href + '" class="house-box">' +
                    '<div class="img-box">' +
                    '<img src="' + data.src + '" />' +
                    '</div>' +
                    '<div class="house-info flex-equal">' +
                    '<p class="f14 c-333 oneEllipsis">' + data.title + '</p>' +
                    '<p class="f14 c-333">' + data.addr + '</p>' +
                    '<p class="c-ff5555 f14 flex-bottom">' + parseInt(data.fee_rent) + '元/月</p>' +
                    '</div>' +
                    '</a>' +
                    '<div class="order-info">' +
                    '<p class="f12 mb4"><span class="c-999">租客：</span><span class="c-333">' + data.name + '</span></p>' +
                    '<p class="f12"><span class="c-999">联系电话：</span><span class="c-333">' + data.phone + '</span></p>' +
                    '</div>' +
                    '<div class="btns flex">' +
                    '<div class="flex-right">' +
                    '<a href="" class="flex-right">查看</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        }
    };
});