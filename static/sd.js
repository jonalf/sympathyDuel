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

	rc.setAttribute("src", "/static/images/cards/" + 
			candle[RED][candle[RED].length-1] +".png");
	rc.setAttribute("class", "card");
	rc.setAttribute("onclick", "convert(\"" + 
			candle[RED][candle[RED].length-1] + "\")");

	bc.setAttribute("src","/static/images/cards/" + 
			candle[BLACK][candle[BLACK].length-1]+".png");
	bc.setAttribute("class", "card");
	bc.setAttribute("onclick", "convert(\"" + 
			candle[BLACK][candle[BLACK].length-1] + "\")");	
	
	$("#redcandle").append(rc);
	$("#redcandle").append("<br><br>");

	$("#blackcandle").append(bc);
	$("#blackcandle").append("<br><br>");

	redRanks.push( getRank(candle[RED][candle[RED].length-1]) );
	blackRanks.push( getRank(candle[BLACK][candle[BLACK].length-1]));
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
    else
	$("#bdeck").addClass("selected2");
}


function dealCard( player ) {

    var chills = false;

    if ( turn == player && canDraw ) {

	var nc = document.createElement("img");

	nc.setAttribute("class", cardClass);

	if ( player == RED )		    
	    var m = $("#redmind")
	else
	    var m = $("#blackmind");

	if ( m.text() == "Binder's Chills" )
	    m.html("");
	
	if ( deck[player].length == 0 )
	    reDeal( player );

	var newCard = deck[player].pop();

	for ( var i=0; i < mind[player].length; i++ )
	    if ( mind[player][i][0] == newCard[0] ) {
		chills = true;
		switchTurns(player);
		break;
	    }
		
	mind[player].push(newCard);
	if (chills)
	    discardAll( player );
	else {
	    nc.setAttribute("src", "/static/images/cards/" + newCard + ".png");
	    nc.setAttribute("onclick", "selectCard(\"" + 
			    newCard + "\")");
	    m.append(nc);
		
	    if ( mind[player].length == 6 || mind[player].length == 8 )
		resizeMind( player );
	}
    }
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

function endGame() {
    if ( turn == RED ) {
	if ( !heartSuccess() ) {
	    $("#blackcandle").empty();
	    $("#blackmind").html("<br><br><h1>Red Wins!</h1>");
	    turn = 3;
	}
	else {
	    turn = BLACK;
	    stone = true;
	    $("#bend").addClass("selected3");
	    console.log("heart of stone");
	}
    }
    else if ( turn == BLACK ) {
	if ( !heartSuccess() ) {
	    $("#redcandle").empty();
	    $("#redmind").html("<br><br><h1>Black Wins!</h1>");
	    turn = 3;
	}
	else {
	    turn = RED;
	    stone = true;
	    $("#rend").addClass("selected3");
	    console.log("heart of stone");
	}
    }
}

function endTurn( player ) {
    if ( player == turn ) {

	if ( stone && !(isGameOver(RED) || isGameOver(BLACK)) ) {
	    console.log("finito " + isGameOver() );
	    stone = false;
	    switchTurns( player );
	}
	else if ( !stone && !discarding ) {
	    $(".selected").removeClass("selected");
	    $(".selected2").removeClass("selected2");
	    if ( turn == RED )
		$("#rend").addClass("selected3");
	    else if (turn == BLACK)
		$("#bend").addClass("selected3");

	    discarding = true;
	}
	else if ( !stone ) {
	    switchTurns( player );
	}
    }
}	

function switchTurns( player ) {

    selected = null;
    cardClass = "card";
    canDraw = true;
    discarding = false;
    console.log(discarding);
    $(".selected").removeClass("selected");    
    $(".selected2").removeClass("selected2");    
    $(".selected3").removeClass("selected3");    
    turn = (turn + 1) % 2;
    if ( turn == RED )
	$("#rdeck").addClass("selected2");
    else if ( turn == BLACK )
	$("#bdeck").addClass("selected2");
}
	
function selectCard( card ) {
    
    if ( getColor(card) == turn ) {
	if ( discarding ) {
	    $("img[src='/static/images/cards/" + card + ".png']").remove();
	    mind[turn].splice( mind[turn].indexOf(card), 1 );
	    discard[turn].push(card);
	}
	else {
	    $(".selected").removeClass("selected");
	    selected = card;
	    $("img[src='/static/images/cards/" + card + ".png']").addClass("selected");
	}
    }
}

function convert( card ) {

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
	    var c = $("img[src='/static/images/cards/" + card + ".png']");
	    c.attr("src", "/static/images/cards/" + selected + ".png");
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

function heartSuccess() {
    
    if ( turn == RED ) {
	for (var m=0; m < mind[BLACK].length; m++)
	    for (var c=0; c < candle[BLACK].length; c++)
		if ( canConvert( mind[BLACK][m], candle[BLACK][c]) ) 
		    return true;
	return false;
    }
    else if ( turn == BLACK ) {
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
	nc.setAttribute("src", "/static/images/cards/"+mind[player][i]+".png");
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
