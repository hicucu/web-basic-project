var _shoppingList = {};
var _shoppingListKey = "ShoppingList";
var _listCount = 0;

//최초 페이지 로드
$(document).ready(function () {
    setMinHeight();
    loadShoppingList();
    
    $(document).on('click', '#uk-button-save', function (e) {
        
        buttonClickSave();
    });
});

//데이터 없을 경우 최소화면 사이즈 = 현재 웹브라우져의 세로크기-booter size
function setMinHeight() {
    document.getElementById("main").style.minHeight = window.innerHeight - 200 + 'px';
    window.onresize = function (event) {
        document.getElementById("main").style.minHeight = window.innerHeight - 200 + 'px';
    }
}

//로컬스토리지에 저장된 리스트 가져오기
function loadShoppingList() {
    var shoppingListStringify = localStorage.getItem(_shoppingListKey);
    shoppingListStringify = decodeURIComponent(shoppingListStringify);
    var _shoppingList = JSON.parse(shoppingListStringify);

    for (var index in _shoppingList) {        
        var shoppingItem = JSON.parse(_shoppingList[index]);

        addShoppingItme(shoppingItem);
    }

}

function addShoppingItme(shoppingItem) {
    var title = shoppingItem["title"];
    var path = shoppingItem["path"];
    var price = shoppingItem["price"];
    var date = shoppingItem["date"];
    var priority = shoppingItem["priority"];
    var reason = shoppingItem["reason"];

    var buttonHtml = "";
    if (priority == "사줘")
        buttonHtml = '<h4 class="inline-block"><span class="uk-label sort-blue">사줘</span></h4>';
    else if (priority == "시발비용")
        buttonHtml = '<h4 class="inline-block"><span class="uk-label-danger sort-red">시발비용</span></h4>';
    else if (priority == "꽁돈생기면")
        buttonHtml = '<h4 class="inline-block"><span class="uk-label-warning sort-yellow">꽁돈생기면</span></h4>';
    else buttonHtml='<h4 class="inline-block"><span class="uk-label-success sort-green">고민 중</span></h4>';



    var card =
        '<div class="shopping-card uk-card uk-card-default uk-card-body">' +
            '<h3 class="uk-card-title" id="card-title">'+title+'</h3>' +
            '<span class="card-title-close" uk-icon="close">'+
            '</span>'+
            '<span id="card-main-date" class="uk-badge">'+date+'</span>' +
            '<div class="uk-grid-small" uk-grid>' +
                '<div class="uk-width-expand" uk-leader="fill: -">' +
                    buttonHtml+
                '</div>' +
                '<div id="card-main-price">'+price+'</div>' +
            '</div>' +
            '<div id="card-hide">' +path+'</div>' +
            '<div id="card-hide">' +reason+'</div>' +
        '</div>';

    $('#card-list').append(card);

    $(".uk-card-body").off();
    $(".uk-card-body").on("click", function(e){        
        var path = $(this)[0].children[4].innerText;        
        window.open(path);
    });
    $('.card-title-close').off();
    $('.card-title-close').on("click", function(e){
        $(this).parent().off();        
        $(this).parent().remove();
        saveShoppingList();
    });

    
}

function saveShoppingList(){
    var count;
    var _shoppingList = {};
    var cards = $('.shopping-card');
    var shoppingItem = {};
    _listCount = cards.length;
    for(var i=0; i<cards.length; i++){
        var shoppingItem = {};
        shoppingItem["title"]=$('.shopping-card')[i].children[0].innerText;
        shoppingItem["path"]=$('.shopping-card')[i].children[4].innerText;
        shoppingItem["price"]=$('.shopping-card')[i].children[3].children[1].innerText;
        shoppingItem["date"]=$('.shopping-card')[i].children[2].innerText;
        shoppingItem["priority"]=$('.shopping-card')[i].children[3].children[0].innerText;
        shoppingItem["reason"]=$('.shopping-card')[i].children[5].innerText
        
        var stringify = JSON.stringify(shoppingItem);
        _shoppingList[i]=stringify;

    }    

    var listStringify = JSON.stringify(_shoppingList);
    localStorage.setItem(_shoppingListKey, listStringify);
    

}
function buttonClickSave(){
    var shoppingItem = {};
    shoppingItem["title"]=$('#title').val();
    shoppingItem["path"]=$('#path').val();
    shoppingItem["price"]=$('#price').val();
    shoppingItem["date"]=$('#date').val();
    shoppingItem["priority"]=$('#priority').val();
    shoppingItem["reason"]=$('#reason').val();

    $('#title').val("");
    $('#path').val("");
    $('#price').val("");
    $('#date').val("");
    $('#priority').val("우선순위를 선택하세요");
    $('#reason').val("");
    

    addShoppingItme(shoppingItem);
    saveShoppingList();
}

$('#filter-button-blue').click(function () { 

    $('.sort-blue').parent().parent().parent().parent().parent().show();
    $('.sort-red').parent().parent().parent().parent().parent().hide();
    $('.sort-yellow').parent().parent().parent().parent().parent().hide();
    $('.sort-green').parent().parent().parent().parent().parent().hide();


});
$('#filter-button-red').click(function () {
    $('.sort-blue').parent().parent().parent().parent().parent().hide();
    $('.sort-red').parent().parent().parent().parent().parent().show();
    $('.sort-yellow').parent().parent().parent().parent().parent().hide();
    $('.sort-green').parent().parent().parent().parent().parent().hide();


});

$('#filter-button-yellow').click(function () {
    $('.sort-blue').parent().parent().parent().parent().parent().hide();
    $('.sort-red').parent().parent().parent().parent().parent().hide();
    $('.sort-yellow').parent().parent().parent().parent().parent().show();
    $('.sort-green').parent().parent().parent().parent().parent().hide();

});
$('#filter-button-green').click(function () {

    $('.sort-blue').parent().parent().parent().parent().parent().hide();
    $('.sort-red').parent().parent().parent().parent().parent().hide();
    $('.sort-yellow').parent().parent().parent().parent().parent().hide();
    $('.sort-green').parent().parent().parent().parent().parent().show();


});
$('#card-header-title').click(function () { //전부보여주기 로고클릭해야함

    $('.sort-blue').parent().parent().parent().parent().parent().show();
    $('.sort-red').parent().parent().parent().parent().parent().show();
    $('.sort-yellow').parent().parent().parent().parent().parent().show();
    $('.sort-green').parent().parent().parent().parent().parent().show();
});
