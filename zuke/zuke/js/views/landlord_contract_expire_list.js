$(document).ready(function() {
    var landlord = landlord || {};
    landlord.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        /*发布移入移出*/
        fabuToggle: (function() {
            var t;
            $(".fabu-contract").mouseover(function(e) {
                e.stopPropagation();
                clearTimeout(t);
                $(".fabu-contract, .fabu-contract-box").show();
            });
            $(".fabu-contract").mouseout(function(e) {
                e.stopPropagation();
                t = setTimeout(function() { $(".fabu-contract-box").hide(); }, 300);
            });
            $(".fabu-contract, .fabu-contract-box").mouseover(function(e) {
                e.stopPropagation();
                clearTimeout(t);
            });
        })(),
        // 删除
        del: (function() {
            var that,
                thatId;
            $(".del").click(function(e) {
                e.preventDefault();
                that = $(this);
                thatId = that.attr("data-id");
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        id: thatId,
                    },
                    success: function(data) {
                        that.parents("tr").remove();
                        landlord.prototype.layerFun("已删除");
                    },
                    error: function() {
                        landlord.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })(),
        // 搜索
        search: (function() {
            var searchVal;
            $(".input-box button").click(function(e) {
                e.preventDefault();
                searchVal = $(".input-box input").val();
                if (!$.trim(searchVal)) {
                    landlord.prototype.layerFun("请输入搜索内容");
                    $(".input-box input").focus();
                    return false;
                }

                window.location.href = "";
            });
        })()
    };
});