var RED = 0;
var BLACK = 1;

var cards = "23456789tjqka";
var suits = "schd";
var shuffPasses = 50;

var turn = RED;
var selected;
var cardClass = "card";
var canDraw = true;
var discarding = false;
var stone = false;

var deck = new Array(2)
deck[RED] = new Array();
deck[BLACK] = new Array();

var mind = new Array(2);
mind[RED] = new Array();
mind[BLACK] = new Array();

var discard = new Array(2);
discard[RED] = new Array();
discard[BLACK] = new Array();

var candle = new Array(2);
candle[RED] = new Array();
candle[BLACK] = new Array();

function setDecks() {
    
    var sa = suits.split("");
    var ca = cards.split("");

    for (var i=0; i < sa.length; i++) {
	for (var j=0; j < ca.length; j++){
	
	    if (sa[i] == "s" || sa[i] == "c")
		deck[BLACK].push( ca[j] + sa[i] );
	    else
		deck[RED].push( ca[j] + sa[i] );
	}
    }
}

function shuffle( deck ) {

    for (var i=0; i < shuffPasses; i++) {
	var r1 = Math.floor( Math.random() * deck.length );
	var r2 = Math.floor( Math.random() * deck.length );
	
	var t = deck[r1];
	deck[r1] = deck[r2];
	deck[r2] = t;
    }
}

function init() {
    
    setDecks();
    shuffle( deck[RED] );
    shuffle( deck[BLACK] );
    var redRanks = new Array();
    var blackRanks = new Array();
    
    for (var i=0; i < 4; i++) {

	var rc = document.createElement("img");
	var bc = document.createElement("img");
	
	candle[RED].push( deck[RED].pop() );
	candle[BLACK].push( deck[BLACK].pop() );

	rc.setAttribute("src", "static/images/cards/" + 
			candle[RED][candle[RED].length-1] +".png");
	rc.setAttribute("class", "card");
	rc.setAttribute("onclick", "convert(\"" + 
			candle[RED][candle[RED].length-1] + "\")");

	bc.setAttribute("src","static/images/cards/" + 
			candle[BLACK][candle[BLACK].length-1]+".png");
	bc.setAttribute("class", "card");
	bc.setAttribute("onclick", "convert(\"" + 
			candle[BLACK][candle[BLACK].length-1] + "\")");	
	
	$("#redcandle").append(rc);
	$("#redcandle").append("<br><br>");

	$("#blackcandle").append(bc);
	$("#blackcandle").append("<br><br>");

	redRanks.push(getRank(candle[RED][candle[RED].length-1]) );
	blackRanks.push(getRank(candle[BLACK][candle[BLACK].length-1]));
    }

    //find out starting player
    var redBest = Math.max.apply(Math, redRanks);
    var blackBest = Math.max.apply(Math, blackRanks);

    if ( redBest == blackBest )
	turn = Math.floor( Math.random() * 2);
    else if ( redBest > blackBest )
	turn = RED;
    else
	turn = BLACK;

    if ( turn == RED )	
	$("#rdeck").addClass("selected2");
    else {
	$("#bdeck").addClass("selected2");
	AITurn();
    }
}

function dealCard( player ) {
    if ( turn == player && canDraw ) {

	if ( player == RED )		    
	    var m = $("#redmind")
	else
	    var m = $("#blackmind");

	if ( m.text() == "Binder's Chills" )
	    m.html("");
	
	if ( deck[player].length == 0 )
	    reDeal( player );

	var newCard = deck[player].pop();

	if (isChilled( player, newCard )) {
	    mind[player].push( newCard );
	    chilled( player );
	}
	else {
	    mind[player].push(newCard);
	    dealCard2( player, newCard, m );
	}
    }
}


function isChilled( player, newCard ) {
    for ( var i=0; i < mind[player].length; i++ )
	if ( mind[player][i][0] == newCard[0] )
	    return true;
    return false;
}

function chilled( player ) {
    discardAll( player );
    switchTurns();
}

