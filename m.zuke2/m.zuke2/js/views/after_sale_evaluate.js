$(document).ready(function() {
    var sale = sale || {};
    sale.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
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
        // 提交
        saleSub: (function() {
            var _this = sale,
                satisfaction,
                pingyu;
            $(".submit").click(function() {
                satisfaction = $("input[name='satisfaction']:checked").val();
                pingyu = $(".pingyu").val();
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        satisfaction: satisfaction,
                        pingyu: pingyu
                    },
                    success: function(data) {
                        _this.prototype.layerFun("提交成功");
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});