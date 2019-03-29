var _shoppingList = {}; //전체 쇼핑카드 리스트
var _shoppingListKey = "ShoppingList"; //로컬스토리지 관리용 키
var _tempCard; //수정시 클릭한 카드 저장용

var _isEdit = false; // 수정 추가 구분 false : 추가 / true : 수정

//최초 페이지 로드
$(document).ready(function () {
    setMinHeight(); //화면 최저길이 설정
    loadShoppingList(); //저장된 데이터 가져오기

    
    //화면사이즈 변경시 화면 최저길이 재설정
    window.onresize = function (event) {
        setMinHeight();
    }

    //추가, 수정 모달에서 저장버튼 클릭시
    $(document).on('click', '#uk-button-save', function (e) {

        //저장버튼 클릭시 동작
        buttonClickSave(e);
    });

    // 추가버튼 클릭했을 떄
    $('.uk-button').click(function () {
        //추가 수정 모달에서 추가하기로 보여주기
        $('#modal-container').find('.uk-modal-title.add').show(); 
        $('#modal-container').find('.uk-modal-title.edit').hide(); 
    })

    //모달 창 닫기 클릭시
    $('.uk-modal-close-default').click(function () {
        $(".uk-card-body").off(); //카드에 걸린 이벤트 삭제, 아래 이벤트 추가시 중복 추가 될 수 있어 미리 삭제 후 재 등록

        //카드 클릭시 저장된 인터넷 주소창 띄우기 이벤트 추가
        $(".uk-card-body").on("click", function (e) {
            var path = $(this)[0].children[4].innerText;
            window.open(path);
        });
    });



    // $(document).on("click", '.card-title-comment', function (e) {
    //     $('#modal-reason').show();
    //     UIkit.modal('.uk-modal-dialog.uk-margin-auto-vertical').show();
    //     var key = $(this).attr("data-key");
    //     var data = localStorage.getItem("ShoppingList");
    //     data = JSON.parse(data);
    //     var obj = JSON.parse(data[key])
    //     $(".uk-modal-dialog.uk-margin-auto-vertical").text(obj.reason);
    // });



});

//데이터 없을 경우 최소화면 사이즈 = 현재 웹브라우져의 세로크기-booter size
function setMinHeight() {
    document.getElementById("main").style.minHeight = window.innerHeight - 200 + 'px';

}

//로컬스토리지에 저장된 리스트 가져오기
function loadShoppingList() {

    //로컬스토리지에서 데이터 가져오기 - 전체 카드리스트
    var shoppingListStringify = localStorage.getItem(_shoppingListKey);

    //한글 데이터값 복원
    shoppingListStringify = decodeURIComponent(shoppingListStringify);

    //데이터값 객체화
    var _shoppingList = JSON.parse(shoppingListStringify);

    //전체 카드리스트에서 각각의 카드 루프문으로 선택
    for (var index in _shoppingList) {
        //선택된 카드 객체화
        var shoppingItem = JSON.parse(_shoppingList[index]);

        //객체화 된 카드 화면에 등록
        addShoppingItme(shoppingItem, index);
    }

}

