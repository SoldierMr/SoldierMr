$(document).ready(function() {
    var houseList = houseList || {};
    houseList.prototype = {
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
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 推荐房源
        recommendHouse: (function() {
            var fontSize = 20 * (document.documentElement.clientWidth / 320),
                recommendHouse = new Swiper('.recommend-house', {
                    slidesPerView: 1.825,
                    spaceBetween: 0.6 * fontSize, // slide之间的距离
                    slidesOffsetBefore: 0.6 * fontSize, // 设定slide与左边框的预设偏移量
                    slidesOffsetAfter: 0.6 * fontSize, // 设定slide与右边框的预设偏移量
                    freeMode: true,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper 
                    observeParents: true //修改swiper的父元素时，自动初始化swiper 
                });
        })(),
        // 弹出搜索框
        searchPop: (function() {
            $(".list-search-icon").click(function() {
                $(".search-fixed").removeClass('hide').addClass('flex');
            });
        })(),
        // 隐藏搜索框
        searchHide: (function() {
            $(".search-hide").click(function() {
                $(".search-fixed").removeClass('flex').addClass('hide');
            });
        })(),
        // 搜素
        search: (function() {
            $(".search-btn").click(function() {
                window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
            });
        })(),
        // .criteria-item切换，筛选条件
        criteriaItemSwitch: (function() {
            var _this = houseList;
            $(document).on('click', '.criteria-item', function() {
                var that = $(this);
                if (that.attr("data-active") == "0") {
                    _this.prototype.clearItemActive();
                    that.find("span").addClass('active');
                    that.find("i").css({
                        backgroundImage: 'url(images/shangla-icon.png)'
                    });
                    $(".criteria-box .criteria-pop[name='" + that.attr("name") + "']").removeClass('hide').addClass('flex');
                    $(".mask-box").show();
                    that.attr("data-active", "1");
                    _this.prototype.modalHelper.afterOpen();
                } else {
                    _this.prototype.modalHelper.beforeClose();
                    that.find("span").removeClass('active');
                    that.find("i").removeAttr('style');
                    $(".criteria-box .criteria-pop[name='" + that.attr("name") + "']").addClass('hide').removeClass('flex');
                    $(".mask-box").hide();
                    that.attr("data-active", "0");
                }
            });
        })(),
        // 清除.criteria-pop .criteria-item状态
        clearItemActive: function() {
            $(".criteria-item").find("span").removeClass('active');
            $(".criteria-item").find("i").removeAttr('style');
            $(".criteria-box .criteria-pop").addClass('hide').removeClass('flex');
            $(".mask-box").hide();
            $(".criteria-item").attr("data-active", "0");
        },
        // tabs切换
        criteriaTabsSwitch: (function() {
            $(document).on('click', '.criteria-pop .tabs ul li', function() {
                var that = $(this),
                    thatParent = that.parents(".criteria-pop");
                thatParent.find(".tabs ul li").removeClass('active');
                that.addClass('active');

                thatParent.find(".tab-content").addClass('hide').removeClass('flex');
                thatParent.find(".tab-content[name='" + that.attr("name") + "']").removeClass('hide').addClass('flex');
            });
        })(),
        // 点击遮罩隐藏
        maskClick: (function() {
            $(".mask-box").click(function() {
                var _this = houseList;
                _this.prototype.modalHelper.beforeClose();
                _this.prototype.clearItemActive();
            });
        })(),
        // .left-content li点击 (区域，地铁)
        leftContentLi: (function() {
            $(document).on('click', '.left-content ul li', function() {
                var _this = houseList,
                    that = $(this),
                    content = '',
                    thatParam = that.attr("data-param");

                switch (thatParam) {
                    // 区域
                    case 'district':
                        if (that.hasClass('unlimited')) {
                            window.location.href = "/qiuzu/fang?district=" + encodeURIComponent(that.attr("data-district")) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
                        } else {
                            $.ajax({
                                url: "/place/region",
                                type: "POST",
                                dataType: "json",
                                data: { // 这里写要传过去的参数
                                    district: $("#district").val()
                                },
                                success: function(json) {
                                    // 将district的值放入隐藏域
                                    $("#district").val(that.attr("data-district"));
                                    // 清除所有active样式
                                    $(".left-content ul li").removeClass('active');
                                    // 给当前元素加active
                                    that.addClass('active');
                                    // 显示对应的右边区域
                                    that.parents(".left-content").siblings('.right-content').removeClass('hide').addClass('flex').children("ul").html("");
                                    // 添加不限
                                    that.parents(".left-content").siblings('.right-content').children("ul").append("<li data-param=\"region\" data-region=\"\">不限</li>");
                                    // 清空content
                                    content = '';
                                    // 遍历添加县
                                    $.each(json, function(index, value) {
                                        // 将数据插入页面
                                        content += '<li data-param="region" data-region="' + value.area_id + '" data-type="area">' + value.area_name + '</li>';
                                    });
                                    that.parents(".left-content").siblings('.right-content').children("ul").append(content);
                                },
                                error: function() {
                                    _this.prototype.layerFun("加载失败");
                                }
                            });
                        }
                        break;
                        // 地铁线路
                    case 'line':
                        if (that.hasClass('unlimited')) {
                            window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent(that.attr("data-line")) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
                        } else {
                            $.ajax({
                                url: "/metro/",
                                type: "POST",
                                dataType: "json",
                                data: { // 这里写要传过去的参数
                                    metro: $("#metro").val()
                                },
                                success: function(json) {
                                    // 将line的值放入隐藏域
                                    $("#line").val(that.attr("data-line"));
                                    // 清除所有active样式
                                    $(".left-content ul li").removeClass('active');
                                    // 给当前元素加active
                                    that.addClass('active');
                                    // 显示对应的右边区域并清空
                                    that.parents(".left-content").siblings('.right-content').removeClass('hide').addClass('flex').children("ul").html("");
                                    // 添加不限
                                    that.parents(".left-content").siblings('.right-content').children("ul").append('<li data-param="station" data-station="">不限</li>');
                                    // 清空content
                                    content = '';
                                    // 遍历添加地铁站台
                                    $.each(json, function(index, value) {
                                        // 将数据插入页面
                                        content = '<li data-param="station" data-station="' + value.station_id + '" data-type="metro">' + value.station_name + '</li>';
                                    });
                                    that.parents(".left-content").siblings('.right-content').children("ul").append(content);
                                },
                                error: function() {
                                    _this.prototype.layerFun("加载失败");
                                }
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        })(),
        // .right-content li点击
        rightContentLi: (function() {
            $(document).on('click', '.right-content ul li', function() {
                var _this = houseList,
                    that = $(this),
                    thatParam = that.attr("data-param");

                switch (thatParam) {
                    // 区域
                    case 'region':
                        window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent(that.attr("data-region")) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent(that.attr("data-station")) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                        // 地铁站台
                    case 'station':
                        window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent(that.attr("data-station")) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 租金，户型
        contentLi: (function() {
            $(document).on('click', '.criteria-pop > .content ul li', function() {
                var that = $(this),
                    thatcontent,
                    thatParam = that.attr("data-param");

                switch (thatParam) {
                    // 租金
                    case 'rent':
                        window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent(that.attr("data-rent")) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                        // 户型
                    case 'bedroom':
                        window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent(that.attr("data-bedroom")) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 价格区间
        priceRange: (function() {
            var _this = houseList;
            $(".price-range-btn").click(function() {
                var rent = parseInt($(".price-range .rent").val());

                if (!rent) {
                    _this.prototype.layerFun("请输入价格");
                    return false;
                }

                window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent(rent) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
            });
        })(),
        // 更多 - 选择单个
        resetMore: (function() {
            $(document).on('click', '.more-notes .more-note', function() {
                var that = $(this),
                    thatParent = that.parents(".more-notes"),
                    thatParam = that.attr("data-param"),
                    thatVal = that.html();

                thatParent.find('.more-note').removeClass('active');
                that.addClass('active');

                switch (thatParam) {
                    // 特色
                    case 'characteristic':
                        $("#characteristic").val(thatVal);
                        break;
                        // 装修
                    case 'decoration':
                        $("#decoration").val(thatVal);
                        break;
                        // 朝向
                    case 'orientation':
                        $("#orientation").val(thatVal);
                        break;
                        // 楼层
                    case 'floor':
                        $("#floor").val(thatVal);
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 更多 - 重置
        resetMore: (function() {
            $(".reset-btn").click(function() {
                $(".more-notes .more-note").removeClass('active');
                // 清空特色、装修、朝向、楼层
                $("#characteristic").val("");
                $("#decoration").val("");
                $("#orientation").val("");
                $("#floor").val("");
            });
        })(),
        // 更多 - 确定
        resetMore: (function() {
            $(".confirm-btn").click(function() {
                window.location.href = "/qiuzu/fang?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&bedroom=" + encodeURIComponent($("#bedroom").val()) + "&rent=" + encodeURIComponent($("#rent").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&decoration=" + encodeURIComponent($("#decoration").val()) + "&orientation=" + encodeURIComponent($("#orientation").val()) + "&floor=" + encodeURIComponent($("#floor").val()) + "&search=" + encodeURIComponent($("#search").val());
            });
        })(),
        //检测滚动条是否滚动到页面底部
        isScrollToPageBottom: function() {
            var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var fontSize = 20 * (document.documentElement.clientWidth / 320);
            return pageHeight - viewportHeight - scrollHeight < 1.5 * fontSize;
        },
        // 无限加载
        windowScroll: (function() {
            var _this = houseList,
                page = 1,
                stop = true, //触发开关，防止多次调用事件
                content = '';
            $(window).on("scroll", function() {
                //当内容滚动到底部时加载新的内容 当距离最底部1.5rem时开始加载
                if (_this.prototype.isScrollToPageBottom()) {
                    if (stop == true) {
                        stop = false;
                        // 显示加载动画
                        $(".loading-box").addClass('loading-icon');
                        // 页码+1
                        page = parseInt(page) + 1;
                        $.ajax({
                            url: "/qiuzu/fang/item",
                            type: "GET",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: $("#district").val(),
                                region: $("#region").val(),
                                line: $("#line").val(), // 地铁线路
                                station: $("#station").val(), // 地铁站台
                                bedroom: $("#bedroom").val(),
                                rent: $("#rent").val(),
                                characteristic: $("#characteristic").val(), // 特色
                                decoration: $("#decoration").val(), // 装修
                                orientation: $("#orientation").val(), // 朝向
                                floor: $("#floor").val(), // 楼层
                                search: $("#search").val(),
                                page: page
                            },
                            success: function(json) {
                                // 加载成功后隐藏加载动画
                                $(".loading-box").removeClass('loading-icon');
                                content = '';
                                // 遍历数据
                                $.each(json, function(index, value) {
                                    content += _this.prototype.getTemplate(value);
                                });
                                // 将数据插入加载动画前面
                                $(".list-box > .loading-box").before(content);
                                stop = true; // 重置触发开关
                            },
                            error: function() {
                                _this.prototype.layerFun("加载失败，请刷新页面");
                            }
                        });
                    }
                }
            })
        })(),
        // 获取list item
        getTemplate: function(data) {
            return '<a href="/qiuzu/' + data.qiuzu_id + '.html" class="list-item plr12">' +
                '<div class="list-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.qiuzu_title + ' ' + data.region_name + '</p>' +
                '<p class="flex align-items-center">' +
                '<span class="flex">' +
                '<i class="icon location-icon"></i>' +
                '<span class="f12 c-999">期望区域：' + data.district_name + '</span>' +
                '</span>' +
                '<span class="c-ff5555 f14 flex-right">' + data.rent_start + ' - ' + data.rent_end + '元/月</span>' +
                '</p>' +
                '<p class="flex">' +
                '<i class="icon qiuzu-type-icon"></i>' +
                '<span class="f12 c-999">住宅求租：' + data.fang_bedroom + ' | ' + data.square_start + ' - ' + data.square_end + 'm²</span>' +
                '</p>' +
                '</div>' +
                '</a>';
        }
    };
});