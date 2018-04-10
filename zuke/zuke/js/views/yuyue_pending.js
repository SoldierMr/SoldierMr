$(document).ready(function() {
    var yuyue = yuyue || {};
    yuyue.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 接受
        accept: (function() {
            var that,
                thatId;
            $(".accept").click(function(e) {
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
                        yuyue.prototype.layerFun("已接受");
                    },
                    error: function() {
                        yuyue.prototype.layerFun("接受失败，请刷新页面");
                    }
                });
            });
        })(),
        // 拒绝
        refuse: (function() {
            var that,
                thatId;
            $(".refuse").click(function(e) {
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
                        yuyue.prototype.layerFun("已拒绝");
                    },
                    error: function() {
                        yuyue.prototype.layerFun("拒绝失败，请刷新页面");
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
                    yuyue.prototype.layerFun("请输入搜索内容");
                    $(".input-box input").focus();
                    return false;
                }

                window.location.href = "";
            });
        })()
    };
});