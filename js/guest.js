var position = [];
var openid = "123456";
var uid = "1989654";
var inputs = document.querySelectorAll("form input");
var map = new AMap.Map('map', {
    resizeEnable: true,
    zoom: 11
});
var wrap = document.querySelector(".wrap");
map.plugin('AMap.Geolocation', function () {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();

    // 移除高德LOGO与版权信息
    var copyright = document.querySelector(".amap-copyright");
    var amapLogo = document.querySelector(".amap-logo");   
    copyright.parentNode.removeChild(copyright);
    amapLogo.parentNode.removeChild(amapLogo);    

    AMap.event.addListener(geolocation, 'complete', function (result) {
        console.dir(result);
        position.push(result.position.lat);
        position.push(result.position.lng);    
        //引入SimpleMarker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
            //启动页面
            initPage(SimpleMarker);
        });
        var poInfo = inputs[1];
        poInfo.value = result.formattedAddress;
        function initPage(SimpleMarker) {

            //创建SimpleMarker实例
            new SimpleMarker({

                //前景文字
                iconLabel: '',

                //图标主题
                iconTheme: 'numv1',

                //背景图标样式
                iconStyle: 'red',

                //...其他Marker选项...，不包括content
                map: map,
                position: result.position
            });
        }
        inputs[2].addEventListener("click", function () {
            var mask = document.createElement("div");
            mask.className = "mask";
            mask.innerHTML = '<div><i class="fa fa-spinner fa-pulse fa-x fa-fw"></i></div>';
            wrap.appendChild(mask);
            console.log(position)
            if (inputs[0].value.trim() && inputs[1].value.trim()) {
                var ajax = new XMLHttpRequest();
                ajax.open("POST", "http://interface.simihua.cn/prevent/api/v1/tourist/create");
                var data = "uid="+uid
                    + "&openid="+openid
                    + "&position=" + JSON.stringify(position)
                    + "&address=" + inputs[1].value.trim()
                    + "&phone=" + inputs[0].value.trim();
                console.log(data)
                ajax.onload = function () {
                    var res = JSON.parse(ajax.responseText);
                    console.log(res);
                    if(res.state){
                        alert("已成功提交信息！")
                    }else{
                        alert(res.message)
                    }
                    mask.parentNode.removeChild(mask);
                };
                ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                ajax.send(data)
            }else{
                alert("请输入内容！")
            }
        })
        
    });//返回定位信息
    AMap.event.addListener(geolocation, 'error', function () {
        alert("定位失败，请刷新页面！");
    });      //返回定位出错信息
});