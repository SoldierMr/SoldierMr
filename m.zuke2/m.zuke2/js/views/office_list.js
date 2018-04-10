$(document).ready(function() {
    var officeList = officeList || {};
    officeList.prototype = {
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
                window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
            });
        })(),
        // .criteria-item切换，筛选条件
        criteriaItemSwitch: (function() {
            var _this = officeList;
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
                var _this = officeList;
                _this.prototype.modalHelper.beforeClose();
                _this.prototype.clearItemActive();
            });
        })(),
        // .left-content li点击 (区域，地铁)
        leftContentLi: (function() {
            $(document).on('click', '.left-content ul li', function() {
                var _this = officeList,
                    that = $(this),
                    content = '',
                    thatParam = that.attr("data-param");

                switch (thatParam) {
                    // 区域
                    case 'district':
                        if (that.hasClass('unlimited')) {
                            window.location.href = "/office?district=" + encodeURIComponent(that.attr("data-district")) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
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
                                    that.parents(".left-content").siblings('.right-content').removeClass('hide').addClass('flex').html("");
                                    // 添加不限
                                    that.parents(".left-content").siblings('.right-content').children('ul').append("<li data-param=\"region\" data-region=\"\">不限</li>");
                                    // 清空content
                                    content = '';
                                    // 遍历添加县
                                    $.each(json, function(index, value) {
                                        // 将数据插入页面
                                        content += '<li data-param="region" data-region="' + value.area_id + '" data-type="area">' + value.area_name + '</li>';
                                    });
                                    that.parents(".left-content").siblings('.right-content').children('ul').append(content);
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
                            window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent(that.attr("data-line")) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
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
                                    that.parents(".left-content").siblings('.right-content').removeClass('hide').addClass('flex').html("");
                                    // 添加不限
                                    that.parents(".left-content").siblings('.right-content').children('ul').append('<li data-param="station" data-station="">不限</li>');
                                    // 清空content
                                    content = '';
                                    // 遍历添加地铁站台
                                    $.each(json, function(index, value) {
                                        // 将数据插入页面
                                        content = '<li data-param="station" data-station="' + value.station_id + '" data-type="metro">' + value.station_name + '</li>';
                                    });
                                    that.parents(".left-content").siblings('.right-content').children('ul').append(content);
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
                var _this = officeList,
                    that = $(this),
                    thatParam = that.attr("data-param");

                switch (thatParam) {
                    // 区域
                    case 'region':
                        window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent(that.attr("data-region")) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                        // 地铁站台
                    case 'station':
                        window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent(that.attr("data-station")) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 租金，面积，特色
        contentLi: (function() {
            $(document).on('click', '.criteria-pop > .content ul li', function() {
                var that = $(this),
                    thatcontent,
                    thatParam = that.attr("data-param");

                switch (thatParam) {
                    // 租金
                    case 'rent':
                        window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent(that.attr("data-rentstart")) + "&rentend=" + encodeURIComponent(that.attr("data-rentend")) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                        // 面积
                    case 'square':
                        window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent(that.attr("data-squarestart")) + "&squareend=" + encodeURIComponent(that.attr("data-squareend")) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                        // 特色
                    case 'characteristic':
                        window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent(that.attr("data-characteristic")) + "&search=" + encodeURIComponent($("#search").val());
                        break;
                    default:
                        break;
                }
            });
        })(),
        // 租金区间
        priceRange: (function() {
            var _this = officeList;
            $(".price-range-btn").click(function() {
                var rentstart = parseInt($(".price-range .rentstart").val()),
                    rentend = parseInt($(".price-range .rentend").val());

                if (!rentstart) {
                    _this.prototype.layerFun("请输入最低价格");
                    return false;
                }
                if (!rentend) {
                    _this.prototype.layerFun("请输入最高价格");
                    return false;
                }

                window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent(rentstart) + "&rentend=" + encodeURIComponent(rentend) + "&squarestart=" + encodeURIComponent($("#squarestart").val()) + "&squareend=" + encodeURIComponent($("#squareend").val()) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
            });
        })(),
        // 面积区间
        squareRange: (function() {
            var _this = officeList;
            $(".square-range-btn").click(function() {
                var squarestart = parseInt($(".square-range .squarestart").val()),
                    squareend = parseInt($(".square-range .squareend").val());

                if (!squarestart) {
                    _this.prototype.layerFun("请输入最小面积");
                    return false;
                }
                if (!squareend) {
                    _this.prototype.layerFun("请输入最大面积");
                    return false;
                }

                window.location.href = "/office?district=" + encodeURIComponent($("#district").val()) + "&region=" + encodeURIComponent($("#region").val()) + "&line=" + encodeURIComponent($("#line").val()) + "&station=" + encodeURIComponent($("#station").val()) + "&rentstart=" + encodeURIComponent($("#rentstart").val()) + "&rentend=" + encodeURIComponent($("#rentend").val()) + "&squarestart=" + encodeURIComponent(squarestart) + "&squareend=" + encodeURIComponent(squareend) + "&characteristic=" + encodeURIComponent($("#characteristic").val()) + "&search=" + encodeURIComponent($("#search").val());
            });
        })(),
        //检测滚动条是否滚动到页面底部
        isScrollToPageBottom: function() {
            var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight),
                viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0,
                scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
                fontSize = 20 * (document.documentElement.clientWidth / 320);
            return pageHeight - viewportHeight - scrollHeight < 1.5 * fontSize;
        },
        // 无限加载
        windowScroll: (function() {
            var _this = officeList,
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
                            url: "/office/item",
                            type: "GET",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
                                district: $("#district").val(),
                                region: $("#region").val(),
                                line: $("#line").val(), // 地铁线路
                                station: $("#station").val(), // 地铁站台
                                rentstart: $("#rentstart").val(),
                                rentend: $("#rentend").val(),
                                squarestart: $("#squarestart").val(), // 小面积
                                squareend: $("#squareend").val(),// 大面积
                                characteristic: $("#characteristic").val(), // 特色
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
            var type = '';
            type += data.room_square + 'm²/' + data.house_total_floor + '层';

            var characteristic = '';
            if (data.zufang_characteristic != '' && data.zufang_characteristic != null && data.zufang_characteristic != 'undefined') {
                var zufang_characteristic = eval('(' + data.zufang_characteristic + ')');
                $.each(zufang_characteristic, function(index, value) {
                    characteristic += '<span class="list-note list-note-type' + (index + 1) + '">' + value + '</span>';
                    if (index == 2) return false;
                });
            }

            return '<a href="/office/' + data.lease_id + '.html" class="list-item plr12">' +
                '<div class="list-img">' +
                '<img src="' + data.lease_image + '" alt="写字楼图片" />' +
                '</div>' +
                '<div class="list-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.lease_title + '</p>' +
                '<p class="clearfix"><span class="f12 c-999 left">' + type + '</span><span class="c-ff5555 f14 right">' + parseInt(data.fee_rent) + '元/m²/月</span></p>' +
                '<p class="flex"><i class="icon location-icon"></i><span class="f12 c-999">' + data.community_name + '</span></p>' +
                '<p class="list-notes">' + characteristic + '</p>' +
                '</div>' +
                '</a>';
        }
    };
});