function AITurn() {
    console.log("AITurn");

    var maxMind = 4;
    var m = $("#blackmind")

    if ( m.text() == "Binder's Chills" )
	m.html("");
 
    //deal some cards, switch turns if chilled
    for (var i=0; i<maxMind; i++) {
	if ( deck[BLACK].length == 0 )
	    reDeal( BLACK );

	var newCard = deck[BLACK].pop();    

	if ( isChilled( BLACK, newCard ) ) {
	    mind[BLACK].push(newCard);
	    chilled( BLACK );
	    return;
	}
	mind[BLACK].push(newCard);
	dealCard2( BLACK, newCard, m );
    }

    //attempt to convert red candle    
    var mindCards = new Array();
    var candleCards = new Array();
    for (var i=0; i < mind[BLACK].length; i++) {
	for (var j=0; j < candle[RED].length; j++) {

	    if ( mindCards.indexOf(mind[BLACK][i]) == -1 &&
		 candleCards.indexOf(candle[RED][j]) == -1  &&
		 canConvert( mind[BLACK][i], candle[RED][j]) ) {
		     
		mindCards.push(mind[BLACK][i]);
		candleCards.push(candle[RED][j]);
	    }
	}
    }
    AIConvert( mindCards, candleCards );

    //defend black candle
    mindCards = new Array();
    candleCards = new Array();
    for (var i=0; i < mind[BLACK].length; i++) {
	for (var j=0; j < candle[BLACK].length; j++) {

	    if ( mindCards.indexOf(mind[BLACK][i]) == -1 &&
		 candleCards.indexOf(candle[BLACK][j]) == -1  &&
		 canConvert( mind[BLACK][i], candle[BLACK][j]) ) {
		     
		mindCards.push(mind[BLACK][i]);
		candleCards.push(candle[BLACK][j]);
	    }
	}
    }
    AIConvert( mindCards, candleCards );

    if ( isGameOver(BLACK) ) {
	if ( heartSuccess( RED ) )
	    stoneF( RED );
	else
	    endGame(BLACK);    
    }
    else
	switchTurns();
}

function AIStone() {

    console.log("AI Stone");
    console.log(mind[BLACK] );
    console.log(candle[BLACK]);

    var mindCards = new Array();
    var candleCards = new Array();
    for (var i=0; i < mind[BLACK].length; i++) {
	for (var j=0; j < candle[BLACK].length; j++) {

	    if ( mindCards.indexOf(mind[BLACK][i]) == -1 &&
		 candleCards.indexOf(candle[BLACK][j]) == -1  &&
		 canConvert( mind[BLACK][i], candle[BLACK][j]) ) {
		     
		mindCards.push(mind[BLACK][i]);
		candleCards.push(candle[BLACK][j]);
	    }
	}
    }
    console.log(mindCards);
    console.log(candleCards);
    AIConvert( mindCards, candleCards );
    turn = BLACK;
    switchTurns();
}

function AIConvert( mindCards, candleCards) {
    for (var i=0; i < mindCards.length; i++)
	convert2( BLACK, mindCards[i], candleCards[i] );
}

function convert( card ) {
    convert2( turn, selected, card );
}

function convert2( player, mindCard, candleCard ) {

    if ( canConvert( mindCard, candleCard ) ) {
	var candleColor = getColor(candleCard);
	//update candle, mind and discard arrays
	mind[player].splice( mind[player].indexOf( mindCard ), 1 );
	discard[candleColor].push(candleCard);
	
	var i = candle[RED].indexOf( candleCard );
	if ( i == -1 ) {
	    i = candle[BLACK].indexOf( candleCard );
	    candle[BLACK][i] = mindCard;
	}
	else
	    candle[RED][i] = mindCard;
	
	//change view
	$("img[src='static/images/cards/" + mindCard + ".png']").remove();
	var c = $("img[src='static/images/cards/" + candleCard + ".png']");
	c.attr("src", "static/images/cards/" + mindCard + ".png");
	c.attr("onclick", "convert(\"" + mindCard + "\")");
	selected = null;

	canDraw = false;
	$(".selected2").removeClass("selected2");
    }
}

