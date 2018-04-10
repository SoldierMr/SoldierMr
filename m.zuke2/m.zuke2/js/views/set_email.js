$(document).ready(function() {
    var setEmail = setEmail || {};
    setEmail.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        email: function() {
            return $(".email").val();
        },
        // 验证密码
        isEmail: function() {
            if (!this.email()) {
                this.layerFun("邮箱不能为空");
                return false;
            } else if (!this.email().match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
                this.layerFun("请输入正确的邮箱");
                return false;
            } else {
                return true;
            }
        },
        // 确定
        sub: (function() {
            var _this = setEmail;
            $(".sub").click(function(event) {
                if (_this.prototype.isEmail()) {
                    // 验证手机号
                    $.post("", {
                        "user_email": encodeURIComponent(_this.prototype.email()),
                    }, function(data) {
                        if (data.result == "10000") {
                            // 跳到对应的页面
                            window.location.href = $("#ref_url").val();
                        } else {
                            _this.prototype.layerFun(data.err);
                        }
                    }, "json");
                }
            });
        })()
    };
});