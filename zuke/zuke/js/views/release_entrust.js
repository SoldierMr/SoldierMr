$(document).ready(function() {
    var release = release || {};
    release.prototype = {
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
                if (release.prototype.isPhone()) {
                    $.post("/login/sendsms", {
                        "user_phone": encodeURIComponent(release.prototype.phone()),
                    }, function(data) {
                        if (data.result == "10000") {
                            release.prototype.getSmsCode(release.prototype.phone()); // 调用获取验证码
                            release.prototype.layerFun("请注意查收");
                        } else {
                            release.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })(),
        // 下拉框
        select: (function() {
            var that;
            // 展开
            $(".select > span").click(function(e) {
                e.stopPropagation();
                that = $(this);
                console.log("0");
                if (that.parents(".select").children('ul').is(":hidden")) {
                    console.log("1");
                    $(".select > ul").hide();
                    $(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');

                    that.parents(".select").children('ul').show();
                    that.find(".select-val").siblings('i').removeClass('xiala-icon').addClass('shangla-active-icon');
                } else {
                    console.log("2");
                    that.parents(".select").children('ul').hide();
                    that.find(".select-val").siblings('i').removeClass('shangla-active-icon').addClass('xiala-icon');
                }
            });
            // 收缩
            $(".select ul li").click(function(e) {
                e.stopPropagation();
                that = $(this);
                that.parents(".select").find(".select-val").html(that.html());
                that.parents(".select").find(".select-val").attr("value", that.html());
                that.parents(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');
                that.parents(".select").children('ul').hide();
            });
            //
            $(document).click(function(e) {
                e.stopPropagation();
                $(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');
                $(".select > ul").hide();
            });
        })(),
        // 选择区域
        selectArea: (function() {
            var _this = release,
                that = '',
                stop = true,
                content = '';

            // 加载县
            $(".district-select ul li").click(function(e) {
                e.stopPropagation();
                that = $(this);

                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "/place/region",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            district: that.attr("value")
                        },
                        success: function(json) {
                            stop = true;
                            // 清空
                            $(".region-select ul").html("");
                            $(".region-select .select-val").html("请选择").attr("value", "");
                            // 清空content
                            content = '';
                            // 遍历添加县
                            $.each(json, function(index, value) {
                                // 将数据插入页面
                                content += '<li value="' + value.area_id + '">' + value.area_name + '</li>';
                            });
                            $(".region-select ul").append(content);
                        },
                        error: function() {
                            _this.prototype.layerFun("加载失败");
                        }
                    });
                }
            });
        })(),
        // 房屋用途切换
        useSwitch: (function() {
            var _this = release,
                that,
                fangType = '<span class="txt">房屋户型</span><span class="ip-wrap"><input class="house-shi iw-128" maxlength="3" type="text"><span class="sign">室</span></span><span class="ip-wrap ml8"><input class="house-ting iw-128" maxlength="3" type="text"><span class="sign">厅</span></span><span class="ip-wrap ml8"><input class="house-wei iw-128" maxlength="3" type="text"><span class="sign">卫</span></span>',
                officeType = '<span class="txt">写字楼类型</span><span class="radio-box"><input type="radio" id="cxzlou" name="office-type" value="纯写字楼" checked="checked"><label for="cxzlou"></label></span><label for="cxzlou" class="f14 c-333 ml8">纯写字楼</label><span class="radio-box ml20"><input type="radio" id="syzhti" name="office-type" value="商业综合体"><label for="syzhti"></label></span><label for="syzhti" class="f14 c-333 ml8">商业综合体</label><span class="radio-box ml20"><input type="radio" id="szlylou" name="office-type" value="商住两用楼"><label for="szlylou"></label></span><label for="szlylou" class="f14 c-333 ml8">商住两用楼</label><span class="radio-box ml20"><input type="radio" id="qita" name="office-type" value="其他"><label for="qita"></label></span><label for="qita" class="f14 c-333 ml8">其他</label>',
                shopType = '<span class="txt">商铺类型</span><span class="radio-box"><input type="radio" id="gqzxin" name="shop-type" value="购物中心" checked="checked"><label for="gqzxin"></label></span><label for="gqzxin" class="f14 c-333 ml8">购物中心</label><span class="radio-box ml20"><input type="radio" id="sqsye" name="shop-type" value="社区商业"><label for="sqsye"></label></span><label for="sqsye" class="f14 c-333 ml8">社区商业</label><span class="radio-box ml20"><input type="radio" id="zhtptao" name="shop-type" value="综合体配套"><label for="zhtptao"></label></span><label for="zhtptao" class="f14 c-333 ml8">综合体配套</label><span class="radio-box ml20"><input type="radio" id="qita" name="shop-type" value="其他"><label for="qita"></label></span><label for="qita" class="f14 c-333 ml8">其他</label>';
            $(document).on('click', 'input[name="use"]', function() {
                that = $(this);
                switch (that.attr("id")) {
                    case 'use-fang':
                        $(".house-type-box").html(fangType);
                        $(".rent").siblings('.sign').html("元/月");
                        break;
                    case 'use-office':
                        $(".house-type-box").html(officeType);
                        $(".rent").siblings('.sign').html("元/㎡/月");
                        break;
                    case 'use-shop':
                        $(".house-type-box").html(shopType);
                        $(".rent").siblings('.sign').html("元/月");
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 提交
        releaseSub: (function() {
            var _this = release,
                use,
                district,
                region,
                courtName,
                officeName,
                shopName,
                addr,
                square,
                houseShi,
                houseTing,
                houseWei,
                officeType,
                shopType,
                rent,
                name,
                phone,
                smsCode;
            $(".release-sub").click(function() {
                use = $('input[name="use"]:checked').attr("id");
                switch (use) {
                    case 'use-fang':
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        courtName = $(".name").val();
                        addr = $(".addr").val();
                        square = $(".square").val();
                        houseShi = $(".house-shi").val();
                        houseTing = $(".house-ting").val();
                        houseWei = $(".house-wei").val();
                        rent = $(".rent").val();
                        name = $(".name").val();
                        phone = $(".edit-line .phone").val();
                        smsCode = $(".edit-line .sms-code").val();
                        if (!district || !region) {
                            _this.prototype.layerFun("请选择所在区域！");
                            return false;
                        }
                        if (!courtName) {
                            _this.prototype.layerFun("请填写小区名称！");
                            return false;
                        }
                        if (!addr) {
                            _this.prototype.layerFun("请填写详细地址！");
                            return false;
                        }
                        if (!square) {
                            _this.prototype.layerFun("请填写房屋面积！");
                            return false;
                        }
                        if (!houseShi || !houseTing || !houseWei) {
                            _this.prototype.layerFun("请填写房屋户型！");
                            return false;
                        }
                        if (!name) {
                            _this.prototype.layerFun("请填写您的姓名！");
                            return false;
                        }
                        if (!rent) {
                            _this.prototype.layerFun("请填写期望租金！");
                            return false;
                        }
                        if (!phone) {
                            _this.prototype.layerFun("请填写联系电话！");
                            return false;
                        }
                        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
                            _this.prototype.layerFun("联系电话不正确，请重新填写");
                            return false;
                        }
                        if (!smsCode) {
                            _this.prototype.layerFun("请填写验证码！");
                            return false;
                        }
                        console.log(district, region, courtName, addr, square, houseShi, houseTing, houseWei, rent, name, phone, smsCode);
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: district,
                                region: region,
                                courtName: courtName,
                                addr: addr,
                                square: square,
                                houseShi: houseShi,
                                houseTing: houseTing,
                                houseWei: houseWei,
                                rent: rent,
                                name: name,
                                phone: phone,
                                smsCode: smsCode
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
                    case 'use-office':
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        officeName = $(".name").val();
                        addr = $(".addr").val();
                        square = $(".square").val();
                        officeType = $('input[name="office-type"]:checked').attr("value");
                        rent = $(".rent").val();
                        name = $(".name").val();
                        phone = $(".edit-line .phone").val();
                        smsCode = $(".edit-line .sms-code").val();
                        if (!district || !region) {
                            _this.prototype.layerFun("请选择所在区域！");
                            return false;
                        }
                        if (!officeName) {
                            _this.prototype.layerFun("请填写写字楼名称！");
                            return false;
                        }
                        if (!addr) {
                            _this.prototype.layerFun("请填写详细地址！");
                            return false;
                        }
                        if (!square) {
                            _this.prototype.layerFun("请填写房屋面积！");
                            return false;
                        }
                        if (!officeType) {
                            _this.prototype.layerFun("请选择写字楼类型！");
                            return false;
                        }
                        if (!name) {
                            _this.prototype.layerFun("请填写您的姓名！");
                            return false;
                        }
                        if (!rent) {
                            _this.prototype.layerFun("请填写期望租金！");
                            return false;
                        }
                        if (!phone) {
                            _this.prototype.layerFun("请填写联系电话！");
                            return false;
                        }
                        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
                            _this.prototype.layerFun("联系电话不正确，请重新填写");
                            return false;
                        }
                        if (!smsCode) {
                            _this.prototype.layerFun("请填写验证码！");
                            return false;
                        }
                        console.log(district, region, officeName, addr, square, officeType, rent, name, phone, smsCode);
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: district,
                                region: region,
                                cofficeName: officeName,
                                addr: addr,
                                square: square,
                                officeType: officeType,
                                rent: rent,
                                name: name,
                                phone: phone,
                                smsCode: smsCode
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
                    case 'use-shop':
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        shopName = $(".name").val();
                        addr = $(".addr").val();
                        square = $(".square").val();
                        shopType = $('input[name="shop-type"]:checked').attr("value");
                        rent = $(".rent").val();
                        name = $(".name").val();
                        phone = $(".edit-line .phone").val();
                        smsCode = $(".edit-line .sms-code").val();
                        if (!district || !region) {
                            _this.prototype.layerFun("请选择所在区域！");
                            return false;
                        }
                        if (!shopName) {
                            _this.prototype.layerFun("请填写写字楼名称！");
                            return false;
                        }
                        if (!addr) {
                            _this.prototype.layerFun("请填写详细地址！");
                            return false;
                        }
                        if (!square) {
                            _this.prototype.layerFun("请填写房屋面积！");
                            return false;
                        }
                        if (!shopType) {
                            _this.prototype.layerFun("请选择写字楼类型！");
                            return false;
                        }
                        if (!name) {
                            _this.prototype.layerFun("请填写您的姓名！");
                            return false;
                        }
                        if (!rent) {
                            _this.prototype.layerFun("请填写期望租金！");
                            return false;
                        }
                        if (!phone) {
                            _this.prototype.layerFun("请填写联系电话！");
                            return false;
                        }
                        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
                            _this.prototype.layerFun("联系电话不正确，请重新填写");
                            return false;
                        }
                        if (!smsCode) {
                            _this.prototype.layerFun("请填写验证码！");
                            return false;
                        }
                        console.log(district, region, shopName, addr, square, shopType, rent, name, phone, smsCode);
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: district,
                                region: region,
                                shopName: shopName,
                                addr: addr,
                                square: square,
                                shopType: shopType,
                                rent: rent,
                                name: name,
                                phone: phone,
                                smsCode: smsCode
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