function endTurn( player ) {

    if ( player == turn ) {

	if ( !discarding ) {
	    discarding = true;
	    $(".selected").removeClass("selected");
	    $(".selected2").removeClass("selected2");
	    if ( player == RED )
		$("#rend").addClass("selected3");
	    else if ( player == BLACK)
		$("#bend").addClass("selected3");
	}

	else if ( isGameOver(player) && heartSuccess( (player+1)%2 )) {
	    console.log("cond1");
	    stoneF( (player+1) % 2 );
	}
	else if ( isGameOver(player) ) {
	    console.log("cond2");
	    endGame( player );
	}
	else {
	    console.log("cond3");
	    switchTurns();
	}
    }
}

function endGame( player ) {

    if ( player == RED ) {
	$("#blackcandle").empty();
	$("#blackmind").html("<br><br><h1>Red Wins!</h1>");
	turn = 3;
    }
    else if (player == BLACK) {
	$("#redcandle").empty();
	$("#redmind").html("<br><br><h1>Black Wins!</h1>");
	turn = 3;
    }
}

function stoneF( player ) {
    if ( player == RED ) {
	console.log("red stone");
	switchTurns();
	canDraw = false;
	$(".selected2").removeClass("selected2");
	$("#rend").addClass("selected3");
    }
    else if ( player == BLACK )
	AIStone();
//	$("#bend").addClass("selected3");
}

function dealCard2( player, newCard, mindDiv ) {
    var nc = document.createElement("img");
    nc.setAttribute("class", cardClass);

    nc.setAttribute("src", "static/images/cards/" + newCard + ".png");
    nc.setAttribute("onclick", "selectCard(\"" + 
		    newCard + "\")");
    mindDiv.append(nc);
    
    if ( mind[player].length == 6 || mind[player].length == 8 )
	resizeMind( player );
}

function discardOne( player, card ) {
    $("img[src='static/images/cards/" + card + ".png']").remove();
    mind[player].splice( mind[player].indexOf(card), 1 );
    discard[player].push(card);
}

function pickCard( card ) {
    $(".selected").removeClass("selected");
    selected = card;
    $("img[src='static/images/cards/" + card + ".png']").addClass("selected");
}

function isGameOver( player ) {
    
    var count = 0;
    if ( player == RED ) {
	for (var i=0; i<candle[BLACK].length; i++)
	    if ( getColor( candle[BLACK][i] ) == BLACK )
		count++;
    }
    else {
	for (var i=0; i<candle[RED].length; i++)
	    if ( getColor( candle[RED][i] ) == RED )
		count++;
    }
    return count == 0
}

function switchTurns() {

    selected = null;
    cardClass = "card";
    canDraw = true;
    discarding = false;

    $(".selected").removeClass("selected");    
    $(".selected2").removeClass("selected2");    
    $(".selected3").removeClass("selected3");    
    turn = (turn + 1) % 2;
    
    console.log("switching to: " + turn);

    if ( turn == RED )
	$("#rdeck").addClass("selected2");
    else if ( turn == BLACK )
	AITurn();
//	$("#bdeck").addClass("selected2");
}
	
function selectCard( card ) {
    if ( getColor(card) == turn ) {
	if ( discarding )
	    discardOne( turn, card );
	else
	    pickCard( card );
    }
}

