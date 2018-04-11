(function () {
    var openid = "123456";
    var url = "http://interface.simihua.cn/prevent/api/v1/";
    var POSListDom = document.querySelector(".POSList");
    var QRListData = "openid=" + openid;
    ajax(url + "parent_user/get_qrcode_lists",QRListData,function (xhr) {
        var QRListDom = document.querySelector(".QRList");
        var res = JSON.parse(xhr.responseText);
        if (res.state){
            var data = res.message;
            console.log(data)
            var inner = "";
            if(data.length>0){
                data.forEach(function (item, index) {
                    inner += `<li>
                        <i class="iconfont icon-erweima"></i>
                            <div>
                                <p>姓名： ${item.name}</p>
                                <p>联系方式： ${item.phone}</p>
                            </div>
                            <i class="iconfont icon-shanchu" data-uid=${item.uid}></i>
                    </li >`;
                    console.log(item.uid)
                    ajax(url + "parent_user/get_tourist_lists", QRListData+"&uid="+item.uid, function (xhr) {
                        var res = JSON.parse(xhr.responseText);
                        
                        console.log(res);
                        if (res.state) {
                            var data = res.message;
                            var inner = `<li><h6>${item.name}</h6></li>`;
                            if (data.length > 0) {
                                data.forEach(function (item, index) {
                                    inner += `<li data-id=${item.id}>
                                        <p>联系方式： ${item.phone}</p>
                                        <p>发现位置： ${item.address}</p>
                                        <p>提交时间： ${item.create_time}</p>
                                    </li>`;
                                });
                            } else {
                                inner += "<li><div style='text-align: center;margin:0'>未提交记录</div></li>";
                            }


                            POSListDom.innerHTML += inner;
                            var POSList = document.querySelectorAll(".POSList li");
                            POSList.forEach(function (el) {
                                el.onclick = function () {
                                    window.location.href = "info.html?openid="+openid+"&id=" + this.dataset.id;
                                }
                            })
                        }
                    });
                });
            }else{
                inner ="<li><div style='text-align: center;margin:0'>未绑定</div></li>";
                POSListDom.innerHTML = "<li><div style='text-align: center;margin:0'>未提交记录</div></li>";
            }
            
           
            QRListDom.innerHTML = inner;
            var dels = document.querySelectorAll(".icon-shanchu");
            dels.forEach(function (el) {
                el.onclick = function () {
                    console.log("openid="+openid+"&uid=" + this.dataset.uid);
                    var THIS = this;
                    ajax(
                        url + "parent_user/remove",
                        "openid=" + openid+"&uid=" + this.dataset.uid,
                        function (xhr) {
                            console.log("删除成功");
                            THIS.parentNode.parentNode.removeChild(THIS.parentNode);
                            var dels = document.querySelectorAll(".icon-shanchu");                            
                            if (!dels.length){
                                QRListDom.innerHTML = "<li><div style='text-align: center;margin:0'>未绑定</div></li>";
                            }
                            window.location.reload();
                        }
                    )
                }
            })
        }
    });
    
    function ajax(url,data,fn) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onload = function () {
            fn(xhr)
        };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
})();