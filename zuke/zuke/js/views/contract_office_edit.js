$(document).ready(function() {
    var contract = contract || {};
    contract.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // img-item Template
        getImgItemTemplate: function(imgSrc) {
            return '<div class="img-item">' +
                '<img src="' + imgSrc + '" />' +
                '<span class="icon close-icon"></span>' +
                '</div>';
        },
        // img-upload
        imgUpload: (function() {
            var _this = contract,
                that,
                content = '',
                file,
                reader;
            $(document).on('change', '.img-upload .add-img input', function(e) {
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
                    content = '';
                    imgItemSum = that.parents(".img-upload").find('.img-item').length;
                    content = _this.prototype.getImgItemTemplate(this.result);
                    // 添加图片
                    that.parents(".add-img").before(content);

                    // 显示已添加提示
                    that.parents(".img-upload").siblings('.fujia-tit').find(".added").show();

                    // 最多上传5张
                    if (imgItemSum == 4) {
                        that.parents(".add-img").hide();
                    }

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
                            content = _this.prototype.getImgItemTemplate(this.result);
                            // 添加裁剪好的图片
                            $(".img-upload .add-img").before(content);
                            // 最多上传5张
                            if (imgItemSum == 4) {
                                $(".img-upload .add-img").hide();
                            }
                        },
                        error: function() {
                            _this.prototype.layerFun("上传失败，请刷新页面");
                        }
                    });*/
                }
            });
        })(),
        // 删除单张照片
        delectImgItem: (function() {
            var _this = contract,
                that,
                thatParent,
                imgItemSum;
            $(document).on('click', '.img-upload .img-item .close-icon', function() {
                that = $(this);
                thatParent = that.parent();
                imgItemSum = that.parents(".img-upload").find('.img-item').length;
                // 如果为5张，则删掉一张后，显示.add-img
                if (imgItemSum == 5) {
                    thatParent.remove();
                    that.parents(".img-upload").find('.add-img').show();
                    return false;
                }
                if (imgItemSum == 1) {
                    // 隐藏已添加提示
                    that.parents(".img-upload").siblings('.fujia-tit').find(".added").hide();
                    thatParent.remove();
                    return false;
                }
                thatParent.remove();
            });
        })(),
        // 下拉框
        select: (function() {
            var that;
            // 展开
            $(document).on('click', '.select > span', function(e) {
                e.stopPropagation();
                that = $(this);
                if (that.parents(".select").children('ul').is(":hidden")) {
                    $(".select > ul").hide();
                    $(".select").find(".select-val").siblings('i').addClass('xiala-icon').removeClass('shangla-active-icon');

                    that.parents(".select").children('ul').show();
                    that.find(".select-val").siblings('i').removeClass('xiala-icon').addClass('shangla-active-icon');
                } else {
                    that.parents(".select").children('ul').hide();
                    that.find(".select-val").siblings('i').removeClass('shangla-active-icon').addClass('xiala-icon');
                }
            });
            // 收缩
            $(document).on('click', '.select ul li', function(e) {
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
        // 加
        add: (function() {
            var that,
                num;
            $(document).on('click', '.add-icon', function() {
                that = $(this);
                num = parseInt(that.siblings('.num').html());
                that.siblings('.num').html(num + 1);
            });
        })(),
        // 减
        minus: (function() {
            var that,
                num;
            $(document).on('click', '.minus-icon', function() {
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
        // 配套设施附加相片
        supportingImg: (function() {
            var that,
                imgLength;
            $(document).on('click', '.fujia-tit', function(e) {
                e.preventDefault();
                that = $(this);
                if (!that.attr("name")) return false;
                if (that.children('.icon').hasClass('xiala-icon')) {
                    that.children('.icon').addClass('shangla-active-icon').removeClass('xiala-icon');
                    $(".img-upload[name='" + that.attr("name") + "']").show();
                } else if (that.children('.icon').hasClass('shangla-active-icon')) {
                    // 检验是否有上传图片
                    imgLength = $(".img-upload[name='" + that.attr("name") + "']").find('.img-item').length;
                    if (imgLength != 0) {
                        that.find(".added").show();
                    } else {
                        that.find(".added").hide();
                    }
                    that.children('.icon').addClass('xiala-icon').removeClass('shangla-active-icon');
                    $(".img-upload[name='" + that.attr("name") + "']").hide();
                }
            });
        })(),
        // 添加配套设施
        addSupporting: (function() {
            var addContent = '<div class="str middle order-supporting"><input class="std goods-td goods-name" type="text" placeholder="物品名"><span class="std num-td middle tcenter"><i class="icon minus-icon"></i><span class="num f14 c-333 ml8">0</span><i class="icon add-icon ml8"></i></span><span class="std remarks-td"><div class="edit-line mtb20"><input class="iw-228 remarks" type="text"></div><div class="test"></div></span><div class="fujia-tit f14" name="order-supporting"><span>附加相片</span><i class="icon xiala-icon"></i><span class="added c-3fabfa hide">(已添加)</span></div><div class="img-upload clearfix" name="order-supporting"><div class="add-img"><input type="file" accept="image/*"></div></div></div>',
                cnotent = '',
                name,
                imgArr = [],
                remarks,
                leftLength,
                rightLength;
            $(".add-supprting-btn").click(function(event) {
                console.log($(".order-supporting").length);
                if ($(".order-supporting").length > 0) {
                    name = $(".order-supporting .goods-name").val();
                    imgArr = [];
                    $(".order-supporting .img-upload .img-item").each(function(index, el) {
                        imgArr.push($(el).children('img').attr("src"));
                    });
                    remarks = $(".order-supporting .remarks").val();
                    if (!name) {
                        contract.prototype.layerFun("请填写物品名称！");
                        $(".order-supporting .goods-name").focus();
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

                    content = '<div class="str middle"><span class="std goods-td">' + name + '</span><span class="std num-td middle tcenter"><i class="icon minus-icon"></i><span class="num f14 c-333 ml8">0</span><i class="icon add-icon ml8"></i></span><span class="std remarks-td"><div class="edit-line mtb20"><input class="iw-228 remarks" value="' + remarks + '" type="text"></div></span><div class="fujia-tit f14" name="' + name + '"><span>附加相片</span><i class="icon xiala-icon"></i><span class="added c-3fabfa hide">(已添加)</span></div><div class="img-upload clearfix" name="' + name + '">' + $(".order-supporting .img-upload").html() + '</div></div>';

                    // 清空数据
                    $(".order-supporting").remove();

                    leftLength = $(".stable .sitem:first-child").find(".str").length;
                    rightLength = $(".stable .sitem:last-child").find(".str").length;
                    if (leftLength == rightLength) {
                        $(".stable .sitem:first-child .sbody").append(content);
                    } else {
                        $(".stable .sitem:last-child .sbody").append(content);
                    }

                    contract.prototype.layerFun("已添加~");
                } else {
                    leftLength = $(".stable .sitem:first-child").find(".str").length;
                    rightLength = $(".stable .sitem:last-child").find(".str").length;
                    if (leftLength == rightLength) {
                        $(".stable .sitem:first-child .sbody").append(addContent);
                    } else {
                        $(".stable .sitem:last-child .sbody").append(addContent);
                    }
                    $(".order-supporting .goods-name").focus();
                }
            });
        })(),
        // 获取配套设施
        getSupporting: function() {
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

            $(".stable .sitem .sbody .str").each(function(index, el) {
                that = $(el);
                var j = {};

                // 如果是宽带则跳出本次循环
                if (that.hasClass('kdai-tr')) return true;

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
                supportingName = that.find(".fujia-tit").attr("name");
                // 获取数量
                num = parseInt(that.find(".num").html());
                // 获取备注
                remarks = that.find(".remarks").val();

                // 添加数据到类
                j.imgArr = imgArr;
                j.num = num;
                j.remarks = remarks;

                // 添加的
                if (that.hasClass('order-supporting')) {
                    supporting[that.find(".goods-name").val()] = j;
                } else {
                    supporting[supportingName] = j;
                }
            });
            // 添加宽带
            supporting["宽带"] = $('input[name="kdai"]:checked').val();
            return supporting;
        },
        // 自动计算租期结束时间
        calcZuqiEndTime: (function() {
            var zuqiStartTime,
                zuqiMonth,
                str,
                d;

            function calc() {
                zuqiMonth = parseInt($(".zuqi-month").val());
                if (!zuqiMonth) return false;

                zuqiStartTime = $(".year-select .select-val").html() + '-' + $(".month-select .select-val").html() + '-' + $(".day-select .select-val").html();

                console.log(zuqiStartTime);

                d = new Date(zuqiStartTime);
                d.setMonth(d.getMonth() + zuqiMonth);
                str = d.getFullYear() + "-" + (d.getMonth() >= 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate() : "0" + d.getDate());

                $(".zuqi-end-time").html(str);
            }
            // 当租期开始时间改变时
            $(".year-select .select-val, .month-select .select-val, .day-select .select-val").bind("DOMNodeInserted", function(e) {
                calc();
            });
            // 当租月数改变时
            $(".zuqi-month").keyup(function() {
                calc();
            });
        })(),
        // 提交
        contractSub: (function() {
            var _this = contract,
                imgArr = [],
                officeName,
                doorNumber,
                addr,
                square,
                supporting = [],
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
                $(".house-img-upload .img-item").each(function(index, el) {
                    imgArr.push($(el).children('img').attr("src"));
                });
                // 判断是否上传图片
                if (!imgArr) {
                    _this.prototype.layerFun("请上传房源图片！");
                    return false;
                }
                officeName = $(".office-name").val();
                doorNumber = $(".door-number").val();
                addr = $(".addr").val();
                square = $(".square").val();
                supporting = _this.prototype.getSupporting();
                operationType = $(".operation-type").val();
                supplyDesc = $(".supply-desc").val();
                rent = $(".rent").val();
                zuqiStartTime = $(".year-select .select-val").attr("value") + '-' + $(".month-select .select-val").attr("value") + '-' + $(".day-select .select-val").attr("value");
                zuqiMonth = $(".zuqi-month").val();
                zuqiEndTime = $(".zuqi-end-time").html();
                fuzuDay = $(".fuzu-day").val();
                rentMethod = $(".rent-method-select .select-val").attr("value");
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

                console.log(imgArr, officeName, addr, square, supporting, operationType, supplyDesc, rent, zuqiStartTime, zuqiMonth, zuqiEndTime, fuzuDay, rentMethod, deposit, renterName, renterPhone, renterId, landlordName, landlordPhone, landlordId);

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        imgArr: imgArr,
                        officeName: officeName,
                        doorNumber: doorNumber,
                        addr: addr,
                        square: square,
                        operationType: operationType,
                        supporting: supporting,
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
        })()
    };
});