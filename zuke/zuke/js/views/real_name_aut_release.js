$(document).ready(function() {
    var personal = personal || {};
    personal.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        phone: function() {
            return $(".edit-line .phone").html();
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
        // id upload
        idFile: (function() {
            var _this = personal,
                that,
                content = '',
                file,
                reader;
            $(document).on('change', '.img-box input', function(e) {
                that = $(this);
                file = this.files[0];
                if (!/image\/\w+/.test(file.type)) {
                    _this.prototype.layerFun("请上传图片！");
                    return false;
                }
                reader = new FileReader();
                //将文件以Data URL形式读入页面
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    /*可删*/
                    that.siblings('img').attr("src", this.result);
                    // 清空file的value，解决连续上传同一张图片时无法选择的问题
                    $("input[type='file'").val("");
                    /*$.ajax({
                        url: "",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            "imgdata": this.result
                        },
                        success: function(data) {
                            that.siblings('img').attr("src", data.src);
                            that.siblings('img').attr("data-src", data.src);
                            // 清空file的value，解决连续上传同一张图片时无法选择的问题
                            $("input[type='file'").val("");
                        },
                        error: function() {
                            _this.prototype.layerFun("上传失败，请刷新页面");
                        }
                    });*/
                }
            });
        })(),
        // 提交
        personalSub: (function() {
            var _this = personal,
                name,
                idNum,
                frontId,
                backId,
                holdId;
            $(".release-sub").click(function() {
                name = $(".name").val();
                idNum = $(".id-num").val();
                frontId = $(".front-id").attr("data-src");
                backId = $(".back-id").attr("data-src");
                holdId = $(".hold-id").attr("data-src");

                console.log(name, idNum, frontId, backId, holdId);

                if (!name) {
                    _this.prototype.layerFun("请填写真实姓名！");
                    return false;
                }
                if (!idNum) {
                    _this.prototype.layerFun("请填写身份证号！");
                    return false;
                }
                if (!frontId) {
                    _this.prototype.layerFun("请上传身份证正面照！");
                    return false;
                }
                if (!backId) {
                    _this.prototype.layerFun("请上传身份证反面照！");
                    return false;
                }
                if (!holdId) {
                    _this.prototype.layerFun("请上传手持身份证照！");
                    return false;
                }
                if (!personal.prototype.smsCode()) {
                    _this.prototype.layerFun("请填写验证码！");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        name: name,
                        idNum: idNum,
                        frontId: frontId,
                        backId: backId,
                        holdId: holdId
                    },
                    success: function(data) {
                        // 弹出提交成功提示
                        _this.prototype.subSucc();
                    },
                    error: function() {
                        _this.prototype.layerFun("保存失败，请刷新页面");
                    }
                });
            });
        })(),
        // 提交成功之后弹出
        subSucc: function() {
            $('body').append('<div class="succ-pop-bg"><div class="succ-pop translateHalf"><div class="succ-bg bb-eee"><p class="succ-txt">提交成功！我们会尽快审核</p></div><div class="succ-confirm">知道了</div></div></div>');
        },
        // 提交成功后 - 知道了
        gotIt: (function() {
            $(document).on('click', '.succ-pop .succ-confirm', function() {
                window.location.href = 'http://www.zuke.com';
            });
        })()
    };
});