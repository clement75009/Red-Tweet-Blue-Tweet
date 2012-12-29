var tweetQueue = [];
var displayedTweets = [];
var currentQueueIndex = 0;
var timer;
var followers;   
var tweetTop = 230;
var level;
var $answer;

$(document).ready(function () {
	init();
});

function init(){
	fetchMySQLFeed();
	intro();
}

function prepareZone() {
	level=1;
	followers=0;
	$('.followers').html("0");
	$('.level-text').html("LEVEL 1");
	$("#mainTitle").remove();
	$(".title-label").remove();
	
	$("#lisereH").css('visibility', 'visible');
	$("#lisereV").css('visibility', 'visible');
	$("#cartouche").css('visibility', 'visible');

	$elephant = $("<div />")
		.addClass("r-logo logo")	
		.click(function(){userChoice("red");});
			
	$donkey = $("<div />")
		.addClass("d-logo logo")	
		.click(function(){userChoice("blue");});
		
	$('#gameZone').append($elephant);
	$('#gameZone').append($donkey);
	
	level1Carton();
}

function startPlay(){	
	levelTimer(60);
	addTweetToDisplayList();
	addTweetToDisplayList();
	addTweetToDisplayList();

	updateTweets();
}

function level1Carton() {
	$level1Carton = $('<div class="level-carton"><div class="level-number">Level 1</div><div class="level-intro"><br />Are these tweets Red or Blue?<br />Click on the Elephant if you think it\'s an R or<br />on the Donkey if it\'s a D.<br /><a class="start levelStart" href="#">Start</a></div></div>');
	$('#gameZone').append($level1Carton);
	$(".levelStart").click(function(){
		$level1Carton.remove();
		 startPlay();}
		);
}

function userChoice(event){
	if ($answer) {$answer.remove()};
	if (displayedTweets[2].hasClass(event)) {
		addFollowers(25); 
		if (event == "red"){
			$answer = $('<div class="red-answer answer right">RIGHT!</div>');
			$('#gameZone').append($answer);
			var t = setTimeout(function(){$answer.remove();}, 1800);
		}
		else {
			$answer = $('<div class="blue-answer answer right">RIGHT!</div>');
			$('#gameZone').append($answer);
			var u = setTimeout(function(){$answer.remove();}, 1800);
		}
	}
	else {	
		if (event == "red"){
			$answer = $('<div class="red-answer answer wrong">WRONG!</div>');
			$('#gameZone').append($answer);
			var v = setTimeout(function(){$answer.remove();}, 1800);
		}
		else {
			$answer = $('<div class="blue-answer answer wrong">WRONG!</div>');
			$('#gameZone').append($answer);
			var w = setTimeout(function(){$answer.remove();}, 1800);
		}					
	}
	addTweetToDisplayList();
	updateTweets();
}

function intro(){
	$titleLabel = $('<div class="title-label"><span class="redtweet">RED TWEET </span><span class="bluetweet">BLUE TWEET</span></div>');
	$bigLogos = $('<img class="bigLogos" />');
	$bigLogos.attr('src','img/r-elephant-180-300.png');
	$logoAndTitle = $('<div />');
	$logoAndTitle.append($bigLogos);
	$logoAndTitle.append($titleLabel);
	setTimeout(function(){$('#gameZone').append($logoAndTitle)}, 400);


	$logoAndTitle.fadeIn(400, function(){
		setTimeout(function(){
			$logoAndTitle.fadeOut(400, function(){
				$('.bluetweet').css('visibility', 'visible');
				$('.redtweet').css('visibility', 'hidden');
				$bigLogos.attr('src','img/d-donkey-180-300.png');
				$logoAndTitle.fadeIn(400, function (){
					setTimeout(function(){
						$logoAndTitle.fadeOut(400, function(){
								mainTitle();
						});
					}, 600)
				});	
				});		
			
		}, 600);
	});
}

function mainTitle(){
	$mainTitle = $("<div id='mainTitle'><img src='img/twitter-logo-300b.png' /></div>");
	$startButton = $("<a class='start' href='#'>Play</a>");
	// $mainTitle.append($titleText);
	$mainTitle.append($startButton);
	$titleLabel = $('<div class="title-label"><span class="redtweet">RED TWEET </span><span class="bluetweet show">BLUE TWEET</span></div>');
	$('#gameZone').append($mainTitle);
	$('#gameZone').append($titleLabel);
	$mainTitle.fadeIn(400);
	$logoAndTitle.remove();
	$(".start").click(prepareZone);	
}

function addTweetToDisplayList() {
	// prendre un tweet au hasard de la tweetQueue (et l'enlever de la queue)
	var tweetQueueLength = tweetQueue.length;
	var index = randomFromTo(0, tweetQueue.length-1);
	var tweet = tweetQueue.splice(index, 1)[0]; // [0] parce splice() retourne une array
	var tweetText = tweet[0];
	var user = tweet[2];
	var color = tweet[3];
	var created_at = tweet[4];
	var profile_image_url = tweet[5];
	var from_user_name = tweet[6];	
	
	// créer la div
	$tweet = $("<div />")
	.addClass("tweet")
	.addClass(color)
	.html('<a target="_blank" href="https://twitter.com/'+ from_user_name+'"><img src="'
	+ profile_image_url +'" class="profile_image" /></a><div class="user"><a target="_blank" href="https://twitter.com/'+ from_user_name+'">'
	+ user+'</div></a><div class="created_at"> '+$.timeago(created_at)+'</div><div class=tweetText>'
	+ parse_tweets_for_urls(tweetText)+'</div>');

	// unshift ajoute un élément au début d'une array (+ retourne sa nouvelle longueur)
	displayedTweets.unshift($tweet);		

}