//객체화 된 카드 화면에 등록
function addShoppingItme(shoppingItem, index) {

    //객체에서 각 데이터 준비
    var title = shoppingItem["title"];
    var path = shoppingItem["path"];
    var price = shoppingItem["price"];
    var date = shoppingItem["date"];
    var priority = shoppingItem["priority"];
    var reason = shoppingItem["reason"];

    //카드에 버튼은 라벨로 표시하기 위하여 데이터 값에 따라 라벨 HTML 만들기
    var buttonHtml = "";
    if (priority == "사줘")
        buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-blue sort-blue">사줘</span></h4>';
    else if (priority == "시발비용")
        buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-danger sort-red">시발비용</span></h4>';
    else if (priority == "꽁돈생기면")
        buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-warning sort-yellow">꽁돈생기면</span></h4>';
    else buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-success sort-green">고민 중</span></h4>';


    //카드 만들기
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

    //카드 리스트에 만든 카드 넣기
    $('#card-list').prepend(card);

    //이벤트는 요소가 생긴 이후에 추가되어야 동작, 동적으로 요소를 발생시키는 경우 요소 추가 후 이벤트를 다시 걸어야함
    //추가되는 요소 이외 동일 class에 같은 이벤트 추가 방지를 위하여 모든 요소에 이벤트 삭제 후 모든 요소에 이벤트를 다시 연결

    //카드 클릭시 연결된 주소로 새창 띄우는 이벤트 추가를 위하여 기존 이벤트 삭제 후 다시 추가
    $(".uk-card-body").off();
    $(".uk-card-body").on("click", function (e) {
        var path = $(this)[0].children[4].innerText;
        window.open(path);
    });

    //카드 삭제 클릭시 카드 삭제이벤트를 추가 하기 위하여 동일 이벤트 삭제 후 추가
    $('.card-title-close').off();
    $('.card-title-close').on("click", function (e) {

        //삭제버튼 부모의 부모에 걸린 카드 클릭시 저장된 주소로 새창 띄우기 이벤트 삭제
        $(this).parent().parent().off();
        
        //삭제버튼 부모의 부모 = 카드 삭제
        $(this).parent().parent().remove();

        //카드 삭제로 변경된 카드리스트 저장
        saveShoppingList();
    });

    //카드 수정하기 버튼 클릭시 수정이벤트 추가를 위해 기존 이벤트 삭제 후 추가
    $('.card-title-edit').off();
    $('.card-title-edit').on("click", function (e) {
        $(this).parent().parent().off(); //이친구의 부모에 부모꺼 오프

        var currentCard = $(this).parent().parent(); //수정시 현재 선택된 카드를 변수에 저장
        _tempCard = currentCard[0]; //해당 카드를 전역으로 저장


        //모달에서 수정하기 표시를 위하여 추가하기 숨김, 수장하기 표시
        $('#modal-container').find('.uk-modal-title.add').hide();
        $('#modal-container').find('.uk-modal-title.edit').show();

        //모달에 현재 선택된 카드의 값을 불러옴
        $('#modal-container').find('#title').val($(currentCard).find('#card-title').text());
        $('#modal-container').find('#path').val($(currentCard).find('#card-path').text());
        $('#modal-container').find('#price').val($(currentCard).find('#card-main-price').text());
        $('#modal-container').find('#date').val($(currentCard).find('#card-main-date').text());
        $('#modal-container').find('#priority').val($(currentCard).find('#card-fill').text());
        $('#modal-container').find('#reason').val($(currentCard).find('#card-reason').text());

        //수정하기
        _isEdit = true;

        //모달창 표시
        UIkit.modal("#modal-container").show();
        e.preventDefault();
    });

    //이유 표시
    //이유를 저장된 데이터에서 불러오는데 이미 카드에 숨김처리된 상태로 가지고 있음 수정필요
    $('.card-title-comment').on("click", function (e) {
        $(".uk-card-body").off();

        UIkit.modal('.uk-modal-dialog.uk-modal-body.uk-margin-auto-vertical').show();
        var key = $(this).attr("data-key");
        var data = localStorage.getItem("ShoppingList");
        data = JSON.parse(data);
        var obj = JSON.parse(data[key])
        $(".uk-modal-dialog.uk-modal-body.uk-margin-auto-vertical p").text(obj.reason);
    });

}

//카드리스트 저장
function saveShoppingList() {
    var _shoppingList = {}; //전체 카드리스트 객체
    var cards = $('.shopping-card'); // 카드리스트
    var shoppingItem = {}; //각 카드의 객체
    var listCount = cards.length-1; //카드의 전체 수
    for (var i = 0; i < cards.length; i++) {
        shoppingItem = {}; //카드객체 초기화 및 저장
        shoppingItem["title"] = $('.shopping-card')[i].children[id = "card-title"].innerText;
        shoppingItem["path"] = $('.shopping-card')[i].children[id = "card-path"].innerText;
        shoppingItem["price"] = $('.shopping-card')[i].children[id = "card-mid"].children[id = "card-main-price"].innerText;
        shoppingItem["date"] = $('.shopping-card')[i].children[id = "card-main-date"].innerText;
        shoppingItem["priority"] = $('.shopping-card')[i].children[id = "card-mid"].children[id = "card-fill"].innerText;
        shoppingItem["reason"] = $('.shopping-card')[i].children[id = "card-reason"].innerText;

        //카드객체의 문자열화
        var stringify = JSON.stringify(shoppingItem);

        //문자열된 카드객체를 카드리스트 객체에 저장
        //prepend로 추가하기 때문에 역순으로 저장
        _shoppingList[listCount-i] = stringify;

    }

    //전체 카드리스트 객체의 문자열화
    var listStringify = JSON.stringify(_shoppingList);

    //문자열화 된 카드리스트 로컬스토리지에 저장
    localStorage.setItem(_shoppingListKey, listStringify);

//모달 input창 초기화
}
function resetModal() {
    $('#title').val("");
    $('#path').val("");
    $('#price').val("");
    $('#date').val("");
    $('#priority').val("우선순위를 선택하세요");
    $('#reason').val("");
}

