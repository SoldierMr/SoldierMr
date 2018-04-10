$(document).ready(function() {
    var partnerShop = partnerShop || {};
    partnerShop.prototype = {
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
                var _this = partnerShop,
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
        // 查看更多
        seeMore: (function() {
            var introductionHeight,
                fontSize = 20 * (document.documentElement.clientWidth / 320),
                state = '';
            $(".introduction-box .toggle").click(function() {
                state = $(this).attr("data-state");
                if (state == '0') {
                    introductionHeight = $(".introduction .flex-hang").height();
                    $(".introduction").animate({
                        height: introductionHeight
                    }, 300);
                    $(this).addClass('shangla-icon').removeClass('xiala-active-icon').attr("data-state", "1");
                } else {
                    $(".introduction").animate({
                        height: 1.7 * fontSize
                    }, 300);
                    $(this).addClass('xiala-active-icon').removeClass('shangla-icon').attr("data-state", "0");
                }
            });
        })(),
        // tabs切换 - 在租房源，小区信息
        tabsSwitch: (function() {
            $(".tabs .tab").click(function() {
                $(".tabs .tab").eq($(this).index()).addClass("active").siblings().removeClass("active");
                $(".tab-content").hide().eq($(this).index()).show();
            });
        })()
    };
});