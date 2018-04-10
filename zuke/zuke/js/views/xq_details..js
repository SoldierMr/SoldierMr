$(document).ready(function() {
    var details = details || {};
    details.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 缩略图
        carousel: (function() {
            var viewSwiper = new Swiper('.view .swiper-container', {
                onSlideChangeStart: function() {
                    updateNavPosition()
                }
            });
            var previewSwiper = new Swiper('.preview .swiper-container', {
                slidesPerView: 'auto',
                allowTouchMove: false,
                direction: 'vertical',
                onTap: function() {
                    viewSwiper.slideTo(previewSwiper.clickedIndex)
                }
            });
            $('.preview .arrow-left').on('click', function(e) {
                e.preventDefault();
                if (viewSwiper.activeIndex == 0) {
                    viewSwiper.slideTo(viewSwiper.slides.length - 1, 1000);
                    return
                }
                viewSwiper.slidePrev();
            });
            $('.preview .arrow-right').on('click', function(e) {
                e.preventDefault();
                if (viewSwiper.activeIndex == viewSwiper.slides.length - 1) {
                    viewSwiper.slideTo(0, 1000);
                    return
                }
                viewSwiper.slideNext();
            });

            function updateNavPosition() {
                $('.preview .active-nav').removeClass('active-nav')
                var activeNav = $('.preview .swiper-slide').eq(viewSwiper.activeIndex).addClass('active-nav')
                if (!activeNav.hasClass('swiper-slide-visible')) {
                    if (activeNav.index() > previewSwiper.activeIndex) {
                        var thumbsPerNav = Math.floor(previewSwiper.width / activeNav.width()) - 1
                        previewSwiper.slideTo(activeNav.index() - thumbsPerNav)
                    } else {
                        previewSwiper.slideTo(activeNav.index())
                    }
                }
            }
        })(),
        // 关注
        follow: (function() {
            $(".follow").click(function() {
                var _this = details,
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
                                    $(".follow").html('已关注');
                                } else {
                                    $(".follow").html('关注房源');
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
        })()
    };
});
