$(document).ready(function() {
    var details = details || {};
    details.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 关注
        follow: (function() {
            $(".follow").click(function() {
                var _this = details,
                    stop = true;
                event.preventDefault();
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "/fang/like",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            "sn": "942"
                        },
                        success: function(data) {
                            stop = true;
                            if (data.result == "10000") {
                                if (data.val == "add") {
                                    $(".follow").html('已关注');
                                } else {
                                    $(".follow").html('关注房源');
                                }
                            } else if (data.result == "30000") {
                                window.location.href = "/login.html";
                            } else {
                                _this.prototype.layerFun("操作失败，请刷新页面");
                            }
                        },
                        error: function() {
                            _this.prototype.layerFun("关注失败，请刷新页面");
                        }
                    });
                }
            });
        })()
    };
});
