$(document).ready(function() {
    var wallet = wallet || {};
    wallet.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 选择付款方式
        selectPayMethod: (function() {
            var that;
            $(".ul-list > li").click(function(e) {
                that = $(this);
                $("ul > li input[type='radio']").prop('checked', false);
                that.find("input[type='radio']").prop('checked', true);
            });
        })(),
        // 确定
        confirm: (function() {
            var rechargeNum,
                isCheck;
            $(".wallet-btn").click(function() {
                rechargeNum = $(".recharge-num").val();
                isCheck = $("input[type='radio'][name='pay-method']").is(':checked');
                if (!rechargeNum) {
                    wallet.prototype.layerFun("请输入需要充值的金额");
                    return false;
                }
                if (!/^[0-9]*$/.test(rechargeNum)) {
                    wallet.prototype.layerFun("请填写正确的金额！");
                    return false;
                }
                if (!isCheck) {
                    wallet.prototype.layerFun("请选择支付方式！");
                    return false;
                }
            });
        })()
    };
});