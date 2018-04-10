$(document).ready(function() {
    var release = release || {};
    release.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // order img upload
        orderFile: (function() {
            var _this = release,
                that,
                content = '',
                file,
                reader;
            $(".order-file-btn").click(function() {
                $(this).parents(".order-input-item").find('.order-file').click();
            });
            $(document).on('change', '.order-file', function(e) {
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
                    that.parents(".order-input-item").find('.order-file-btn').show();
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
                            that.parents(".order-input-item").find('.order-file-btn').show();
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
        // 角色切换
        roleSwitch: (function() {
            var _this = release,
                that,
                role1 = '<div class="release-left left"><div class="edit-big-tit"><span class="c-3fabfa bold">|</span><span class="c-333">发布求租信息</span></div><div class="edit-line mb10 middle lh-36"><span class="txt">选择角色</span><span class="radio-box"><input type="radio" id="role1" name="role" checked="checked"><label for="role1"></label></span><label for="role1" class="f14 c-333 ml8">我是独立合伙人</label><span class="radio-box ml20"><input type="radio" id="role2" name="role"><label for="role2"></label></span><label for="role2" class="f14 c-333 ml8">我是正规资质的中介或托管公司</label></div><p class="edit-tit mb10">个人信息</p><div class="edit-line mb20"><span class="txt">姓&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp名</span><input class="name iw-128" type="text" placeholder="请填写姓名"></div><div class="edit-line mb10 middle lh-36"><span class="txt">性&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp别</span><span class="radio-box"><input type="radio" id="male" name="gender" checked="checked" value="男"><label for="male"></label></span><label for="male" class="f14 c-333 ml8">男</label><span class="radio-box ml20"><input type="radio" id="female" name="gender" value="女"><label for="female"></label></span><label for="female" class="f14 c-333 ml8">女</label></div><div class="edit-line mb20"><span class="txt">身份证号</span><input class="id-number iw-228" type="text" placeholder="请填写身份证号"></div><div class="edit-line mb20"><span class="txt">手机号码</span><input class="phone iw-128" type="text" placeholder="请填写手机号码"></div><p class="edit-tit mb10">公司信息</p><div class="edit-line mb20"><span class="txt">公&nbsp司&nbsp名&nbsp</span><input class="company-name iw-382" type="text" placeholder="请填写公司名"></div><div class="edit-line mb20"><span class="txt">公司注册地址</span><input class="company-addr iw-382" type="text" placeholder="请填写公司注册地址"></div><div class="edit-line mb20"><span class="txt">法人姓名</span><input class="legal-name iw-128" type="text" placeholder="请填写法人姓名"></div><div class="edit-line mb20"><span class="txt">执照号码</span><input class="license-number iw-382" type="text" placeholder="请填写执照号码"></div><div class="release-sub sub-btn">提交</div></div><div class="release-right right"><div class="edit-line mb20 v-top clearfix"><p class="edit-tit mb10">文件上传</p><div class="order-input-box left"><div class="order-input-item clearfix"><div class="order-img left"><img class="front-id" src="" alt="" /><input class="order-file" src="" type="file" /></div><div class="order-info left"><p class="f16"><span class="c-ff5555">*</span><span class="c-333">身份证正面</span></p><p class="f12 c-999 mt4">身份证正面 请上传本人身份证正面照片或扫描文件，身份证图像需保持完整、无遮挡，文字清晰可见，不得涂改编辑，文件不能超过600</p><button class="order-file-btn hide">重新上传</button></div></div><div class="order-input-item clearfix"><div class="order-img left"><img class="back-id" src="" alt=""><input class="order-file" type="file" /></div><div class="order-info left"><p class="f16"><span class="c-ff5555">*</span><span class="c-333">身份证背面</span></p><p class="f12 c-999 mt4">身份证背面 请上传本人身份证背面照片或扫描文件，身份证图像需保持完整、无遮挡，文字清晰可见，不得涂改编辑，文件不能超过600</p><button class="order-file-btn hide">重新上传</button></div></div><div class="order-input-item clearfix"><div class="order-img left"><img class="hold-id" src="" alt=""><input class="order-file" type="file" /></div><div class="order-info left"><p class="f16"><span class="c-ff5555">*</span><span class="c-333">手持身份证</span></p><p class="f12 c-999 mt4">手持身份证 请上传本人手持身份证免冠半身照片，身份证信息需保持清晰、完整、无遮挡，持证人的五官必须清晰可见，不得涂改编辑，文</p><button class="order-file-btn hide">重新上传</button></div></div><div class="order-input-item clearfix"><div class="order-img left"><img class="company-prove" src="" alt=""><input class="order-file" type="file" /></div><div class="order-info left"><p class="f16"><span class="c-ff5555">*</span><span class="c-333">中介公司证明文件</span></p><p class="f12 c-999 mt4">中介公司证明文件 请上传公司出具的证明文件扫描件，证明确实为公司职工，证明文件需加盖公章的，文字需保持清晰、完整、无遮挡，建</p><button class="order-file-btn hide">重新上传</button></div></div></div></div></div>',
                role2 = '<div class="release-left left"><div class="edit-big-tit"><span class="c-3fabfa bold">|</span><span class="c-333">发布求租信息</span></div><div class="edit-line mb10 middle lh-36"><span class="txt">选择角色</span><span class="radio-box"><input type="radio" id="role1" name="role"><label for="role1"></label></span><label for="role1" class="f14 c-333 ml8">我是独立合伙人</label><span class="radio-box ml20"><input type="radio" id="role2" name="role" checked="checked"><label for="role2"></label></span><label for="role2" class="f14 c-333 ml8">我是正规资质的中介或托管公司</label></div><p class="edit-tit mb10">公司信息</p><div class="edit-line mb20"><span class="txt">公&nbsp司&nbsp名&nbsp</span><input class="company-name iw-382" type="text" placeholder="请填写公司名"></div><div class="edit-line mb20"><span class="txt">法人姓名</span><input class="legal-name iw-128" type="text" placeholder="请填写法人姓名"></div><div class="edit-line mb20"><span class="txt">公司注册地址</span><input class="company-addr iw-382" type="text" placeholder="请填写公司注册地址"></div><div class="edit-line mb20"><span class="txt">营业执照号码</span><input class="license-number iw-382" type="text" placeholder="请填写营业执照号码"></div><p class="edit-tit mb10">个人信息</p><div class="edit-line mb20"><span class="txt">姓&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp名</span><input class="name iw-128" type="text" placeholder="请填写姓名"></div><div class="edit-line mb10 middle lh-36"><span class="txt">性&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp别</span><span class="radio-box"><input type="radio" id="male" name="gender" checked="checked" value="男"><label for="male"></label></span><label for="male" class="f14 c-333 ml8">男</label><span class="radio-box ml20"><input type="radio" id="female" name="gender" value="女"><label for="female"></label></span><label for="female" class="f14 c-333 ml8">女</label></div><div class="edit-line mb20"><span class="txt">身份证号</span><input class="id-number iw-228" type="text" placeholder="请填写身份证号"></div><div class="edit-line mb20"><span class="txt">手机号码</span><input class="phone iw-128" type="text" placeholder="请填写手机号码"></div><div class="release-sub sub-btn">提交</div></div><div class="release-right right"><div class="edit-line mb20 v-top clearfix"><p class="edit-tit mb10">文件上传</p><div class="order-input-box left"><div class="order-input-item clearfix"><div class="order-img left"><img class="license" src="" alt="" /><input class="order-file" src="" type="file" /></div><div class="order-info left"><p class="f16"><span class="c-ff5555">*</span><span class="c-333">营业执照扫描件上传</span></p><p class="f12 c-999 mt4">请上传本人身份证照片或扫描文件，身份证图像需保持完整、无遮挡，文字清晰可见，不得涂改编辑，文件不能超过600K。</p><button class="order-file-btn hide">重新上传</button></div></div><div class="order-input-item clearfix"><div class="order-img left"><img class="company-prove" src="" alt="" /><input class="order-file" src="" type="file" /></div><div class="order-info left"><p class="f16"><span class="c-ff5555">*</span><span class="c-333">公司授权证明扫描件上传</span></p><p class="f12 c-999 mt4">请上传完整的身份证原件彩色图片，文字清晰可见，保证身份证无遮挡、无污秽，建议图片在600K以内。</p><button class="order-file-btn hide">重新上传</button></div></div></div></div></div>';
            $(document).on('change', 'input[name="role"]', function() {
                that = $(this);
                switch (that.attr("id")) {
                    case 'role1':
                        $(".release-box").html(role1);
                        break;
                    case 'role2':
                        $(".release-box").html(role2);
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 提交认证
        autSub: (function() {
            var _this = release,
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
            $(document).on('click', '.release-sub', function() {
                role = $('input[name="role"]:checked');
                switch (role[0].id) {
                    case 'role2':
                        companyName = $(".company-name").val();
                        legalName = $(".legal-name").val();
                        companyAddr = $(".company-addr").val();
                        licenseNumber = $(".license-number").val();
                        name = $(".name").val();
                        phone = $(".phone").val();
                        idNumber = $(".id-number").val();
                        gender = $('input[name="gender"]:checked').val();
                        license = $(".license").attr("src");
                        companyProve = $(".company-prove").attr("src");

                        console.log(companyName, legalName, companyAddr, licenseNumber, name, phone, idNumber, gender, license, companyProve);
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
                        break;
                    case 'role1':
                        companyName = $(".company-name").val();
                        legalName = $(".legal-name").val();
                        companyAddr = $(".company-addr").val();
                        licenseNumber = $(".license-number").val();
                        name = $(".name").val();
                        phone = $(".phone").val();
                        idNumber = $(".id-number").val();
                        gender = $('input[name="gender"]:checked').val();
                        companyProve = $(".company-prove").attr("src");
                        frontDatabase = $(".front-id").attr("src");
                        backDatabase = $(".back-id").attr("src");
                        holdDatabase = $(".hold-id").attr("src");

                        console.log(companyName, legalName, companyAddr, licenseNumber, name, phone, idNumber, gender, companyProve, frontDatabase, backDatabase, holdDatabase);
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
                        break;
                    default:
                        break;
                }
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