$(document).ready(function() {
    var newsDetails = newsDetails || {};
    newsDetails.prototype = {
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
        // 分享转发
        forwarding: (function() {
            $(".forwarding").click(function() {
                soshm.popIn({
                    sites: ['weixin', 'weixintimeline', 'weibo', 'qzone', 'qq']
                });
            });
        })()
    };
});