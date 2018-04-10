$(document).ready(function() {
    var list = list || {};
    list.prototype = {
        // 搜索
        search: (function() {
            $(".search-btn").click(function(e) {
                e.stopPropagation();
                window.location.href = '/xq?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
        })()
    };
});