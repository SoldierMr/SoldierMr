$(document).ready(function() {
    var home = home || {};
    home.prototype = {
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
        // 轮播图
        carousel: (function() {
            var carousel = new Swiper('.carousel', {
                direction: "horizontal", //横向滑动                
                loop: true, //形成环路（即：可以从最后一张图跳转到第一张图
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                autoplay: 3000 // 每隔3秒自动播放
            });
        })(),
        // 
        searchToggle: (function() {
            $(".home-search form dl").hover(function() {
                $(this).children("dd").show();
            }, function() {
                $(this).children("dd").hide();
            });
        })(),
        searchTypeCheck: (function() {
            var that,
                data1 = '<li data-param="/office">搜写字楼</li><li data-param="/shop">搜商铺</li>',
                data2 = '<li data-param="/fang">搜住宅</li><li data-param="/shop">搜商铺</li>',
                data3 = '<li data-param="/fang">搜住宅</li><li data-param="/office">搜写字楼</li>';
            $(document).on('click', '.home-search form dl dd ul li', function(e) {
                e.preventDefault();
                that = $(this);
                $(".home-search form dl dt").html(that.html());
                $("#form-search").attr("action", that.attr("data-param"));
                switch (that.attr("data-param")) {
                    case '/fang':
                        $("#banner-search-select").html(data1);
                        break;
                    case '/office':
                        $("#banner-search-select").html(data2);
                        break;
                    case '/shop':
                        $("#banner-search-select").html(data3);
                        break;
                }
            });
        })()
    };
});