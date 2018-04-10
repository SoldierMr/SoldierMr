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
                // 判断是否为写字楼，元/m²/月
                if (e.target.dataset.type == "office") {
                    $(".rentend").next('span').html("元/m²/月");
                } else {
                    $(".rentend").next('span').html("元/月");
                }
                $(".type-pop").remove();
                switch (e.target.dataset.type) {
                    case 'house':
                        // 替换对应的html
                        $(".house-type").html(_this.prototype.houseType());
                        $("body").append(_this.prototype.houseTypePop(), _this.prototype.houseLabelsPop());
                        break;
                    case 'office':
                        $(".house-type").html(_this.prototype.officeType());
                        $("body").append(_this.prototype.officeTypePop(), _this.prototype.officeLabelsPop());
                        break;
                    case 'shop':
                        $(".house-type").html(_this.prototype.shopType());
                        $("body").append(_this.prototype.shopTypePop(), _this.prototype.shopLabelsPop());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 期望户型toggle
        hopeHouseToggle: (function() {
            // 显示
            $(document).on('click', '.house-shi', function(e) {
                e.preventDefault();
                $(".hope-house-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.close-hope-house', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".hope-house-pop").hide();
            });
        })(),
        // 期望户型选择
        hopeHouseCheck: (function() {
            var that;
            $(document).on('click', '.hope-house-pop .ul-list li a', function(e) {
                e.preventDefault();
                that = $(this);
                if (that.hasClass('check-icon')) {
                    that.removeClass('check-icon');
                    return false;
                }
                that.addClass('check-icon');
            });
        })(),
        // 期望户型完成
        hopeHouseFinish: (function() {
            var that,
                checkArr = [];
            $(document).on('click', '.hope-house-pop .hope-house-finish', function() {
                that = $(this);
                // 重置
                checkArr = [];
                // 循环获取已选择的值
                $(".hope-house-pop .ul-list li a").each(function(index, el) {
                    if ($(el).hasClass('check-icon')) {
                        checkArr.push($(el).children('span').html());
                    }
                });
                // 将选择的值放入.house-shi的data-house-shi中
                $(".house-shi").attr("data-house-shi", checkArr);
                // 判断选未选择
                if ($(".house-shi").attr("data-house-shi") == "") {
                    $(".house-shi > span:last-child > span:first-child").html("未选择");
                } else {
                    $(".house-shi > span:last-child > span:first-child").html("已选择");
                }
                release.prototype.modalHelper.beforeClose();
                $(".hope-house-pop").hide();
            });
        })(),
        // 写字楼类型toggle
        officeTypeToggle: (function() {
            // 显示
            $(document).on('click', '.office-type', function(e) {
                e.preventDefault();
                $(".office-type-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.close-office-type', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".office-type-pop").hide();
            });
        })(),
        // 写字楼类型选择
        officeTypeCheck: (function() {
            var that;
            $(document).on('click', '.office-type-pop .ul-list li a', function(e) {
                e.preventDefault();
                that = $(this);
                if (that.hasClass('check-icon')) {
                    that.removeClass('check-icon');
                    return false;
                }
                that.addClass('check-icon');
            });
        })(),
        // 写字楼类型完成
        officeTypeFinish: (function() {
            var that,
                checkArr = [];
            $(document).on('click', '.office-type-pop .office-type-finish', function() {
                that = $(this);
                // 重置
                checkArr = [];
                // 循环获取已选择的值
                $(".office-type-pop .ul-list li a").each(function(index, el) {
                    if ($(el).hasClass('check-icon')) {
                        checkArr.push($(el).children('span').html());
                    }
                });
                // 将选择的值放入.office-type的data-office-type中
                $(".office-type").attr("data-office-type", checkArr);
                // 判断选未选择
                if ($(".office-type").attr("data-office-type") == "") {
                    $(".office-type > span:last-child > span:first-child").html("未选择");
                } else {
                    $(".office-type > span:last-child > span:first-child").html("已选择");
                }
                release.prototype.modalHelper.beforeClose();
                $(".office-type-pop").hide();
            });
        })(),
        // 商铺类型toggle
        shopTypeToggle: (function() {
            // 显示
            $(document).on('click', '.shop-type', function(e) {
                e.preventDefault();
                $(".shop-type-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.close-shop-type', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".shop-type-pop").hide();
            });
        })(),
        // 商铺类型选择
        shopTypeCheck: (function() {
            var that;
            $(document).on('click', '.shop-type-pop .ul-list li a', function(e) {
                e.preventDefault();
                that = $(this);
                if (that.hasClass('check-icon')) {
                    that.removeClass('check-icon');
                    return false;
                }
                that.addClass('check-icon');
            });
        })(),
        // 商铺类型完成
        shopTypeFinish: (function() {
            var that,
                checkArr = [];
            $(document).on('click', '.shop-type-pop .shop-type-finish', function() {
                that = $(this);
                // 重置
                checkArr = [];
                // 循环获取已选择的值
                $(".shop-type-pop .ul-list li a").each(function(index, el) {
                    if ($(el).hasClass('check-icon')) {
                        checkArr.push($(el).children('span').html());
                    }
                });
                // 将选择的值放入.shop-type的data-shop-type中
                $(".shop-type").attr("data-shop-type", checkArr);
                // 判断选未选择
                if ($(".shop-type").attr("data-shop-type") == "") {
                    $(".shop-type > span:last-child > span:first-child").html("未选择");
                } else {
                    $(".shop-type > span:last-child > span:first-child").html("已选择");
                }
                release.prototype.modalHelper.beforeClose();
                $(".shop-type-pop").hide();
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
        // 期望户型
        houseType: function() {
            return '<a class="house-shi"><span class="f14 c-333">期望户型</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a>';
        },
        // 写字楼类型
        officeType: function() {
            return '<a class="office-type"><span class="f14 c-333">写字楼类型</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a>';
        },
        // 商铺类型
        shopType: function() {
            return '<a class="shop-type"><span class="f14 c-333">商铺类型</span><span class="flex flex-right align-items-center"><span class="f12 c-666">未选择</span><span class="next"></span></span></a>';
        },
        // 期望户型pop
        houseTypePop: function() {
            return '<div class="hope-house-pop type-pop wh100 bg-fff pt37 pop hide"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-hope-house"></div><span class="f16 c-333 absolute translateHalf">期望户型</span></div><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">1室</span></a></li><li class="bb-eee"><a><span class="f14 c-333">2室</span></a></li><li class="bb-eee"><a><span class="f14 c-333">3室</span></a></li><li class="bb-eee"><a><span class="f14 c-333">4室</span></a></li><li class="bb-eee"><a><span class="f14 c-333">4室以上</span></a></li></ul><button class="submit hope-house-finish">完成</button></div>';
        },
        // 写字楼类型pop
        officeTypePop: function() {
            return '<div class="office-type-pop type-pop wh100 bg-fff pt37 pop hide"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-office-type"></div><span class="f16 c-333 absolute translateHalf">写字楼类型</span></div><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">写字楼</span></a></li><li class="bb-eee"><a><span class="f14 c-333">商业综合体</span></a></li><li class="bb-eee"><a><span class="f14 c-333">商住两用楼</span></a></li><li class="bb-eee"><a><span class="f14 c-333">其他</span></a></li></ul><button class="submit office-type-finish">完成</button></div>';
        },
        // 商铺类型pop
        shopTypePop: function() {
            return '<div class="shop-type-pop type-pop wh100 bg-fff pt37 pop hide"><div class="top-fixed bg-fff flex align-items-center bb-ddd"><div class="return-icon ml15 close-shop-type"></div><span class="f16 c-333 absolute translateHalf">商铺类型</span></div><ul class="ul-list"><li class="bb-eee"><a><span class="f14 c-333">购物中心</span></a></li><li class="bb-eee"><a><span class="f14 c-333">社区商业</span></a></li><li class="bb-eee"><a><span class="f14 c-333">综合体配套</span></a></li><li class="bb-eee"><a><span class="f14 c-333">其他</span></a></li></ul><button class="submit shop-type-finish">完成</button></div>';
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
                labels,
                courtName,
                qiuzuDesc;
            $(".release-sub").click(function() {
                use = $('.house-use .note.active').attr("data-type");
                switch (use) {
                    case 'house':
                        title = $(".title").val();
                        squarestart = $(".squarestart").val();
                        squareend = $(".squareend").val();
                        rentstart = $(".rentstart").val();
                        rentend = $(".rentend").val();
                        houseShi = $(".house-shi").attr("data-shi");
                        labels = $(".labels").attr("data-labels");
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        courtName = $(".court-name").val();
                        qiuzuDesc = $(".qiuzu-desc").val();
                        if (!title) {
                            _this.prototype.layerFun("请填写标题！");
                            return false;
                        }
                        if (!squarestart) {
                            _this.prototype.layerFun("请填写最小面积！");
                            return false;
                        }
                        if (!squareend) {
                            _this.prototype.layerFun("请填写最大面积！");
                            return false;
                        }
                        if (!/^[0-9]*$/.test(squarestart) || !/^[0-9]*$/.test(squareend)) {
                            _this.prototype.layerFun("请填写正确的面积格式！");
                            return false;
                        }
                        if (!rentstart) {
                            _this.prototype.layerFun("请填写最低租金！");
                            return false;
                        }
                        if (!rentend) {
                            _this.prototype.layerFun("请填写最高租金！");
                            return false;
                        }
                        if (!/^[0-9]*$/.test(rentstart) || !/^[0-9]*$/.test(rentend)) {
                            _this.prototype.layerFun("请填写正确的租金格式！");
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
                        console.log(title, houseShi, houseTing, houseWei, squarestart, squareend, rentstart, rentend, labels, district, region, qiuzuDesc);
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                title: title,
                                squarestart: squarestart,
                                squareend: squareend,
                                rentstart: rentstart,
                                rentend: rentend,
                                houseShi: houseShi,
                                labels: labels,
                                district: district,
                                region: region,
                                courtName: courtName,
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
                    case 'office':
                        title = $(".title").val();
                        squarestart = $(".squarestart").val();
                        squareend = $(".squareend").val();
                        rentstart = $(".rentstart").val();
                        rentend = $(".rentend").val();
                        officeType = $(".office-type").attr("data-office-type");
                        labels = $(".labels").attr("data-labels");
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        courtName = $(".court-name").val();
                        qiuzuDesc = $(".qiuzu-desc").val();
                        if (!title) {
                            _this.prototype.layerFun("请填写标题！");
                            return false;
                        }
                        if (!squarestart) {
                            _this.prototype.layerFun("请填写最小面积！");
                            return false;
                        }
                        if (!squareend) {
                            _this.prototype.layerFun("请填写最大面积！");
                            return false;
                        }
                        if (!/^[0-9]*$/.test(squarestart) || !/^[0-9]*$/.test(squareend)) {
                            _this.prototype.layerFun("请填写正确的面积格式！");
                            return false;
                        }
                        if (!rentstart) {
                            _this.prototype.layerFun("请填写最低租金！");
                            return false;
                        }
                        if (!rentend) {
                            _this.prototype.layerFun("请填写最高租金！");
                            return false;
                        }
                        if (!/^[0-9]*$/.test(rentstart) || !/^[0-9]*$/.test(rentend)) {
                            _this.prototype.layerFun("请填写正确的租金格式！");
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
                        console.log(title, squarestart, squareend, rentstart, rentend, officeType, labels, district, region, qiuzuDesc);
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                title: title,
                                squarestart: squarestart,
                                squareend: squareend,
                                rentstart: rentstart,
                                rentend: rentend,
                                officeType: officeType,
                                labels: labels,
                                district: district,
                                region: region,
                                courtName: courtName,
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
                    case 'shop':
                        title = $(".title").val();
                        squarestart = $(".squarestart").val();
                        squareend = $(".squareend").val();
                        rentstart = $(".rentstart").val();
                        rentend = $(".rentend").val();
                        shopType = $(".shop-type").attr("data-shop-type");
                        labels = $(".labels").attr("data-labels");
                        district = $(".area .area-html").attr("data-district");
                        region = $(".area .area-html").attr("data-region");
                        courtName = $(".court-name").val();
                        qiuzuDesc = $(".qiuzu-desc").val();
                        if (!title) {
                            _this.prototype.layerFun("请填写标题！");
                            return false;
                        }
                        if (!squarestart) {
                            _this.prototype.layerFun("请填写最小面积！");
                            return false;
                        }
                        if (!squareend) {
                            _this.prototype.layerFun("请填写最大面积！");
                            return false;
                        }
                        if (!/^[0-9]*$/.test(squarestart) || !/^[0-9]*$/.test(squareend)) {
                            _this.prototype.layerFun("请填写正确的面积格式！");
                            return false;
                        }
                        if (!rentstart) {
                            _this.prototype.layerFun("请填写最低租金！");
                            return false;
                        }
                        if (!rentend) {
                            _this.prototype.layerFun("请填写最高租金！");
                            return false;
                        }
                        if (!/^[0-9]*$/.test(rentstart) || !/^[0-9]*$/.test(rentend)) {
                            _this.prototype.layerFun("请填写正确的租金格式！");
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
                        console.log(title, squarestart, squareend, rentstart, rentend, shopType, labels, district, region, qiuzuDesc);
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                title: title,
                                squarestart: squarestart,
                                squareend: squareend,
                                rentstart: rentstart,
                                rentend: rentend,
                                shopType: shopType,
                                labels: labels,
                                district: district,
                                region: region,
                                courtName: courtName,
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