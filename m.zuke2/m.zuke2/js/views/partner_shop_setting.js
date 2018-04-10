$(document).ready(function() {
    var team = team || {};
    team.prototype = {
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
            var _this = team,
                fontSize = 20 * (document.documentElement.clientWidth / 320),
                pc = new PhotoClip('#clipArea', {
                    size: [16 * fontSize, 4.9 * fontSize],
                    ok: '.clip-pop .confirm',
                    loadStart: function() {
                        console.log('开始读取照片');
                    },
                    loadComplete: function() {
                        console.log('照片读取完成');
                        _this.prototype.photoClipObj = this;
                    },
                    done: function(dataURL) {
                        // 添加裁剪好的图片
                        /*$(".banner").show().children("img").attr("src", dataURL);
                        $(".replace-bg").parent().removeClass("hide").addClass("flex");
                        $(".big-upload").hide();
                        team.prototype.modalHelper.beforeClose();
                        $(".clip-pop").hide();
                        // 裁剪完销毁对象
                        this.destroy();

                        // 清空file的value，解决连续上传同一张图片时无法选择的问题
                        $("input[type='file'").val("");*/
                        // 裁剪后进行上传
                        $.ajax({
                            url: "",
                            type: "POST",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                "imgdata": dataURL
                            },
                            success: function(data) {
                                // 添加裁剪好的图片
                                $(".banner").show().children("img").attr("src", data.src);
                                $(".replace-bg").parent().removeClass("hide").addClass("flex");
                                $(".big-upload").hide();
                                team.prototype.modalHelper.beforeClose();
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
            var _this = team;
            $(".clip-pop .close-clip").click(function(event) {
                team.prototype.modalHelper.beforeClose();
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
        // 上传店铺背景图
        bigUpload: (function() {
            var _this = team;
            $(document).on('change', '.big-upload input', function(e) {
                _this.prototype.photoClip().load(this.files[0]);
                $(".clip-pop").show();
                _this.prototype.modalHelper.afterOpen();
            });
        })(),
        // .replace-bg 触发上传
        replaceBg: (function() {
            $(".replace-bg").click(function() {
                $(".big-upload input").click();
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
        // 修改头像
        changeAvatar: (function() {
            var _this = team;
            $(document).on('change', 'input[name="avatar"]', function() {
                //检验是否为图像文件  
                var file = this.files[0];
                if (!/image\/\w+/.test(file.type)) {
                    _this.prototype.layerFun("请上传图片！");
                    return false;
                }
                var reader = new FileReader();
                //将文件以Data URL形式读入页面
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    $.ajax({
                        url: "",
                        type: "GET",
                        dataType: "json",
                        data: {
                            avatar: this.result
                        },
                        success: function(json) {
                            $(".avatar img").attr("src", this.result);
                        },
                        error: function() {
                            _this.prototype.layerFun("上传失败，请刷新页面");
                        }
                    });
                }
            });
        })(),
        // 提交
        teamSub: (function() {
            var _this = team,
                shopName,
                shopBg,
                shopDesc;
            $(".submit").click(function() {
                // 获取图片
                shopBg = $(".banner img").attr("src");
                // 判断是否上传图片
                if (!shopBg) {
                    _this.prototype.layerFun("请上传店铺形象图！");
                    return false;
                }

                shopName = $(".shop-name").val();
                // 店铺名称
                if (!shopName) {
                    _this.prototype.layerFun("请填写店铺名称！");
                    return false;
                }

                // 店铺简介
                shopDesc = $(".shop-desc").val();
                if (!shopDesc) {
                    _this.prototype.layerFun("请填写店铺简介！");
                    return false;
                }

                console.log(shopBg, shopDesc);

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        shopBg: shopBg,
                        shopName: shopName,
                        shopDesc: shopDesc
                    },
                    success: function(data) {
                        window.location.href = '';
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});