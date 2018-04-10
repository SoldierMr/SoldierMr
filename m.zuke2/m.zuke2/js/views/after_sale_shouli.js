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
        // 选择租期时间
        selectDate: (function() {
            var calendar = new datePicker(),
                zuqiMonth,
                str,
                d;
            calendar.init({
                'trigger': '.shouli-time',
                /*按钮选择器，用于触发弹出插件*/
                'type': 'datetime',
                /*模式：date日期；datetime日期时间；time时间；ym年月；*/
                'minDate': '1900-1-1',
                /*最小日期*/
                'maxDate': '2100-12-31',
                /*最大日期*/
                'onSubmit': function() { /*确认时触发事件*/
                    console.log(calendar.value.split(" "));
                    $(".shouli-date").val(calendar.value.split(" ")[0]);
                    $(".shouli-shi").val(calendar.value.split(" ")[1].split(":")[0]);
                    $(".shouli-fen").val(calendar.value.split(" ")[1].split(":")[1]);
                },
                'onClose': function() { /*取消时触发事件*/ }
            });
        })(),
        // 提交
        saleSub: (function() {
            var _this = sale,
                shouliDate,
                shouliShi,
                shouliFen,
                isSolve;
            $(".submit").click(function() {
                shouliDate = $(".shouli-date").val();
                shouliShi = $(".shouli-shi").val();
                shouliFen = $(".shouli-fen").val();
                isSolve = $("input[name='problem']:checked").val();
                if (!shouliDate) {
                    _this.prototype.layerFun("请选择受理日期");
                    return false;
                }
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        shouliDate: shouliDate,
                        shouliShi: shouliShi,
                        shouliFen: shouliFen,
                        isSolve: isSolve
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