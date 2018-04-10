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
        // 提交
        releaseSub: (function() {
            var _this = release,
                use,
                title,
                district,
                region,
                officeType,
                squarestart,
                squareend,
                rentstart,
                rentend,
                labels = [],
                qiuzuDesc;
            $(".release-sub").click(function() {
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