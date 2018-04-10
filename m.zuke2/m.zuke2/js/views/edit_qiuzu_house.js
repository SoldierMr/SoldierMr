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
                $(".labels-pop").show();
                release.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.labels-pop .close-labels', function(e) {
                e.preventDefault();
                release.prototype.modalHelper.beforeClose();
                $(".labels-pop").hide();
            });
        })(),
        // 提交
        releaseSub: (function() {
            var _this = release,
                title,
                district,
                region,
                houseShi,
                squarestart,
                squareend,
                rentstart,
                rentend,
                labels,
                courtName,
                qiuzuDesc;
            $(".release-sub").click(function() {
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