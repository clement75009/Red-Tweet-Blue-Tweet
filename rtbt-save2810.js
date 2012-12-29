//test

var play;
var interval;
var timer;
var followers = 0;   
var miss = 0;
var FPS = 16;
var WIDTH = 1000;
var HEIGHT = 500;
var tweetWidth = 400;
var tweetLeft;
var tweetTop;
var tweetQueue = [];
var displayedTweets = [];
var currentQueueIndex = 0;

$(document).ready(function () {
	init();
});

function init(){
	fetchMySQLFeed();
	setTimeout(intro, 1000);

	//démarer le jeu
	$("#start").click(function(){
		startPlay();
		});
		
	// stop
	$("#stop").click(function(){
//		clearInterval(interval);
		});
}

function startPlay() {
	$("#message").fadeOut('slow');
	tweetLeft = WIDTH/2-tweetWidth/2;
	tweetTop = HEIGHT/2 - 100;

	$elephant = $("<div />")
		.addClass("r-logo logo")	
		.css({
		left: tweetLeft - 107 + "px",
		top: tweetTop + "px"	
			})
		.click(function(){	
			// tweetsDown();
			$tweet.fadeOut(600, function(){
				$tweet.remove();
				addFollowers();
				createTweetDiv();
				});	
		});
			
	$donkey = $("<div />")
		.addClass("d-logo logo")	
		.css({
			left: tweetLeft + 418 + "px",
			top: tweetTop + "px"	
		})
		.click(function(){
			// tweetsDown();
			$tweet.fadeOut(600, function(){
				$tweet.remove();
				createTweetDiv();
				});	
		});
		
	$('#gameZone').append($elephant);
	$('#gameZone').append($donkey);
	
	timer();
//	createTweetDiv();
	addTweetToDisplayList();
	addTweetToDisplayList();
	addTweetToDisplayList();
	displayTweets();
};

function intro(){
    $bigLogos = $('<img class="bigLogos" />');
	$bigLogos.attr('src','img/r-elephant-180-300.png');
	$('#gameZone').append($bigLogos);

	$bigLogos.fadeIn(400, function(){
		setTimeout(function(){
			$bigLogos.fadeOut(400, function(){
				$bigLogos.attr('src','img/d-donkey-180-300.png');
				$bigLogos.fadeIn(400, function (){
					setTimeout(function(){
						$bigLogos.fadeOut(400, function(){
							$bigLogos.attr('src','img/twitter-logo-red&blue-2s.png');
							$bigLogos.fadeIn(400, function (){
								setTimeout(function(){
									$bigLogos.fadeOut(400, titleScreen)
								}, 600);
							
								console.log("end anim");
							});	
						});
					}, 600)
				});	
				});		
			
		}, 600);
	});

}

function titleScreen(){
	$bigLogos.remove();
	console.log("title screen");
}

function createTweetDiv() {
	// prendre un tweet au hasard de la tweetQueue (et l'enlever de la queue)
	var index = randomFromTo(0, tweetQueue.length);
	var tweet = tweetQueue.splice(index, 1)[0]; // [0] parce splice() retourne une array
	var tweetText = tweet[0];
	var user = tweet[2];
	$tweet = $("<div />")
	.addClass("tweet")
	.html('<div class="user">@'+user+'</div><div class=tweetText>'+tweetText+'</div>')
	.css({
		left: tweetLeft + "px",
		top: tweetTop + "px"	
		});
	displayedTweets.push($tweet);
	
	$('#gameZone').append($tweet);
}

function addTweetToDisplayList() {
	// prendre un tweet au hasard de la tweetQueue (et l'enlever de la queue)
	var index = randomFromTo(0, tweetQueue.length);
	var tweet = tweetQueue.splice(index, 1)[0]; // [0] parce splice() retourne une array
	var tweetText = tweet[0];
	var user = tweet[2];
	
	// créer la div
	$tweet = $("<div />")
	.addClass("tweet")
	.html('<div class="user">@'+user+'</div><div class=tweetText>'+tweetText+'</div>')

	// afficher
	$tweet.css({
		left: tweetLeft + "px",
		top: tweetTop + "px"	
		});
	displayedTweets.push($tweet);
	
	$('#gameZone').append($tweet);
}


