$(document).ready(function() {
    var share = share || {};
    share.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 浏览器版本
        browser: {
            versions: function() {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1 || u.indexOf('micromessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.indexOf('QQ') > -1 || u.indexOf('qq') > -1, //是否QQ
                    uc: u.indexOf('UCBrowser') > -1 || u.indexOf('uc') > -1,
                    androidView: u.indexOf('ANDROIDWEBVIEW') > -1 //需要app端配合,在userAgent中加入标识
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        },
        // 分享toggle
        shareToggle: (function() {
            // 弹出
            $(".share-btn").click(function(event) {
                $(".share-pop-bg").show();
                share.prototype.modalHelper.afterOpen();
            });
            // 隐藏
            $(document).on('click', '.share-pop-bg, .share-pop-bg .share-cancel', function(e) {
                e.preventDefault();
                share.prototype.modalHelper.beforeClose();
                $(".share-pop-bg").hide();
            });
            // 阻止除了.icon的子元素的事件冒泡
            $(document).on('click', '.share-pop-bg *:not(.share-cancel)', function(e) {
                e.preventDefault();
                return false;
            });
        })(),
        // 分享点击
        shareItem: (function() {
            var site,
                versions,
                ua = navigator.userAgent.toLowerCase(),
                script,
                isAddScript = false;
            $(".share-item").click(function(e) {
                e.preventDefault();
                versions = share.prototype.browser.versions;
                site = e.currentTarget.dataset.site;
                if (!site) return false;
                /*判断是否在腾讯的浏览器*/
                if (versions.weixin || versions.qq) {
                    // 添加微信js-sdk js
                    if (!isAddScript) {
                        script = document.createElement('script');
                        script.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
                        script.setAttribute('type', 'text/javascript');
                        document.getElementsByTagName('head')[0].appendChild(script);

                        isAddScript = true;
                    }
                    //调用后台接口得到时间戳、签名、随机串
                    $.ajax({
                        url: '',
                        type: 'post',
                        dataType: 'json',
                        //async: false,
                        data: {

                        },
                        success: function(data) {
                            var time = data[0].timestamp;
                            console.log("时间戳：" + time);
                            var nonceStr = data[0].nonceStr;
                            console.log("签名随机串:" + nonceStr);
                            var signature = data[0].signature;
                            console.log("签名:" + signature);
                            wx.config({
                                debug: true, // 开启调试模式
                                appId: 'wxf8b4f85f3a794e77', // 必填，公众号的唯一标识
                                timestamp: time, // 必填，生成签名的时间戳
                                nonceStr: nonceStr, // 必填，生成签名的随机串
                                signature: signature, // 必填，签名
                                jsApiList: [
                                    'onMenuShareTimeline',
                                    'onMenuShareAppMessage',
                                    'onMenuShareQQ',
                                    'onMenuShareWeibo'
                                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            });
                        },
                        error: function() {
                            alert("error");
                        }
                    });
                    wx.ready(function() {
                        //分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: '', // 分享标题
                            link: '', // 分享链接
                            imgUrl: '', // 分享图标
                            success: function() {
                                // 用户确认分享后执行的回调函数
                                //下面我们可以做自己的操作，调用自己的接口了。
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            },
                            fail: function() {
                                // 分享失败的操作
                            }
                        });
                        // 微信好友
                        wx.onMenuShareAppMessage({
                            title: '',
                            link: '',
                            imgUrl: "",
                            desc: "", // 分享描述
                            trigger: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        });
                        // 分享到QQ
                        wx.onMenuShareQQ({
                            title: '', // 分享标题
                            desc: '', // 分享描述
                            link: '', // 分享链接
                            imgUrl: '', // 分享图标
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        // 分享到QQ空间
                        wx.onMenuShareQZone({
                            title: '', // 分享标题
                            desc: '', // 分享描述
                            link: '', // 分享链接
                            imgUrl: '', // 分享图标
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                    switch (site) {
                        case 'weixin':
                            break;
                        case 'weixintimeline':
                            break;
                        case 'qq':
                            break;
                        case 'qzone':
                            break;
                        case 'weibo':
                            break;
                        default:
                            break;
                    }
                } else {
                    share.prototype.layerFun("请在微信中打开网站进行分享或使用浏览器自带分享功能进行分享！");
                }

            });
        })(),
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
                var _this = share,
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
                share.prototype.modalHelper.beforeClose();
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
                var _this = share,
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
            var _this = share;
            $(".empty-history").click(function(event) {
                localStorage.removeItem('historyArr');
                $(".history-ul").html("");
                $(".empty-history").hide();
                $(".no-history").show();
            });
        })(),
        // 搜索
        search: (function() {
            var _this = share;
            $(".search-btn").click(function() {
                var _this = share,
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
                share.prototype.modalHelper.afterOpen();
            });
        })(),
        // 发布关闭
        fabuClose: (function() {
            $(".close-fabu").click(function() {
                share.prototype.modalHelper.beforeClose();
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
        })(),
        // 动态的高度
        dynamicHeight: function() {
            var dynamicHeight = 0;
            $('.dynamic p').each(function(i, n) {
                dynamicHeight += $(n).outerHeight(true);
            });
            return dynamicHeight;
        },
        // 查看更多
        seeMore: (function() {
            var _this = share,
                fontSize = 20 * (document.documentElement.clientWidth / 320);
            // 判断.more的显示
            setTimeout(function() {
                if (_this.prototype.dynamicHeight() > 3 * fontSize) $(".dynamic-box .more").addClass("show").removeClass("hide");
            }, 10);

            $(".dynamic-box .more").click(function(event) {
                $(".dynamic").animate({
                    height: _this.prototype.dynamicHeight()
                }, 100);
                $(".main .close").addClass("show").removeClass("hide");
                $(".dynamic-box .more").addClass("hide").removeClass("show");
            });

            $(".main .close").click(function(event) {
                $(".dynamic").animate({
                    height: 3 * fontSize
                }, 100);
                $(".main .close").addClass("hide").removeClass("show");
                $(".dynamic-box .more").addClass("show").removeClass("hide");
            });
        })()
    };
});