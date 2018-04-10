$(document).ready(function() {
    var personal = personal || {};
    personal.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        phone: function() {
            return $(".edit-line .phone").val();
        },
        smsCode: function() {
            return $(".edit-line .sms-code").val();
        },
        // 验证手机号
        isPhone: function() {
            if (!this.phone()) {
                this.layerFun("手机号不能为空");
                return false;
            } else if (!this.phone().match(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/)) {
                this.layerFun("请输入正确的手机号码");
                return false;
            } else {
                return true;
            }
        },
        // 获取验证码
        getSmsCode: function(phone) {
            var InterValObj; //timer变量，控制时间
            var count = 60; //间隔函数，1秒执行
            var curCount; //当前剩余秒数
            curCount = count;
            //设置button效果，开始计时
            $(".edit-get-code").attr("disabled", "true").html("60 s");
            InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次

            //timer处理函数
            function SetRemainTime() {
                if (curCount == 0) {
                    window.clearInterval(InterValObj); //停止计时器
                    $(".edit-get-code").removeAttr("disabled").html("重新发送"); //启用按钮
                } else {
                    curCount--;
                    $(".edit-get-code").html(curCount + " s");
                }
            }
        },
        // 点击获取验证码
        clickGetCode: (function() {
            $(document).on('click', '.edit-get-code', function() {
                if (personal.prototype.isPhone()) {
                    $.post("/login/sendsms", {
                        "user_phone": encodeURIComponent(personal.prototype.phone()),
                    }, function(data) {
                        if (data.result == "10000") {
                            personal.prototype.getSmsCode(personal.prototype.phone()); // 调用获取验证码
                            personal.prototype.layerFun("请注意查收");
                        } else {
                            personal.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })(),
        // 提交
        personalSub: (function() {
            var _this = personal,
                phone;
            $(".release-sub").click(function() {
                phone = $(".edit-line .phone").val();
                if (!phone) {
                    personal.prototype.layerFun("请输入新手机号");
                    return false;
                }
                if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
                    personal.prototype.layerFun("请输入正确的手机号");
                    return false;
                }
                if (!personal.prototype.smsCode()) {
                    _this.prototype.layerFun("请填写验证码！");
                    return false;
                }
                console.log(phone);

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        phone: phone
                    },
                    success: function(data) {
                        // 弹出提交成功提示
                        _this.prototype.layerFun("保存成功");
                    },
                    error: function() {
                        _this.prototype.layerFun("保存失败，请刷新页面");
                    }
                });
            });
        })()
    };
});