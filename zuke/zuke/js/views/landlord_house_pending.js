$(document).ready(function() {
    var landlord = landlord || {};
    landlord.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
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
        })(),
        // 搜索
        search: (function() {
            var searchVal;
            $(".input-box button").click(function(e) {
                e.preventDefault();
                searchVal = $(".input-box input").val();
                if (!$.trim(searchVal)) {
                    landlord.prototype.layerFun("请输入搜索内容");
                    $(".input-box input").focus();
                    return false;
                }

                window.location.href = "";
            });
        })()
    };
});