$(document).ready(function() {
    var list = list || {};
    list.prototype = {
        // 搜索
        search: (function() {
            $(".search-btn").click(function(e) {
                e.stopPropagation();
                window.location.href = '/partner?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&search=' + $('#search').val();
            });
        })()
    };
});