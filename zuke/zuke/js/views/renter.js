$(document).ready(function() {
    var renter = renter || {};
    renter.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 提前结束
        end: (function() {
            var that,
                thatId;
            $(".end").click(function(e) {
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
                        renter.prototype.layerFun("已结束");
                    },
                    error: function() {
                        renter.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});