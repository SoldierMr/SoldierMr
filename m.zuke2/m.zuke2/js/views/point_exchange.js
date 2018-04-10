$(document).ready(function() {
    var pointExchange = pointExchange || {};
    pointExchange.prototype = {
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
        // 固定导航
        fixedNav: (function() {
            var navOffset = $(".tabs.tiX").offset().top,
                scrollPos,
                fontSize = 20 * (document.documentElement.clientWidth / 320);
            $(window).scroll(function() {
                scrollPos = $(window).scrollTop();
                if (scrollPos >= navOffset - 1.85 * fontSize) {
                    $(".tabs.tiX").css({
                        height: $(".tabs.tiX ul").height(),
                    });
                    $(".tabs.tiX ul").css({
                        position: 'fixed',
                        left: '0',
                        top: '1.85rem',
                        width: '100%'
                    });
                } else {
                    $(".tabs.tiX").removeAttr('style');
                    $(".tabs.tiX ul").removeAttr('style');
                }
            });
        })(),
        // 兑换显示隐藏
        exchangeToggle: (function() {
            var that,
                point,
                rent;
            // 显示
            $(".exchange-btn").click(function() {
                that = $(this);
                rent = that.attr("data-rent");
                point = parseInt(that.attr("data-point"));
                $(".rent-coupon").html(rent);
                $(".deduction-point").html(rent * 10);
                $(".exchange-num").html('1');
                $(".exchange-bg").attr({
                    'data-rent': rent,
                    'data-point': point
                });;
                $(".exchange-bg").show();
                pointExchange.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(".close-btn").click(function() {
                pointExchange.prototype.modalHelper.beforeClose();
                $(".exchange-bg").hide();
            });
        })(),
        // 加
        add: (function() {
            var that,
                pointerNum,
                point,
                rent,
                num;
            $(".exchange-pop .add-icon").click(function() {
                that = $(this);
                rent = parseInt($(".exchange-bg").attr("data-rent"));
                point = parseInt($(".exchange-bg").attr("data-point"));
                pointerSum = parseInt($(".point-sum").html());
                exchangeNum = parseInt($(".exchange-num").html());

                // 判断积分够不够
                if ((exchangeNum + 1) * point > pointerSum) {
                    pointExchange.prototype.layerFun("积分不够~");
                    return false;
                } else {
                    $(".exchange-num").html(exchangeNum + 1);
                    $(".deduction-point").html((exchangeNum + 1) * rent * 10);
                }
            });
        })(),
        // 减
        minus: (function() {
            var that,
                pointerNum,
                point,
                rent,
                num;
            $(".exchange-pop .minus-icon").click(function() {
                that = $(this);
                rent = parseInt($(".exchange-bg").attr("data-rent"));
                point = parseInt($(".exchange-bg").attr("data-point"));
                pointerSum = parseInt($(".point-sum").html());
                exchangeNum = parseInt($(".exchange-num").html());

                if ((exchangeNum - 1) <= 0) {
                    pointExchange.prototype.layerFun("不能减咯~");
                    return false;
                } else {
                    $(".exchange-num").html(exchangeNum - 1);
                    $(".deduction-point").html((exchangeNum - 1) * rent * 10);
                }
            });
        })(),
        // 确定兑换
        confirmExchange: (function() {
            var that,
                pointerNum,
                rentCoupon,
                exchangeNum;
            $(".exchange-pop .confirm-btn").click(function() {
                that = $(this);
                // 兑换的租金券类型，10租金券、30租金券等...
                rentCoupon = parseInt($(".rent-coupon").html());
                // 兑换的数量
                exchangeNum = parseInt($(".exchange-num").html());
                // 兑换所需的积分总数
                pointerSum = rentCoupon * exchangeNum;

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        rentCoupon: rentCoupon,
                        exchangeNum: exchangeNum,
                        pointerSum: pointerSum
                    },
                    success: function(data) {
                        pointExchange.prototype.modalHelper.beforeClose();
                        $(".exchange-bg").hide();
                        pointExchange.prototype.layerFun("兑换成功");
                    },
                    error: function() {
                        pointExchange.prototype.layerFun("兑换失败，请刷新页面");
                    }
                });
            });
        })()
    };
});