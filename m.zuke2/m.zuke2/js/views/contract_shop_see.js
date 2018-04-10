$(document).ready(function() {
    var contract = contract || {};
    contract.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 合同确定
        confirmContract: (function() {
            $(".confirm-contract").click(function(event) {
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                    },
                    success: function(data) {
                    },
                    error: function() {
                        contract.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});