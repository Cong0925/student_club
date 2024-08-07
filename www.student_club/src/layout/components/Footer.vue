<template>
    <div class="bottom">
        <div class="bottem_con">
            <div class="img"><img src="@/assets/images/logo_horizontal.png" alt="NCEPU"></div>
            <div class="bottom_center">
                Copyright © 2023 华北电力大学<br>
                地址:北京市昌平区德胜门外北农路2号 邮编:102206<br>
                Powered By:控制与计算机工程学院iDeal工作室
            </div>
            <div class="share">
                <ul>
                    <li><a href="#"></a></li>
                    <li><a href="#" style="background-position: -35px 0;"></a></li>
                    <li><a href="#" style="background-position: -70px 0;"></a></li>
                    <li><a href="#" style="background-position: 0 -35px;"></a></li>
                    <li><a href="#" style="background-position: -35px -35px;"></a></li>
                    <li><a href="#" style="background-position: -70px -35px;"></a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
.bottom{
    background-color: rgb(17, 101, 172); 
    width: 100%;
    height: 130px;
    color: rgb(255, 255, 255);
}
.bottem_con{
    position: relative;
    width: 1250px;
    height: 120px;
    margin: auto;
}
.img{
    position: absolute;
    width: 30%;
    height: 120px;
    padding-top: 10px;
    border-left: 1px solid rgba(255, 255, 255, .2);
    border-right: 1px solid rgba(255, 255, 255, .2);
    padding-left: 10%;
}
.bottom_center{
    position: absolute;
    width: 40%;
    height: 120px;
    font-size: 15px;
    line-height: 28px;
    text-align: center;
    left: 30%;
    padding-top: 20px;
    border-right: 1px solid rgba(255, 255, 255, .2);
}
.share{
    position: absolute;
    width: 25%;
    border-right: 1px solid rgba(255, 255, 255, .2);
    height: 120px;
    left: 75%;
}
.share ul{
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
    list-style: none;
}
.share li{
    float: left;
    width: 80px;
    height: 60px;
    text-align: center;
}
.share a{
    display: inline-block;
    float: none;
    width: 30px;
    height: 30px;
    background: #ffffff url(@/assets/images/share_icon.png) no-repeat;
    background-size:100px 135px;
    border-radius:20px;
    margin: 15px 0 0 0;
    padding: 0;
}
</style>