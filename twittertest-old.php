<?php
error_reporting(E_ALL);

require('twitteroauth/OAuth.php');
require('twitteroauth/twitteroauth.php');
 
define('CONSUMER_KEY', 'SSJhIgVd9QyCnpaHP5V0vw');
define('CONSUMER_SECRET', 'IpntdgcTVv4EtUQYG4FIVr408zwqAUqDpYrpB5s9Lg');
define('OAUTH_TOKEN',  '89417211-OXofgleJgSh0Thsy00aKULYKwyOrNyz6u2WNj4WXj');
define('OAUTH_TOKEN_SECRET',  '8MdcAedVGEWcwMvWfz18RhGGNeE9NCYjPqECSZbygU');


function getConnectionWithAccessToken($oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
// ouvrir la connection
$connection = getConnectionWithAccessToken(OAUTH_TOKEN, OAUTH_TOKEN_SECRET);
if (!$connection) {echo "NO connection<br />";}

// lancer la requête
$tweets = $connection->listSearch("TPM", "hill-democrats");
if (!is_array($tweets)) {echo "no array<br />";}

if($tweets != null){
	// ouvrir la connection mysql
	$mysql = mysql_connect('localhost', 'root', 'root');
	if (!$mysql){die('Could not connect: ' . mysql_error());}

	foreach($tweets as $tweet){
		$id = $tweet->id;
		$created_at = $tweet->created_at;
		$created_at = strtotime($created_at);
		$mysqldate = date('Y-m-d H:i:s',$created_at);
		$from_user = ($tweet->user->name);
		$text = ($tweet->text);
		$source = ($tweet->source);
		$geo = $tweet->geo;
//		$profile_image_url = ($tweet->profile_image_url);
		
		// recherche des mots clés
		$containsOneKeyWord = false;		
		$keywords = array("obama", "romney", "biden", "ryan");
		
		foreach($keywords as $keyword)	{
			$pos = stripos($text, $keyword);  	// attention $pos peut être égal à zéro si mot en début de phrase			
			if ($pos !== false) {				// d'où formulation longue
				$containsOneKeyWord = true;			
			}	
		}
		
		// inscrire dans la database si au moins un des mots clés trouvé
		if ($containsOneKeyWord){
			echo $tweet->text."<br />";		
			mysql_select_db("twittertest", $mysql);
             // SQL query to create table available at http://snipplr.com/view/56995/sql-query-to-create-a-table-in-mysql-to-store-tweets/
			$query = "INSERT INTO tweets (id, created_at, from_user, text, source, geo) VALUES ($id,'$mysqldate','$from_user','$text','$source','$geo')";
			$result = mysql_query($query);
	
		}  
	}
	mysql_close($mysql);	
}
?>