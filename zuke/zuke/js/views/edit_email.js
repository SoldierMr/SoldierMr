$(document).ready(function() {
    var personal = personal || {};
    personal.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 提交
        releaseSub: (function() {
            var _this = personal,
                email;
            $(".release-sub").click(function() {
                email = $(".email").val();
                if (!email) {
                    personal.prototype.layerFun("请输入邮箱号");
                    return false;
                }
                if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
                    personal.prototype.layerFun("请输入正确的邮箱号");
                    return false;
                }
                console.log(email);

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        email: email
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