function convert_OLD( card ) {

    if ( selected != null ) {
	
	var candleRank = getRank(card);
	var candleColor = getColor(card);
	var mindRank = getRank(selected);
	var mindColor = getColor(selected);
		
	if ( (Math.abs( candleRank - mindRank ) == 1 ||
	      Math.abs( candleRank - mindRank ) == 12) && 
	     candleColor != turn ) {
	    
	    //update candle, mind and discard arrays
	    mind[turn].splice( mind[turn].indexOf( selected ), 1 );
	    discard[candleColor].push(card);
	    var i = candle[RED].indexOf( card );
	    if ( i == -1 ) {
		i = candle[BLACK].indexOf( card );
		candle[BLACK][i] = selected;
	    }
	    else
		candle[RED][i] = selected;

	    //change view
	    var c = $("img[src='static/images/cards/" + card + ".png']");
	    c.attr("src", "static/images/cards/" + selected + ".png");
	    c.attr("onclick", "convert(\"" + selected + "\")");
	    $(".selected").remove();
	    selected = null;

	    if ( isGameOver(turn) ) {
		console.log( "game over" );
		endGame();
	    }
	    canDraw = false;
	    $(".selected2").removeClass("selected2");
	}
    }
}

function heartSuccess( player ) {
    
    if ( player == BLACK ) {
	for (var m=0; m < mind[BLACK].length; m++)
	    for (var c=0; c < candle[BLACK].length; c++)
		if ( canConvert( mind[BLACK][m], candle[BLACK][c]) ) 
		    return true;
	return false;
    }
    else if ( player == RED ) {
	for (var m=0; m < mind[RED].length; m++)
	    for (var c=0; c < candle[RED].length; c++)
		if ( canConvert( mind[RED][m], candle[RED][c]) ) 
		    return true;
	return false;
    } 
}

function canConvert( card1, card2 ) {
    var c1Color = getColor( card1 );
    var c1Rank = getRank(card1);
    var c2Color = getColor( card2 );
    var c2Rank = getRank(card2);
    
    return ( (Math.abs( c1Rank - c2Rank ) == 1 ||
	      Math.abs( c1Rank - c2Rank ) == 12) && 
	     c1Color != c2Color );
}

function getColor( card ) {
    var c = card[1];
    if ( c == "h" || c == "d" )
	return RED;
    else
	return BLACK;
}

function getRank( card ) {
    
    var c = card[0];
    if ( c == "a" )
	return 14;
    else if ( c == "k" )
	return 13;
    else if ( c == "q" )
	return 12;
    else if ( c == "j" )
	return 11;
    else if ( c == "t" )
	return 10;
    else
	return parseInt( c );
}

function resizeMind( player ) {

    if ( mind[player].length == 6 )
	cardClass = "card2";
    else if ( mind[player].length == 8 )
	cardClass = "card3";

    if ( player == RED )
	var m = $("#redmind");
    else
	var m = $("#blackmind");
    m.html("<br>");
	
    for (var i=0; i < mind[player].length; i++) {
	var nc = document.createElement("img");
	nc.setAttribute("class", cardClass);
	nc.setAttribute("src", "static/images/cards/"+mind[player][i]+".png");
	nc.setAttribute("onclick", "selectCard(\""
			+mind[player][i]+"\")");
	m.append(nc);
    }
} 

function discardAll( player ) {
    if ( player == RED )
	var m = $("#redmind");
    else
	var m = $("#blackmind");
    
    while ( mind[player].length != 0 )
	discard[player].push( mind[player].pop() );

    m.html("<br><br><h1>Binder's Chills</h1>");
}
    
function reDeal( player ) {

    while ( discard[player].length != 0 ) 
	deck[player].push( discard[player].pop() );
    shuffle( deck[player] );
}

function printDecks() {

    console.log("Red Cand: " + candle[RED]);
    console.log("Red Deck: " + deck[RED]);
    console.log("Red Mind: " + mind[RED]);
    console.log("Red Disc: " + discard[RED]);

    console.log("Black Cand: " + candle[BLACK]);
    console.log("Black Deck: " + deck[BLACK]);
    console.log("Black Mind: " + mind[BLACK]);
    console.log("Black Disc: " + discard[BLACK]);
}

function pause( milis ) {
    d = new Date();
    start = d.getTime();
    do {
	d = new Date();
    }
    while ( d.getTime() < start + milis);
}

function test() {
    console.log("start");
    pause(1000);
    console.log("end");
}
