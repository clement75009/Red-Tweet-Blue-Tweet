<?php
ini_set(‘display_errors’,1);
error_reporting(E_ALL|E_STRICT);
date_default_timezone_set('UTC');
// vérifier si on a besoin de ça et du html pour que les caractères s'affichent bien
header('content-type: text/html; charset=utf-8');


require_once('twitteroauth/OAuth.php');
require_once('twitteroauth/twitteroauth.php');
 
define('CONSUMER_KEY', 'SSJhIgVd9QyCnpaHP5V0vw');
define('CONSUMER_SECRET', 'IpntdgcTVv4EtUQYG4FIVr408zwqAUqDpYrpB5s9Lg');
define('OAUTH_TOKEN',  '89417211-OXofgleJgSh0Thsy00aKULYKwyOrNyz6u2WNj4WXj');
define('OAUTH_TOKEN_SECRET',  '8MdcAedVGEWcwMvWfz18RhGGNeE9NCYjPqECSZbygU');

$myKeywords = array("obama", "biden", "Taxes", "Health Care", "immigration",
	 "Limbaugh", "Pelosi", "Reagan", "Bush", "abortion", "gay", "Benghazi", "syria",
	  "palin", "deficit", "policy", "outsourcing", "china", "drones",
	  "france", "attack", "tea party", "obamacare", "irak",
	   "afghanistan", "bill ayers", "mandate", "hillary", "clinton", "reid", 
	   "gun rights", "gun control", "weapon",
	   "lobby", "fiscal cliff", "tax cuts", "debt ceiling", "veto" );



// ouvrir la connection avec twitter

$connection = getConnectionWithAccessToken(OAUTH_TOKEN, OAUTH_TOKEN_SECRET);
if (!$connection) {echo "NO connection<br />";}

// ouvrir la connection mysql
//$mysqli = mysqli_connect("localhost", "root", "root", "twittertest");
//$mysql = mysql_connect('db439006988.db.1and1.com', 'dbo439006988', 'sciences');
$mysqli = mysqli_connect("db439006988.db.1and1.com", "dbo439006988", "sciences", "db439006988");

if (mysqli_connect_errno()){
	printf('Could not connect: ' , mysqli_connect_error()); 
	exit();
}

// main

$blues = listSearch("TPM", "hill-democrats", $connection);
filterAndSaveTweets($blues, "blue", $myKeywords, $mysqli);

$blues2 = listSearch("TPM", "democratic-insiders", $connection);
filterAndSaveTweets($blues2, "blue", $myKeywords, $mysqli);

$reds = listSearch("TPM", "hill-republicans", $connection);
filterAndSaveTweets($reds, "red", $myKeywords, $mysqli);

$reds2 = listSearch("TPM", "republican-insiders", $connection);
filterAndSaveTweets($reds2, "red", $myKeywords, $mysqli);


function getConnectionWithAccessToken($oauth_token, $oauth_token_secret) {
	echo "get connection with token<br />";
  $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $oauth_token, $oauth_token_secret);
  return $connection;
}
 

// lancer la requête
function listSearch($owner_screen_name, $list_slug, $connection){
	echo "<br />list search ".$owner_screen_name." / ".$list_slug."<br />";
	$url = "https://api.twitter.com/1.1/lists/statuses.json?slug={$list_slug}&owner_screen_name={$owner_screen_name}&count=100";
	$tweets = $connection->get($url);
//	print_r(get_headers($tweets));
	return $tweets;
}

function filterAndSaveTweets ($tweets, $mysqlTable, $keywords, $mysqli) {
//	echo "filterAndSaveTweets<br />";
	if (!is_array($tweets)) {echo "no array<br />";}

	if($tweets != null){	
		foreach($tweets as $tweet){
//			echo $tweet->text."<br />";
			$id = $tweet->id_str;
			$created_at = $tweet->created_at;
			$created_at = strtotime($created_at);
			$mysqldate = date('Y-m-d H:i:s',$created_at);
			$from_user = ($tweet->user->name);
			$from_user_name = ($tweet->user->screen_name);
			$text = ($tweet->text);
//			$source = ($tweet->source);
			$geo = $tweet->geo;
			$profile_image_url = ($tweet->user->profile_image_url);
		
			// recherche des mots clés
			$containsOneKeyWord = false;		
			foreach($keywords as $keyword)	{
				$pos = stripos($text, $keyword);  	
				// attention $pos = zéro si mot en début de phrase, d'où formulation longue			
				if ($pos !== false) {			
					$containsOneKeyWord = true;			
				}	
			}

		// inscrire dans la database si au moins un des mots clés trouvé
			if ($containsOneKeyWord){
			echo $tweet->text."<br />";		
			$query = "INSERT INTO {$mysqlTable} (id, created_at, from_user, from_user_name, text, geo, profile_image_url) VALUES ('$id','$mysqldate','$from_user', '$from_user_name', '$text','$geo', '$profile_image_url')";
			$result = mysqli_query($mysqli, $query);
			}  
			else {
//				echo " - NO keyword<br />";
			}
		}	
	}
}


// POUR GENERER LE JSON

// créer l'array
$tweetArray = array();
$doublons = 0;
// requête 1 : les 150 tweets BLUE les + récents
// requête MySQL puis on met les résultats dans une array
// en utilisant une boucle while/fetch 

$blues = mysqli_query($mysqli, "SELECT * FROM blue ORDER BY id DESC LIMIT 150");
	$blueauthors = array();
while($row = mysqli_fetch_array ($blues))    {
	$imgURL = str_replace('_normal', '_bigger', $row['profile_image_url']);
	$newTweet = array(
	        'id' => $row['id'],
	        'from_user' => $row['from_user'],
	        'from_user_name' => $row['from_user_name'],
	        'text' => $row['text'],
			'color' => 'blue',
			'created_at' => $row['created_at'],
			'profile_image_url' => $imgURL
	    );
	if (!in_array($row['from_user_name'], $blueauthors)) {
		array_push($blueauthors, $row['from_user_name']);
	    array_push($tweetArray, $newTweet);		
	}
		else {$doublons++;};	
}

// requête 2 : les 150 tweets RED les + récents
$reds = mysqli_query($mysqli, "SELECT * FROM red ORDER BY id DESC LIMIT 150");

$redauthors = array();
while($row = mysqli_fetch_array ($reds))    {  
	// remplacer l'image _normal 48x48 par _bigger 73x73 (à tester)
	$imgURL = $row['profile_image_url']; /* str_replace('_normal', '_bigger', $row['profile_image_url']); */
	$newTweet = array(
	        'id' => $row['id'],
	        'from_user' => $row['from_user'],
		    'from_user_name' => $row['from_user_name'],
	        'text' => $row['text'],
			'color' => 'red',
			'created_at' => $row['created_at'],
			'profile_image_url' => $imgURL
	    );
	if (!in_array($row['from_user_name'], $redauthors)) {
		array_push($redauthors, $row['from_user_name']);
	    array_push($tweetArray, $newTweet);		
	}
	else {$doublons++;};	
}
	
// encoder l'array en json et l'afficher
$jsonstring = json_encode($tweetArray);
echo $doublons." doublons<br />";
echo $jsonstring;

$file = 'json.json';

file_put_contents($file, $jsonstring);

mysqli_close($mysqli);


?>