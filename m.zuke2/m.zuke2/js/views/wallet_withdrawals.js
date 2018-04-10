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
        // 滚动穿透
        modalHelper: (function(bodyCls) {
            var scrollTop;
            return {
                afterOpen: function() {
                    scrollTop = document.scrollingElement.scrollTop;
                    document.body.classList.add(bodyCls);
                    document.body.style.top = -scrollTop + 'px';
                },
                beforeClose: function() {
                    document.body.classList.remove(bodyCls);
                    // scrollTop lost after set position:fixed, restore it back.
                    document.scrollingElement.scrollTop = scrollTop;
                }
            };
        })('modal-open'),
        // 选择付款方式
        selectPayMethod: (function() {
            var that;
            $(".ul-list > li").click(function(e) {
                that = $(this);
                $("ul > li input[type='radio']").prop('checked', false);
                that.find("input[type='radio']").prop('checked', true);
            });
        })(),
        // 选择银行卡toggle
        selectCardToggle: (function() {
            // 显示
            $(document).on('click', '.select-card', function(e) {
                e.preventDefault();
                $(".select-card-pop").show();
                wallet.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.select-card-pop .close-select-card', function(e) {
                e.preventDefault();
                wallet.prototype.modalHelper.beforeClose();
                $(".select-card-pop").hide();
            });
        })(),
        // 选择银行卡选择
        selectCardCheck: (function() {
            var that,
                dataBank,
                dataIcon,
                dataWeihao;
            $(document).on('click', '.select-card-pop .ul-list li a', function(e) {
                e.preventDefault();
                that = $(this);
                if (that.hasClass('check-icon')) {
                    that.removeClass('check-icon');
                    return false;
                }
                $(".select-card-pop .ul-list li a").removeClass('check-icon');
                that.addClass('check-icon');

                dataBank = that.attr("data-bank");
                dataIcon = that.attr("data-icon");
                dataWeihao = that.attr("data-weihao");

                $(".select-card > i").removeClass().addClass('pay-method-icon ' + dataIcon);
                $(".select-card > i").next("span").children("span:first-child").html(dataBank);
                $(".select-card > i").next("span").children("span:last-child").html(dataWeihao);

                wallet.prototype.modalHelper.beforeClose();
                $(".select-card-pop").hide();
            });
        })(),
        // 添加银行卡toggle
        addBankToggle: (function() {
            $(".add-bank").click(function() {
                $(".add-card-pop").show();
                wallet.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.add-card-pop .close-add-card', function(e) {
                e.preventDefault();
                wallet.prototype.modalHelper.beforeClose();
                $(".add-card-pop").hide();
            });
        })(),
        // 确定添加银行卡
        confirmAddBank: (function() {
            var name,
                bankCardNum;
            $(".confirm-add-bank").click(function() {
                name = $(".add-card-pop .name").val();
                bankCardNum = $(".add-card-pop .card-num").val();
                if (!name) {
                    wallet.prototype.layerFun("请输入您的姓名");
                    return false;
                }

                if (!bankCardNum) {
                    wallet.prototype.layerFun("请输入您的银行卡号码");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        name: name,
                        legalName: legalName,
                        bankCardNum: bankCardNum
                    },
                    success: function(data) {
                        // 弹出提交成功提示
                        wallet.prototype.layerFun("添加成功");
                        wallet.prototype.modalHelper.beforeClose();
                        $(".add-card-pop").hide();
                    },
                    error: function() {
                        wallet.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 确定
        confirmWithdrawals: (function() {
            var withdrawalsNum;
            $(".confirm-withdrawals").click(function() {
                withdrawalsNum = $(".withdrawals-num").val();
                if (!withdrawalsNum) {
                    wallet.prototype.layerFun("请输入需要提现的金额");
                    return false;
                }
                if (!/^[0-9]*$/.test(withdrawalsNum)) {
                    wallet.prototype.layerFun("请填写正确的金额！");
                    return false;
                }
                if (!$("#agreement-checkbox").is(':checked')) {
                    wallet.prototype.layerFun("请勾选并同意《租客网发布求租协议》！");
                    return false;
                }
            });
        })()
    };
});