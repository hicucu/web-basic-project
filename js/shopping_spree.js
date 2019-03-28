var _shoppingList = {};
var _shoppingListKey = "ShoppingList";
var _listCount = 0;

//최초 페이지 로드
$(document).ready(function () {
    setMinHeight();                                                                                                                                                                                                                                                                                                         
    loadShoppingList();

    $(document).on('click', '#uk-button-save', function (e) {

        buttonClickSave(e);
    });
    // 추가버튼 클릭했을 떄
    $('.uk-button').click(function() {
        $('#modal-container').find('.uk-modal-title.add').show();
        $('#modal-container').find('.uk-modal-title.edit').hide();
    })

    $('.uk-modal-close-default').click(function(){
        $(".uk-card-body").off();
        $(".uk-card-body").on("click", function (e) {
            var path = $(this)[0].children[4].innerText;
            window.open(path);
        });
        location.reload();
    });

    // $('#edit-card').off(); //기능꺼두고
    $(document).on("click", '.card-title-edit', function (e) { //수정하기를 클릭했을때
        $(this).parent().parent().remove();

        $(this).parent().parent().off(); //이친구의 부모에 부모꺼 오프

        var currentCard = $(this).parent().parent();
        
        
        $('#modal-container').find('.uk-modal-title.add').hide();
        $('#modal-container').find('.uk-modal-title.edit').show();
        UIkit.modal('#modal-container').show();

        $('#modal-container').find('#title').val($(currentCard).find('#card-title').text());
        $('#modal-container').find('#path').val($(currentCard).find('#card-path').text());
        $('#modal-container').find('#price').val($(currentCard).find('#card-main-price').text());
        $('#modal-container').find('#date').val($(currentCard).find('#card-main-date').text());
        $('#modal-container').find('#priority').val($(currentCard).find('#card-fill').text());
        $('#modal-container').find('#reason').val($(currentCard).find('#card-reason').text());



    });

    $('.card-title-comment').off(); //기능꺼두고
    $(document).on("click", '.card-title-comment', function (e) {
        $('#modal-reason').show();
        UIkit.modal('.uk-modal-dialog.uk-margin-auto-vertical').show();
        // $('#modal-container').find('#reason').val
        var key = $(this).attr("data-key");
        var data = localStorage.getItem("ShoppingList");
        data = JSON.parse(data);
        var obj = JSON.parse(data[key])
        $(".uk-modal-dialog.uk-margin-auto-vertical").text(obj.reason);
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

        addShoppingItme(shoppingItem, index);
    }

}

function addShoppingItme(shoppingItem, index) {
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
    else buttonHtml = '<h4 class="inline-block"><span class="uk-label-success sort-green">고민 중</span></h4>';



    var card =
        '<div class="shopping-card uk-card uk-card-default uk-card-body ">' +
        '<h3 class="uk-card-title" id="card-title">' + title + '</h3>' +
        '<div id="card-icon-group">' +
        '<span class="card-title-comment card-icon btns" data-key="' + index + '" uk-icon="comment">' +
        '</span>' +
        '<span class="card-title-edit card-icon btns" uk-icon="file-edit">' +
        '</span>' +
        '<span class="card-title-close card-icon btns" uk-icon="trash">' +
        '</span>' +
        '</div>' +
        '<span id="card-main-date" class="uk-badge">' + date + '</span>' +
        '<div id="card-mid" class="uk-grid-small" uk-grid>' +
        '<div id="card-fill" class="uk-width-expand" uk-leader="fill: -">' +
        buttonHtml +
        '</div>' +
        '<div id="card-main-price">' + price + '</div>' +
        '</div>' +
        '<div id="card-path" class="card-hide">' + path + '</div>' +
        '<div id="card-reason" class="card-hide">' + reason + '</div>' +
        '</div>';

    $('#card-list').prepend(card);

    $(".uk-card-body").off();
    $(".uk-card-body").on("click", function (e) {
        var path = $(this)[0].children[4].innerText;
        window.open(path);
    });
    $('.card-title-close').off();
    $('.card-title-close').on("click", function (e) {
        $(this).parent().parent().off();
        $(this).parent().parent().remove();
        saveShoppingList();
    });

    $('.card-title-edit').on("click", function (e) {
        $(".uk-card-body").off();    

        UIkit.modal("#modal-container").show();
        e.preventDefault();        
    });
}



function saveShoppingList() {
    var count;
    var _shoppingList = {};
    var cards = $('.shopping-card');
    var shoppingItem = {};
    _listCount = cards.length;
    for (var i = 0; i < cards.length; i++) {
        var shoppingItem = {};
        shoppingItem["title"] = $('.shopping-card')[i].children[id = "card-title"].innerText;
        shoppingItem["path"] = $('.shopping-card')[i].children[id = "card-path"].innerText;
        shoppingItem["price"] = $('.shopping-card')[i].children[id = "card-mid"].children[id = "card-main-price"].innerText;
        shoppingItem["date"] = $('.shopping-card')[i].children[id = "card-main-date"].innerText;
        shoppingItem["priority"] = $('.shopping-card')[i].children[id = "card-mid"].children[id = "card-fill"].innerText;
        shoppingItem["reason"] = $('.shopping-card')[i].children[id = "card-reason"].innerText;

        var stringify = JSON.stringify(shoppingItem);
        _shoppingList[i] = stringify;

    }

    var listStringify = JSON.stringify(_shoppingList);
    localStorage.setItem(_shoppingListKey, listStringify);


}
function resetModal() {
    $('#title').val("");
    $('#path').val("");
    $('#price').val("");
    $('#date').val("");
    $('#priority').val("우선순위를 선택하세요");
    $('#reason').val("");
}
function buttonClickSave(e) {
    var shoppingItem = {};

    if ($('#title').val() == "" || $('#path').val() == "") {                
        return;
    }
    var today=$('#date').val();
    if ( today == "") {
        var date = new Date();
        today =
            leadingZeros(date.getFullYear(), 4) + '-' +
            leadingZeros(date.getMonth() + 1, 2) + '-' +
            leadingZeros(date.getDate(), 2);
    }

    shoppingItem["title"] = $('#title').val(); 
        if($('#path').val().startsWith("http://")){
            shoppingItem["path"] = $('#path').val();
        } else{
            shoppingItem["path"] = "http://" + $('#path').val();
        }
        
    shoppingItem["price"] = $('#price').val();
    shoppingItem["date"] = today;
    shoppingItem["priority"] = $('#priority').val();
    shoppingItem["reason"] = $('#reason').val();

    resetModal();

    addShoppingItme(shoppingItem);
    saveShoppingList();
    UIkit.modal("#modal-container").hide();
}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
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
