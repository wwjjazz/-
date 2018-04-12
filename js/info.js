let position = {};
var data = window.location.search.substr(1);
var xhr = new XMLHttpRequest();
xhr.open("POST","http://interface.simihua.cn/prevent/api/v1/parent_user/get_tourist_detail",true);
xhr.onload = function(){
    let data = JSON.parse(xhr.responseText);
    if(data.state){
        var PO = JSON.parse(data.message.position);
        position = { P: PO[0], O: PO[1], lng: PO[1], lat: PO[0]};
        var map = new AMap.Map('map', {
            resizeEnable: true
            // zoom: 11
        });
        // map.panTo(position)
        map.setZoomAndCenter(17, position);
        let copyright = document.querySelector(".amap-copyright");
        let amapLogo = document.querySelector(".amap-logo");
        copyright.parentNode.removeChild(copyright);
        amapLogo.parentNode.removeChild(amapLogo);
        AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
            //启动页面
            initPage(SimpleMarker);
        });

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
                position: position
            });
        }
        var ps = document.querySelectorAll(".info p");
        ps[0].innerHTML = "联系方式："+data.message.phone;
        ps[1].innerHTML = "发现位置："+data.message.address;
        ps[2].innerHTML = "提交时间："+data.message.create_time;
    }
    console.log(data)
}
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send(data);