//모달에서 저장버튼 클릭시
function buttonClickSave(e) {


    var shoppingItem = {}; //카드객체

    //validation
    if ($('#title').val() == "" || $('#path').val() == "") {
        return;
    }

    //달이 한자리인 1~9월은 앞에 0을 붙임
    var today = $('#date').val();
    if (today == "") {
        var date = new Date();
        today =
            leadingZeros(date.getFullYear(), 4) + '-' +
            leadingZeros(date.getMonth() + 1, 2) + '-' +
            leadingZeros(date.getDate(), 2);
    }

    //주소가 http://로 시작하지 않는 경우 주소 앞에 http://붙여주기
    shoppingItem["title"] = $('#title').val();
    if ($('#path').val().startsWith("http://")) {
        shoppingItem["path"] = $('#path').val();
    } else {
        shoppingItem["path"] = "http://" + $('#path').val();
    }

    shoppingItem["price"] = $('#price').val();
    shoppingItem["date"] = today;
    shoppingItem["priority"] = $('#priority').val();
    shoppingItem["reason"] = $('#reason').val();

    //모달 input 초기화
    resetModal();
    
    //수정하기인경우
    if (_isEdit) {

        //카드에서 우선수위 태그 생성
        _tempCard.children[id = "card-mid"].children[id = "card-fill"].children[0].children[0].innerText;
        var buttonHtml = "";
        if (shoppingItem["priority"] == "사줘")
            buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-blue sort-blue">사줘</span></h4>';
        else if (shoppingItem["priority"]  == "시발비용")
            buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-danger sort-red">시발비용</span></h4>';
        else if (shoppingItem["priority"]  == "꽁돈생기면")
            buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-warning sort-yellow">꽁돈생기면</span></h4>';
        else buttonHtml = '<h4 class="inline-block"><span class="uk-label uk-label-success sort-green">고민 중</span></h4>';

        //수정하려는 카드에 값을 수정된 값으로 변경
        _tempCard.children[id = "card-title"].innerText = shoppingItem["title"];
        _tempCard.children[id = "card-path"].innerText = shoppingItem["path"];
        _tempCard.children[id = "card-mid"].children[id = "card-main-price"].innerText = shoppingItem["price"];
        _tempCard.children[id = "card-main-date"].innerText = shoppingItem["date"];
        _tempCard.children[id = "card-mid"].children[id = "card-fill"].children[0].innerHTML = buttonHtml;
        _tempCard.children[id = "card-reason"].innerText = shoppingItem["reason"];

        //수정된 카드리스트 저장
        saveShoppingList();

        //모달 닫기
        UIkit.modal("#modal-container").hide();

        //모달 input 초기화
        resetModal();

        //추가하기 모드로 변경, 수정버튼 클릭시 다시 변경됨
        _isEdit = false;

        //저장종료
        return;
    }

    //추가하기인 경우
    else {
        //카드 생성
        addShoppingItme(shoppingItem);

        //카드리스트 저장
        saveShoppingList();

        //모달 닫기
        UIkit.modal("#modal-container").hide();
    }
}

//달이 한자리인 1~9월은 앞에 0을 붙임
function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

//필터링
$(".uk-label-border").click(function () {

    //전체 카드 숨김
    $(".shopping-card .uk-label").parent().parent().parent().parent().parent().hide();

    //현재 선택된 카드의 ID와 동일한 class를 같는 우선순위의 카드는 표시
    $("."+$(this).attr("id")).parent().parent().parent().parent().parent().show();

});

//타이틀 클릭시 전체 카드 보여줌
$('#card-header-title').click(function () { 

    $('.sort-blue').parent().parent().parent().parent().parent().show();
    $('.sort-red').parent().parent().parent().parent().parent().show();
    $('.sort-yellow').parent().parent().parent().parent().parent().show();
    $('.sort-green').parent().parent().parent().parent().parent().show();
});
