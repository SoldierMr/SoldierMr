$(document).ready(function() {
    var realNameAut = realNameAut || {};
    realNameAut.prototype = {
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
        phone: function() {
            return $(".phone").val();
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
            var _this = realNameAut;
            $(document).on('click', '.get-code', function() {
                if (_this.prototype.isPhone()) {
                    $.post("/sendsms", {
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
        // 上传身份证弹出
        idPop: (function() {
            $(document).on('click', '.id', function(e) {
                e.preventDefault();
                $(".id-pop").show();
                realNameAut.prototype.modalHelper.afterOpen();
            });
        })(),
        // 上传身份证隐藏
        idHide: (function() {
            $(document).on('click', '.id-pop .close-id', function(e) {
                e.preventDefault();
                realNameAut.prototype.modalHelper.beforeClose();
                $(".id-pop").hide();
            });
        })(),
        readAsDataURL: function(obj) {
            //检验是否为图像文件  
            var file = obj.files[0];
            if (!/image\/\w+/.test(file.type)) {
                this.layerFun("请上传图片！");
                return false;
            }
            var reader = new FileReader();
            //将文件以Data URL形式读入页面
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                $(obj).siblings('img').attr("src", this.result);
            }
        },
        // 上传图片
        imgUpload: (function() {
            var _this = realNameAut,
                result = '';
            $(document).on('change', '.pop .upload-img input', function() {
                result = _this.prototype.readAsDataURL(this);
            });
        })(),
        // 个人身份证 上传
        idSub: (function() {
            var _this = realNameAut,
                frontDatabase,
                backDatabase,
                holdDatabase;
            $(document).on('click', '.id-pop .submit', function() {
                frontDatabase = $(".front-id").attr("src");
                backDatabase = $(".back-id").attr("src");
                holdDatabase = $(".hold-id").attr("src");
                if (!frontDatabase) {
                    _this.prototype.layerFun("请上传身份证正面照片！");
                    return false;
                }
                if (!backDatabase) {
                    _this.prototype.layerFun("请上传身份证反面照片！");
                    return false;
                }
                if (!holdDatabase) {
                    _this.prototype.layerFun("请上传手持身份证照片！");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        "frontDatabase": frontDatabase,
                        "backDatabase": backDatabase,
                        "holdDatabase": holdDatabase
                    },
                    success: function(data) {
                        var data = eval("(" + data + ")");
                        // 返回的src数组，用来判断是否提交
                        $(".front-id").attr("data-src", data[0]);
                        $(".back-id").attr("data-src", data[1]);
                        $(".hold-id").attr("data-src", data[2]);
                        $(".id > span:last-child > span:first-child").html("已选择");
                        realNameAut.prototype.modalHelper.beforeClose();
                        $(".id-pop").hide();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 提交成功之后弹出
        subSucc: function() {
            $('body').append('<div class="succ-pop-bg"><div class="succ-pop"><div class="succ-icon"><p class="succ-txt">提交成功！我们会尽快审核</p></div><div class="succ-confirm">知道了</div></div></div>');
        },
        // 提交成功后 - 知道了
        gotIt: (function() {
            $(document).on('click', '.succ-pop .succ-confirm', function() {
                window.location.href = 'http://m.zuke.com/n/renter.html';
            });
        })(),
        // 提交认证
        autSub: (function() {
            var _this = realNameAut,
                name,
                idNumber,
                frontDatabase,
                backDatabase,
                holdDatabase,
                phone,
                smsCode;
            $(".aut-btn").click(function() {
                name = $(".name").val();
                idNumber = $(".id-number").val();
                phone = $(".phone").val();
                smsCode = $(".sms-code").val();
                frontDatabase = $(".front-id").attr("src");
                backDatabase = $(".back-id").attr("src");
                holdDatabase = $(".hold-id").attr("src");
                if (!name) {
                    _this.prototype.layerFun("请填写真实姓名！");
                    return false;
                }
                if (!idNumber) {
                    _this.prototype.layerFun("请填写身份证号码！");
                    return false;
                }
                if (!frontDatabase) {
                    _this.prototype.layerFun("请上传身份证正面照片！");
                    return false;
                }
                if (!backDatabase) {
                    _this.prototype.layerFun("请上传身份证反面照片！");
                    return false;
                }
                if (!holdDatabase) {
                    _this.prototype.layerFun("请上传手持身份证照片！");
                    return false;
                }
                if (!phone) {
                    _this.prototype.layerFun("请填写手机号！");
                    return false;
                }
                if (!smsCode) {
                    _this.prototype.layerFun("请填写验证码！");
                    return false;
                }
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        name: name,
                        idNumber: idNumber,
                        phone: phone,
                        frontDatabase: frontDatabase,
                        backDatabase: backDatabase,
                        holdDatabase: holdDatabase
                    },
                    success: function(data) {
                        // 弹出提交成功提示
                        _this.prototype.subSucc();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});