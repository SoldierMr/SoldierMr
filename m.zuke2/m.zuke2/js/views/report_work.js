$(document).ready(function() {
    var team = team || {};
    team.prototype = {
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
        // img-item Template
        getImgItemTemplate: function(imgSrc) {
            return '<div class="img-item">' +
                '<img src="' + imgSrc + '" />' +
                '<span class="icon close-icon"></span>' +
                '</div>';
        },
        // 图片第一张上传，big-upload
        bigUpload: (function() {
            var _this = team;
            $(document).on('change', '.big-upload input', function(e) {
                _this.prototype.imgUpload(this);
            });
        })(),
        // add-upload
        addUpload: (function() {
            var _this = team;
            $(document).on('change', '.add-upload .add-img input', function(e) {
                _this.prototype.imgUpload(this);
            });
        })(),
        // 上传图片
        imgUpload: function(obj) {
            var _this = team,
                that,
                content = '',
                file,
                reader;
            that = $(obj);
            file = obj.files[0];
            if (!/image\/\w+/.test(file.type)) {
                team.prototype.layerFun("请上传图片！");
                return false;
            }
            reader = new FileReader();
            //将文件以Data URL形式读入页面
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        "imgdata": e.target.result
                    },
                    success: function(data) {
                        content = '';
                        imgItemSum = $(".img-item").length;
                        // 判断img-item的数量，如果为0，则为第一张
                        if (imgItemSum == 0) {
                            // 隐藏.big-upload，并显示.add-upload
                            $(".big-upload").hide();
                            $(".add-upload").show();
                        }
                        content = _this.prototype.getImgItemTemplate(data.src);
                        // 添加裁剪好的图片
                        $(".add-upload .add-img").before(content);
                        // 最多上传5张
                        if (imgItemSum == 4) {
                            $(".add-upload .add-img").hide();
                        }

                        // 清空file的value，解决连续上传同一张图片时无法选择的问题
                        $("input[type='file'").val("");
                    },
                    error: function() {
                        _this.prototype.layerFun("上传失败，请刷新页面");
                    }
                });
            }
        },
        // 删除单张照片
        delectImgItem: (function() {
            var _this = team,
                that,
                thatParent,
                imgItemSum;
            $(document).on('click', '.add-upload .img-item .close-icon', function() {
                that = $(this),
                    thatParent = that.parent();
                imgItemSum = $(".img-item").length;
                // 如果.big-upload是隐藏的
                if ($(".add-upload .add-img").is(":hidden")) {
                    // 如果为5张，则删掉一张后，显示.add-img
                    if (imgItemSum == 5) {
                        thatParent.remove();
                        $(".add-upload .add-img").show();
                    }
                } else {
                    // 如果删除唯一一张，则显示.big-upload，隐藏.add-upload
                    if (imgItemSum == 1) {
                        $(".big-upload").show();
                        $(".add-upload").hide();
                    }
                    thatParent.remove();
                }

                // 如果此张图片为主图，则将第一张设为主图
                if (thatParent.hasClass('active')) {
                    if (imgItemSum == 1) return false;
                    $(".add-upload .img-item:first").addClass('active');
                    $(".add-upload .img-item:first .set-mainImg").html('主图');
                }
            });
        })(),
        // 地图
        map: (function() {
            var map = new BMap.Map("map");
            var point = new BMap.Point(116.331398, 39.897445);
            map.centerAndZoom(point, 12);

            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    console.log('经度纬度：' + r.point.lng + ',' + r.point.lat);
                    $("#longitude").val(r.point.lng);
                    $("#latitude").val(r.point.lat);

                    var gc = new BMap.Geocoder();
                    point = new BMap.Point(r.point.lng, r.point.lat);
                    gc.getLocation(point, function(rs) {
                        var addComp = rs.addressComponents;
                        $(".map-addr").html(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
                        console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    });
                } else {
                    console.log('failed' + this.getStatus());
                }
            });
        })(),
        // 提交
        teamSub: (function() {
            var _this = team,
                imgArr = [],
                customerName,
                customerPhone,
                longitude,
                latitude;
            $(".submit").click(function() {
                // 获取图片
                imgArr = [];
                $(".add-upload .img-item").each(function(index, el) {
                    imgArr.push($(el).children('img').attr("src"));
                });
                // 判断是否上传图片
                if (!imgArr.length) {
                    _this.prototype.layerFun("请上传房源图片！");
                    return false;
                }

                // 客户姓名
                customerName = $(".customer-name").val();
                if (!customerName) {
                    _this.prototype.layerFun("请填写客户姓名！");
                    return false;
                }

                // 客户电话
                customerPhone = $(".customer-phone").val();
                if (!customerPhone) {
                    _this.prototype.layerFun("请填写客户电话！");
                    return false;
                }

                longitude = $("#longitude").val();
                latitude = $("#latitude").val();

                console.log(imgArr, customerName, customerPhone);

                $.ajax({
                    url: "",
                    type: "POST",
                    dataType: "json",
                    data: { // 这里写要传过去的参数
                        imgArr: imgArr,
                        customerName: customerName,
                        customerPhone: customerPhone,
                        longitude: longitude, //经度
                        latitude: latitude // 纬度
                    },
                    success: function(data) {
                        window.location.href = '';
                    },
                    error: function() {
                        _this.prototype.layerFun("提交失败，请刷新页面");
                    }
                });
            });
        })()
    };
});