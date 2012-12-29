var play;
var interval;
var followers = 0;   
var miss = 0;
var FPS = 16;
var WIDTH = 960;
var HEIGHT = 650;
var tweetWidth = 420;
var	intervalId;
var tweetShooterQueue = [];
var shooterTweets = [];
var currentKeyword = "election2012";
var currentQueueIndex = 0;


function initShooter(keyword){
	fetchSearchFeed(keyword);
//	fetchMySQLFeed()
	startShooter();
	levelTimer(25);
	//démarer le jeu
}

function loop(){
	intervalId = requestAnimationFrame(function(){
		updateShooterTweets();
		loop();
	} )	
}

function updateShooterTweets (){
	for (var i = 0; i < shooterTweets.length; i++){
		var tweet = shooterTweets[i];
		var top = tweet.css('top');
		var topNb = parseInt(top.slice(0, -2));
		topNb += 2 ;
		if (topNb > HEIGHT){
			tweet.remove();
			shooterTweets.splice(i, 1);
		}
		tweet.css('top', (topNb)+"px");
	}
}

function startShooter() {
	interval = setInterval(createShootDiv, 2000);
	loop();
};

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function createShootDiv() {
	var speed = 10000;
	var tweet = tweetShooterQueue.pop();
	var tweetText = tweet[0];
	var user = tweet[2];
	var left = randomFromTo(0, WIDTH-tweetWidth);
	
	$tweet = $("<div />");
	$tweet.addClass("tweet shooter");
	$tweet.html('<div class="shooterUser">@'+user+'</div><div class=tweetText>'+tweetText+'</div>');
	$tweet.css({
	left:left+"px",
	top:"-50px"	
		});
	shooterTweets.push($tweet);
	$('#gameZone').append($tweet);

	$tweet.click(function(){
		addFollowers(10);
		$(this).fadeOut(600, function(){
			$(this).remove();
			});
	});
}

function fetchSearchFeed(keyword){
	//https://dl.dropbox.com/u/30128236/jsonfeed.txt
	$.getJSON('http://search.twitter.com/search.json?callback=?&rpp=100&q='+keyword,
		function(data) {	
		$.each(data, function(i, tweets) {
			if (tweets.length != undefined && tweets.length > 0 && tweets[0] && tweets[0].text != undefined )	{
				//CLEAR PREVIOUS QUEUE
				tweetShooterQueue.length = 0;
				currentQueueIndex = 0;
				for (i = 0; i < tweets.length; i++) {
					if (tweets[i].text != '') {
						tweetShooterQueue[tweetShooterQueue.length] = [tweets[i].text, tweets[i].id, tweets[i].from_user, tweets[i].created_at];
					};
				}				 
			}					
		});
		}  
		);
}


/**
 * requestAnimationFrame polyfill by Erik Möller & Paul Irish et. al.
 * https://gist.github.com/1866474
 *
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
**/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */


(function( window ) {

  'use strict';

  var lastTime = 0;
  var prefixes = 'webkit moz ms o'.split(' ');
  // get unprefixed rAF and cAF, if present
  var requestAnimationFrame = window.requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame;
  // loop through vendor prefixes and get prefixed rAF and cAF
  var prefix;
  for( var i = 0; i < prefixes.length; i++ ) {
    if ( requestAnimationFrame && cancelAnimationFrame ) {
      break;
    }
    prefix = prefixes[i];
    requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
    cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
                              window[ prefix + 'CancelRequestAnimationFrame' ];
  }

  // fallback to setTimeout and clearTimeout if either request/cancel is not supported
  if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
      var id = window.setTimeout( function() {
        callback( currTime + timeToCall );
      }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function( id ) {
      window.clearTimeout( id );
    };
  }

  // put in global namespace
  window.requestAnimationFrame = requestAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;

})( window );
