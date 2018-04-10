$(document).ready(function() {
    var contract = contract || {};
    contract.prototype = {
        // 用来记录PhotoClip对象
        photoClipObj: null,
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
        // 图片裁剪函数
        photoClip: function() {
            var _this = contract,
                fontSize = 20 * (document.documentElement.clientWidth / 320),
                content = '',
                pc = new PhotoClip('#clipArea', {
                    size: [16 * fontSize, 11.6 * fontSize],
                    ok: '.clip-pop .confirm',
                    loadStart: function() {
                        console.log('开始读取照片');
                    },
                    loadComplete: function() {
                        console.log('照片读取完成');
                        _this.prototype.photoClipObj = this;
                    },
                    done: function(dataURL) {
                        // 裁剪后进行上传
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                "imgdata": dataURL
                            },
                            success: function(data) {
                                content = '';
                                imgItemSum = $(".img-item").length;
                                // 判断img-item的数量，如果为0，则为第一张
                                if (imgItemSum == 0) {
                                    // 隐藏.big-upload，并显示.add-upload
                                    $(".big-upload").hide();
                                    $(".add-upload").show();
                                }
                                content = _this.prototype.getImgItemTemplate(data.src);
                                // 添加裁剪好的图片
                                $(".add-upload .add-img").before(content);
                                // 最多上传5张
                                if (imgItemSum == 4) {
                                    $(".add-upload .add-img").hide();
                                }
                                contract.prototype.modalHelper.beforeClose();
                                $(".clip-pop").hide();
                                // 裁剪完销毁对象
                                this.destroy();

                                // 清空file的value，解决连续上传同一张图片时无法选择的问题
                                $("input[type='file'").val("");
                            },
                            error: function() {
                                _this.prototype.layerFun("提交失败，请刷新页面");
                            }
                        });
                    },
                    fail: function(msg) {
                        console.log(msg);
                    }
                });
            return pc;
        },
        // 裁剪关闭
        clipHide: (function() {
            var _this = contract;
            $(".clip-pop .close-clip").click(function(event) {
                contract.prototype.modalHelper.beforeClose();
                // 取消的时候 销毁已创建的PhotoClip对象
                _this.prototype.photoClipObj.destroy();
                // 初始化photoClipObj
                _this.prototype.photoClipObj = null;
                $(".clip-pop").hide();
                $("#clipArea").html("");
                // 清空file的value，解决连续上传同一张图片时无法选择的问题
                $("input[type='file'").val("");
            });
        })(),
        // img-item Template
        getImgItemTemplate: function(imgSrc) {
            return '<div class="img-item">' +
                '<img src="' + imgSrc + '" />' +
                '<span class="icon close-icon"></span>' +
                '</div>';
        },
        // 图片第一张上传，big-upload
        bigUpload: (function() {
            var _this = contract;
            $(document).on('change', '.big-upload input', function(e) {
                _this.prototype.photoClip().load(this.files[0]);
                $(".clip-pop").show();
                contract.prototype.modalHelper.afterOpen();
            });
        })(),
        // add-upload
        addUpload: (function() {
            var _this = contract;
            $(document).on('change', '.add-upload .add-img input', function(e) {
                _this.prototype.photoClip().load(this.files[0]);
                $(".clip-pop").show();
                contract.prototype.modalHelper.afterOpen();
            });
        })(),
        // 删除单张照片
        delectImgItem: (function() {
            var _this = contract,
                that,
                thatParent,
                imgItemSum;
            $(document).on('click', '.add-upload .img-item .close-icon', function() {
                that = $(this),
                    thatParent = that.parent();
                imgItemSum = $(".img-item").length;
                // 如果.big-upload是隐藏的
                if ($(".add-upload .add-img").is(":hidden")) {
                    // 如果为5张，则删掉一张后，显示.add-img
                    if (imgItemSum == 5) {
                        thatParent.remove();
                        $(".add-upload .add-img").show();
                    }
                } else {
                    // 如果删除唯一一张，则显示.big-upload，隐藏.add-upload
                    if (imgItemSum == 1) {
                        $(".big-upload").show();
                        $(".add-upload").hide();
                    }
                    thatParent.remove();
                }

                // 如果此张图片为主图，则将第一张设为主图
                if (thatParent.hasClass('active')) {
                    if (imgItemSum == 1) return false;
                    $(".add-upload .img-item:first").addClass('active');
                    $(".add-upload .img-item:first .set-mainImg").html('主图');
                }
            });
        })(),
        // 付租方式切换
        typeSwitch: (function() {
            $(document).on('click', '.rent-method .note', function() {
                if ($(this).hasClass('active')) return false;
                $(this).addClass('active').siblings().removeClass('active');
            });
        })(),
        // 字数限制
        wordLimit: (function() {
            var curLength,
                res,
                maxLength;
            $(document).on('keyup', 'textarea', function() {
                curLength = $.trim($(this).val()).length;
                maxLength = parseInt($(this).attr("data-maxWord"));
                if (curLength > maxLength) {
                    res = $(this).val().substr(0, maxLength);
                    $(this).val(res);
                } else {
                    $(this).siblings().children(".shengyu").text(maxLength - curLength);
                }
            });
        })(),
        // 配套Toggle
        supportingToggle: (function() {
            // 弹出
            $(document).on('click', '.supporting', function(e) {
                e.preventDefault();
                $(".supporting-pop").show();
                contract.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.supporting-pop .close-supporting', function(e) {
                e.preventDefault();
                contract.prototype.modalHelper.beforeClose();
                $(".supporting-pop").hide();
            });
        })(),
        // 配套下拉收缩
        supportingItemToggle: (function() {
            var that;
            $(document).on('click', '.supporting-pop .ul-list > li', function(e) {
                e.preventDefault();
                that = $(this);
                if (!that.attr("name")) return false;
                if (that.children('.icon').hasClass('xiala-icon')) {
                    that.children('.icon').addClass('shangla-icon').removeClass('xiala-icon');
                    $(".supporting-pop .li-box[name='" + that.attr("name") + "']").slideDown(300);
                } else if (that.children('.icon').hasClass('shangla-icon')) {
                    that.children('.icon').addClass('xiala-icon').removeClass('shangla-icon');
                    $(".supporting-pop .li-box[name='" + that.attr("name") + "']").slideUp(300);
                }
            });
            // bug...，无法阻止事件冒泡，应该与for有关~
            $(".supporting-pop .ul-list > li label[for='have'], .supporting-pop ul > li label[for='not-have']").click(function(e) {
                e.preventDefault();
                that = $(this);
                $(".supporting-pop ul > li input[type='radio']").prop('checked', false);
                if (that.siblings("input[type='radio']").length > 0) {
                    that.siblings("input[type='radio']").prop('checked', true);
                } else {
                    that.prev("span").children("input[type='radio']").prop('checked', true);
                }
                return false;
            });
            // 阻止除了.icon的子元素的事件冒泡
            $(document).on('click', '.supporting-pop .ul-list > li > *:not(.icon)', function(e) {
                e.preventDefault();
                return false;
            });
        })(),
        // supporting img-item Template
        getSupportingImgItemTemplate: function(imgSrc) {
            return '<div class="img-item">' +
                '<img src="' + imgSrc + '" />' +
                '<span class="icon close-icon"></span>' +
                '</div>';
        },
        // 添加配套设施
        addSupporting: (function() {
            var content = '<li class="order-supporting bb-eee" name="order-supporting"><input class="flex-equal name" type="text" placeholder="请物品名称"><span class="flex-right mr13 icon shangla-icon"></span></li><div class="li-box order-supporting-box" name="order-supporting"><div class="plr12 pt12 small-upload supporting-upload clearfix"><div class="add-img"><input type="file" accept="image/*" /></div></div><p class="flex align-items-center plr12 ptb12"><span class="f12 c-333">数量</span><i class="icon minus-icon"></i><span class="num f12 c-333">0</span><i class="icon add-icon"></i></p><div class="plr12 ptb12 bb-eee"><p class="f14 c-333">备注</p><textarea class="remarks pt12" placeholder="请输入备注" data-maxWord="200" name="remarks"></textarea><p class="f12 c-999"><span class="shengyu">0</span><span>/200</span></p></div></div>',
                name,
                imgArr = [],
                remarks;
            $(".supporting-pop .add-supporting").click(function(event) {
                if ($(".order-supporting").length > 0) {
                    name = $(".order-supporting .name").val();
                    imgArr = [];
                    $(".order-supporting-box .img-item").each(function(index, el) {
                        imgArr.push($(el).children('img').attr("src"));
                    });
                    remarks = $(".order-supporting-box .remarks").val();
                    if (!name) {
                        contract.prototype.layerFun("请填写物品名称！");
                        return false;
                    }
                    if (imgArr.length == 0) {
                        contract.prototype.layerFun("请上传物品图片！");
                        return false;
                    }
                    if (!remarks) {
                        contract.prototype.layerFun("请填写备注！");
                        return false;
                    }
                    $(".supporting-pop .order-supporting").before('<li class="bb-eee" name="' + name + '"><span class="f14 c-333">' + name + '</span><span class="flex-right mr13 icon xiala-icon"></span></li><div class="li-box hide" name="' + name + '">' + $(".order-supporting-box").html() + '</div>');
                    $(".li-box[name=" + name + "] .remarks").val(remarks);

                    // 清空数据
                    $(".order-supporting .name").val("");
                    $(".order-supporting-box .img-item").remove();
                    $(".order-supporting-box .remarks").val("");

                    contract.prototype.layerFun("已添加~");
                } else {
                    $(".supporting-pop .ul-list").append(content);
                    $('.supporting-pop').scrollTop($('.supporting-pop')[0].scrollHeight);
                }
            });
        })(),
        // 配套完成
        supportingFinish: (function() {
            var that,
                /*supporting = {
                    "床": {
                        "imgArr": [],
                        "num": 0,
                        "remarks": "lalala"
                    },
                    .......,
                    "宽带": "0" // 0代表无，1代表有
                } */
                supporting = {},
                supportingName,
                imgArr = [],
                num = 0,
                remarks = '';
            $(".supporting-finish").click(function() {
                $(".supporting-pop .li-box").each(function(index, el) {
                    that = $(el);
                    var j = {};

                    // 初始化值
                    imgArr = []
                    supportingName = '';
                    num = 0;
                    remarks = '';

                    // 循环获取img
                    that.find(".img-item").each(function(index, el) {
                        imgArr.push($(el).children('img').attr("src"));
                    });
                    // 获取物品名称
                    supportingName = that.attr("name");
                    // 获取数量
                    num = parseInt(that.find(".num").html());
                    // 获取备注
                    remarks = that.find(".remarks").val();

                    // 添加数据到类
                    j.imgArr = imgArr;
                    j.num = num;
                    j.remarks = remarks;

                    if (that.hasClass('order-supporting-box')) {
                        supporting[$(".order-supporting .name").val()] = j;
                    } else {
                        supporting[supportingName] = j;
                    }
                });
                // 添加宽带
                supporting["宽带"] = $('input[name="kdai"]:checked').val();
                // 将值放到.supporting的data-supporting中
                $(".supporting").attr({
                    "data-supporting": JSON.stringify(supporting)
                });
                $(".supporting > span:last-child > span:first-child").html("已填写");
                contract.prototype.modalHelper.beforeClose();
                $(".supporting-pop").hide();
                console.log(JSON.stringify(supporting));
            });
        })(),
        // supporting-upload
        supportingUpload: (function() {
            var _this = contract,
                that,
                content,
                imgItemSum;
            $(document).on('change', '.supporting-upload .add-img input', function(e) {
                that = $(this);
                var file = this.files[0];
                if (!/image\/\w+/.test(file.type)) {
                    contract.prototype.layerFun("请上传图片！");
                    return false;
                }
                var reader = new FileReader();
                //将文件以Data URL形式读入页面
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    content = '';
                    imgItemSum = that.parents('.supporting-upload').children(".img-item").length;
                    content = _this.prototype.getSupportingImgItemTemplate(e.target.result);
                    // 添加裁剪好的图片
                    that.parents('.supporting-upload').children('.add-img').before(content);

                    // 清空file的value，解决连续上传同一张图片时无法选择的问题
                    $("input[type='file'").val("");
                    /*$.ajax({
                        url: "",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            "imgdata": e.target.result
                        },
                        success: function(data) {
                            content = '';
                            imgItemSum = $(".img-item").length;
                            content = _this.prototype.getSupportingImgItemTemplate(data.src);
                            // 添加裁剪好的图片
                            that.parents('.supporting-upload').children('.add-img').before(content);
                            // 清空file的value，解决连续上传同一张图片时无法选择的问题
                            $("input[type='file'").val("");
                        },
                        error: function() {
                            _this.prototype.layerFun("提交失败，请刷新页面");
                        }
                    });*/
                }
            });
        })(),
        // 删除单张配套照片
        delectSupportingImgItem: (function() {
            var _this = contract,
                that,
                thatParentImgItem,
                thatParentSupporting,
                imgItemSum;
            $(document).on('click', '.supporting-upload .img-item .close-icon', function() {
                that = $(this);
                thatParentSupporting = that.parents('.supporting-upload');
                thatParentImgItem = that.parents('.img-item');
                imgItemSum = thatParentSupporting.children(".img-item").length;

                thatParentImgItem.remove();
            });
        })(),
        // 加
        add: (function() {
            var that,
                num;
            $(document).on('click', '.supporting-pop .add-icon', function() {
                that = $(this);
                num = parseInt(that.siblings('.num').html());
                that.siblings('.num').html(num + 1);
            });
        })(),
        // 减
        minus: (function() {
            var that,
                num;
            $(document).on('click', '.supporting-pop .minus-icon', function() {
                that = $(this);
                num = parseInt(that.siblings('.num').html());

                if ((num - 1) < 0) {
                    contract.prototype.layerFun("不能减咯~");
                    return false;
                } else {
                    that.siblings('.num').html(num - 1);
                }
            });
        })(),
        // 选择租期时间
        selectDate: (function() {
            var calendar = new datePicker(),
                zuqiMonth,
                str,
                d;
            calendar.init({
                'trigger': '.zuqi-start-time',
                /*按钮选择器，用于触发弹出插件*/
                'type': 'date',
                /*模式：date日期；datetime日期时间；time时间；ym年月；*/
                'minDate': '1900-1-1',
                /*最小日期*/
                'maxDate': '2100-12-31',
                /*最大日期*/
                'onSubmit': function() { /*确认时触发事件*/
                    zuqiMonth = parseInt($(".zuqi-month").val());
                    if (zuqiMonth) {
                        d = new Date(calendar.value.replace(/-/g, "/"));
                        d.setMonth(d.getMonth() + zuqiMonth);
                        str = d.getFullYear() + "-" + (d.getMonth() >= 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate() : "0" + d.getDate());
                        $(".zuqi-end-time").val(str);
                    }
                },
                'onClose': function() { /*取消时触发事件*/ }
            });
        })(),
        // 修改租的月数，自动计算出到期时间
        changeZuQiMonth: (function() {
            var zuqiStartTime,
                zuqiStartTime,
                d,
                str;
            $(".zuqi-month").keyup(function(event) {
                zuqiStartTime = $(".zuqi-start-time").val();
                zuqiMonth = parseInt($(".zuqi-month").val());
                if (zuqiStartTime) {
                    d = new Date(zuqiStartTime.replace(/-/g, "/"));
                    d.setMonth(d.getMonth() + zuqiMonth);
                    str = d.getFullYear() + "-" + (d.getMonth() >= 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate() : "0" + d.getDate());
                    $(".zuqi-end-time").val(str);
                }
                if (!zuqiMonth) $(".zuqi-end-time").val('');
            });
        })(),
        // 提交
        contractSub: (function() {
            var _this = contract,
                imgArr = [],
                shopName,
                doorNumber,
                addr,
                square,
                operationType,
                supplyDesc,
                rent,
                zuqiStartTime,
                zuqiEndTime,
                zuqiMonth,
                fuzuDay,
                rentMethod,
                deposit,
                penalty,
                penaltyDay,
                property,
                orderCost,
                renterName,
                renterPhone,
                renterId,
                landlordName,
                landlordPhone,
                landlordId;
            $(".contract-sub").click(function() {
                // 获取图片
                imgArr = [];
                $(".add-upload .img-item").each(function(index, el) {
                    imgArr.push($(el).children('img').attr("src"));
                });
                // 判断是否上传图片
                if (!imgArr) {
                    _this.prototype.layerFun("请上传房源图片！");
                    return false;
                }
                shopName = $(".shop-name").val();
                doorNumber = $(".door-number").val();
                addr = $(".addr").val();
                square = $(".square").val();
                operationType = $(".operation-type").val();
                supplyDesc = $(".supply-desc").val();
                rent = $(".rent").val();
                zuqiStartTime = $(".zuqi-start-time").val();
                zuqiMonth = $(".zuqi-month").val();
                zuqiEndTime = $(".zuqi-end-time").val();
                fuzuDay = $(".fuzu-day").val();
                rentMethod = $('.rent-method .note.active').attr("data-type");
                deposit = $(".deposit").val();
                penalty = $(".penalty").val();
                penaltyDay = $(".penalty-day").val();
                property = $(".property").val();
                orderCost = $(".order-cost").val();
                renterName = $(".renter-name").val();
                renterPhone = $(".renter-phone").val();
                renterId = $(".renter-id").val();
                landlordName = $(".landlord-name").val();
                landlordPhone = $(".landlord-phone").val();
                landlordId = $(".landlord-id").val();

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        imgArr: imgArr,
                        shopName: shopName,
                        doorNumber: doorNumber,
                        addr: addr,
                        square: square,
                        operationType: operationType,
                        supplyDesc: supplyDesc,
                        rent: rent,
                        zuqiStartTime: zuqiStartTime,
                        zuqiMonth: zuqiMonth,
                        zuqiEndTime: zuqiEndTime,
                        fuzuDay: fuzuDay,
                        rentMethod: rentMethod,
                        deposit: deposit,
                        penalty: penalty,
                        penaltyDay: penaltyDay,
                        property: property,
                        orderCost: orderCost,
                        renterName: renterName,
                        renterPhone: renterPhone,
                        renterId: renterId,
                        landlordName: landlordName,
                        landlordPhone: landlordPhone,
                        landlordId: landlordId
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