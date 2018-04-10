$(document).ready(function() {
    var login = login || {};
    login.prototype = {
        phone: function() {
            return $(".phone").val();
        },
        smsCode: function() {
            return $(".sms-code").val();
        },
        pwd: function() {
            return $(".pwd").val();
        },
        // 快捷登录
        quickLog: function() {
            return '<ul class="log-ul quick-log"><li><i class="icon phone-icon"></i><p><input class="phone" type="text" placeholder="请输入手机号码"><button class="get-code flex-right">获取验证码</button></p></li><li><i class="icon aut-code-icon"></i><p><input class="sms-code" type="text" placeholder="请输入验证码"></p></li></ul>';
        },
        // 密码登录
        pwdLog: function() {
            return '<ul class="log-ul pwd-log"><li><i class="icon phone-icon"></i><p><input class="phone" type="text" placeholder="请输入手机号码"></p></li><li><i class="icon password-icon"></i><p><input class="pwd" type="password" placeholder="请输入密码"></p></li></ul>';
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
            var _this = login;
            $(document).on('click', '.get-code', function() {
                if (_this.prototype.isPhone()) {
                    $.post("/login/sendsms", {
                        "user_phone": encodeURIComponent(_this.prototype.phone()),
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
        // 快捷登录、密码登录切换
        tabsSwitch: (function() {
            var _this = login,
                dataType,
                that;
            $(".tabs span").click(function() {
                that = $(this);
                if (that.hasClass('active')) return false;
                
                that.addClass("active").siblings().removeClass("active");
                dataType = that.attr("data-type");
                switch (dataType) {
                    case 'quick':
                        $(".pwd-log").remove();
                        $(".tabs").after(_this.prototype.quickLog());
                        break;
                    case 'pwd':
                        $(".quick-log").remove();
                        $(".tabs").after(_this.prototype.pwdLog());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 点击登录按钮
        clickLoginBtn: (function() {
            var _this = login,
                dataType;
            $(".log-btn").click(function() {
                dataType = $(".tabs .tab.active").attr("data-type");
                switch (dataType) {
                    case 'quick':
                        if (_this.prototype.isPhone() && _this.prototype.isSmsCode()) {
                            // 快捷登录
                            $.post("/login/smslogin", {
                                "user_phone": encodeURIComponent(_this.prototype.phone()),
                                "sms_code": encodeURIComponent(_this.prototype.smsCode()),
                            }, function(data) {
                                if (data.result == "10000") {
                                    window.location.href = $("#ref_url").val();
                                } else {
                                    _this.prototype.layerFun(data.err);
                                }
                            }, "json");
                        }
                        break;
                    case 'pwd':
                        if (_this.prototype.isPhone() && _this.prototype.isPwd()) {
                            // 密码登录
                            $.post("/login/pwdlogin", {
                                "user_phone": encodeURIComponent(_this.prototype.phone()),
                                "user_pass": encodeURIComponent(_this.prototype.pwd())
                            }, function(data) {
                                if (data.result == "10000") {
                                    window.location.href = $("#ref_url").val();
                                } else {
                                    _this.prototype.layerFun(data.err);
                                }
                            }, "json");
                        }
                        break;
                    default:
                        break;
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