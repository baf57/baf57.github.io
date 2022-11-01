$(document).ready(function(){
    if($(document).width() < 991){
        var main = w3_close();
    }
    else{
        var main = w3_open();
    }
    fix_back(true);
    if($(".card-list")[0]){
        calcMargins(main - 64);
    }
});

$(window).resize(function(){
    if($(document).width() < 991){
        w3_close(false);
    }
    else{
        w3_open(false);
    }
    fix_back();
    if($(".card-list")[0]){
        calcMargins();
    }
});

$(document).scroll(function(){
    scrollLock();
    fix_back();
});