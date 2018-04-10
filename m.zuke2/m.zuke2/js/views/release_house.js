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
                pcThis,
                pc = new PhotoClip('#clipArea', {
                    size: [16 * fontSize, 11.6 * fontSize],
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
                        console.log(dataURL);
                        pcThis = this;
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
                                pcThis.destroy();

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
                    thatParent = that.parent(),
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
        // 写字楼类型、商铺类型、装修、押金方式、付租方式切换
        typeSwitch: (function() {
            $(document).on('click', '.office-type .note, .shop-type .note, .decoration .note, .decoration .note, .deposit-method .note, .rent-method .note', function() {
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
            var use;
            // 显示
            $(document).on('click', '.labels', function(e) {
                e.preventDefault();
                use = $('.house-use .note.active').attr("data-type");
                switch (use) {
                    case 'house':
                        $(".labels-pop.house").show();
                        break;
                    case 'office':
                        $(".labels-pop.office").show();
                        break;
                    case 'shop':
                        $(".labels-pop.shop").show();
                        break;
                    default:
                        break;
                }
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
        // 朝向
        orientationToggle: (function() {
            // 弹出
            $(document).on('click', '.orientation', function(e) {
                e.preventDefault();
                $(".orientation-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.orientation-pop .close-orientation', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".orientation-pop").hide();
            });
        })(),
        // 朝向选择
        orientationCheck: (function() {
            var that;
            $(document).on('click', '.orientation-pop .ul-list li a', function(e) {
                e.preventDefault();
                that = $(this);
                $(".orientation-pop .ul-list li a").removeClass('check-icon');
                that.addClass('check-icon');
            });
        })(),
        // 朝向选择完成
        orientationCheckFinish: (function() {
            var that,
                checkArr = '',
                dataOrientation;
            $(document).on('click', '.orientation-pop .orientation-finish', function() {
                that = $(this);
                // 重置
                checkArr = '';
                // 循环获取已选择的值
                $(".orientation-pop .ul-list li a").each(function(index, el) {
                    if ($(el).hasClass('check-icon')) {
                        checkArr = $(el).children('span').html();
                    }
                });
                // 将选择的值放入.orientation的data-orientation中
                $(".orientation").attr("data-orientation", checkArr);
                // 判断选未选择
                dataOrientation = $(".orientation").attr("data-orientation");
                if (dataOrientation == "") {
                    $(".orientation > span:last-child > span:first-child").html("未选择");
                } else {
                    $(".orientation > span:last-child > span:first-child").html(dataOrientation);
                }
                release.prototype.modalHelper.beforeClose();
                $(".orientation-pop").hide();
            });
        })(),
        // 房屋用途
        houseUse: function() {
            return '<ul class="ul-list house"><li class="bb-eee"><a class="chanquan"><span class="f14 c-333">产权证明</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a class="xieyi"><span class="f14 c-333">独家租赁委托协议</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">小区名称</span><span class="flex flex-right align-items-center"><input class="tright court-name" type="text" placeholder="请输入小区名称" /></span></a></li><li class="bb-eee"><a class="area"><span class="f14 c-333 rneed">区域</span><span class="flex flex-right align-items-center"><span class="area-html f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">地址</span><span class="flex flex-right align-items-center"><input class="tright addr" type="text" placeholder="请填写详细地址" /></span></a></li><li class="bb-eee house-type"><a><span class="f14 c-333 rneed">房屋户型</span><span class="flex flex-right align-items-center"><input class="tcenter house-shi" type="text" /><span class="f14 c-333">室</span><input class="tcenter house-ting" type="text" /><span class="f14 c-333">厅</span><input class="tcenter house-wei" type="text" /><span class="f14 c-333">卫</span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">房屋面积</span><span class="flex flex-right align-items-center"><input class="tright square" type="text" placeholder="请输入房屋面积" /><span class="f14 c-333 ml8">m²</span></span></a></li><li class="bb-eee"><a><p class="f14 c-333 rneed">楼层</p><span class="flex flex-right align-items-center"><span class="f14 c-333">第</span><input class="tcenter floor" type="text" /><span class="f14 c-333">层</span><span class="f14 c-333 ml20">共</span><input class="tcenter floor-sum" type="text" /><span class="f14 c-333">层</span></span></a></li><li class="bb-eee"><a class="orientation"><span class="f14 c-333 rneed">朝向</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><div class="main"><p class="f14 c-333 relative rneed">装修</p><p class="notes decoration"><span class="note active" data-type="豪华装修">豪华装修</span><span class="note" data-type="中等装修">中等装修</span><span class="note" data-type="普通装修">普通装修</span><span class="note" data-type="无装修">无装修</span></p></div></li></ul>';
        },
        // 写字楼用途
        officeUse: function() {
            return '<ul class="ul-list office"><li class="bb-eee"><a class="chanquan"><span class="f14 c-333">产权证明</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a class="xieyi"><span class="f14 c-333">独家租赁委托协议</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">写字楼名称</span><span class="flex flex-right align-items-center"><input class="tright office-name" type="text" placeholder="请输入写字楼名称" /></span></a></li><li class="bb-eee"><a class="area"><span class="f14 c-333 rneed">区域</span><span class="flex flex-right align-items-center"><span class="area-html f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">楼盘地址</span><span class="flex flex-right align-items-center"><input class="tright addr" type="text" placeholder="请填写楼盘地址" /></span></a></li><li class="bb-eee pb0 house-type"><div class="main"><p class="f14 c-333 relative rneed">写字楼类型</p><p class="notes office-type"><span class="note active" data-type="写字楼">写字楼</span><span class="note" data-type="商业综合体">商业综合体</span><span class="note" data-type="商住两用楼">商住两用楼</span><span class="note" data-type="其他">其他</span></p></div></li><li class="bb-eee"><a><span class="f14 c-333 rneed">房屋面积</span><span class="flex flex-right align-items-center"><input class="tright square" type="text" placeholder="请输入房屋面积" /><span class="f14 c-333 ml8">m²</span></span></a></li><li class="bb-eee"><a><p class="f14 c-333 rneed">楼层</p><span class="flex flex-right align-items-center"><span class="f14 c-333">第</span><input class="tcenter floor" type="text" /><span class="f14 c-333">层</span><span class="f14 c-333 ml20">共</span><input class="tcenter floor-sum" type="text" /><span class="f14 c-333">层</span></span></a></li><li class="bb-eee"><div class="main"><p class="f14 c-333 relative rneed">装修</p><p class="notes decoration"><span class="note active" data-type="豪华装修">豪华装修</span><span class="note" data-type="中等装修">中等装修</span><span class="note" data-type="普通装修">普通装修</span><span class="note" data-type="无装修">无装修</span></p></div></li></ul>';
        },
        // 商铺用途
        shopUse: function() {
            return '<ul class="ul-list office"><li class="bb-eee"><a class="chanquan"><span class="f14 c-333">产权证明</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a class="xieyi"><span class="f14 c-333">独家租赁委托协议</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">商铺名称</span><span class="flex flex-right align-items-center"><input class="tright shop-name" type="text" placeholder="请输入商铺名称" /></span></a></li><li class="bb-eee"><a class="area"><span class="f14 c-333 rneed">区域</span><span class="flex flex-right align-items-center"><span class="area-html f12 c-666">未选择</span><span class="next"></span></span></a></li><li class="bb-eee"><a><span class="f14 c-333 rneed">商铺地址</span><span class="flex flex-right align-items-center"><input class="tright addr" type="text" placeholder="请填写商铺地址" /></span></a></li><li class="bb-eee pb0 house-type"><div class="main"><p class="f14 c-333 relative rneed">商铺类型</p><p class="notes shop-type"><span class="note active" data-type="购物中心">购物中心</span><span class="note" data-type="社区商业">社区商业</span><span class="note" data-type="综合体配套">综合体配套</span><span class="note" data-type="其他">其他</span></p></div></li><li class="bb-eee"><a><span class="f14 c-333 rneed">房屋面积</span><span class="flex flex-right align-items-center"><input class="tright square" type="text" placeholder="请输入房屋面积" /><span class="f14 c-333 ml8">m²</span></span></a></li><li class="bb-eee"><a><p class="f14 c-333 rneed">楼层</p><span class="flex flex-right align-items-center"><span class="f14 c-333">第</span><input class="tcenter floor" type="text" /><span class="f14 c-333">层</span><span class="f14 c-333 ml20">共</span><input class="tcenter floor-sum" type="text" /><span class="f14 c-333">层</span></span></a></li><li class="bb-eee"><div class="main"><p class="f14 c-333 relative rneed">装修</p><p class="notes decoration"><span class="note active" data-type="豪华装修">豪华装修</span><span class="note" data-type="中等装修">中等装修</span><span class="note" data-type="普通装修">普通装修</span><span class="note" data-type="无装修">无装修</span></p></div></li></ul>';
        },
        // 配套
        houseSupporting: function() {
            return '<div class="col-f5f5f5 house-supporting"></div><ul class="ul-list house-supporting"><li class="bb-eee"><div class="main"><p class="f14 c-333">配套</p><p class="notes supporting"><span class="note" data-type="电视">电视</span><span class="note" data-type="冰箱">冰箱</span><span class="note" data-type="空调">空调</span><span class="note" data-type="沙发">沙发</span><span class="note" data-type="床">床</span><span class="note" data-type="洗衣机">洗衣机</span><span class="note" data-type="微波炉">微波炉</span><span class="note" data-type="热水器">热水器</span><span class="note" data-type="衣柜">衣柜</span><span class="note" data-type="宽带">宽带</span></p></div></li></ul>';
        },
        // 特色标签 住宅
        houseLabelsPop: function() {
            return '<div class="labels-pop wh100 bg-fff pt37 pop hide house"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-labels"></div><span class="f16 c-333 absolute translateHalf">特色标签</span></div><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">拎包入住</span></a></li><li class="bb-eee"><a><span class="f14 c-333">首次出租</span></a></li><li class="bb-eee"><a><span class="f14 c-333">采光好</span></a></li><li class="bb-eee"><a><span class="f14 c-333">停车位多</span></a></li><li class="bb-eee"><a><span class="f14 c-333">地铁口附近</span></a></li><li class="bb-eee"><a><span class="f14 c-333">商业街附近</span></a></li><li class="bb-eee"><a><span class="f14 c-333">学校附近</span></a></li><li class="bb-eee"><a><span class="f14 c-333">有电梯</span></a></li><li class="bb-eee"><a><span class="f14 c-333">有阳台</span></a></li><li class="bb-eee"><a><span class="f14 c-333">有花园</span></a></li><li class="bb-eee"><a><span class="f14 c-333">有阁楼</span></a></li><li class="bb-eee"><a><span class="f14 c-333">有地下室</span></a></li></ul><button class="submit labels-finish">完成</button></div>';
        },
        // 特色标签 写字楼
        officeLabelsPop: function() {
            return '<div class="labels-pop wh100 bg-fff pt37 pop hide office"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-labels"></div><span class="f16 c-333 absolute translateHalf">特色标签</span></div><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">标志性建筑</span></a></li><li class="bb-eee"><a><span class="f14 c-333">5A甲级</span></a></li><li class="bb-eee"><a><span class="f14 c-333">名企入驻</span></a></li><li class="bb-eee"><a><span class="f14 c-333">地铁口附近</span></a></li><li class="bb-eee"><a><span class="f14 c-333">电梯口</span></a></li><li class="bb-eee"><a><span class="f14 c-333">商业街附近</span></a></li><li class="bb-eee"><a><span class="f14 c-333">整层整栋</span></a></li><li class="bb-eee"><a><span class="f14 c-333">小面积</span></a></li><li class="bb-eee"><a><span class="f14 c-333">停车位多</span></a></li><li class="bb-eee"><a><span class="f14 c-333">可注册公司</span></a></li></ul><button class="submit labels-finish">完成</button></div>';
        },
        // 特色标签 商铺
        shopLabelsPop: function() {
            return '<div class="labels-pop wh100 bg-fff pt37 pop hide shop"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-labels"></div><span class="f16 c-333 absolute translateHalf">特色标签</span></div><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">沿街旺铺</span></a></li><li class="bb-eee"><a><span class="f14 c-333">繁华地带</span></a></li><li class="bb-eee"><a><span class="f14 c-333">专业市场</span></a></li><li class="bb-eee"><a><span class="f14 c-333">住宅底商</span></a></li><li class="bb-eee"><a><span class="f14 c-333">综合体配套</span></a></li><li class="bb-eee"><a><span class="f14 c-333">地铁口附近</span></a></li><li class="bb-eee"><a><span class="f14 c-333">小面积</span></a></li><li class="bb-eee"><a><span class="f14 c-333">独栋整层</span></a></li><li class="bb-eee"><a><span class="f14 c-333">知名商户入驻</span></a></li><li class="bb-eee"><a><span class="f14 c-333">可分隔办公室</span></a></li></ul><button class="submit labels-finish">完成</button></div>';
        },
        // 提交
        releaseSub: (function() {
            var _this = release,
                use,
                mainImg,
                orderImg = [],
                chanquan,
                xieyi,
                courtName,
                officeName,
                shopName,
                district,
                region,
                addr,
                houseShi,
                houseTing,
                houseWei,
                officeType,
                shopType,
                square,
                floor,
                floorSum,
                orientation,
                decoration,
                supporting = [],
                rent,
                commission,
                depositMethod,
                rentMethod,
                labels,
                title,
                qiuzuDesc;
            $(".release-sub").click(function() {
                use = $('.house-use .note.active').attr("data-type");
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
                switch (use) {
                    case 'house':
                        chanquan = $(".chanquan-img").attr("data-src");
                        xieyi = $(".xieyi-img").attr("data-src");
                        courtName = $(".court-name").val();
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        addr = $(".addr").val();
                        houseShi = $(".house-shi").val();
                        houseTing = $(".house-ting").val();
                        houseWei = $(".house-wei").val();
                        square = $(".square").val();
                        floor = $('.floor').val();
                        floorSum = $(".floor-sum").val();
                        orientation = $(".orientation").attr("data-orientation");
                        decoration = $('.decoration .note.active').attr("data-type");
                        supporting = [];
                        $(".supporting .note.active").each(function(index, el) {
                            supporting.push($(el).attr("data-type"));
                        });
                        rent = $(".rent").val();
                        commission = $(".commission").val();
                        depositMethod = $('.deposit-method .note.active').attr("data-type");
                        rentMethod = $('.rent-method .note.active').attr("data-type");
                        labels = $(".labels").attr("data-labels");
                        title = $(".title").val();
                        qiuzuDesc = $(".qiuzu-desc").val();

                        /*if (!chanquan) {
                            _this.prototype.layerFun("请上传产权证明！");
                            return false;
                        }
                        if (!xieyi) {
                            _this.prototype.layerFun("请上传独家租赁委托协议！");
                            return false;
                        }*/
                        if (!courtName) {
                            _this.prototype.layerFun("请填写小区名！");
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
                        if (!houseShi || !houseTing || !houseWei) {
                            _this.prototype.layerFun("请填写房屋户型！");
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
                        if (!orientation) {
                            _this.prototype.layerFun("请选择朝向！");
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
                                courtName: courtName,
                                district: district,
                                region: region,
                                addr: addr,
                                houseShi: houseShi,
                                houseTing: houseTing,
                                houseWei: houseWei,
                                square: square,
                                floor: floor,
                                floorSum: floorSum,
                                orientation: orientation,
                                decoration: decoration,
                                supporting: supporting,
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
                        console.log(chanquan, xieyi, courtName, district, region, addr, houseShi, houseTing, houseWei, square, floor, floorSum, orientation, decoration, supporting, rent, commission, depositMethod, rentMethod, labels, title, qiuzuDesc);
                        break;
                    case 'office':
                        chanquan = $(".chanquan-img").attr("data-src");
                        xieyi = $(".xieyi-img").attr("data-src");
                        officeName = $(".office-name").val();
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        addr = $(".addr").val();
                        officeType = $(".office-type .note.active").attr("data-type");
                        square = $(".square").val();
                        floor = $('.floor').val();
                        floorSum = $(".floor-sum").val();
                        decoration = $('.decoration .note.active').attr("data-type");
                        rent = $(".rent").val();
                        commission = $(".commission").val();
                        depositMethod = $('.deposit-method .note.active').attr("data-type");
                        rentMethod = $('.rent-method .note.active').attr("data-type");
                        labels = $(".labels").attr("data-labels");
                        title = $(".title").val();
                        qiuzuDesc = $(".qiuzu-desc").val();

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
                        console.log(chanquan, xieyi, officeName, district, region, addr, officeType, square, floor, floorSum, decoration, rent, commission, depositMethod, rentMethod, labels, title, qiuzuDesc);
                        break;
                    case 'shop':
                        chanquan = $(".chanquan-img").attr("data-src");
                        xieyi = $(".xieyi-img").attr("data-src");
                        shopName = $(".shop-name").val();
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        addr = $(".addr").val();
                        shopType = $(".shop-type .note.active").attr("data-type");
                        square = $(".square").val();
                        floor = $('.floor').val();
                        floorSum = $(".floor-sum").val();
                        decoration = $('.decoration .note.active').attr("data-type");
                        rent = $(".rent").val();
                        commission = $(".commission").val();
                        depositMethod = $('.deposit-method .note.active').attr("data-type");
                        rentMethod = $('.rent-method .note.active').attr("data-type");
                        labels = $(".labels").attr("data-labels");
                        title = $(".title").val();
                        qiuzuDesc = $(".qiuzu-desc").val();

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