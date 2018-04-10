$(document).ready(function() {
    var list = list || {};
    list.prototype = {
    	// 区间
        range: (function() {
            $(".price-btn").click(function() {
                window.location.href = '/qiuzu/shop?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&rent=' + $('.rent').val() + '&square=' + $('#square').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
            $(".square-btn").click(function() {
                window.location.href = '/qiuzu/shop?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&rent=' + $('#rent').val() + '&square=' + $('.square').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
        })(),
        // 搜索
        search: (function() {
            $(".search-btn").click(function(e) {
                e.stopPropagation();
                window.location.href = '/qiuzu/shop?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&rent=' + $('#rent').val() + '&square=' + $('#square').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
        })()
    };
});