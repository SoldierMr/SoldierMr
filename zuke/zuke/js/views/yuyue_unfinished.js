$(document).ready(function() {
    var yuyue = yuyue || {};
    yuyue.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 取消预约
        cancelYuyue: (function() {
            var that,
                thatId;
            $(".cancel-yuyue").click(function(e) {
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
                        that.parents("tr").remove();
                        yuyue.prototype.layerFun("已取消预约");
                    },
                    error: function() {
                        yuyue.prototype.layerFun("取消预约失败，请刷新页面");
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
                    yuyue.prototype.layerFun("请输入搜索内容");
                    $(".input-box input").focus();
                    return false;
                }

                window.location.href = "";
            });
        })()
    };
});