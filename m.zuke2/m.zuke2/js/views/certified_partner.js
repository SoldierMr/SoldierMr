$(document).ready(function() {
    var certifiedPpartner = certifiedPpartner || {};
    certifiedPpartner.prototype = {
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
        // 上传身份证弹出
        idPop: (function() {
            $(document).on('click', '.id', function(e) {
                e.preventDefault();
                $(".id-pop").show();
                certifiedPpartner.prototype.modalHelper.afterOpen();
            });
        })(),
        // 上传身份证隐藏
        idHide: (function() {
            $(document).on('click', '.id-pop .close-id', function(e) {
                e.preventDefault();
                certifiedPpartner.prototype.modalHelper.beforeClose();
                $(".id-pop").hide();
            });
        })(),
        // 上传独立经纪人 公司证明 弹出
        ownCompanyPop: (function() {
            $(document).on('click', '.own-company', function(e) {
                e.preventDefault();
                $(".own-company-pop").show();
                certifiedPpartner.prototype.modalHelper.afterOpen();
            });
        })(),
        // 上传独立经纪人 公司证明 隐藏
        ownCompanyHide: (function() {
            $(document).on('click', '.own-company-pop .close-own-company', function(e) {
                e.preventDefault();
                certifiedPpartner.prototype.modalHelper.beforeClose();
                $(".own-company-pop").hide();
            });
        })(),
        // 公司授权证明弹出
        companyProvePop: (function() {
            $(document).on('click', '.companyProve', function(e) {
                e.preventDefault();
                $(".company-prove-pop").show();
                certifiedPpartner.prototype.modalHelper.afterOpen();
            });
        })(),
        // 公司授权证明隐藏
        companyProveHide: (function() {
            $(document).on('click', '.close-company-prove', function(e) {
                e.preventDefault();
                certifiedPpartner.prototype.modalHelper.beforeClose();
                $(".company-prove-pop").hide();
            });
        })(),
        // 营业执照弹出
        licensePop: (function() {
            $(document).on('click', '.license', function(e) {
                e.preventDefault();
                $(".license-pop").show();
                certifiedPpartner.prototype.modalHelper.afterOpen();
            });
        })(),
        // 营业执照隐藏
        licenseHide: (function() {
            $(document).on('click', '.close-license', function(e) {
                e.preventDefault();
                certifiedPpartner.prototype.modalHelper.beforeClose();
                $(".license-pop").hide();
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
            var _this = certifiedPpartner,
                result = '';
            $(document).on('change', '.pop .upload-img input', function() {
                result = _this.prototype.readAsDataURL(this);
            });
        })(),
        // 角色切换
        roleSwitch: (function() {
            // 用change,不能用click
            $(document).on('change', 'input[name="role"]', function(e) {
                switch (e.target.id) {
                    case 'role1':
                        $(".own").remove();
                        $(".aut-sub").before(certifiedPpartner.prototype.role1());
                        break;
                    case 'role2':
                        $(".company").remove();
                        $(".aut-sub").before(certifiedPpartner.prototype.role2());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 正规资质的中介或托管公司
        role1: function() {
            return '<div class="col-f5f5f5 company"></div><div class="main pt12 company"><p class="f14 c-333 bold plr12">认证信息</p><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333 rneed">公司名</span><span class="flex flex-right align-items-center"><input class="tright company-name" type="text" placeholder="请输入公司名" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">法人姓名</span><span class="flex flex-right align-items-center"><input class="tright legal-name" type="text" placeholder="请输入法人姓名" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">公司注册地址</span><span class="flex flex-right align-items-center"><input class="tright company-addr" type="text" placeholder="请输入公司注册地址" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">营业执照号码</span><span class="flex flex-right align-items-center"><input class="tright license-number" type="text" placeholder="请输入营业执照号码" /></span></a></li><li class="bb-eee"><a class="license"><span class="f14 c-333 rneed">营业执照上传</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li></ul></div><div class="col-f5f5f5 company"></div><div class="main company"><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333 rneed">您的姓名</span><span class="flex flex-right align-items-center"><input class="tright name" type="text" placeholder="请输入姓名" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">性别</span><span class="flex flex-right align-items-center h20"><span class="radio-box"><input type="radio" id="gender1" name="gender" value="女" checked="checked"><label for="gender1"></label></span><label for="gender1" class="f12 c-333 female">女</label><span class="radio-box"><input type="radio" id="gender2" name="gender" value="男"><label for="gender2"></label></span><label for="gender2" class="f12 c-333 male">男</label></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">联系电话</span><span class="flex flex-right align-items-center"><input class="tright phone" type="text" placeholder="请输入联系电话" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">身份证号码</span><span class="flex flex-right align-items-center"><input class="tright id-number" type="text" placeholder="请输入身份证号码" /></span></a></li><li class="bb-eee"><a class="companyProve"><span class="f14 c-333 rneed">公司授权证明</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li></ul></div><div class="company-prove-pop wh100 bg-fff pt37 pop hide company"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-company-prove"></div><span class="f16 c-333 absolute translateHalf">公司授权证明上传</span></div><div class="main"><div class="upload-img upload-bg"><input type="file" /><img class="translateTopHalf company-prove" src="" alt="公司授权证明照片" /></div><p class="f14 c-333 tcenter">公司授权证明照片</p></div><button class="submit">提交</button></div><div class="license-pop wh100 bg-fff pt37 pop hide company"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-license"></div><span class="f16 c-333 absolute translateHalf">营业执照上传</span></div><div class="main"><div class="upload-img upload-bg"><input type="file" /><img class="translateTopHalf license-img" src="" alt="营业执照照片" /></div><p class="f14 c-333 tcenter">营业执照照片</p></div><button class="submit">提交</button></div>';
        },
        // 独立经纪人
        role2: function() {
            return '<div class="col-f5f5f5 own"></div><div class="main pt12 own"><p class="f14 c-333 bold plr12">认证信息</p><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333 rneed">真实姓名</span><span class="flex flex-right align-items-center"><input class="tright name" type="text" placeholder="请输入真实姓名" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">性别</span><span class="flex flex-right align-items-center h20"><span class="radio-box"><input type="radio" id="gender1" name="gender" value="女" checked="checked"><label for="gender1"></label></span><label for="gender1" class="f12 c-333 female">女</label><span class="radio-box"><input type="radio" id="gender2" name="gender" value="男"><label for="gender2"></label></span><label for="gender2" class="f12 c-333 male">男</label></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">身份证号码</span><span class="flex flex-right align-items-center"><input class="tright id-number" type="text" placeholder="请输入身份证号码" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">联系电话</span><span class="flex flex-right align-items-center"><input class="tright phone" type="text" placeholder="请输入联系电话" /></span></a></li><li class="bb-eee"><a class="id"><span class="f14 c-333 rneed">身份证照片上传</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li></ul></div><div class="col-f5f5f5 own"></div><div class="main own"><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">公司名</span><span class="flex flex-right align-items-center"><input class="tright company-name" type="text" placeholder="请输入公司名" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333">法人姓名</span><span class="flex flex-right align-items-center"><input class="tright legal-name" type="text" placeholder="请输入法人姓名" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333">公司注册地址</span><span class="flex flex-right align-items-center"><input class="tright company-addr" type="text" placeholder="请输入公司注册地址" /></span></a></li><li class="bb-eee"><a><span class="f14 c-333">公司执照号码</span><span class="flex flex-right align-items-center"><input class="tright license-number" type="text" placeholder="请输入公司注册地址" /></span></a></li><li class="bb-eee"><a class="own-company"><span class="f14 c-333">公司证明上传</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li></ul></div><div class="id-pop wh100 bg-fff pt37 pop hide own"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-id"></div><span class="f16 c-333 absolute translateHalf">身份证上传</span></div><div class="main"><div class="upload-img upload-bg"><input type="file" /><img class="translateTopHalf front-id" src="" alt="身份证正面照片" /></div><p class="f14 c-333 tcenter">身份证正面照片</p><div class="upload-img upload-bg"><input type="file" /><img class="translateTopHalf back-id" src="" alt="身份证背面照片" /></div><p class="f14 c-333 tcenter">身份证背面照片</p><div class="upload-img upload-bg"><input type="file" /><img class="translateTopHalf hold-id" src="" alt="手持身份证照片" /></div><p class="f14 c-333 tcenter">手持身份证照片</p></div><button class="submit">提交</button></div><div class="own-company-pop wh100 bg-fff pt37 pop hide own"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-own-company"></div><span class="f16 c-333 absolute translateHalf">公司证明上传</span></div><div class="main"><div class="upload-img upload-bg"><input type="file" /><img class="translateTopHalf company-prove" src="" alt="公司证明照片" /></div><p class="f14 c-333 tcenter">公司证明照片</p></div><button class="submit">提交</button></div>';
        },
        // 营业执照提交
        licenseSub: (function() {
            var _this = certifiedPpartner,
                imgDatabase;
            $(document).on('click', '.license-pop .submit', function() {
                imgDatabase = $(".license-img").attr("src");
                if (!imgDatabase) {
                    _this.prototype.layerFun("请上传营业执照照片！");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        "imgdata": imgDatabase
                    },
                    success: function(data) {
                        // 返回的src，用来判断是否提交
                        $(".license-img").attr("data-src", data.src);
                        $(".license > span:last-child > span:first-child").html("已选择");
                        release.prototype.modalHelper.beforeClose();
                        $(".license-pop").hide();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 中介、公司；公司授权证明提交
        companyProveSub: (function() {
            var _this = certifiedPpartner,
                imgDatabase;
            $(document).on('click', '.company-prove-pop .submit', function() {
                imgDatabase = $(".company-prove").attr("src");
                if (!imgDatabase) {
                    _this.prototype.layerFun("请上传公司授权证明照片！");
                    return false;
                }
                // ~
                $(".company-prove").attr("data-src", "zuke.com");

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        "imgdata": imgDatabase
                    },
                    success: function(data) {
                        // 返回的src，用来判断是否提交
                        $(".company-prove").attr("data-src", data.src);
                        $(".companyProve > span:last-child > span:first-child").html("已选择");
                        release.prototype.modalHelper.beforeClose();
                        $(".company-prove-pop").hide();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 个人身份证 上传
        idSub: (function() {
            var _this = certifiedPpartner,
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
                // 上传身份证正面照片
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: { // 这里写要传过去的参数
                        "frontDatabase": frontDatabase,
                    },
                    success: function(data) {
                        // 返回的src数组，用来判断是否提交
                        $(".front-id").attr("data-src", data);
                        // 上传身份证反面照片
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            async: false,
                            data: { // 这里写要传过去的参数
                                "backDatabase": backDatabase
                            },
                            success: function(data) {
                                $(".back-id").attr("data-src", data);
                                // 上传手持身份证
                                $.ajax({
                                    url: "",
                                    type: "POST",
                                    dataType: "json",
                                    async: false,
                                    data: {
                                        "holdDatabase": holdDatabase
                                    },
                                    success: function(data) {
                                        $(".hold-id").attr("data-src", data);

                                        $(".id > span:last-child > span:first-child").html("已选择");
                                        release.prototype.modalHelper.beforeClose();
                                        $(".id-pop").hide();
                                    },
                                    error: function() {
                                        _this.prototype.layerFun("手持身份证提交失败，请刷新页面");
                                    }
                                });
                            },
                            error: function() {
                                _this.prototype.layerFun("身份证背面照片提交失败，请刷新页面");
                            }
                        });
                    },
                    error: function() {
                        _this.prototype.layerFun("身份证正面照片提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 个人 公司证明上传
        ownCompanySub: (function() {
            var _this = certifiedPpartner,
                imgDatabase;
            $(document).on('click', '.own-company-pop .submit', function() {
                imgDatabase = $(".company-prove").attr("src");
                if (!imgDatabase) {
                    _this.prototype.layerFun("请上传公司证明照片！");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        "imgDatabase": imgDatabase
                    },
                    success: function(data) {
                        // 返回的src，用来判断是否提交
                        $(".company-prove").attr("data-src", data[0]);
                        $(".own-company > span:last-child > span:first-child").html("已选择");
                        release.prototype.modalHelper.beforeClose();
                        $(".own-company-pop").hide();
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
            var _this = certifiedPpartner,
                role,
                companyName,
                legalName,
                companyAddr,
                licenseNumber,
                name,
                phone,
                idNumber,
                gender,
                companyProve,
                license,
                frontDatabase,
                backDatabase,
                holdDatabase;
            $(".aut-sub").click(function() {
                role = $('input[name="role"]:checked');
                switch (role[0].id) {
                    case 'role1':
                        companyName = $(".company .company-name").val();
                        legalName = $(".company .legal-name").val();
                        companyAddr = $(".company .company-addr").val();
                        licenseNumber = $(".company .license-number").val();
                        name = $(".company .name").val();
                        phone = $(".company .phone").val();
                        idNumber = $(".company .id-number").val();
                        gender = $('.company input[name="gender"]:checked').val();
                        license = $(".company .license-img").attr("data-src");
                        companyProve = $(".company .company-prove").attr("data-src");
                        if (!companyName) {
                            _this.prototype.layerFun("请输入公司名！");
                            return false;
                        }
                        if (!legalName) {
                            _this.prototype.layerFun("请输入法人姓名！");
                            return false;
                        }
                        if (!companyAddr) {
                            _this.prototype.layerFun("请输入公司地址！");
                            return false;
                        }
                        if (!licenseNumber) {
                            _this.prototype.layerFun("请输入营业执照号码！");
                            return false;
                        }
                        if (!name) {
                            _this.prototype.layerFun("请输入您的姓名！");
                            return false;
                        }
                        if (!phone) {
                            _this.prototype.layerFun("请输入联系电话！");
                            return false;
                        }
                        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
                            _this.prototype.layerFun("联系电话不正确，请重新填写");
                            return false;
                        }
                        if (!idNumber) {
                            _this.prototype.layerFun("请输入身份证号码！");
                            return false;
                        }
                        if (!license) {
                            _this.prototype.layerFun("请上传营业执照！");
                            return false;
                        }
                        if (!companyProve) {
                            _this.prototype.layerFun("请上传公司授权证明照片！");
                            return false;
                        }
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                companyName: companyName,
                                legalName: legalName,
                                companyAddr: companyAddr,
                                licenseNumber: licenseNumber,
                                name: name,
                                phone: phone,
                                idNumber: idNumber,
                                gender: gender,
                                license: license,
                                companyProve: companyProve
                            },
                            success: function(data) {
                                // 弹出提交成功提示
                                _this.prototype.subSucc();
                            },
                            error: function() {
                                _this.prototype.layerFun("提交失败，请刷新页面");
                            }
                        });
                        console.log(companyName, legalName, companyAddr, licenseNumber, name, phone, idNumber, gender, license, companyProve);
                        break;
                    case 'role2':
                        companyName = $(".own .company-name").val();
                        legalName = $(".own .legal-name").val();
                        companyAddr = $(".own .company-addr").val();
                        licenseNumber = $(".own .license-number").val();
                        name = $(".own .name").val();
                        phone = $(".own .phone").val();
                        idNumber = $(".own .id-number").val();
                        gender = $('.own input[name="gender"]:checked').val();
                        companyProve = $(".own .company-prove").attr("data-src");
                        frontDatabase = $(".own .front-id").attr("data-src");
                        backDatabase = $(".own .back-id").attr("data-src");
                        holdDatabase = $(".own .hold-id").attr("data-src");
                        if (!name) {
                            _this.prototype.layerFun("请输入您的姓名！");
                            return false;
                        }
                        if (!phone) {
                            _this.prototype.layerFun("请输入联系电话！");
                            return false;
                        }
                        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
                            _this.prototype.layerFun("联系电话不正确，请重新填写");
                            return false;
                        }
                        if (!idNumber) {
                            _this.prototype.layerFun("请输入身份证号码！");
                            return false;
                        }
                        if (!frontDatabase || !backDatabase || !holdDatabase) {
                            _this.prototype.layerFun("请上传身份证照片！");
                            return false;
                        }
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                companyName: companyName,
                                legalName: legalName,
                                companyAddr: companyAddr,
                                licenseNumber: licenseNumber,
                                name: name,
                                phone: phone,
                                idNumber: idNumber,
                                gender: gender,
                                companyProve: companyProve,
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
                        console.log(companyName, legalName, companyAddr, licenseNumber, name, phone, idNumber, gender, companyProve, frontDatabase, backDatabase, holdDatabase);
                        break;
                    default:
                        break;
                }
            });
        })()
    };
});