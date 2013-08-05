var RED = 0;
var BLACK = 1;

var cards = "23456789tjqka";
var suits = "schd";
var shuffPasses = 26;

var turn = BLACK;
var cardClass = "card";

var redDeck = new Array();
var blackDeck = new Array();
var redMind = new Array();
var blackMind = new Array();
var redDiscard = new Array();
var blackDiscard = new Array();

function setDecks() {
    
    var sa = suits.split("");
    var ca = cards.split("");

    for (var i=0; i < sa.length; i++) {
	for (var j=0; j < ca.length; j++){
	
	    if (sa[i] == "s" || sa[i] == "c")
		blackDeck.push( ca[j] + sa[i] );
	    else
		redDeck.push( ca[j] + sa[i] );
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
    shuffle(redDeck);
    shuffle(blackDeck);
    
    //set up black candle
    for (var i=0; i < 4; i++) {
	var c = document.createElement("img");
	var cs = blackDeck.pop();
	c.setAttribute("src", "images/cards/" + cs + ".png");
	c.setAttribute("class", "card");
	c.setAttribute("onclick", "console.log(\"" + cs + "\")");
    
	$("#blackcandle").append(c);
	$("#blackcandle").append("<br><br>");
    }

    //set up red candle
    for (var i=0; i < 4; i++) {
	var c = document.createElement("img");
	c.setAttribute("src", "images/cards/" + redDeck.pop() + ".png");
	c.setAttribute("class", "card");
    
	$("#redcandle").append(c);
	$("#redcandle").append("<br><br>");
    }
}

function playCard( player ) {

    var chills = false;

    if ( turn == player ) {

	var nc = document.createElement("img");

	nc.setAttribute("class", cardClass);
	
	if ( player == RED ) {
		    
	    var m = $("#redmind")
	    if ( m.text() == "Binder's Chills" )
		m.html("");

	    if ( redDeck.length == 0 )
		reDeal( player );

	    var newCard = redDeck.pop();

	    for ( var i=0; i < redMind.length; i++ )
		if ( redMind[i][0] == newCard[0] ) {
		    chills = true;
		    turn = BLACK;
		    cardClass = "card";
		    break;
		}
		
	    redMind.push(newCard);
	    if (chills)
		discard( player );
	    else {
		nc.setAttribute("src", "images/cards/" + newCard + ".png");		
		m.append(nc);
		
		if ( redMind.length == 6 || redMind.length == 8 )
		    resizeMind( player );
	    }
	} //end red player

	else {
		    
	    var m = $("#blackmind")
	    if ( m.text() == "Binder's Chills" )
		m.html("");

	    if ( blackDeck.length == 0 )
		reDeal( player );

	    var newCard = blackDeck.pop();

	    for ( var i=0; i < blackMind.length; i++ )
		if ( blackMind[i][0] == newCard[0] ) {
		    chills = true;
		    turn = RED;
		    cardClass = "card";
		    break;
		}
		
	    blackMind.push(newCard);
	    if (chills)
		discard( player );
	    else {
		nc.setAttribute("src", "images/cards/" + newCard + ".png");		
		m.append(nc);
		
		if ( blackMind.length == 6 || blackMind.length == 8 )
		    resizeMind( player );
	    }
	} //end black player
    }
}

function resizeMind( player ) {
    console.log("resizing");

    if ( player == RED ) {
	
	if ( redMind.length == 6 )
	    cardClass = "card2";
	else if ( redMind.length == 8 )
	    cardClass = "card3";
	
	var mind = $("#redmind");
	mind.html("<br>");
	
	for (var i=0; i < redMind.length; i++) {
	    var nc = document.createElement("img");
	    nc.setAttribute("class", cardClass);
	    nc.setAttribute("src", "images/cards/" + redMind[i] + ".png");
	    mind.append(nc);
	}
    } //end red player
    else {
	
	if ( blackMind.length == 6 )
	    cardClass = "card2";
	else if ( blackMind.length == 8 )
	    cardClass = "card3";
	
	var mind = $("#blackmind");
	mind.html("<br>");
	
	for (var i=0; i < blackMind.length; i++) {
	    var nc = document.createElement("img");
	    nc.setAttribute("class", cardClass);
	    nc.setAttribute("src", "images/cards/" + blackMind[i] + ".png");
	    mind.append(nc);
	}
    }
}
    

function discard( player ) {
    if ( player == RED ) {
	while ( redMind.length != 0 )
	    redDiscard.push( redMind.pop() );
	$("#redmind").html("<br><br><h1>Binder's Chills</h1>");
    }
    else {
	while ( blackMind.length != 0 )
	    blackDiscard.push( blackMind.pop() );
	$("#blackmind").html("<br><br><h1>Binder's Chills</h1>");
    }
}
    
function reDeal( player ) {

    if ( player == RED ) {
	while ( redDiscard.length != 0 ) 
	    redDeck.push( redDiscard.pop() );
	shuffle( redDeck );
    }
    else {
	while ( blackDiscard.length != 0 ) 
	    blackDeck.push( blackDiscard.pop() );
	shuffle( blackDeck );
    }
}

function printDecks() {

    console.log("Deck: " + redDeck);
    console.log("Mind: " + redMind);
    console.log("Disc: " + redDiscard);
}
