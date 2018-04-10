$(document).ready(function() {
    var sale = sale || {};
    sale.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 催促
        urge: (function() {
            var that,
                thatId;
            $(".urge").click(function(e) {
                e.preventDefault();
                that = $(this);
                thatId = that.attr("data-id");
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        id: thatId,
                    },
                    success: function(data) {
                        sale.prototype.layerFun("已催促");
                    },
                    error: function() {
                        sale.prototype.layerFun("催促失败，请刷新页面");
                    }
                });
            });
        })(),
        // 搜索
        search: (function() {
            var searchVal;
            $(".input-box button").click(function(e) {
                e.preventDefault();
                searchVal = $(".input-box input").val();
                if (!$.trim(searchVal)) {
                    sale.prototype.layerFun("请输入搜索内容");
                    $(".input-box input").focus();
                    return false;
                }

                window.location.href = "";
            });
        })()
    };
});