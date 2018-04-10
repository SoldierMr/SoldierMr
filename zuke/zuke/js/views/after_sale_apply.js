$(document).ready(function() {
    var sale = sale || {};
    sale.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 提交
        saleSub: (function() {
            var _this = sale,
                name,
                phone,
                problemDesc;
            $(".release-sub").click(function() {
                name = $(".edit-line .name").val();
                phone = $(".edit-line .phone").val();
                problemDesc = $(".problem-desc").val();
                console.log(name, phone, problemDesc);
                if (!name) {
                    _this.prototype.layerFun("请填写姓名");
                    return false;
                }
                if (!phone) {
                    _this.prototype.layerFun("请填写联系方式");
                    return false;
                }
                if (!problemDesc) {
                    _this.prototype.layerFun("请填写您的问题");
                    return false;
                }
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        name: name,
                        phone: phone,
                        problemDesc: problemDesc
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