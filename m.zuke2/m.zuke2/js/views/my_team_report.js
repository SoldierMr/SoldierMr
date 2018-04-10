$(document).ready(function() {
    var team = team || {};
    team.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 固定导航
        fixedNav: (function() {
            var navOffset = $(".tabs.tiX").offset().top,
                scrollPos,
                fontSize = 20 * (document.documentElement.clientWidth / 320);
            $(window).scroll(function() {
                scrollPos = $(window).scrollTop();
                if (scrollPos >= navOffset - 1.85 * fontSize) {
                    $(".tabs.tiX").css({
                        height: $(".tabs.tiX ul").height(),
                    });
                    $(".tabs.tiX ul").css({
                        position: 'fixed',
                        left: '0',
                        top: '1.85rem',
                        width: '100%'
                    });
                } else {
                    $(".tabs.tiX").removeAttr('style');
                    $(".tabs.tiX ul").removeAttr('style');
                }
            });
        })(),
        //检测滚动条是否滚动到页面底部
        isScrollToPageBottom: function() {
            var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight),
                viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0,
                scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
                fontSize = 20 * (document.documentElement.clientWidth / 320);
            return pageHeight - viewportHeight - scrollHeight < 1.5 * fontSize;
        },
        // 无限加载
        windowScroll: (function() {
            var _this = team,
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
                        // 积分
                        $.ajax({
                            url: "",
                            type: "GET",
                            dataType: "json",
                            data: {
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
            });
        })(),
        // 获取list item
        getTemplate: function(data) {
            return '<a href="' + data.href + '" class="my-box" data-id="' + data.id + '">' +
                '<div class="house-top flex align-items-center">' +
                '<p class="f12"><span class="c-999">报告编号：</span><span class="c-333">' + data.num + '</span></p>' +
                '</div>' +
                '<div class="report-box">' +
                '<div class="report-info">' +
                '<div class="avatar-box">' +
                '<div class="avatar"><img src="' + data.avatar + '" alt="下级头像" /></div>' +
                '<p class="f14 c-333 ml8">' + data.name + '</p>' +
                '</div>' +
                '<p class="f12"><span class="c-999">客户名：</span><span class="c-333">' + data.customer_name + '</span></p>' +
                '<p class="f12"><span class="c-999">客户电话：</span><span class="c-333">' + data.customer_phone + '</span></p>' +
                '<p class="f12"><span class="c-999">时间：</span><span class="c-333">' + data.customer_time + '</span></p>' +
                '</div>' +
                '<div class="report-img">' +
                '<img src="' + data.src + '" />' +
                '</div>' +
                '</div>' +
                '</a>';
        }
    };
});