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
        // 房屋用途切换
        useSwitch: (function() {
            var _this = release,
                that,
                courtName = '<span class="txt">小区名称</span><input class="court-name iw-276" type="text" placeholder="请填写小区名称"><span class="f14 c-999"> (仅填写小区名称)</span>',
                officeName = '<span class="txt">写字楼名称</span><input class="office-name iw-276" type="text" placeholder="请填写写字楼名称"><span class="f14 c-999"> (仅填写写字楼名称)</span>',
                shopName = '<span class="txt">商铺名称</span><input class="shop-name iw-276" type="text" placeholder="请填写商铺名称"><span class="f14 c-999"> (仅填写商铺名称)</span>',
                fangType = '<span class="txt">房屋户型</span><span class="ip-wrap"><input class="house-shi iw-128" maxlength="3" type="text"><span class="sign">室</span></span><span class="ip-wrap ml8"><input class="house-ting iw-128" maxlength="3" type="text"><span class="sign">厅</span></span><span class="ip-wrap ml8"><input class="house-wei iw-128" maxlength="3" type="text"><span class="sign">卫</span></span>',
                officeType = '<span class="txt">类&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp型</span><span class="radio-box"><input type="radio" id="cxzlou" name="office-type" value="纯写字楼" checked="checked"><label for="cxzlou"></label></span><label for="cxzlou" class="f14 c-333 ml8">纯写字楼</label><span class="radio-box ml20"><input type="radio" id="syzhti" name="office-type" value="商业综合体"><label for="syzhti"></label></span><label for="syzhti" class="f14 c-333 ml8">商业综合体</label><span class="radio-box ml20"><input type="radio" id="szlylou" name="office-type" value="商住两用楼"><label for="szlylou"></label></span><label for="szlylou" class="f14 c-333 ml8">商住两用楼</label><span class="radio-box ml20"><input type="radio" id="qita" name="office-type" value="其他"><label for="qita"></label></span><label for="qita" class="f14 c-333 ml8">其他</label>',
                shopType = '<span class="txt">类&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp型</span><span class="radio-box"><input type="radio" id="gqzxin" name="shop-type" value="购物中心" checked="checked"><label for="gqzxin"></label></span><label for="gqzxin" class="f14 c-333 ml8">购物中心</label><span class="radio-box ml20"><input type="radio" id="sqsye" name="shop-type" value="社区商业"><label for="sqsye"></label></span><label for="sqsye" class="f14 c-333 ml8">社区商业</label><span class="radio-box ml20"><input type="radio" id="zhtptao" name="shop-type" value="综合体配套"><label for="zhtptao"></label></span><label for="zhtptao" class="f14 c-333 ml8">综合体配套</label><span class="radio-box ml20"><input type="radio" id="qita" name="shop-type" value="其他"><label for="qita"></label></span><label for="qita" class="f14 c-333 ml8">其他</label>',
                fangDecoration = '<span class="txt">装&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp修</span><span class="radio-box"><input type="radio" id="hhua-zx" name="decoration" value="豪华装修" checked="checked"><label for="hhua-zx"></label></span><label for="hhua-zx" class="f14 c-333 ml8">豪华装修</label><span class="radio-box ml20"><input type="radio" id="zdeng-zx" name="decoration" value="中等装修"><label for="zdeng-zx"></label></span><label for="zdeng-zx" class="f14 c-333 ml8">中等装修</label><span class="radio-box ml20"><input type="radio" id="putongu-zx" name="decoration" value="普通装修"><label for="putongu-zx"></label></span><label for="putongu-zx" class="f14 c-333 ml8">普通装修</label><span class="radio-box ml20"><input type="radio" id="wu-zx" name="decoration" value="无装修"><label for="wu-zx"></label></span><label for="wu-zx" class="f14 c-333 ml8">无装修</label>',
                officeDecoration = '<span class="txt">装&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp修</span><span class="radio-box"><input type="radio" id="hhua-zx" name="decoration" value="豪华装修" checked="checked"><label for="hhua-zx"></label></span><label for="hhua-zx" class="f14 c-333 ml8">豪华装修</label><span class="radio-box ml20"><input type="radio" id="zdeng-zx" name="decoration" value="简单装修"><label for="zdeng-zx"></label></span><label for="zdeng-zx" class="f14 c-333 ml8">简单装修</label><span class="radio-box ml20"><input type="radio" id="wu-zx" name="decoration" value="无装修"><label for="wu-zx"></label></span><label for="wu-zx" class="f14 c-333 ml8">无装修</label><span class="radio-box ml20"><input type="radio" id="putongu-zx" name="decoration" value="遗留装修"><label for="putongu-zx"></label></span><label for="putongu-zx" class="f14 c-333 ml8">遗留装修</label>',
                shopDecoration = '<span class="txt">装&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp修</span><span class="radio-box"><input type="radio" id="hhua-zx" name="decoration" value="豪华装修" checked="checked"><label for="hhua-zx"></label></span><label for="hhua-zx" class="f14 c-333 ml8">豪华装修</label><span class="radio-box ml20"><input type="radio" id="zdeng-zx" name="decoration" value="简单装修"><label for="zdeng-zx"></label></span><label for="zdeng-zx" class="f14 c-333 ml8">简单装修</label><span class="radio-box ml20"><input type="radio" id="wu-zx" name="decoration" value="无装修"><label for="wu-zx"></label></span><label for="wu-zx" class="f14 c-333 ml8">无装修</label><span class="radio-box ml20"><input type="radio" id="putongu-zx" name="decoration" value="遗留装修"><label for="putongu-zx"></label></span><label for="putongu-zx" class="f14 c-333 ml8">遗留装修</label>',
                fangLabels = '<span class="checkbox"><input type="checkbox" id="lbrzhu" name="labels" value="拎包入住"><label for="lbrzhu"></label></span><label for="lbrzhu" class="f14 c-333 ml8">拎包入住</label><span class="checkbox ml20"><input type="checkbox" id="scczhu" name="labels" value="首次出租"><label for="scczhu"></label></span><label for="scczhu" class="f14 c-333 ml8">首次出租</label><span class="checkbox ml20"><input type="checkbox" id="cghao" name="labels" value="采光好"><label for="cghao"></label></span><label for="cghao" class="f14 c-333 ml8">采光好</label><span class="checkbox ml20"><input type="checkbox" id="tcwduo" name="labels" value="停车位多"><label for="tcwduo"></label></span><label for="tcwduo" class="f14 c-333 ml8">停车位多</label><span class="checkbox ml20"><input type="checkbox" id="jdtie" name="labels" value="近地铁"><label for="jdtie"></label></span><label for="jdtie" class="f14 c-333 ml8">近地铁</label><span class="checkbox ml20"><input type="checkbox" id="jsyjie" name="labels" value="近商业街"><label for="jsyjie"></label></span><label for="jsyjie" class="f14 c-333 ml8">近商业街</label><span class="checkbox"><input type="checkbox" id="xxfjin" name="labels" value="学校附近"><label for="xxfjin"></label></span><label for="xxfjin" class="f14 c-333 ml8">学校附近</label><span class="checkbox ml20"><input type="checkbox" id="ydti" name="labels" value="有电梯"><label for="ydti"></label></span><label for="ydti" class="f14 c-333 ml8">有电梯</label><span class="checkbox ml20"><input type="checkbox" id="yytai" name="labels" value="有阳台"><label for="yytai"></label></span><label for="yytai" class="f14 c-333 ml8">有阳台</label><span class="checkbox ml20"><input type="checkbox" id="yhyuan" name="labels" value="有花园"><label for="yhyuan"></label></span><label for="yhyuan" class="f14 c-333 ml8">有花园</label><span class="checkbox ml20"><input type="checkbox" id="yglou" name="labels" value="有阁楼"><label for="yglou"></label></span><label for="yglou" class="f14 c-333 ml8">有阁楼</label><span class="checkbox ml20"><input type="checkbox" id="ydxshi" name="labels" value="有地下室"><label for="ydxshi"></label></span><label for="ydxshi" class="f14 c-333 ml8">有地下室</label>',
                officeLabels = '<html><head></head><body><span class="checkbox"><input type="checkbox" id="bzjzhu" name="labels" value="标志建筑" /><label for="bzjzhu"></label></span><label for="bzjzhu" class="f14 c-333 ml8">标志建筑</label><span class="checkbox ml20"><input type="checkbox" id="jji" name="labels" value="5A甲级" /><label for="jji"></label></span><label for="jji" class="f14 c-333 ml8">5A甲级</label><span class="checkbox ml20"><input type="checkbox" id="mqrzhu" name="labels" value="名企入驻" /><label for="mqrzhu"></label></span><label for="mqrzhu" class="f14 c-333 ml8">名企入驻</label><span class="checkbox ml20"><input type="checkbox" id="dtkou" name="labels" value="电梯口" /><label for="dtkou"></label></span><label for="dtkou" class="f14 c-333 ml8">电梯口</label><span class="checkbox ml20"><input type="checkbox" id="jsyjie" name="labels" value="近商业街" /><label for="jsyjie"></label></span><label for="jsyjie" class="f14 c-333 ml8">近商业街</label><span class="checkbox ml20"><input type="checkbox" id="zczdong" name="labels" value="整层整栋" /><label for="zczdong"></label></span><label for="zczdong" class="f14 c-333 ml8">整层整栋</label><span class="checkbox"><input type="checkbox" id="jdtie" name="labels" value="近地铁" /><label for="jdtie"></label></span><label for="jdtie" class="f14 c-333 ml8">近地铁</label><span class="checkbox ml20"><input type="checkbox" id="xmji" name="labels" value="小面积" /><label for="xmji"></label></span><label for="xmji" class="f14 c-333 ml8">小面积</label><span class="checkbox ml20"><input type="checkbox" id="tcwduo" name="labels" value="停车位多" /><label for="tcwduo"></label></span><label for="tcwduo" class="f14 c-333 ml8">停车位多</label><span class="checkbox ml20"><input type="checkbox" id="kzcgsi" name="labels" value="可注册公司" /><label for="kzcgsi"></label></span><label for="kzcgsi" class="f14 c-333 ml8">可注册公司</label></body></html>',
                shopLabels = '<html><head></head><body><span class="checkbox"><input type="checkbox" id="yjwpu" name="labels" value="沿街旺铺" /><label for="yjwpu"></label></span><label for="yjwpu" class="f14 c-333 ml8">沿街旺铺</label><span class="checkbox ml20"><input type="checkbox" id="fhdduan" name="labels" value="繁华地段" /><label for="fhdduan"></label></span><label for="fhdduan" class="f14 c-333 ml8">繁华地段</label><span class="checkbox ml20"><input type="checkbox" id="zyschang" name="labels" value="专业市场" /><label for="zyschang"></label></span><label for="zyschang" class="f14 c-333 ml8">专业市场</label><span class="checkbox ml20"><input type="checkbox" id="zzdshang" name="labels" value="住宅底商" /><label for="zzdshang"></label></span><label for="zzdshang" class="f14 c-333 ml8">住宅底商</label><span class="checkbox ml20"><input type="checkbox" id="jdtie" name="labels" value="近地铁" /><label for="jdtie"></label></span><label for="jdtie" class="f14 c-333 ml8">近地铁</label><span class="checkbox ml20"><input type="checkbox" id="xmji" name="labels" value="小面积" /><label for="xmji"></label></span><label for="xmji" class="f14 c-333 ml8">小面积</label><span class="checkbox"><input type="checkbox" id="zhtptao" name="labels" value="综合体配套" /><label for="zhtptao"></label></span><label for="zhtptao" class="f14 c-333 ml8">综合体配套</label><span class="checkbox ml20"><input type="checkbox" id="ddzceng" name="labels" value="独栋整层" /><label for="ddzceng"></label></span><label for="ddzceng" class="f14 c-333 ml8">独栋整层</label><span class="checkbox ml20"><input type="checkbox" id="msrzhu" name="labels" value="名商入驻" /><label for="msrzhu"></label></span><label for="msrzhu" class="f14 c-333 ml8">名商入驻</label><span class="checkbox ml20"><input type="checkbox" id="kfgbgshi" name="labels" value="可分隔办公室" /><label for="kfgbgshi"></label></span><label for="kfgbgshi" class="f14 c-333 ml8">可分隔办公室</label></body></html>';
            $(document).on('click', 'input[name="use"]', function() {
                that = $(this);
                switch (that.attr("id")) {
                    case 'use-fang':
                        $(".name-box").html(courtName);
                        $(".addr-box .txt").html("小区地址");
                        $(".house-type-box").html(fangType);
                        $(".orientation-box, .supporting-box").parent().show();
                        $(".rent").siblings('.sign').html("元/月");
                        $(".labels-box").html(fangLabels);
                        $(".decoration-box").html(fangDecoration);
                        break;
                    case 'use-office':
                        $(".name-box").html(officeName);
                        $(".addr-box .txt").html("写字楼地址");
                        $(".house-type-box").html(officeType);
                        $(".orientation-box, .supporting-box").parent().hide();
                        $(".rent").siblings('.sign').html("元/㎡/月");
                        $(".labels-box").html(officeLabels);
                        $(".decoration-box").html(officeDecoration);
                        break;
                    case 'use-shop':
                        $(".name-box").html(shopName);
                        $(".addr-box .txt").html("商铺地址");
                        $(".house-type-box").html(shopType);
                        $(".orientation-box, .supporting-box").parent().hide();
                        $(".rent").siblings('.sign').html("元/月");
                        $(".labels-box").html(shopLabels);
                        $(".decoration-box").html(shopDecoration);
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
                labels = [],
                title,
                detailsDesc;
            $(".release-sub").click(function() {
                use = $('input[name="use"]:checked').attr("id");
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
                switch (use) {
                    case 'use-fang':
                        chanquan = $(".chanquan").attr("src");
                        xieyi = $(".xieyi").attr("src");
                        courtName = $(".court-name").val();
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        addr = $(".addr").val();
                        houseShi = $(".house-shi").val();
                        houseTing = $(".house-ting").val();
                        houseWei = $(".house-wei").val();
                        square = $(".square").val();
                        floor = $('.floor').val();
                        floorSum = $(".floor-sum").val();
                        orientation = $('input[name="orientation"]:checked').attr("value");
                        decoration = $('input[name="decoration"]:checked').attr("value");
                        supporting = [];
                        $('input[name="supporting"]:checked').each(function(index, el) {
                            supporting.push($(el).attr("value"));
                        });
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

                        console.log(mainImg, orderImg, chanquan, xieyi, courtName, district, region, addr, houseShi, houseTing, houseWei, square, floor, floorSum, orientation, decoration, supporting, rent, commission, depositMethod, rentMethod, labels, title, detailsDesc);

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
                        console.log(chanquan, xieyi, courtName, district, region, addr, houseShi, houseTing, houseWei, square, floor, floorSum, orientation, decoration, supporting, rent, commission, depositMethod, rentMethod, labels, title, detailsDesc);
                        break;
                    case 'use-office':
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
                        console.log(chanquan, xieyi, officeName, district, region, addr, officeType, square, floor, floorSum, decoration, rent, commission, depositMethod, rentMethod, labels, title, detailsDesc);
                        break;
                    case 'use-shop':
                        chanquan = $(".chanquan").attr("src");
                        xieyi = $(".xieyi").attr("src");
                        shopName = $(".shop-name").val();
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        addr = $(".addr").val();
                        shopType = $('input[name="shop-type"]:checked').attr("value");
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

                        console.log(chanquan, xieyi, shopName, district, region, addr, shopType, square, floor, floorSum, decoration, rent, commission, depositMethod, rentMethod, labels, title, detailsDesc);

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