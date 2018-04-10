$(document).ready(function() {
    var evaluate = evaluate || {};
    evaluate.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.msg(text);
        },
        // 房源星级评价
        houseScore: (function() {
            $('.house-score').raty({
                score: 5,
                starOff: './images/star-off.png',
                starOn: './images/star-on.png',
                click: function(score, evt) {
                    $(".house-score-num").html(score);
                }
            });
        })(),
        // 专业能力星级评价
        zyeScore: (function() {
            var zyeScoreNum,
                xyingScoreNum,
                fuwuScoreNum;
            $('.zye-score').raty({
                score: 5,
                starOff: './images/star-off.png',
                starOn: './images/star-on.png',
                click: function(score, evt) {
                    $(".zye-score-num").html(score);
                    zyeScoreNum = score;
                    xyingScoreNum = parseInt($(".xying-score-num").html());
                    fuwuScoreNum = parseInt($(".fuwu-score-num").html());
                    $(".zonghe-score-num").html(((zyeScoreNum + xyingScoreNum + fuwuScoreNum) / 3).toFixed(1));
                }
            });
        })(),
        // 响应速度星级评价
        xyingScore: (function() {
            var zyeScoreNum,
                xyingScoreNum,
                fuwuScoreNum;
            $('.xying-score').raty({
                score: 5,
                starOff: './images/star-off.png',
                starOn: './images/star-on.png',
                click: function(score, evt) {
                    $(".xying-score-num").html(score);
                    zyeScoreNum = parseInt($(".zye-score-num").html());
                    xyingScoreNum = score;
                    fuwuScoreNum = parseInt($(".fuwu-score-num").html());
                    $(".zonghe-score-num").html(((zyeScoreNum + xyingScoreNum + fuwuScoreNum) / 3).toFixed(1));
                }
            });
        })(),
        // 服务态度星级评价
        fuwuScore: (function() {
            var zyeScoreNum,
                xyingScoreNum,
                fuwuScoreNum;
            $('.fuwu-score').raty({
                score: 5,
                starOff: './images/star-off.png',
                starOn: './images/star-on.png',
                click: function(score, evt) {
                    $(".fuwu-score-num").html(score);
                    zyeScoreNum = parseInt($(".zye-score-num").html());
                    xyingScoreNum = parseInt($(".xying-score-num").html());
                    fuwuScoreNum = score;
                    $(".zonghe-score-num").html(((zyeScoreNum + xyingScoreNum + fuwuScoreNum) / 3).toFixed(1));
                }
            });
        })(),
        // 提交
        evaluateSub: (function() {
            var _this = evaluate,
                stop = true,
                houseScoreNum,
                houseDesc,
                zyeScoreNum,
                xyingScoreNum,
                fuwuScoreNum,
                partnerDesc;
            $(".evaluate-sub").click(function() {
                if (stop) {
                    stop = false;
                    houseScoreNum = parseInt($(".house-score-num").html());
                    houseDesc = $(".house-desc").val();
                    zyeScoreNum = parseInt($(".zye-score-num").html());
                    xyingScoreNum = parseInt($(".xying-score-num").html());
                    fuwuScoreNum = parseInt($(".fuwu-score-num").html());
                    partnerDesc = $(".partner-desc").val();
                    console.log(houseScoreNum, houseDesc, zyeScoreNum, xyingScoreNum, fuwuScoreNum, partnerDesc);
                    $.ajax({
                        url: "",
                        type: "POST",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            houseScoreNum: houseScoreNum,
                            houseDesc: houseDesc,
                            zyeScoreNum: zyeScoreNum,
                            xyingScoreNum: xyingScoreNum,
                            fuwuScoreNum: fuwuScoreNum,
                            partnerDesc: partnerDesc
                        },
                        success: function(data) {
                            stop = true;
                            _this.prototype.layerFun("提交成功");
                        },
                        error: function() {
                            _this.prototype.layerFun("提交失败，请刷新页面");
                        }
                    });
                }
            });
        })()
    };
});