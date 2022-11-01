function calcMargins(listWidth=0){
    var cardWidth = 0;
    if(listWidth == 0){
        listWidth = $( ".card-list" ).width();
        cardWidth = $( ".card" ).width();
    } else {
        if(listWidth >= 460){
            cardWidth = 220;
        } else if(listWidth > 220) {
            lMargin = ~~((listWidth - 220) / 2);
            $( ".card" ).css("margin-left",lMargin+'px');
            return;
        } else {
            return;
        }
    }

    let cardsPerRow = ~~(listWidth/(cardWidth + 20)); //integer division
    let margin = ~~((listWidth - ((cardsPerRow) * cardWidth))/(cardsPerRow - 1));
    $( ".card" ).each(function(i,el){
        if(i % (cardsPerRow) == (cardsPerRow - 1)){
            $( el ).css("margin-right",'0px');
        } else {
            $( el ).css("margin-right",margin+'px');
        }
    });
}