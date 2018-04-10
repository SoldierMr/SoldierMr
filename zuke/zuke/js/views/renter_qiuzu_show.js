$(document).ready(function() {
    var landlord = landlord || {};
    landlord.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 下架
        off: (function() {
            var that,
                thatId;
            $(".off").click(function(e) {
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
                        landlord.prototype.layerFun("已结束");
                    },
                    error: function() {
                        landlord.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 删除
        del: (function() {
            var that,
                thatId;
            $(".del").click(function(e) {
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
                        landlord.prototype.layerFun("已结束");
                    },
                    error: function() {
                        landlord.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});