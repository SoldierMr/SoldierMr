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
        // 上传file
        uploadFile: (function() {
            $(document).on('click', '#file', function(event) {
                event.preventDefault();
                $.ajaxFileUpload({
                    url: '', //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'file', //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function(data, status) //服务器成功响应处理函数
                    {

                    },
                    error: function(data, status, e) //服务器响应失败处理函数
                    {
                        alert(e);
                    }
                })
                return false;
            });
        })(),
        // 提交
        saleSub: (function() {
            var _this = sale,
                phone,;
            $(".submit").click(function() {
                if (!phone) {
                    _this.prototype.layerFun("请填写联系方式");
                    return false;
                }
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        phone: phone
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