$(document).ready(function() {
    var sale = sale || {};
    sale.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
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