$(document).ready(function() {
    var pay = pay || {};
    pay.prototype = {
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
        // 选择租期时间
        selectDate: (function() {
            var calendar = new datePicker(),
                zuqiMonth,
                str,
                d;
            calendar.init({
                'trigger': '.start-time',
                /*按钮选择器，用于触发弹出插件*/
                'type': 'date',
                /*模式：date日期；datetime日期时间；time时间；ym年月；*/
                'minDate': '1900-1-1',
                /*最小日期*/
                'maxDate': '2100-12-31',
                /*最大日期*/
                'onSubmit': function() { /*确认时触发事件*/ },
                'onClose': function() { /*取消时触发事件*/ }
            });
        })(),
        // 选择租金券toggle
        selectCouponToggle: (function() {
            // 显示
            $(".coupon").click(function() {
                $(".coupon-pop").show();
                pay.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(".close-coupon").click(function() {
                pay.prototype.modalHelper.beforeClose();
                $(".coupon-pop").hide();
            });
        })(),
        // 选择租金券
        selectCoupon: (function() {
            var that;
            $(".coupon-box").click(function(e) {
                that = $(this);
                $(".coupon-box input[type='radio']").prop('checked', false);
                that.find("input[type='radio']").prop('checked', true);
            });
        })(),
        // 确定优惠券
        confirmCoupon: (function() {
            var discount, // 优惠券的金额
                rent,
                num;
            $(".confirm-coupon").click(function() {
                discount = parseInt($(".coupon-box input[type='radio']:checked").attr("data-rent"));
                console.log(discount);
                rent = parseInt($(".rent").attr("data-rent"));
                num = parseInt($('.num').html());

                rent = rent * num - discount;

                $(".discount").html(discount);
                $(".rent").html(rent + ".00");
                $(".discount").parent().show();
                $(".usable-span").hide();
                pay.prototype.modalHelper.beforeClose();
                $(".coupon-pop").hide();
            });
        })(),

        // 加
        add: (function() {
            var that,
                num,
                discount, // 优惠券的金额
                rent,
                result;
            $(document).on('click', '.add-icon', function() {
                that = $(this);
                num = parseInt(that.siblings('.num').html());
                that.siblings('.num').html(num + 1);

                discount = parseInt($(".discount").html()) || 0;
                rent = parseInt($(".rent").attr("data-rent"));

                result = rent * (num + 1) - discount;
                $(".rent").html(result + ".00");
            });
        })(),
        // 减
        minus: (function() {
            var that,
                num,
                discount, // 优惠券的金额
                rent,
                result;
            $(document).on('click', '.minus-icon', function() {
                that = $(this);
                num = parseInt(that.siblings('.num').html());

                if ((num - 1) < 1) {
                    pay.prototype.layerFun("不能减咯~");
                    return false;
                } else {
                    that.siblings('.num').html(num - 1);
                    discount = parseInt($(".discount").html()) || 0;
                    rent = parseInt($(".rent").attr("data-rent"));

                    result = rent * (num - 1) - discount;
                    $(".rent").html(result + ".00");
                }
            });
        })()
    };
});