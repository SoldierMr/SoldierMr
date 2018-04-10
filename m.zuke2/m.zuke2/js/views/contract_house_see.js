$(document).ready(function() {
    var contract = contract || {};
    contract.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 滚动穿透
        modalHelper: (function(bodyCls) {
            var scrollTop;
            return {
                afterOpen: function() {
                    scrollTop = document.scrollingElement.scrollTop;
                    document.body.classList.add(bodyCls);
                    document.body.style.top = -scrollTop + 'px';
                },
                beforeClose: function() {
                    document.body.classList.remove(bodyCls);
                    // scrollTop lost after set position:fixed, restore it back.
                    document.scrollingElement.scrollTop = scrollTop;
                }
            };
        })('modal-open'),
        // 配套Toggle
        supportingToggle: (function() {
            // 弹出
            $(document).on('click', '.supporting', function(e) {
                e.preventDefault();
                $(".supporting-pop").show();
                contract.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.supporting-pop .close-supporting', function(e) {
                e.preventDefault();
                contract.prototype.modalHelper.beforeClose();
                $(".supporting-pop").hide();
            });
        })(),
        // 配套下拉收缩
        supportingItemToggle: (function() {
            var that;
            $(document).on('click', '.supporting-pop .ul-list > li', function(e) {
                e.preventDefault();
                that = $(this);
                if (!that.attr("name")) return false;
                if (that.children('.icon').hasClass('xiala-icon')) {
                    that.children('.icon').addClass('shangla-icon').removeClass('xiala-icon');
                    $(".supporting-pop .li-box[name='" + that.attr("name") + "']").slideDown(300);
                } else if (that.children('.icon').hasClass('shangla-icon')) {
                    that.children('.icon').addClass('xiala-icon').removeClass('shangla-icon');
                    $(".supporting-pop .li-box[name='" + that.attr("name") + "']").slideUp(300);
                }
            });
            // 阻止除了.icon的子元素的事件冒泡
            $(document).on('click', '.supporting-pop .ul-list > li > *:not(.icon)', function(e) {
                e.preventDefault();
                return false;
            });
        })(),
        // 合同确定
        confirmContract: (function() {
            $(".confirm-contract").click(function(event) {
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                    },
                    success: function(data) {
                    },
                    error: function() {
                        contract.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});