var wrap = document.querySelector(".wrap");
var inputs = document.querySelectorAll("form input");
var openid = "123456";
var uid = "1989654";
inputs[2].onclick = function () {
    if (inputs[0].value.trim() && inputs[1].value.trim()) {
        var mask = document.createElement("div");
        mask.className = "mask";
        mask.innerHTML = '<div><i class="iconfont icon-loading"></i></div>';
        wrap.appendChild(mask);
        var ajax = new XMLHttpRequest();
        ajax.open("POST", "http://interface.simihua.cn/prevent/api/v1/parent_user/create", true);
        var data = "uid=" + uid
            + "&openid=" + openid
            + "&phone=" + inputs[1].value.trim()
            + "&name=" + inputs[0].value.trim();
        console.log(data)
        ajax.onload = function () {
            var res = JSON.parse(ajax.responseText);
            console.log(res)
            if (!res.state) {
                alert(res.message);
                // inputs[0].value = "";
                // inputs[1].value = "";
            } else {
                var r = confirm("绑定成功，是否跳转到个人中心？")
                if (r == true) {
                    // window.location.href = "personal.html?openid=" + openid;
                    window.location.reload();
                } else {
                    console.log(11)
                }

            }
            mask.parentNode.removeChild(mask);
        };
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send(data)
    } else {
        alert("请输入内容！")
    }
}