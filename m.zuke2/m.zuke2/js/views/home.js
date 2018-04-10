$(document).ready(function() {
    var home = home || {};
    home.prototype = {
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
        // 轮播图
        carousel: (function() {
            var carousel = new Swiper('.carousel', {
                direction: "horizontal", //横向滑动                
                loop: true, //形成环路（即：可以从最后一张图跳转到第一张图
                pagination: ".swiper-pagination",
                autoplay: 3000 // 每隔3秒自动播放
            });
        })(),
        // 创建历史数据封装
        createHistoryLi: function() {
            var historyArr = this.getHistoryArr(),
                template = '';

            if (historyArr) {
                for (var i = 0; i < historyArr.length; i++) {
                    template += '<li class="history-li"><a href="">' + historyArr[i] + '</a><span class="del-history-li" data-index="' + i + '"></span></li>';
                }
                $(".history-ul").html("");
                $(".history-ul").append(template);
            }
        },
        // 显示search-pop弹框
        showSearchPop: (function() {
            $(".show-search-pop").click(function() {
                var _this = home,
                    historyArr = _this.prototype.getHistoryArr();

                if (historyArr) {
                    $(".empty-history").show();
                    $(".no-history").hide();
                } else {
                    $(".empty-history").hide();
                    $(".no-history").show();
                }
                _this.prototype.createHistoryLi();
                $(".search-pop").show();
                _this.prototype.modalHelper.afterOpen();
            });
        })(),
        // 关闭search-pop弹框
        hideSearchPop: (function() {
            $(".close-search").click(function() {
                home.prototype.modalHelper.beforeClose();
                $(".search-pop").hide();
            });
        })(),
        // 获取历史记录
        getHistoryArr: function() {
            if (localStorage.getItem("historyArr")) {
                var historyArr = localStorage.getItem("historyArr").split(",");
                return historyArr;
            } else {
                return "";
            }
        },
        // 设置历史记录
        setHistoryArr: function(historyArr) {
            localStorage.setItem("historyArr", historyArr);
        },
        // 删除单个搜索历史
        delHistoryLi: (function() {
            $(document).on('click', '.del-history-li', function() {
                var _this = home,
                    that = $(this),
                    index = that.attr("data-index"),
                    historyArr = _this.prototype.getHistoryArr();
                // 删除指定的那个元素
                historyArr.splice(index, 1);
                if (historyArr.length) {
                    // 重新存储搜索历史数据
                    _this.prototype.setHistoryArr(historyArr);
                } else {
                    $(".history-ul").html("");
                    $(".empty-history").hide();
                    $(".no-history").show();
                    // 清空搜索历史数据
                    _this.prototype.setHistoryArr("");
                }
                // 重新遍历生成历史记录
                _this.prototype.createHistoryLi();
            });
        })(),
        // 删除搜索历史
        delAllHistory: (function() {
            var _this = home;
            $(".empty-history").click(function(event) {
                localStorage.removeItem('historyArr');
                $(".history-ul").html("");
                $(".empty-history").hide();
                $(".no-history").show();
            });
        })(),
        // 搜索
        search: (function() {
            var _this = home;
            $(".search-btn").click(function() {
                var _this = home,
                    searchVal = $(".search-val").val(),
                    historyArr = _this.prototype.getHistoryArr();
                searchVal = $.trim(searchVal);
                if (searchVal) {
                    if (!historyArr) {
                        var historyArr = [];
                    }

                    if (historyArr.length >= 6) {
                        // 超过10个之后，先前添加一个并删除最后一个
                        historyArr.unshift(searchVal);
                        historyArr.pop();
                    } else {
                        // 向数组前面加上新的搜索数据
                        historyArr.unshift(searchVal);
                    }

                    _this.prototype.setHistoryArr(historyArr);

                    $(".search-pop").hide();
                    console.log(localStorage.getItem("historyArr"));

                    window.location.href = '';
                } else {
                    return false;
                }
            });
        })(),
        // 发布弹出
        fabuPop: (function() {
            $(".fabu").click(function() {
                $(".fabu-pop").fadeIn();
                $(".close-fabu > i").addClass('close-fabu-ani');
                $(".fabu-qiuzu").css({
                    transition: 'all .3s ease-in-out .2s',
                    bottom: '10rem',
                    opacity: '1'
                });
                $(".fabu-zufang").css({
                    transition: 'all .3s ease-in-out .2s',
                    bottom: '4rem',
                    opacity: '1'
                });
                home.prototype.modalHelper.afterOpen();
            });
        })(),
        // 发布关闭
        fabuClose: (function() {
            $(".close-fabu").click(function() {
                home.prototype.modalHelper.beforeClose();
                var fontSize = 20 * (document.documentElement.clientWidth / 320);
                $(".fabu-qiuzu,.fabu-zufang").css({
                    transition: 'all .2s ease-in-out',
                    bottom: -5.5 * fontSize,
                    opacity: '0'
                });
                setTimeout(function() {
                    $(".fabu-pop").fadeOut(200);
                    setTimeout(function() {
                        $(".close-fabu > i").removeClass('close-fabu-ani');
                    }, 200);
                }, 200);
            });
        })()
    };
});