$(document).ready(function() {
    var personal = personal || {};
    personal.prototype = {
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
        // 头像上传
        avatar: (function() {
            var _this = personal,
                that,
                content = '',
                file,
                reader;
            $(".upload-avatar-btn").click(function() {
                $(this).siblings(".avatar").find('.upload-avatar').click();
            });
            $(document).on('change', '.upload-avatar', function(e) {
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
            var _this = personal,
                avatar,
                userName,
                name,
                gender,
                birthday;
            $(".release-sub").click(function() {
                avatar = $(".upload-avatar").siblings('img').attr("src");
                userName = $(".edit-line .user-name").val();
                name = $(".edit-line .name").val();
                gender = $('input[name="gender"]:checked').attr("value");
                birthday = $(".year-select .select-val").attr("value") + '-' + $(".month-select .select-val").attr("value") + '-' + $(".day-select .select-val").attr("value");

                console.log(avatar, userName, name, gender, birthday);

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        avatar: avatar,
                        userName: userName,
                        name: name,
                        gender: gender,
                        birthday: birthday
                    },
                    success: function(data) {
                        // 弹出提交成功提示
                        _this.prototype.layerFun("保存成功");
                    },
                    error: function() {
                        _this.prototype.layerFun("保存失败，请刷新页面");
                    }
                });
            });
        })()
    };
});