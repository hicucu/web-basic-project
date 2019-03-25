//최초 페이지 로드
$(document).ready(function(){
    setMinHeight();
});

//데이터 없을 경우 최소화면 사이즈 = 현재 웹브라우져의 세로크기-booter size
function setMinHeight(){
        document.getElementById("main").style.minHeight = window.innerHeight-200 + 'px';
        window.onresize = function (event) {
            document.getElementById("main").style.minHeight = window.innerHeight-200 + 'px';
        }
}