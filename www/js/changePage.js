window.changePage = changePage;

function changePage(page){
    $('[data-role][data-role="page"]').removeClass('show');
    $(page).addClass('show');
}