$(document).ready(function() {
    var release = release || {};
    release.prototype = {
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
        // 选择区域toggle
        areaToggle: (function() {
            // 显示
            $(document).on('click', '.area', function(e) {
                e.preventDefault();
                $(".area-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.area-pop .close-area', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".area-pop").hide();
            });
        })(),
        // 选择区域
        selectArea: (function() {
            var _this = release,
                that = '',
                stop = true,
                content = '',
                dataDistrict,
                dataRegion;
            // 加载县
            $(".area-pop .district li").click(function(event) {
                that = $(this);
                if (that.hasClass('active')) return false;
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "/place/region",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            district: $(this).attr("data-district")
                        },
                        success: function(json) {
                            stop = true;
                            // 给当前元素加active
                            that.addClass('active').siblings().removeClass('active');
                            // 显示右边区域
                            $(".area-pop .region").html("");
                            // 清空content
                            content = '';
                            // 遍历添加县
                            $.each(json, function(index, value) {
                                // 将数据插入页面
                                content += '<li data-param="region" data-region="' + value.area_id + '" data-type="area">' + value.area_name + '</li>';
                            });
                            $(".area-pop .region").append(content).show();
                        },
                        error: function() {
                            _this.prototype.layerFun("加载失败");
                        }
                    });
                }
            });
            // 选择县
            $(document).on('click', '.area-pop .region li', function() {
                $(this).addClass('active').siblings().removeClass('active');

                dataDistrict = $(".area-pop .district li.active").attr("data-district");
                dataRegion = $(".area-pop .region li.active").attr("data-region");

                $(".area .area-html").html($(".area-pop .district li.active").html() + " " + $(".area-pop .region li.active").html()).attr({
                    'data-district': dataDistrict,
                    'data-region': dataRegion
                });;

                release.prototype.modalHelper.beforeClose();
                $(".area-pop").hide();
            });
        })(),
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
            var _this = release;
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
        // 房屋用途切换
        useSwitch: (function() {
            $(document).on('click', '.house-use .note', function(e) {
                if ($(this).hasClass('active')) return false;
                $(this).addClass('active').siblings().removeClass('active');

                // 判断是否为写字楼，元/m²/月
                if (e.target.dataset.type == "office") {
                    $(".rent").next('span').html("元/m²/月");
                } else {
                    $(".rent").next('span').html("元/月");
                }
                switch (e.target.dataset.type) {
                    case 'house':
                        $(".office,.shop").remove();
                        // 将期望租金前面的换掉
                        $(".rent").parents("li").before(release.prototype.use1());
                        break;
                    case 'office':
                        $(".house,.shop").remove();
                        // 将期望租金前面的换掉
                        $(".rent").parents("li").before(release.prototype.use2());
                        break;
                    case 'shop':
                        $(".house,.office").remove();
                        // 将期望租金前面的换掉
                        $(".rent").parents("li").before(release.prototype.use3());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 写字楼类型、商铺类型切换
        typeSwitch: (function() {
            $(document).on('click', '.office-type .note, .shop-type .note', function() {
                if ($(this).hasClass('active')) return false;
                $(this).addClass('active').siblings().removeClass('active');
            });
        })(),
        // 住宅
        use1: function() {
            return '<li class="bb-eee house"><a><span class="f14 c-333">小区名称</span><span class="flex flex-right align-items-center"><input class="tright court-name" type="text" placeholder="请输入小区名称" /></span></a></li><li class="bb-eee house"><a><span class="f14 c-333">地址</span><span class="flex flex-right align-items-center"><input class="tright addr" type="text" placeholder="请填写详细地址" /></span></a></li><li class="bb-eee house"><a><span class="f14 c-333">房屋面积</span><span class="flex flex-right align-items-center"><input class="tright square" type="text" placeholder="请输入房屋面积" /><span class="f14 c-333 ml8">m²</span></span></a></li><li class="bb-eee house"><a><span class="f14 c-333">房屋户型</span><span class="flex flex-right align-items-center house-type"><input class="tcenter house-shi" type="text" /><span class="f14 c-333">室</span><input class="tcenter house-ting" type="text" /><span class="f14 c-333">厅</span><input class="tcenter house-wei" type="text" /><span class="f14 c-333">卫</span></span></a></li>';
        },
        // 写字楼
        use2: function() {
            return '<li class="bb-eee office"><a><span class="f14 c-333">写字楼名称</span><span class="flex flex-right align-items-center"><input class="tright office-name" type="text" placeholder="请输入写字楼名称" /></span></a></li><li class="bb-eee office"><a><span class="f14 c-333">地址</span><span class="flex flex-right align-items-center"><input class="tright addr" type="text" placeholder="请填写详细地址" /></span></a></li><li class="bb-eee office"><a><span class="f14 c-333">房屋面积</span><span class="flex flex-right align-items-center"><input class="tright square" type="text" placeholder="请输入房屋面积" /><span class="f14 c-333 ml8">m²</span></span></a></li><li class="bb-eee pb0 house-type office"><div class="main"><p class="f14 c-333">写字楼类型</p><p class="notes office-type"><span class="note active" data-type="写字楼">写字楼</span><span class="note" data-type="商业综合体">商业综合体</span><span class="note" data-type="商住两用楼">商住两用楼</span><span class="note" data-type="其他">其他</span></p></div></li>';
        },
        // 商铺
        use3: function() {
            return '<li class="bb-eee shop"><a><span class="f14 c-333">商铺名称</span><span class="flex flex-right align-items-center"><input class="tright shop-name" type="text" placeholder="请输入商铺名称" /></span></a></li><li class="bb-eee shop"><a><span class="f14 c-333">地址</span><span class="flex flex-right align-items-center"><input class="tright addr" type="text" placeholder="请填写详细地址" /></span></a></li><li class="bb-eee shop"><a><span class="f14 c-333">房屋面积</span><span class="flex flex-right align-items-center"><input class="tright square" type="text" placeholder="请输入房屋面积" /><span class="f14 c-333 ml8">m²</span></span></a></li><li class="bb-eee pb0 house-type shop"><div class="main"><p class="f14 c-333">商铺类型</p><p class="notes shop-type"><span class="note active" data-type="购物中心">购物中心</span><span class="note" data-type="社区商业">社区商业</span><span class="note" data-type="综合体配套">综合体配套</span><span class="note" data-type="其他">其他</span></p></div></li>';
        },
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
                use = $('.house-use .note.active').attr("data-type");
                switch (use) {
                    case 'house':
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        courtName = $(".house .court-name").val();
                        addr = $(".house .addr").val();
                        square = $(".house .square").val();
                        houseShi = $(".house .house-shi").val();
                        houseTing = $(".house .house-ting").val();
                        houseWei = $(".house .house-wei").val();
                        rent = $(".rent").val();
                        name = $(".name").val();
                        phone = $(".phone").val();
                        smsCode = $(".sms-code").val();
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
                        if (!$("#agreement-checkbox").is(':checked')) {
                            _this.prototype.layerFun("请勾选并同意《租客网出租委托协议》！");
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
                    case 'office':
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        officeName = $(".office .office-name").val();
                        addr = $(".office .addr").val();
                        square = $(".office .square").val();
                        officeType = $(".office-type .note.active").attr("data-type");
                        rent = $(".rent").val();
                        name = $(".name").val();
                        phone = $(".phone").val();
                        smsCode = $(".sms-code").val();
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
                        if (!$("#agreement-checkbox").is(':checked')) {
                            _this.prototype.layerFun("请勾选并同意《租客网出租委托协议》！");
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
                                cofficeName: cofficeName,
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
                    case 'shop':
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        shopName = $(".shop .shop-name").val();
                        addr = $(".shop .addr").val();
                        square = $(".shop .square").val();
                        shopType = $(".shop-type .note.active").attr("data-type");
                        rent = $(".rent").val();
                        name = $(".name").val();
                        phone = $(".phone").val();
                        smsCode = $(".sms-code").val();
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
                        if (!$("#agreement-checkbox").is(':checked')) {
                            _this.prototype.layerFun("请勾选并同意《租客网出租委托协议》！");
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
            $('body').append('<div class="succ-pop-bg"><div class="succ-pop"><div class="succ-icon"><p class="succ-txt">提交成功！我们会尽快审核</p></div><div class="succ-confirm">知道了</div></div></div>');
        },
        // 提交成功后 - 知道了
        gotIt: (function() {
            $(document).on('click', '.succ-pop .succ-confirm', function() {
                window.location.href = 'http://m.zuke.com/n/renter.html';
            });
        })()
    };
});