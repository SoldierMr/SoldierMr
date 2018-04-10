$(document).ready(function() {
    var qiuzuDetails = qiuzuDetails || {};
    qiuzuDetails.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 关注
        follow: (function() {
            $(".follow").click(function(event) {
                var _this = qiuzuDetails,
                    stop = true;
                event.preventDefault();
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "/qiuzu/fang/like",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            "sn": "942"
                        },
                        success: function(data) {
                            stop = true;
                            if (data.result == "10000") {
                                if (data.val == "add") {
                                    $(".follow").html('<i class="icon heart-icon"></i>已关注');
                                } else {
                                    $(".follow").html('<i class="icon heart-fine-icon"></i>关注');
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