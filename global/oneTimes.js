var emailChanged = false;
var lEmailChanged = false;

function showEmail(elem,diff=false){
    if(diff){
        if(!lEmailChanged) elem.parentNode.innerHTML+="<br><a rel='external' href='mailto:andrewbrayden98@gmail.com?subject=[Via%20Website]%20'>Email me!</a>"
        lEmailChanged = true;
    }
    else{
        if($(document).width() < 430){
            if(!emailChanged) elem.parentNode.innerHTML+="<br><a rel='external' href='mailto:andrewbrayden98@gmail.com?subject=[Via%20Website]%20'>Email me!</a>"
        }
        else{
            if(!emailChanged) elem.parentNode.innerHTML+=" <a rel='external' href='mailto:andrewbrayden98@gmail.com?subject=[Via%20Website]%20' style='white-space: nowrap'>andrewbrayden98@gmail.com</a>"
        }
        emailChanged = true;

    }
    fix_back();
}

function scrollLock(){
    let lockable = $('.lockable');
    let top = $(document).scrollTop();
    let main = $("#main");
    let toTop = $("#totop");
    let trigger = $('#header').offset().top + $('#header').height();
    let titleHeight = $('#title').height();

    main.addClass("no-trans");

    if(top >= trigger){
        main.offset({top:trigger + titleHeight});
        lockable.addClass('scrolling');
        toTop.css('display', 'inline');
    }
    else{
        main.offset({top:trigger});
        lockable.removeClass('scrolling');
        toTop.css('display', 'none');
    }

    main.removeClass("no-trans");
}

function w3_open(trans=true){
    let openWidth = 175;
    let main = $("#main");
    let bar = $("#bar");
    let title = $("#title");
    let open = $("#open");
    let closed = $("#closed");
    let content = $("#content");
    let right = Math.min(main.parent().width(), 1200);

    if(!trans){
        main.addClass('no-trans');
        content.addClass('no-trans');
        title.addClass('no-trans');
        bar.addClass('no-trans');
    }

    main.css('margin-left', openWidth);
    bar.css('width', openWidth);
    main.css('width', (right-openWidth));
    content.css('width', (right-openWidth));
    title.css('width', (right-openWidth));
    open.css('display', 'block');
    closed.css('display', 'none');

    if(!trans){
        main.removeClass('no-trans');
        content.removeClass('no-trans');
        title.removeClass('no-trans');
        bar.removeClass('no-trans');
    }

    return right - openWidth;
}

function w3_close(trans=false){
    let closedWidth = 47.5;
    let main = $("#main");
    let bar = $("#bar");
    let title = $("#title");
    let open = $("#open");
    let closed = $("#closed");
    let content = $("#content");
    let right = Math.min(main.parent().width(), 1200);

    if(!trans){
        main.addClass('no-trans');
        content.addClass('no-trans');
        title.addClass('no-trans');
        bar.addClass('no-trans');
    }

    main.css('margin-left', closedWidth);
    bar.css('width', closedWidth);
    main.css('width', (right-closedWidth));
    content.css('width', (right-closedWidth));
    title.css('width', (right-closedWidth));
    open.css('display', 'none');
    closed.css('display', 'block');

    if(!trans){
        main.removeClass('no-trans');
        content.removeClass('no-trans');
        title.removeClass('no-trans');
        bar.removeClass('no-trans');
    }

    return right - closedWidth;
}

function fix_back(anim=false){
    let name = document.getElementsByClassName("name")[0];
    let back = $('.back-bar');
    let namePos = name.getBoundingClientRect();
    let w = Math.min($(window).width(),1200);
    let backPos = {y:(namePos.y-5), w:w, h:(namePos.height+10)};

    back.addClass("no-trans");
    back.css('top', backPos.y);
    if(anim){
        back.removeClass("no-trans");
    }

    back.css('height', backPos.h);
    back.css('width', backPos.w);
}