function updateTweets(){
	$.each(displayedTweets, function(index, tweet){
		tweet.remove();	
	});
	
	displayedTweets[0].css('top', tweetTop-220 + "px");
	$('#gameZone').append(displayedTweets[0]);
	
	displayedTweets[1].css('top', tweetTop-110 + "px");	
	$('#gameZone').append(displayedTweets[1]);
					
	$('#gameZone').append(displayedTweets[2]);	
	
	displayedTweets[2].css({
		top: tweetTop,
		 "border-color": "#737E84"	
		});

	if (displayedTweets[3]) {
	displayedTweets[3].css({
			top: tweetTop+110 + "px",
			"border-color": "#b4c5ce"	
	}).addClass("reveal");
	$('#gameZone').append(displayedTweets[3]);	
	}
	
	if (displayedTweets[4]) {
	displayedTweets[4].css({
			top: tweetTop+250 + "px"
	}).addClass("reveal");
	$('#gameZone').append(displayedTweets[4]);	
	}
	
	if (displayedTweets[5]) {
	displayedTweets.pop();
	}
}

function endLevel(){
	if ($answer) $answer.remove();
	$.each(displayedTweets, function(index, tweet){
		tweet.remove();	
	});
	displayedTweets.length = 0;
	clearInterval(timer);
	
	if (level == 1){
		level++;
		$('.level-text').html("LEVEL 2");	
		var $level2Carton = $('<div class="level-carton"><div class="level-number">Level 2</div><div class="level-intro"><br />You have ' + followers + ' followers. Keep going!<br /><a class="start levelStart" href="#">OK</a></div></div>');
		$('#gameZone').append($level2Carton);
		$(".levelStart").click(function(){
			$level2Carton.remove();
			 startPlay();}
			);
	}
	else if (level == 2) {
		level++;
		$("#lisereH").css('visibility', 'hidden');
		$("#lisereV").css('visibility', 'hidden');
		$elephant.remove();
		$donkey.remove();
		
		$level2Carton = $('<div class="level-carton level-carton2"><div class="level-number">BONUS ROUND</div><div class="level-intro"><br />You have ' + followers + ' followers. Last chance to get more!<br />First, who are you?<br /><a class="shooterbutton demshoot" href="#">I\'m a Democrat</a><a class="shooterbutton repshoot" href="#">I\'m a Republican</a><a class="shooterbutton undecided" href="#">I\'m undecided</a></div></div>');
		$('.level-text').html("BONUS ROUND");
		$('#gameZone').append($level2Carton);
		$(".demshoot").click(function(){
			$level2Carton.remove();
			initShooter('%23tcot');
			$demShootText = $('<div class="shoot-text">...then shoot at all these Conservative tweets!</div>');
			$('#gameZone').append($demShootText);	
			setTimeout(function(){$demShootText.fadeOut(1000);}, 3000);	
			}
			);
		$(".repshoot").click(function(){
			$level2Carton.remove();
			initShooter('%23obama2012');
			$repShootText = $('<div class="shoot-text">...then shoot at all these Liberal tweets!</div>');
			$('#gameZone').append($repShootText);	
			setTimeout(function(){$repShootText.fadeOut(1000);}, 3000);
			}
			);
		$(".undecided").click(function(){
			alert('How can you still be undecided? The election is over!')}
			);
	}
	else {
		cancelAnimationFrame(intervalId);
		clearInterval(interval);
		$.each(shooterTweets, function(index, tweet){
			tweet.remove();	
		});
		$finalCarton = $('<div class="level-carton end"><div class="level-number">Congratulations!</div><div class="level-intro"><br />You\'ve reached ' + followers + ' followers. Thanks for playing!<br /><a class="start end" href="#">Play again</a></div></div>');
		$('#gameZone').append($finalCarton);
		$(".start").click(function(){
			$finalCarton.remove();
			prepareZone();
			}
			);
		
	}
}

function levelTimer(seconds){
	var seconds = seconds;  // 40
	timer = setInterval(function(){
		if (seconds == 0){
		endLevel();
		return;	
		};
		seconds--;
		$("#timer").html(seconds);
	}, 1000);
}

function fetchMySQLFeed(){
	// JSON.php livre 100 tweets : 50 blue, 50 red
	// De chacun de ces tweets on fait une array que l'on met dans tweetQueue	
		$.getJSON('json.json', function(data) {	
			$.each(data, function(key, tweet) {	
				if (tweet.text){
					var newTweet = [tweet.text, tweet.id, tweet.from_user, tweet.color, tweet.created_at, tweet.profile_image_url, tweet.from_user_name];	
					tweetQueue.push(newTweet);
				}					
			});
			}  
			);
}	
		
function addFollowers(number) {
	followers +=number;
	$('.followers').html(function(){
		return parseInt(followers);
	})
}

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function parse_tweets_for_urls(tweet) {
    return tweet
    .replace(/(ftp|http|https|file):\/\/[\S]+(\b|$)/gim, '<a href="$&" class="my_link" target="_blank">$&</a>')
    .replace(/([^\/])(www[\S]+(\b|$))/gim, '$1<a href="http://$2" class="my_link" target="_blank">$2</a>')
    .replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2" class="my_link" target="_blank">@$2</a>')
    .replace(/(^|\s)#(\S+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2" class="my_link" target="_blank">#$2</a>');
}
