$(document).ready(function() {
    var release = release || {};
    release.prototype = {
        // 用来记录PhotoClip对象
        photoClipObj: null,
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // img-item Template
        getImgItemTemplate: function(imgSrc, isActive) {
            var active = "",
                word = "";
            if (isActive) {
                active = "active";
                word = "主图";
            } else {
                active = "";
                word = "设为主图";
            }
            return '<div class="img-item ' + active + '">' +
                '<img src="' + imgSrc + '" />' +
                '<p class="set-mainImg">' + word + '</p>' +
                '<span class="icon close-icon"></span>' +
                '</div>';
        },
        // 图片裁剪函数
        photoClip: function(that) {
            var _this = release,
                content = '',
                pcThis,
                pc = new PhotoClip('#clipArea', {
                    size: [550, 400],
                    outputSize: [1000, 725], // 输出图像大小
                    ok: '.clip-pop .confirm',
                    loadStart: function() {
                        console.log('开始读取照片');
                    },
                    loadComplete: function() {
                        console.log('照片读取完成');
                        _this.prototype.photoClipObj = this;
                    },
                    done: function(dataURL) {
                        // console.log(dataURL);
                        pcThis = this;

                        content = '';
                        imgItemSum = that.parents(".img-upload").find('.img-item').length;
                        // 判断img-item的数量，如果为0，则为第一张
                        if (imgItemSum == 0) {
                            content = _this.prototype.getImgItemTemplate(dataURL, true);
                        } else {
                            content = _this.prototype.getImgItemTemplate(dataURL, false);
                        }
                        // 添加图片
                        that.parents(".add-img").before(content);

                        // 最多上传5张
                        if (imgItemSum == 4) {
                            that.parents(".img-upload").find('.add-img').hide();
                        }

                        $(".clip-pop").hide();
                        // 裁剪完销毁对象
                        pcThis.destroy();

                        // 清空file的value，解决连续上传同一张图片时无法选择的问题
                        $("input[type='file'").val("");
                        // 裁剪后进行上传
                        /*$.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                "imgdata": dataURL
                            },
                            success: function(data) {
                                content = '';
                                imgItemSum = that.parents(".img-upload").find('.img-item').length;
                                // 判断img-item的数量，如果为0，则为第一张
                                if (imgItemSum == 0) {
                                    content = _this.prototype.getImgItemTemplate(data.src, true);
                                } else {
                                    content = _this.prototype.getImgItemTemplate(data.src, false);
                                }
                                // 添加图片
                                that.parents(".add-img").before(content);

                                // 最多上传5张
                                if (imgItemSum == 4) {
                                    that.parents(".img-upload").find('.add-img').hide();
                                }

                                $(".clip-pop").hide();
                                // 裁剪完销毁对象
                                pcThis.destroy();

                                // 清空file的value，解决连续上传同一张图片时无法选择的问题
                                $("input[type='file'").val("");
                            },
                            error: function() {
                                _this.prototype.layerFun("提交失败，请刷新页面");
                            }
                        });*/
                    },
                    fail: function(msg) {
                        console.log(msg);
                    }
                });
            return pc;
        },
        // 裁剪关闭
        clipHide: (function() {
            var _this = release;
            $(".clip-pop .cancel").click(function(event) {
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
        // img-upload
        imgUpload: (function() {
            var _this = release;
            $(document).on('change', '.img-upload .add-img input', function(e) {
                _this.prototype.photoClip($(this)).load(this.files[0]);
                $(".clip-pop").show();
            });
        })(),
        // 删除单张照片
        delectImgItem: (function() {
            var _this = release,
                that,
                thatParent,
                imgItemSum;
            $(document).on('click', '.img-upload .img-item .close-icon', function() {
                that = $(this);
                thatParent = that.parent();
                imgItemSum = that.parents(".img-upload").find('.img-item').length;
                // 如果为5张，则删掉一张后，显示.add-img
                if (imgItemSum == 5) {
                    that.parents(".img-upload").find('.add-img').show();
                }
                thatParent.remove();

                // 如果此张图片为主图，则将第一张设为主图
                if (thatParent.hasClass('active')) {
                    if (imgItemSum == 1) return false;

                    $(".img-upload .img-item").first().addClass('active');
                    $(".img-upload .img-item .set-mainImg").first().html('主图');
                }
            });
        })(),
        // 设为主图
        setMainImg: (function() {
            var that,
                thatParent;
            $(document).on('click', '.set-mainImg', function() {
                that = $(this);
                thatParent = that.parent();
                if (thatParent.hasClass('active')) return false;

                thatParent.addClass('active').siblings().removeClass('active');
                $(".set-mainImg").html("设为主图");
                that.html("主图");
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
                            that.parents(".select").find(".select-val").html(that.html());
                            that.parents("ul").hide();
                        },
                        error: function() {
                            _this.prototype.layerFun("加载失败");
                        }
                    });
                }
            });
        })(),
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
        releaseSub: (function() {
            var _this = release,
                use,
                mainImg,
                orderImg = [],
                chanquan,
                xieyi,
                officeName,
                district,
                region,
                addr,
                officeType,
                square,
                floor,
                floorSum,
                decoration,
                rent,
                commission,
                depositMethod,
                rentMethod,
                labels = [],
                title,
                detailsDesc;
            $(".release-sub").click(function() {
                // 获取图片
                orderImg = [];
                $(".house-img-upload .img-item").each(function(index, el) {
                    if ($(el).hasClass('active')) {
                        mainImg = $(el).children('img').attr("src");
                    } else {
                        orderImg.push($(el).children('img').attr("src"));
                    }
                });
                // 判断是否上传主图
                if (!mainImg) {
                    _this.prototype.layerFun("请上传房源图片！");
                    return false;
                }
                chanquan = $(".chanquan").attr("src");
                xieyi = $(".xieyi").attr("src");
                officeName = $(".office-name").val();
                district = $(".district-select .select-val").attr("value");
                region = $(".region-select .select-val").attr("value");
                addr = $(".addr").val();
                officeType = $('input[name="office-type"]:checked').attr("value");
                square = $(".square").val();
                floor = $('.floor').val();
                floorSum = $(".floor-sum").val();
                decoration = $('input[name="decoration"]:checked').attr("value");
                rent = $(".rent").val();
                commission = $(".commission").val();
                depositMethod = $('input[name="deposit-method"]:checked').attr("value");
                rentMethod = $('input[name="rent-method"]:checked').attr("value");
                labels = [];
                $('input[name="labels"]:checked').each(function(index, el) {
                    labels.push($(el).attr("value"));
                });
                title = $(".title").val();
                detailsDesc = $(".details-desc").val();

                console.log(chanquan, xieyi, officeName, district, region, addr, officeType, square, floor, floorSum, decoration, rent, commission, depositMethod, rentMethod, labels, title, detailsDesc);

                if (!officeName) {
                    _this.prototype.layerFun("请填写写字楼名称！");
                    return false;
                }
                if (!district || !region) {
                    _this.prototype.layerFun("请选择所在区域！");
                    return false;
                }
                if (!addr) {
                    _this.prototype.layerFun("请填写详细地址！");
                    return false;
                }
                if (!officeType) {
                    _this.prototype.layerFun("请选择写字楼类型！");
                    return false;
                }
                if (!square) {
                    _this.prototype.layerFun("请填写房屋面积！");
                    return false;
                }
                if (!floorSum) {
                    _this.prototype.layerFun("请填写楼层数！");
                    return false;
                }
                if (!rent) {
                    _this.prototype.layerFun("请填写租金！");
                    return false;
                }
                if (!commission) {
                    _this.prototype.layerFun("请填写佣金！");
                    return false;
                }
                if (!title) {
                    _this.prototype.layerFun("请填写标题！");
                    return false;
                }
                if (!detailsDesc) {
                    _this.prototype.layerFun("请填写出租描述！");
                    return false;
                }

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        mainImg: mainImg,
                        orderImg: orderImg,
                        chanquan: chanquan,
                        xieyi: xieyi,
                        officeName: officeName,
                        district: district,
                        region: region,
                        addr: addr,
                        officeType: officeType,
                        square: square,
                        floor: floor,
                        floorSum: floorSum,
                        decoration: decoration,
                        rent: rent,
                        commission: commission,
                        depositMethod: depositMethod,
                        rentMethod: rentMethod,
                        labels: labels,
                        title: title,
                        detailsDesc: detailsDesc
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