$(document).ready(function() {
    var sale = sale || {};
    sale.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 提交
        saleSub: (function() {
            var _this = sale,
                satisfaction,
                pingyu;
            $(".release-sub").click(function() {
                satisfaction = $("input[name='satisfaction']:checked").val();
                pingyu = $(".problem-desc").val();
                console.log(satisfaction, pingyu);
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        satisfaction: satisfaction,
                        pingyu: pingyu
                    },
                    success: function(data) {
                        _this.prototype.layerFun("提交成功");
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});