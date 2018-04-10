$(document).ready(function() {
    var perfectInfo = perfectInfo || {};
    perfectInfo.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 修改头像
        changeAvatar: (function() {
            var _this = perfectInfo;
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
                    $(".avatar img").attr("src", this.result);
                }
            });
        })(),
        // 选择生日
        selectBirthday: (function() {
            var calendar = new datePicker(),
                theSelectData;
            calendar.init({
                'trigger': '#birthday',
                /*按钮选择器，用于触发弹出插件*/
                'type': 'date',
                /*模式：date日期；datetime日期时间；time时间；ym年月；*/
                'minDate': '1900-1-1',
                /*最小日期*/
                'maxDate': '2100-12-31',
                /*最大日期*/
                'defaultDate': $(".select-date-val").html(),
                'onSubmit': function() { /*确认时触发事件*/
                    theSelectData = calendar.value;
                },
                'onClose': function() { /*取消时触发事件*/ }
            });
        })(),
        // 提交
        sub: (function() {
            var _this = perfectInfo,
                avatar,
                userName,
                email,
                gender,
                birthday,
                name;
            $(".perfect-info-btn").click(function(event) {
                avatar = $(".avatar img").attr("src");
                userName = $(".user-name").val();
                email = $(".e-mail").val();
                gender = $('input[name="gender"]:checked').val();
                birthday = $("#birthday").val();
                name = $(".name").val();
                console.log(avatar, userName, email, gender, birthday, name);

                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    data: {
                        avatar: avatar,
                        userName: userName,
                        email: email,
                        gender: gender,
                        birthday: birthday,
                        name: name
                    },
                    success: function(json) {

                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});