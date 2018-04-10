$(document).ready(function() {
    var personalInfo = personalInfo || {};
    personalInfo.prototype = {
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
            var _this = personalInfo;
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
        // 修改生日
        selectBirthday: (function() {
            var _this = personalInfo,
                calendar = new datePicker();
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
                    $.ajax({
                        url: "",
                        type: "GET",
                        dataType: "json",
                        data: {
                            birthday: calendar.value
                        },
                        success: function(json) {
                            $("#birthday").html(calendar.value);
                        },
                        error: function() {
                            _this.prototype.layerFun("修改失败，请刷新页面");
                        }
                    });
                },
                'onClose': function() { /*取消时触发事件*/ }
            });
        })(),
        // 修改性别
        changeGender: (function() {
            $(document).on('change', 'input[name="gender"]', function(e) {
                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    data: {
                        gender: e.target.value
                    },
                    success: function(json) {
                        personalInfo.prototype.layerFun("修改成功");
                    },
                    error: function() {
                        personalInfo.prototype.layerFun("修改失败，请刷新页面");
                    }
                });
            });
        })(),
        // 弹出框显示共用，传入各自的class
        popShow: function(className) {
            $("." + className + "-pop").show();
        },
        // 弹出框隐藏共用，传入各自的class
        popHide: function(className) {
            $("." + className + "-pop").hide();
        },
        // 修改用户名显示
        changeUserNameShow: (function() {
            var _this = personalInfo;
            $(".user-name").click(function(e) {
                e.preventDefault();
                _this.prototype.popShow("user-name");
            });
        })(),
        // 修改用户名隐藏
        changeUserNameHide: (function() {
            var _this = personalInfo;
            $(document).on('click', '.close-user-name', function() {
                _this.prototype.popHide('user-name');
            });
        })(),
        // 用户名完成
        changeUserName: (function() {
            var _this = personalInfo,
                userName;
            $(document).on('click', '.save-user-name', function() {
                userName = $(".user-name-pop input").val();
                if (!userName) {
                    _this.prototype.layerFun("请输入用户名");
                    return false;
                }
                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    data: {
                        userName: userName
                    },
                    success: function(json) {
                        _this.prototype.popHide('user-name');
                        personalInfo.prototype.layerFun("修改成功");
                    },
                    error: function() {
                        personalInfo.prototype.layerFun("修改失败，请刷新页面");
                    }
                });
            });
        })(),
        // 修改真实姓名显示
        changeNameShow: (function() {
            var _this = personalInfo;
            $(".name").click(function(e) {
                e.preventDefault();
                _this.prototype.popShow("name");
            });
        })(),
        // 修改真实姓名隐藏
        changeNameHide: (function() {
            var _this = personalInfo;
            $(document).on('click', '.close-name', function() {
                _this.prototype.popHide('name');
            });
        })(),
        // 真实姓名完成
        changeName: (function() {
            var _this = personalInfo,
                name;
            $(document).on('click', '.save-name', function() {
                name = $(".name-pop input").val();
                if (!name) {
                    _this.prototype.layerFun("请输入真实姓名");
                    return false;
                }
                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    data: {
                        name: name
                    },
                    success: function(json) {
                        _this.prototype.popHide('name');
                        personalInfo.prototype.layerFun("修改成功");
                    },
                    error: function() {
                        personalInfo.prototype.layerFun("修改失败，请刷新页面");
                    }
                });
            });
        })()
    };
});