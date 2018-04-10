$(document).ready(function() {
    var release = release || {};
    release.prototype = {
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
            var _this = release,
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
                                    content = _this.prototype.getImgItemTemplate(data.src, true);
                                    // 隐藏.big-upload，并显示.add-upload
                                    $(".big-upload").hide();
                                    $(".add-upload").show();
                                } else {
                                    content = _this.prototype.getImgItemTemplate(data.src, false);
                                }
                                // 添加裁剪好的图片
                                $(".add-upload .add-img").before(content);
                                // 最多上传5张
                                if (imgItemSum == 4) {
                                    $(".add-upload .add-img").hide();
                                }
                                release.prototype.modalHelper.beforeClose();
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
            var _this = release;
            $(".clip-pop .close-clip").click(function(event) {
                release.prototype.modalHelper.beforeClose();
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
        // 图片第一张上传，big-upload
        bigUpload: (function() {
            var _this = release;
            $(document).on('change', '.big-upload input', function(e) {
                _this.prototype.photoClip().load(this.files[0]);
                $(".clip-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
        })(),
        // add-upload
        addUpload: (function() {
            var _this = release;
            $(document).on('change', '.add-upload .add-img input', function(e) {
                _this.prototype.photoClip().load(this.files[0]);
                $(".clip-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
        })(),
        // 删除单张照片
        delectImgItem: (function() {
            var _this = release,
                that,
                thatParent,
                imgItemSum;
            $(document).on('click', '.img-item .close-icon', function() {
                that = $(this),
                    thatParent = that.parent();
                imgItemSum = $(".img-item").length;
                // 如果.big-upload是隐藏的
                if ($(".add-img").is(":hidden")) {
                    // 如果为5张，则删掉一张后，显示.add-img
                    if (imgItemSum == 5) {
                        thatParent.remove();
                        $(".add-img").show();
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
        // 字数限制
        wordLimit: (function() {
            var curLength,
                res;
            $("textarea").keyup(function() {
                curLength = $.trim($(".qiuzu-desc").val()).length;
                if (curLength > 800) {
                    res = $(".qiuzu-desc").val().substr(0, 800);
                    $(".qiuzu-desc").val(res);
                } else {
                    $(".shengyu").text(800 - curLength);
                }
            });
        })(),
        // 房屋用途切换
        useSwitch: (function() {
            var _this = release;
            $(document).on('click', '.house-use .note', function(e) {
                if ($(this).hasClass('active')) return false;
                // 清除兄弟元素样式，自己加上样式
                $(this).addClass('active').siblings().removeClass('active');
                // 重置特色标签已选择的数据
                $(".labels > span:last-child > span:first-child").html("未选择");
                $(".labels").removeAttr('data-labels');
                // 删掉已有的.labels-pop
                $(".labels-pop").remove();
                switch (e.target.dataset.type) {
                    case 'house':
                        // 替换对应的html
                        $(".use-main").html(_this.prototype.houseUse());
                        $(".use-main").after(_this.prototype.houseSupporting());
                        $("body").append(_this.prototype.houseLabelsPop());
                        break;
                    case 'office':
                        $(".use-main").html(_this.prototype.officeUse());
                        $(".house-supporting").remove();
                        $("body").append(_this.prototype.officeLabelsPop());
                        break;
                    case 'shop':
                        $(".use-main").html(_this.prototype.shopUse());
                        $(".house-supporting").remove();
                        $("body").append(_this.prototype.shopLabelsPop());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 写字楼类型、商铺类型、楼层、装修、押金方式、付租方式切换
        typeSwitch: (function() {
            $(document).on('click', '.office-type .note, .shop-type .note, .floor .note, .decoration .note, .decoration .note, .deposit-method .note, .rent-method .note', function() {
                if ($(this).hasClass('active')) return false;
                $(this).addClass('active').siblings().removeClass('active');
            });
        })(),
        // 配套选择
        typeSwitch: (function() {
            $(document).on('click', '.supporting .note', function() {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    return false;
                }
                $(this).addClass('active');
            });
        })(),
        // 特色标签选择
        labelsCheck: (function() {
            var that;
            $(document).on('click', '.labels-pop .ul-list li a', function(e) {
                e.preventDefault();
                that = $(this);
                if (that.hasClass('check-icon')) {
                    that.removeClass('check-icon');
                    return false;
                }
                that.addClass('check-icon');
            });
        })(),
        // 特色标签选择完成
        labelsCheckFinish: (function() {
            var that,
                checkArr = [];
            $(document).on('click', '.labels-pop .labels-finish', function() {
                that = $(this);
                // 重置
                checkArr = [];
                // 循环获取已选择的值
                $(".labels-pop .ul-list li a").each(function(index, el) {
                    if ($(el).hasClass('check-icon')) {
                        checkArr.push($(el).children('span').html());
                    }
                });
                // 将选择的值放入.labels的data-labels中
                $(".labels").attr("data-labels", checkArr);
                // 判断选未选择
                if ($(".labels").attr("data-labels") == "") {
                    $(".labels > span:last-child > span:first-child").html("未选择");
                } else {
                    $(".labels > span:last-child > span:first-child").html("已选择");
                }
                release.prototype.modalHelper.beforeClose();
                $(".labels-pop").hide();
            });
        })(),
        // 特色标签toggle
        labelsToggle: (function() {
            // 显示
            $(document).on('click', '.labels', function(e) {
                e.preventDefault();
                $(".labels-pop.shop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.labels-pop .close-labels', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".labels-pop").hide();
            });
        })(),
        // 产权证明
        chanquanToggle: (function() {
            // 弹出
            $(document).on('click', '.chanquan', function(e) {
                e.preventDefault();
                $(".chanquan-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.chanquan-pop .close-chanquan', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".chanquan-pop").hide();
            });
        })(),
        // 产权证明提交
        chanquanSub: (function() {
            var _this = release,
                imgDatabase;
            $(document).on('click', '.chanquan-pop .submit', function() {
                imgDatabase = $(".chanquan-img").attr("src");
                if (!imgDatabase) {
                    _this.prototype.layerFun("请上传产权证明照片！");
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
                        $(".chanquan-img").attr("data-src", data.src);
                        $(".chanquan > span:last-child > span:first-child").html("已选择");
                        release.prototype.modalHelper.beforeClose();
                        $(".chanquan-pop").hide();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 独家租赁委托协议
        xieyiToggle: (function() {
            // 弹出
            $(document).on('click', '.xieyi', function(e) {
                e.preventDefault();
                $(".xieyi-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.xieyi-pop .close-xieyi', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".xieyi-pop").hide();
            });
        })(),
        // 独家租赁委托协议提交
        xieyiSub: (function() {
            var _this = release,
                imgDatabase;
            $(document).on('click', '.xieyi-pop .submit', function() {
                imgDatabase = $(".xieyi-img").attr("src");
                if (!imgDatabase) {
                    _this.prototype.layerFun("请上传独家租赁委托协议照片！");
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
                        $(".xieyi-img").attr("data-src", data.src);
                        $(".xieyi > span:last-child > span:first-child").html("已选择");
                        release.prototype.modalHelper.beforeClose();
                        $(".xieyi-pop").hide();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
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
            var _this = release,
                result = '';
            $(document).on('change', '.pop .upload-img input', function() {
                result = _this.prototype.readAsDataURL(this);
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
                shopName,
                district,
                region,
                addr,
                shopType,
                square,
                floor,
                floorSum,
                decoration,
                rent,
                commission,
                depositMethod,
                rentMethod,
                labels,
                title,
                qiuzuDesc;
            $(".release-sub").click(function() {
                // 获取图片
                orderImg = [];
                $(".add-upload .img-item").each(function(index, el) {
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

                chanquan = $(".chanquan-img").attr("data-src");
                xieyi = $(".xieyi-img").attr("data-src");
                shopName = $(".shop-name").val();
                district = $(".area .area-html").attr("data-district");
                region = $(".area .area-html").attr("data-region");
                addr = $(".addr").val();
                shopType = $(".shop-type .note.active").attr("data-type");
                square = $(".square").val();
                floor = $('.floor .note.active').attr("data-type");
                floorSum = $(".floor-sum").val();
                decoration = $('.decoration .note.active').attr("data-type");
                rent = $(".rent").val();
                commission = $(".commission").val();
                depositMethod = $('.deposit-method .note.active').attr("data-type");
                rentMethod = $('.rent-method .note.active').attr("data-type");
                labels = $(".labels").attr("data-labels");
                title = $(".title").val();
                qiuzuDesc = $(".qiuzu-desc").val();

                if (!chanquan) {
                    _this.prototype.layerFun("请上传产权证明！");
                    return false;
                }
                if (!xieyi) {
                    _this.prototype.layerFun("请上传独家租赁委托协议！");
                    return false;
                }
                if (!shopName) {
                    _this.prototype.layerFun("请填写商铺名称！");
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
                if (!shopType) {
                    _this.prototype.layerFun("请选择商铺类型！");
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
                if (!labels) {
                    _this.prototype.layerFun("请选择特色标签！");
                    return false;
                }
                if (!title) {
                    _this.prototype.layerFun("请填写标题！");
                    return false;
                }
                if (!qiuzuDesc) {
                    _this.prototype.layerFun("请填写求租描述！");
                    return false;
                }
                if (!$("#agreement-checkbox").is(':checked')) {
                    _this.prototype.layerFun("请勾选并同意《租客网发布求租协议》！");
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
                        shopName: shopName,
                        district: district,
                        region: region,
                        addr: addr,
                        shopType: shopType,
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
                        qiuzuDesc: qiuzuDesc
                    },
                    success: function(data) {
                        // 弹出提交成功提示
                        _this.prototype.subSucc();
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
                console.log(chanquan, xieyi, shopName, district, region, addr, shopType, square, floor, floorSum, decoration, rent, commission, depositMethod, rentMethod, labels, title, qiuzuDesc);
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