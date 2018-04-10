$(document).ready(function() {
    var list = list || {};
    list.prototype = {
        // 区间
        range: (function() {
            $(".price-btn").click(function() {
                window.location.href = '/office?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&rentstart=' + $('.rentstart').val() + '&rentend=' + $('.rentend').val() + '&squarestart=' + $('#squarestart').val() + '&squareend=' + $('#squareend').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
            $(".square-btn").click(function() {
                window.location.href = '/office?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&rentstart=' + $('#rentstart').val() + '&rentend=' + $('#rentend').val() + '&squarestart=' + $('.squarestart').val() + '&squareend=' + $('.squareend').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
        })(),
        // 搜索
        search: (function() {
            $(".search-btn").click(function(e) {
                e.stopPropagation();
                window.location.href = '/office?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&rentstart=' + $('#rentstart').val() + '&rentend=' + $('#rentend').val() + '&squarestart=' + $('#squarestart').val() + '&squareend=' + $('#squareend').val() + '&characteristic=' + $('#characteristic').val() + '&search=' + $('#search').val();
            });
        })(),
        // 分类切换
        subsectionItemSwitch: (function() {
            $(".subsection-item").click(function() {
                $(".subsection-item").eq($(this).index()).addClass("active").siblings().removeClass("active");
                $(".criteria-item[name='" + $(this).attr("name") + "']").show();
                if ($(this).attr("name") == "area") {
                    $(".criteria-item[name='metro']").hide();
                }
                if ($(this).attr("name") == "metro") {
                    $(".criteria-item[name='area']").hide();
                }
            });
        })()
    };
});