$(document).ready(function() {
    var partner = partner || {};
    partner.prototype = {
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
                partner.prototype.modalHelper.afterOpen();
            });
        })(),
        // 发布关闭
        fabuClose: (function() {
            $(".close-fabu").click(function() {
                partner.prototype.modalHelper.beforeClose();
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
        })(),
        // 小图放大
        zoomIn: (function() {
            var that,
                img,
                thatSrc,
                thatDataZoomifySize;
            $(document).on('click', 'img.zoomify', function() {
                that = $(this);
                thatSrc = that.attr("data-imgsrc");
                thatDataZoomifySize = that.attr("data-zoomifySize");
                img = new Image();
                console.log(thatDataZoomifySize);
                img.src = thatSrc;
                if (thatDataZoomifySize) {
                    if (img.width < img.height) {
                        $(".zoomify-shadow .zoomify-img").css({
                            width: "auto",
                            height: thatDataZoomifySize + "%"
                        });
                    } else {
                        $(".zoomify-shadow .zoomify-img").css({
                            width: thatDataZoomifySize + "%",
                            height: "auto"
                        });
                    }
                } else {
                    if (img.width < img.height) {
                        $(".zoomify-shadow .zoomify-img").addClass('widthAuto');
                    } else if (img.width == img.height) {
                        $(".zoomify-shadow .zoomify-img").addClass('widthAuto');
                    } else {
                        $(".zoomify-shadow .zoomify-img").addClass('heightAuto');
                    }
                }
                $(".zoomify-shadow .zoomify-img").attr("src", thatSrc);
                $(".zoomify-shadow").animate({
                    opacity: 1,
                    'z-index': 100
                }, 10);
            });
        })(),
        // 大图缩小
        zoomOut: (function() {
            $(document).on('click', '.zoomify-shadow, .zoomify-img', function() {
                $(".zoomify-shadow .zoomify-img").attr({ "src": "", "style": "" }).removeClass().addClass("zoomify-img");
                $(".zoomify-shadow").animate({
                    opacity: 0,
                    'z-index': -1
                }, 100);
            });
        })()
    };
});