function displayTweets(){
	displayedTweets[0].css({
		left: tweetLeft + "px",
		top: tweetTop-240 + "px"	
		});
	$('#gameZone').append(displayedTweets[0]);
	
	displayedTweets[1].css({
		left: tweetLeft + "px",
		top: tweetTop-120 + "px"	
		});
	$('#gameZone').append(displayedTweets[1]);

	displayedTweets[2].css({
		left: tweetLeft + "px",
		top: tweetTop + "px"	
		});
	$('#gameZone').append(displayedTweets[2]);	
	
	
}

function endLevel1(){
	$endLevelOne = $("<div id='carton'>Congrats! You now have " + followers + " followers.</div>");
	$('#gameZone').append($endLevelOne);
	clearInterval(timer);
}

function timer(){
	var seconds = 10;  // 40
	timer = setInterval(function(){
		if (seconds == 0){
		endLevel1();
		return;	
		};
		seconds--;
		$("#timer").html(seconds);
	}, 1000);
}

function fetchMySQLFeed(){
	// JSON.php livre 100 tweets : 50 blue, 50 red
	// De chacun de ces tweets on fait une array que l'on met dans tweetQueue	
		$.getJSON('json.php', function(data) {	
			$.each(data, function(key, tweet) {	
				if (tweet.text){
					var newTweet = [tweet.text, tweet.id, tweet.from_user, tweet.color /*, tweet.profile_image_url */];	
					tweetQueue.push(newTweet)
				}					
			});
			}  
			);
		console.log("fetchMySQLFeed() done")	
}			

function fetchSearchFeed(keyword){
	//https://dl.dropbox.com/u/30128236/jsonfeed.txt
	var keyword = "tcot";
	$.getJSON('http://search.twitter.com/search.json?callback=?&rpp=100&q='+keyword,
		function(data) {	
		$.each(data, function(i, tweets) {
			if (tweets.length != undefined && tweets.length > 0 && tweets[0] && tweets[0].created_at != undefined && tweets[0].text != undefined )	{
				//CLEAR PREVIOUS QUEUE
				tweetQueue.length = 0;
				currentQueueIndex = 0;
				for (i = 0; i < tweets.length; i++) {
					if (tweets[i].text != '') {
						tweetQueue[tweetQueue.length] = [tweets[i].text, tweets[i].id, tweets[i].from_user, tweets[i].created_at];
					};
				}				 
			}					
		});
		}  
		);	
}

function addFollowers() {
	followers +=25;
	$('#followers').html(function(){
		if (followers > 1)
			return parseInt(followers) + " followers";
		return parseInt(followers) + " follower";
	})
}

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}


/*
function createDescendingTweetDiv() {
	var speed = 10000;
	var tweet = tweetQueue.pop();
	var tweetText = tweet[0];
	var user = tweet[2];
	var left = randomFromTo(0, WIDTH-tweetWidth);
	
	$tweet = $("<div />");
	$tweet.addClass("tweet");
	$tweet.html('<div class="user">@'+user+'</div><div class=tweetText>'+tweetText+'</div>');
	$tweet.css({
	left:left+"px",
	top:"-50px"	
		});
	tweets.push($tweet);
	$('#gameZone').append($tweet);

	$tweet.click(function(){
		addFollowers();
		$(this).fadeOut(600, function(){
			$(this).remove();
			});
	});
}

function loop(){
	var intervalId = webkitRequestAnimationFrame(function(){
		loop();
	} )
		
}

function updateTweets (){
	for (var i = 0; i < tweets.length; i++){
		var tweet = tweets[i];
		var top = tweet.css('top');
		var topNb = parseInt(top.slice(0, -2));
		topNb += 1 ;
		if (topNb > HEIGHT){
			tweet.remove();
			tweets.splice(i, 1);
		}
		tweet.css('top', (topNb)+"px");
	}
}
*/

