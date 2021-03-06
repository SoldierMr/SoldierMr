$(document).ready(function() {
    var register = register || {};
    register.prototype = {
        phone: function() {
            return $(".phone").val();
        },
        smsCode: function() {
            return $(".sms-code").val();
        },
        pwd: function() {
            return $(".pwd").val();
        },
        tuijianNum: function() {
            return $(".tuijian-num").val();
        },
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
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
        // 验证密码
        isPwd: function() {
            if (!this.pwd()) {
                this.layerFun("密码不能为空");
                return false;
            } else {
                return true;
            }
        },
        // 验证短信验证码
        isSmsCode: function() {
            if (!this.smsCode()) {
                this.layerFun("短信验证码不能为空");
                return false;
            } else if (!this.smsCode().match(/^\d{6}$/)) {
                this.layerFun("请输入正确的短信验证码");
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
            $(".get-code").attr("disabled", "true").html("60 s");
            InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次

            //timer处理函数
            function SetRemainTime() {
                if (curCount == 0) {
                    window.clearInterval(InterValObj); //停止计时器
                    $(".get-code").removeAttr("disabled").html("重新发送"); //启用按钮
                } else {
                    curCount--;
                    $(".get-code").html(curCount + " s");
                }
            }
        },
        // 点击获取验证码
        clickGetCode: (function() {
            var _this = register;
            $(".get-code").click(function() {
                if (_this.prototype.isPhone()) {
                    $.post("/register/sendsms", {
                        "user_phone": encodeURIComponent(_this.prototype.phone()),
                        "user_pass": encodeURIComponent(_this.prototype.pwd()),
                    }, function(data) {
                        if (data.result == "10000") {
                            _this.prototype.getSmsCode(_this.prototype.phone()); // 调用获取验证码
                            _this.prototype.layerFun("请注意查收");
                        } else {
                            _this.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })(),
        // 点击注册按钮
        clickRegisterBtn: (function() {
            var _this = register;
            $(".register-btn").click(function() {
                if (_this.prototype.isPhone() && _this.prototype.isSmsCode() && _this.prototype.isPwd()) {
                    // 点击注册之后
                    $.post("/register/save", {
                        "user_phone": encodeURIComponent(_this.prototype.phone()),
                        "user_pass": encodeURIComponent(_this.prototype.pwd()),
                        "sms_code": encodeURIComponent(_this.prototype.smsCode()),
                        "tuijian_num": encodeURIComponent(_this.prototype.tuijianNum())
                    }, function(data) {
                        if (data.result == "10000") {
                            window.location.href = $("#ref_url").val();
                        } else {
                            _this.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })(),
        // 解决安卓input获取焦点软键盘弹出影响定位的问题
        changeFixed: (function() {
            var h = $(window).height();
            $(window).resize(function() {
                if ($(window).height() < h) {
                    $('.agreement').hide();
                }
                if ($(window).height() >= h) {
                    $('.agreement').show();
                }
            });
        })()
    };
});