$(document).ready(function() {
    var setPwd = setPwd || {};
    setPwd.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        pwd: function() {
            return $(".pwd").val();
        },
        // 验证密码
        isPwd: function() {
            if (!this.pwd()) {
                this.layerFun("密码不能为空");
                return false;
            } else {
                return true;
            }
        },
        // 确定
        sub: (function() {
            var _this = setPwd;
            $(".sub").click(function(event) {
                if (_this.prototype.isPwd()) {
                    // 验证手机号
                    $.post("", {
                        "user_pass": encodeURIComponent(_this.prototype.pwd()),
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