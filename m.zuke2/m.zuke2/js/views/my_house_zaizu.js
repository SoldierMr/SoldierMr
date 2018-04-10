$(document).ready(function() {
    var house = house || {};
    house.prototype = {
        // 封装提示
        layerFun: function(text) {
            layer.open({
                content: text,
                skin: 'msg',
                time: 2
            });
        },
        // 下架
        xiajaHouse: (function() {
            var _this = house,
                that,
                houseId,
                stop = true;
            $(document).on('click', '.xiaja-house', function(e) {
                e.preventDefault();
                that = $(this);
                houseId = that.parents(".my-box").attr("data-id");
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "",
                        type: "GET",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            id: houseId
                        },
                        success: function(json) {
                            that.parents(".my-box").remove();
                            _this.prototype.layerFun("已下架");
                            stop = true; // 重置触发开关
                        },
                        error: function() {
                            _this.prototype.layerFun("下架失败，请刷新页面");
                        }
                    });
                }
            });
        })(),
        // 删除
        deleteHouse: (function() {
            var _this = house,
                that,
                houseId,
                stop = true;
            $(document).on('click', '.delete-house', function(e) {
                e.preventDefault();
                that = $(this);
                houseId = that.parents(".my-box").attr("data-id");
                if (stop) {
                    stop = false;
                    $.ajax({
                        url: "",
                        type: "GET",
                        dataType: "json",
                        data: { // 这里写要传过去的参数
                            id: houseId
                        },
                        success: function(json) {
                            that.parents(".my-box").remove();
                            _this.prototype.layerFun("已删除");
                            stop = true; // 重置触发开关
                        },
                        error: function() {
                            _this.prototype.layerFun("删除失败，请刷新页面");
                        }
                    });
                }
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
            var _this = house,
                page = 1,
                stop = true, //触发开关，防止多次调用事件
                content = '';
            $(window).on("scroll", function() {
                //当内容滚动到底部时加载新的内容 当距离最底部1.5rem时开始加载
                if (_this.prototype.isScrollToPageBottom()) {
                    if (stop) {
                        stop = false;
                        // 显示加载动画
                        $(".loading-box").addClass('loading-icon');
                        // 页码+1
                        page = parseInt(page) + 1;
                        $.ajax({
                            url: "",
                            type: "GET",
                            dataType: "json",
                            data: { // 这里写要传过去的参数
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
                                // 图片懒加载
                                $("img[src][data-src]").scrollLoading();
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
            return '<div class="my-box" data-id="1">' +
                '<a href="/fang/' + data.lease_id + '.html" class="list-item plr12">' +
                '<div class="list-img">' +
                '<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3720393058,1997690162&fm=27&gp=0.jpg" alt="房源图片" />' +
                '</div>' +
                '<div class="list-info flex-equal">' +
                '<p class="f14 c-333 oneEllipsis">' + data.lease_title + '</p>' +
                '<p class="f12 c-999">' + data.room_square + 'm²/' + data.bedroom_num + '室' + data.livingroom_num + '厅</p>' +
                '<p class="flex"><i class="icon location-icon"></i><span class="f12 c-999">翠海花园</span></p>' +
                '<p class="c-ff5555 f14 right">' + parseInt(data.fee_rent) + '/月</p>' +
                '</div>' +
                '</a>' +
                '<div class="btns flex">' +
                '<div class="flex flex-right">' +
                '<a href="release_house.html">编辑</a> <a class="xiajia-house">下架</a> <a class="delete-house">删除</a>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    };
});