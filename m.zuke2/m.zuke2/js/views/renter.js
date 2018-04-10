$(document).ready(function() {
    var renter = renter || {};
    renter.prototype = {
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
        tabsSwitch: (function() {
            $(".tabs ul li").click(function() {
                $(".tabs ul li").eq($(this).index()).addClass("active").siblings().removeClass("active");
                $(".tab-content").hide().eq($(this).index()).show();
            });
        })(),
        // 发布弹出
        fabuPop: (function() {
            $(".fabu").click(function() {
                $(".fabu-pop").fadeIn();
                $(".close-fabu > i").addClass('close-fabu-ani');
                $(".fabu-qiuzu").css({
                    transition: 'all .3s ease-in-out .2s',
                    bottom: '10rem',
                    opacity: '1'
                });
                $(".fabu-zufang").css({
                    transition: 'all .3s ease-in-out .2s',
                    bottom: '4rem',
                    opacity: '1'
                });
                renter.prototype.modalHelper.afterOpen();
            });
        })(),
        // 发布关闭
        fabuClose: (function() {
            $(".close-fabu").click(function() {
                renter.prototype.modalHelper.beforeClose();
                var fontSize = 20 * (document.documentElement.clientWidth / 320);
                $(".fabu-qiuzu,.fabu-zufang").css({
                    transition: 'all .2s ease-in-out',
                    bottom: -5.5 * fontSize,
                    opacity: '0'
                });
                setTimeout(function() {
                    $(".fabu-pop").fadeOut(200);
                    setTimeout(function() {
                        $(".close-fabu > i").removeClass('close-fabu-ani');
                    }, 200);
                }, 200);
            });
        })()
    };
});