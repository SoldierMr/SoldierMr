$(document).ready(function() {
    var release = release || {};
    release.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
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
        // 房屋用途切换
        useSwitch: (function() {
            var _this = release,
                that,
                fangType = '<span class="txt">期望户型</span><span class="radio-box"><input type="radio" id="yishi" name="fang-type" value="一室" checked="checked"><label for="yishi"></label></span><label for="yishi" class="f14 c-333 ml8">一室</label><span class="radio-box ml20"><input type="radio" id="liangshi" name="fang-type" value="两室"><label for="liangshi"></label></span><label for="liangshi" class="f14 c-333 ml8">两室</label><span class="radio-box ml20"><input type="radio" id="sanshi" name="fang-type" value="三室"><label for="sanshi"></label></span><label for="sanshi" class="f14 c-333 ml8">三室</label><span class="radio-box ml20"><input type="radio" id="sishi" name="fang-type" value="四室"><label for="sishi"></label></span><label for="sishi" class="f14 c-333 ml8">四室</label><span class="radio-box ml20"><input type="radio" id="wushi" name="fang-type" value="四室以上"><label for="wushi"></label></span><label for="wushi" class="f14 c-333 ml8">四室以上</label>',
                officeType = '<span class="txt">写字楼类型</span><span class="radio-box"><input type="radio" id="cxzlou" name="office-type" value="纯写字楼" checked="checked"><label for="cxzlou"></label></span><label for="cxzlou" class="f14 c-333 ml8">纯写字楼</label><span class="radio-box ml20"><input type="radio" id="syzhti" name="office-type" value="商业综合体"><label for="syzhti"></label></span><label for="syzhti" class="f14 c-333 ml8">商业综合体</label><span class="radio-box ml20"><input type="radio" id="szlylou" name="office-type" value="商住两用楼"><label for="szlylou"></label></span><label for="szlylou" class="f14 c-333 ml8">商住两用楼</label><span class="radio-box ml20"><input type="radio" id="qita" name="office-type" value="其他"><label for="qita"></label></span><label for="qita" class="f14 c-333 ml8">其他</label>',
                shopType = '<span class="txt">商铺类型</span><span class="radio-box"><input type="radio" id="gqzxin" name="shop-type" value="购物中心" checked="checked"><label for="gqzxin"></label></span><label for="gqzxin" class="f14 c-333 ml8">购物中心</label><span class="radio-box ml20"><input type="radio" id="sqsye" name="shop-type" value="社区商业"><label for="sqsye"></label></span><label for="sqsye" class="f14 c-333 ml8">社区商业</label><span class="radio-box ml20"><input type="radio" id="zhtptao" name="shop-type" value="综合体配套"><label for="zhtptao"></label></span><label for="zhtptao" class="f14 c-333 ml8">综合体配套</label><span class="radio-box ml20"><input type="radio" id="qita" name="shop-type" value="其他"><label for="qita"></label></span><label for="qita" class="f14 c-333 ml8">其他</label>',
                fangLabels = '<span class="checkbox"><input type="checkbox" id="lbrzhu" name="labels" value="拎包入住"><label for="lbrzhu"></label></span><label for="lbrzhu" class="f14 c-333 ml8">拎包入住</label><span class="checkbox ml20"><input type="checkbox" id="scczhu" name="labels" value="首次出租"><label for="scczhu"></label></span><label for="scczhu" class="f14 c-333 ml8">首次出租</label><span class="checkbox ml20"><input type="checkbox" id="cghao" name="labels" value="采光好"><label for="cghao"></label></span><label for="cghao" class="f14 c-333 ml8">采光好</label><span class="checkbox ml20"><input type="checkbox" id="tcwduo" name="labels" value="停车位多"><label for="tcwduo"></label></span><label for="tcwduo" class="f14 c-333 ml8">停车位多</label><span class="checkbox ml20"><input type="checkbox" id="jdtie" name="labels" value="近地铁"><label for="jdtie"></label></span><label for="jdtie" class="f14 c-333 ml8">近地铁</label><span class="checkbox ml20"><input type="checkbox" id="jsyjie" name="labels" value="近商业街"><label for="jsyjie"></label></span><label for="jsyjie" class="f14 c-333 ml8">近商业街</label><span class="checkbox"><input type="checkbox" id="xxfjin" name="labels" value="学校附近"><label for="xxfjin"></label></span><label for="xxfjin" class="f14 c-333 ml8">学校附近</label><span class="checkbox ml20"><input type="checkbox" id="ydti" name="labels" value="有电梯"><label for="ydti"></label></span><label for="ydti" class="f14 c-333 ml8">有电梯</label><span class="checkbox ml20"><input type="checkbox" id="yytai" name="labels" value="有阳台"><label for="yytai"></label></span><label for="yytai" class="f14 c-333 ml8">有阳台</label><span class="checkbox ml20"><input type="checkbox" id="yhyuan" name="labels" value="有花园"><label for="yhyuan"></label></span><label for="yhyuan" class="f14 c-333 ml8">有花园</label><span class="checkbox ml20"><input type="checkbox" id="yglou" name="labels" value="有阁楼"><label for="yglou"></label></span><label for="yglou" class="f14 c-333 ml8">有阁楼</label><span class="checkbox ml20"><input type="checkbox" id="ydxshi" name="labels" value="有地下室"><label for="ydxshi"></label></span><label for="ydxshi" class="f14 c-333 ml8">有地下室</label>',
                officeLabels = '<html><head></head><body><span class="checkbox"><input type="checkbox" id="bzjzhu" name="labels" value="标志建筑" /><label for="bzjzhu"></label></span><label for="bzjzhu" class="f14 c-333 ml8">标志建筑</label><span class="checkbox ml20"><input type="checkbox" id="jji" name="labels" value="5A甲级" /><label for="jji"></label></span><label for="jji" class="f14 c-333 ml8">5A甲级</label><span class="checkbox ml20"><input type="checkbox" id="mqrzhu" name="labels" value="名企入驻" /><label for="mqrzhu"></label></span><label for="mqrzhu" class="f14 c-333 ml8">名企入驻</label><span class="checkbox ml20"><input type="checkbox" id="dtkou" name="labels" value="电梯口" /><label for="dtkou"></label></span><label for="dtkou" class="f14 c-333 ml8">电梯口</label><span class="checkbox ml20"><input type="checkbox" id="jsyjie" name="labels" value="近商业街" /><label for="jsyjie"></label></span><label for="jsyjie" class="f14 c-333 ml8">近商业街</label><span class="checkbox ml20"><input type="checkbox" id="zczdong" name="labels" value="整层整栋" /><label for="zczdong"></label></span><label for="zczdong" class="f14 c-333 ml8">整层整栋</label><span class="checkbox"><input type="checkbox" id="jdtie" name="labels" value="近地铁" /><label for="jdtie"></label></span><label for="jdtie" class="f14 c-333 ml8">近地铁</label><span class="checkbox ml20"><input type="checkbox" id="xmji" name="labels" value="小面积" /><label for="xmji"></label></span><label for="xmji" class="f14 c-333 ml8">小面积</label><span class="checkbox ml20"><input type="checkbox" id="tcwduo" name="labels" value="停车位多" /><label for="tcwduo"></label></span><label for="tcwduo" class="f14 c-333 ml8">停车位多</label><span class="checkbox ml20"><input type="checkbox" id="kzcgsi" name="labels" value="可注册公司" /><label for="kzcgsi"></label></span><label for="kzcgsi" class="f14 c-333 ml8">可注册公司</label></body></html>',
                shopLabels = '<html><head></head><body><span class="checkbox"><input type="checkbox" id="yjwpu" name="labels" value="沿街旺铺" /><label for="yjwpu"></label></span><label for="yjwpu" class="f14 c-333 ml8">沿街旺铺</label><span class="checkbox ml20"><input type="checkbox" id="fhdduan" name="labels" value="繁华地段" /><label for="fhdduan"></label></span><label for="fhdduan" class="f14 c-333 ml8">繁华地段</label><span class="checkbox ml20"><input type="checkbox" id="zyschang" name="labels" value="专业市场" /><label for="zyschang"></label></span><label for="zyschang" class="f14 c-333 ml8">专业市场</label><span class="checkbox ml20"><input type="checkbox" id="zzdshang" name="labels" value="住宅底商" /><label for="zzdshang"></label></span><label for="zzdshang" class="f14 c-333 ml8">住宅底商</label><span class="checkbox ml20"><input type="checkbox" id="jdtie" name="labels" value="近地铁" /><label for="jdtie"></label></span><label for="jdtie" class="f14 c-333 ml8">近地铁</label><span class="checkbox ml20"><input type="checkbox" id="xmji" name="labels" value="小面积" /><label for="xmji"></label></span><label for="xmji" class="f14 c-333 ml8">小面积</label><span class="checkbox"><input type="checkbox" id="zhtptao" name="labels" value="综合体配套" /><label for="zhtptao"></label></span><label for="zhtptao" class="f14 c-333 ml8">综合体配套</label><span class="checkbox ml20"><input type="checkbox" id="ddzceng" name="labels" value="独栋整层" /><label for="ddzceng"></label></span><label for="ddzceng" class="f14 c-333 ml8">独栋整层</label><span class="checkbox ml20"><input type="checkbox" id="msrzhu" name="labels" value="名商入驻" /><label for="msrzhu"></label></span><label for="msrzhu" class="f14 c-333 ml8">名商入驻</label><span class="checkbox ml20"><input type="checkbox" id="kfgbgshi" name="labels" value="可分隔办公室" /><label for="kfgbgshi"></label></span><label for="kfgbgshi" class="f14 c-333 ml8">可分隔办公室</label></body></html>';
            $(document).on('click', 'input[name="use"]', function() {
                that = $(this);
                switch (that.attr("id")) {
                    case 'use-fang':
                        $(".house-type-box").html(fangType);
                        $(".rentstart, .rentend").siblings('.sign').html("元/月");
                        $(".labels-box").html(fangLabels);
                        break;
                    case 'use-office':
                        $(".house-type-box").html(officeType);
                        $(".rentstart, .rentend").siblings('.sign').html("元/㎡/月");
                        $(".labels-box").html(officeLabels);
                        break;
                    case 'use-shop':
                        $(".house-type-box").html(shopType);
                        $(".rentstart, .rentend").siblings('.sign').html("元/月");
                        $(".labels-box").html(shopLabels);
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
                title,
                district,
                region,
                houseShi,
                officeType,
                shopType,
                squarestart,
                squareend,
                rentstart,
                rentend,
                labels = [],
                qiuzuDesc;
            $(".release-sub").click(function() {
                use = $('input[name="use"]:checked').attr("id");

                switch (use) {
                    case 'use-fang':
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        houseShi = $('input[name="fang-type"]:checked').attr("value");
                        squarestart = $(".squarestart").val();
                        squareend = $(".squareend").val();
                        rentstart = $(".rentstart").val();
                        rentend = $(".rentend").val();
                        labels = [];
                        $('input[name="labels"]:checked').each(function(index, el) {
                            labels.push($(el).attr("value"));
                        });
                        title = $(".title").val();
                        qiuzuDesc = $(".qiuzu-desc").val();

                        console.log(district, region, houseShi, squarestart, squareend, rentstart, rentend, labels, title, qiuzuDesc);

                        if (!district || !region) {
                            _this.prototype.layerFun("请选择所在区域！");
                            return false;
                        }
                        if (!houseShi) {
                            _this.prototype.layerFun("请填写房屋户型！");
                            return false;
                        }
                        if (!squarestart || !squareend) {
                            _this.prototype.layerFun("请填写房屋面积！");
                            return false;
                        }
                        if (!rentstart || !rentend) {
                            _this.prototype.layerFun("请填写租金！");
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

                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: district,
                                region: region,
                                houseShi: houseShi,
                                squarestart: squarestart,
                                squareend: squareend,
                                rentstart: rentstart,
                                rentend: rentend,
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
                        break;
                    case 'use-office':
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        officeType = $('input[name="office-type"]:checked').attr("value");
                        squarestart = $(".squarestart").val();
                        squareend = $(".squareend").val();
                        rentstart = $(".rentstart").val();
                        rentend = $(".rentend").val();
                        labels = [];
                        $('input[name="labels"]:checked').each(function(index, el) {
                            labels.push($(el).attr("value"));
                        });
                        title = $(".title").val();
                        qiuzuDesc = $(".qiuzu-desc").val();

                        console.log(district, region, officeType, squarestart, squareend, rentstart, rentend, labels, title, qiuzuDesc);

                        if (!district || !region) {
                            _this.prototype.layerFun("请选择所在区域！");
                            return false;
                        }
                        if (!officeType) {
                            _this.prototype.layerFun("请选择写字楼类型！");
                            return false;
                        }
                        if (!squarestart || !squareend) {
                            _this.prototype.layerFun("请填写房屋面积！");
                            return false;
                        }
                        if (!rentstart || !rentend) {
                            _this.prototype.layerFun("请填写租金！");
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

                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: district,
                                region: region,
                                officeType: officeType,
                                squarestart: squarestart,
                                squareend: squareend,
                                rentstart: rentstart,
                                rentend: rentend,
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
                        break;
                    case 'use-shop':
                        district = $(".district-select .select-val").attr("value");
                        region = $(".region-select .select-val").attr("value");
                        shopType = $('input[name="shop-type"]:checked').attr("value");
                        squarestart = $(".squarestart").val();
                        squareend = $(".squareend").val();
                        rentstart = $(".rentstart").val();
                        rentend = $(".rentend").val();
                        labels = [];
                        $('input[name="labels"]:checked').each(function(index, el) {
                            labels.push($(el).attr("value"));
                        });
                        title = $(".title").val();
                        qiuzuDesc = $(".qiuzu-desc").val();

                        console.log(district, region, shopType, squarestart, squareend, rentstart, rentend, labels, title, qiuzuDesc);

                        if (!district || !region) {
                            _this.prototype.layerFun("请选择所在区域！");
                            return false;
                        }
                        if (!shopType) {
                            _this.prototype.layerFun("请选择写字楼类型！");
                            return false;
                        }
                        if (!squarestart || !squareend) {
                            _this.prototype.layerFun("请填写房屋面积！");
                            return false;
                        }
                        if (!rentstart || !rentend) {
                            _this.prototype.layerFun("请填写租金！");
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

                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: district,
                                region: region,
                                shopType: shopType,
                                squarestart: squarestart,
                                squareend: squareend,
                                rentstart: rentstart,
                                rentend: rentend,
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