$(document).ready(function() {
    var qiuzu = qiuzu || {};
    qiuzu.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 删除求租
        deleteQiuzu: (function() {
            var _this = qiuzu,
                that,
                qiuzuId,
                stop = true;
            $(document).on('click', '.delete-qiuzu', function(e) {
                e.preventDefault();
                that = $(this);
                qiuzuId = that.parents(".my-box").attr("data-id");
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "",
                        type: "GET",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            id: qiuzuId
                        },
                        success: function(json) {
                            that.parents(".my-box").remove();
                            _this.prototype.layerFun("已删除");
                            stop = true; // 重置触发开关
                        },
                        error: function() {
                            _this.prototype.layerFun("删除失败，请刷新页面");
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
            var _this = qiuzu,
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
            return '<div class="my-box" data-id="' + data.qiuzu_id + '">' +
                '<a href="/qiuzu/' + data.qiuzu_id + '.html" class="list-item">' +
                '<div class="list-info flex-equal plr12">' +
                '<p class="flex align-items-center">' +
                '<span class="title f14 c-333 oneEllipsis">' + data.qiuzu_title + '</span>' +
                '</p>' +
                '<p class="flex align-items-center">' +
                '<span class="flex">' +
                '<i class="icon location-icon"></i>' +
                '<span class="f12 c-999">期望区域：' + data.district_name + '</span>' +
                '</span>' +
                '<span class="c-ff5555 f14 flex-right">' + data.rent_start + ' - ' + data.rent_end + '元/月</span>' +
                '</p>' +
                '<p class="flex">' +
                '<i class="icon qiuzu-type-icon"></i>' +
                '<span class="f12 c-999">' + data.fang_bedroom + ' | ' + data.square_start + ' - ' + data.square_end + 'm²</span>' +
                '</p>' +
                '</div>' +
                '</a>' +
                '<div class="btns flex">' +
                '<div class="flex flex-right">' +
                '<a href="release_qiuzu.html">编辑</a><a class="delete-qiuzu">删除</a>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    };
});