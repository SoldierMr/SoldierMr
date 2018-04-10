$(document).ready(function() {
    var list = list || {};
    list.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 下拉框
        select: (function() {
            var that;
            // 展开
            $(".select > span").click(function(e) {
                e.stopPropagation();
                that = $(this);
                if (that.parents(".select").children('ul').is(":hidden")) {
                    $(".select > ul").hide();
                    $(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');

                    that.parents(".select").children('ul').show();
                    that.find(".select-val").siblings('i').removeClass('xiala-icon').addClass('shangla-active-icon');
                } else {
                    that.parents(".select").children('ul').hide();
                    that.find(".select-val").siblings('i').removeClass('shangla-active-icon').addClass('xiala-icon');
                }
            });
            // 收缩
            $(".select ul li").click(function(e) {
                e.stopPropagation();
                that = $(this);
                that.parents(".select").find(".select-val").html(that.attr("data-value"));
                that.parents(".select").find(".select-val").attr("value", that.attr("data-value"));
                that.parents(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');
                that.parents(".select").children('ul').hide();
            });
            //
            $(document).click(function(e) {
                e.stopPropagation();
                $(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');
                $(".select > ul").hide();
            });
        })(),
        // 下拉框
        select: (function() {
            var that;
            // 展开
            $(document).on('click', '.select > span', function(e) {
                e.stopPropagation();
                that = $(this);
                if (that.parents(".select").children('ul').is(":hidden")) {
                    $(".select > ul").hide();
                    $(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');

                    that.parents(".select").children('ul').show();
                    that.find(".select-val").siblings('i').removeClass('xiala-icon').addClass('shangla-active-icon');
                } else {
                    that.parents(".select").children('ul').hide();
                    that.find(".select-val").siblings('i').removeClass('shangla-active-icon').addClass('xiala-icon');
                }
            });
            // 收缩
            $(document).on('click', '.select ul li', function(e) {
                e.stopPropagation();
                that = $(this);
                that.parents(".select").find(".select-val").html(that.html());
                that.parents(".select").find(".select-val").attr("value", that.html());
                that.parents(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');
                that.parents(".select").children('ul').hide();
            });
            //
            $(document).click(function(e) {
                e.stopPropagation();
                $(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');
                $(".select > ul").hide();
            });
        })(),
        // 区间
        range: (function() {
            $(".price-btn").click(function(e) {
                e.stopPropagation();
                window.location.href = '/fang?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&bedroom=' + $('#bedroom').val() + '&rentstart=' + $('.rentstart').val() + '&rentend=' + $('.rentend').val() + '&characteristic=' + $('#characteristic').val() + '&decoration=' + $('#decoration').val() + '&orientation=' + $('#orientation').val() + '&search=' + $('#search').val();
            });
        })(),
        // 搜索
        search: (function() {
            $(".search-btn").click(function(e) {
                e.stopPropagation();
                window.location.href = '/fang?district=' + $('#district').val() + '&region=' + $('#region').val() + '&line=' + $('#line').val() + '&station=' + $('#station').val() + '&bedroom=' + $('#bedroom').val() + '&rentstart=' + $('#rentstart').val() + '&rentend=' + $('#rentend').val() + '&characteristic=' + $('#characteristic').val() + '&decoration=' + $('#decoration').val() + '&orientation=' + $('#orientation').val() + '&search=' + $('#search').val();
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