$(document).ready(function() {
    var team = team || {};
    team.prototype = {
        // 地图
        map: (function() {
            // 创建地图实例
            var map = new BMap.Map("map");
            // 获取经纬度
            var longitude = $("#map").attr("data-longitude"), // 经度
                latitude = $("#map").attr("data-latitude"); // 纬度
            // 创建点坐标
            var point = new BMap.Point(longitude, latitude);
            // 初始化地图，设置中心点坐标和地图级别
            map.centerAndZoom(point, 15);
        })()
    };
});