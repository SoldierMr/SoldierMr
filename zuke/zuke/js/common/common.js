$(document).ready(function() {
    var common = common || {};
    common.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
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
            $(document).on('click', '.get-code', function() {
                if (common.prototype.isPhone()) {
                    $.post("/login/sendsms", {
                        "user_phone": encodeURIComponent(common.prototype.phone()),
                    }, function(data) {
                        if (data.result == "10000") {
                            common.prototype.getSmsCode(common.prototype.phone()); // 调用获取验证码
                            common.prototype.layerFun("请注意查收");
                        } else {
                            common.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })(),
        // 移入移出
        hoverFunc: function(el, elbox) {
            var t;
            $("." + el).mouseover(function(e) {
                e.stopPropagation();
                clearTimeout(t);
                $("." + el + "-box").show();
            });
            $("." + el).mouseout(function(e) {
                e.stopPropagation();
                t = setTimeout(function() { $("." + el + "-box").hide(); }, 300);
            });
            $("." + el + "-box").mouseover(function(e) {
                e.stopPropagation();
                clearTimeout(t);
            });
        },
        /*导航栏二维码移入移出*/
        QRCodeToggle: (function() {
            setTimeout(function() {
                common.prototype.hoverFunc("qr-code", "qr-code-box");
            }, 300);
        })(),
        /*发布移入移出*/
        fabuToggle: (function() {
            setTimeout(function() {
                common.prototype.hoverFunc("fabu-btn", "fabu-btn-box");
            }, 300);
        })(),
        /*个人信息移入移出*/
        userInfoToggle: (function() {
            setTimeout(function() {
                common.prototype.hoverFunc("user-info", "user-info-box");
            }, 300);
        })(),
        // 登录注册
        sign: (function() {
            var quickLog = '<div class="tabs"><span class="tab active" data-type="quick">快捷登录</span><span class="f18 c-ddd">|</span><span class="tab" data-type="pwd">密码登录</span></div><ul class="sign-ul quick-log"><li class="clearfix"><i class="icon phone-icon left"></i><p class="left"><input class="phone" type="text" placeholder="请输入手机号码"><button class="get-code">获取验证码</button></p></li><li class="clearfix"><i class="icon aut-code-icon left"></i><p class="left"><input class="sms-code" type="text" placeholder="请输入验证码"></p></li></ul><button class="sub quick-log-btn">登录</button><p class="f14 tcenter"><span class="reg-span c-3fabfa cursor-pointer">立即注册</span><span class="c-666"> | </span><span class="forget-pwd c-666 cursor-pointer">忘记密码</span></p>',
                pwdLog = '<div class="tabs"><span class="tab" data-type="quick">快捷登录</span><span class="f18 c-ddd">|</span><span class="tab active" data-type="pwd">密码登录</span></div><ul class="sign-ul pwd-log"><li class="clearfix"><i class="icon phone-icon left"></i><p class="left"><input class="phone" type="text" placeholder="请输入手机号码"></p></li><li class="clearfix"><i class="icon password-icon left"></i><p class="left"><input class="pwd" type="password" placeholder="请输入密码"></p></li></ul><button class="sub pwd-log-btn">登录</button><p class="f14 tcenter"><span class="reg-span c-3fabfa cursor-pointer">立即注册</span><span class="c-666"> | </span><span class="forget-pwd c-666 cursor-pointer">忘记密码</span></p>',
                reg = '<p class="f18 c-333 tcenter mtb20">注册</p><ul class="sign-ul reg"><li class="clearfix"><i class="icon phone-icon left"></i><p class="left"><input class="phone" type="text" placeholder="请输入手机号码"><button class="get-code">获取验证码</button></p></li><li class="clearfix"><i class="icon aut-code-icon left"></i><p class="left"><input class="sms-code" type="text" placeholder="请输入验证码"></p></li><li class="clearfix"><i class="icon password-icon left"></i><p class="left"><input class="pwd" type="password" placeholder="请输入密码"></p></li><li class="clearfix"><i class="icon tuijian-num-icon left"></i><p class="left"><input class="tuijian-num" type="text" placeholder="请输入推荐人编号"></p></li></ul><button class="sub register-btn">注册</button><p class="have-acc f14 tcenter c-3fabfa cursor-pointer">已有账号，立即登录</p>',
                forgetPwd = '<p class="f18 c-333 tcenter mtb20">找回密码</p><ul class="sign-ul reg"><li class="clearfix"><i class="icon phone-icon left"></i><p class="left"><input class="phone" type="text" placeholder="请输入手机号码"><button class="get-code">获取验证码</button></p></li><li class="clearfix"><i class="icon aut-code-icon left"></i><p class="left"><input class="sms-code" type="text" placeholder="请输入验证码"></p></li><li class="clearfix"><i class="icon password-icon left"></i><p class="left"><input class="pwd" type="password" placeholder="请输入新密码"></p></li></ul><button class="sub confirm-new-pwd">确认</button><p class="have-acc f14 tcenter c-3fabfa cursor-pointer">已有账号，立即登录</p>',
                dataType,
                that;
            // 快捷登陆、密码登录切换
            $(document).on('click', '.sign-box .tabs .tab', function(e) {
                e.preventDefault();
                that = $(this);
                if (that.hasClass('active')) return false;

                that.addClass("active").siblings().removeClass("active");
                dataType = that.attr("data-type");
                switch (dataType) {
                    case 'quick':
                        $(".sign-box .sign-right").html(quickLog);
                        break;
                    case 'pwd':
                        $(".sign-box .sign-right").html(pwdLog);
                        break;
                    default:
                        break;
                }
            });
            // 注册
            $(document).on('click', '.sign-box .reg-span', function(e) {
                e.preventDefault();
                $(".sign-box .sign-right").html(reg);
            });
            // 登录
            $(document).on('click', '.sign-box .have-acc', function(e) {
                e.preventDefault();
                $(".sign-box .sign-right").html(quickLog);
            });
            // 找回密码
            $(document).on('click', '.sign-box .forget-pwd', function(e) {
                e.preventDefault();
                $(".sign-box .sign-right").html(forgetPwd);
            });
            // 登录显示
            $(".nav-log").click(function(e) {
                e.preventDefault();
                $(".sign-box .sign-right").html(quickLog);
                $(".sign-box").parent().show();
            });
            // 注册显示
            $(".nav-reg").click(function(e) {
                e.preventDefault();
                $(".sign-box .sign-right").html(reg);
                $(".sign-box").parent().show();
            });
            // 隐藏
            $(".cancel-sign").click(function(e) {
                e.preventDefault();
                $(".sign-box").parent().hide();
            });
            // 注册
            $(document).on('click', '.register-btn', function() {
                if (common.prototype.isPhone() && common.prototype.isSmsCode() && common.prototype.isPwd()) {
                    // 点击注册之后
                    $.post("/register/save", {
                        "user_phone": encodeURIComponent(common.prototype.phone()),
                        "user_pass": encodeURIComponent(common.prototype.pwd()),
                        "sms_code": encodeURIComponent(common.prototype.smsCode()),
                        "tuijian_num": encodeURIComponent(common.prototype.tuijianNum())
                    }, function(data) {
                        if (data.result == "10000") {
                            window.location.href = $("#ref_url").val();
                        } else {
                            common.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
            // 快捷登陆
            $(document).on('click', '.quick-log-btn', function() {
                if (common.prototype.isPhone() && common.prototype.isSmsCode()) {
                    // 快捷登录
                    $.post("/login/smslogin", {
                        "user_phone": encodeURIComponent(common.prototype.phone()),
                        "sms_code": encodeURIComponent(common.prototype.smsCode()),
                    }, function(data) {
                        if (data.result == "10000") {
                            window.location.href = $("#ref_url").val();
                        } else {
                            common.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
            // 密码登陆
            $(document).on('click', '.pwd-log-btn', function() {
                if (common.prototype.isPhone() && common.prototype.isPwd()) {
                    // 密码登录
                    $.post("/login/pwdlogin", {
                        "user_phone": encodeURIComponent(common.prototype.phone()),
                        "user_pass": encodeURIComponent(common.prototype.pwd())
                    }, function(data) {
                        if (data.result == "10000") {
                            window.location.href = $("#ref_url").val();
                        } else {
                            common.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
            // 找回密码
            $(document).on('click', '.confirm-new-pwd', function() {
                if (common.prototype.isPhone() && common.prototype.isSmsCode() && common.prototype.isPwd()) {
                    // 点击提交之后
                    $.post("/getpass/step1", {
                        "user_phone": encodeURIComponent(common.prototype.phone()),
                        "user_pass": encodeURIComponent(common.prototype.pwd()),
                        "sms_code": encodeURIComponent(common.prototype.smsCode())
                    }, function(data) {
                        if (data.result == "10000") {
                            window.location.href = "";
                        } else {
                            common.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })(),
        // 选择城市
        selectCity: (function() {
            // 显示
            $(".nav-city").click(function(e) {
                e.preventDefault();
                $(".city-box").parent().show();
            });
            // 隐藏
            $(".cancel-city").click(function(e) {
                e.preventDefault();
                $(".city-box").parent().hide();
            });
        })(),
        // 侧边栏
        rightAside: (function() {
            // 给tip动态赋值宽度
            $(".tool-tip").each(function(idx, el) {
                $(el).css({
                    left: -$(el).outerWidth(true) - 20
                });
            });
            // 回到顶部
            $(".goto-top").click(function() {
                $("html,body").animate({ scrollTop: 0 }, 100);
            });
            // 隐藏分享图
            $(".share-close").click(function() {
                $(".share-box").hide();
            });
            // 显示分享图
            $(".hide-share").click(function() {
                $(".share-box").show();
            });
            // 复制分享链接
            var clipboard = new Clipboard('.share-link-href');
            clipboard.on('success', function(e) {
                layer.msg('<span style="color:#fff;">复制链接成功</span>');
            });
            clipboard.on('error', function(e) {
                console.log(e);
            });
        })()
    };
});