<?php
ini_set(‘display_errors’,1);
error_reporting(E_ALL|E_STRICT);

// vérifier si on a besoin de ça et du html pour que les caractères s'affichent bien
header('content-type: text/html; charset=utf-8');

require_once('twitteroauth/OAuth.php');
require_once('twitteroauth/twitteroauth.php');
 
define('CONSUMER_KEY', 'SSJhIgVd9QyCnpaHP5V0vw');
define('CONSUMER_SECRET', 'IpntdgcTVv4EtUQYG4FIVr408zwqAUqDpYrpB5s9Lg');
define('OAUTH_TOKEN',  '89417211-OXofgleJgSh0Thsy00aKULYKwyOrNyz6u2WNj4WXj');
define('OAUTH_TOKEN_SECRET',  '8MdcAedVGEWcwMvWfz18RhGGNeE9NCYjPqECSZbygU');


function getConnectionWithAccessToken($oauth_token, $oauth_token_secret) {
	echo "get connection with token<br />";
  $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $oauth_token, $oauth_token_secret);
  return $connection;
}
 

// lancer la requête
function listSearch($owner_screen_name, $list_slug, $connection){
	echo "list search ".$owner_screen_name." / ".$list_slug."<br />";
	$url = "https://api.twitter.com/1.1/lists/statuses.json?slug={$list_slug}&owner_screen_name={$owner_screen_name}&count=100";
	$tweets = $connection->get($url);
//	print_r(get_headers($tweets));
	return $tweets;
}

function getMembersFromList($owner_screen_name, $list_slug, $connection){
	echo "get members from ".$owner_screen_name." / ".$list_slug."<br />";	
	$url = "https://api.twitter.com/1.1/lists/members.json?slug={$list_slug}&owner_screen_name={$owner_screen_name}&cursor=-1&skip_status=1";
	$return = $connection->get($url);
//	print_r(get_headers($tweets));
	$members = $return->users;
	$next_cursor_str = $return->next_cursor_str;
	echo "next_cursor_str: ". $next_cursor_str;
	return $members;
}


function putMembersInDatabase($members, $mysqlTable) {
	if (!is_array($members)) {echo "no array<br />";}
	if($members != null){	
		foreach($members as $member){
			$id = $member->id_str;
			$name = $member->name;
			$screen_name = $member->screen_name;
			$followers_count = $member->followers_count;			
		// inscrire dans la database 

			echo $name."<br />";		
			$query = "INSERT INTO {$mysqlTable} (id, name, screen_name, followers_count) VALUES ('$id','$name','$screen_name', '$followers_count')";
			$result = mysql_query($query);
		}	
	}
}

// ouvrir la connection avec twitter

$connection = getConnectionWithAccessToken(OAUTH_TOKEN, OAUTH_TOKEN_SECRET);
if (!$connection) {echo "NO connection<br />";}

// ouvrir la connection mysql
//$mysql = mysql_connect('localhost', 'root', 'root');
$mysql = mysql_connect('db439006988.db.1and1.com', 'dbo439006988', 'sciences');
//$mysqli = new mysqli("db439006988.db.1and1.com", "dbo439006988", "sciences", "db439006988");




if (!$mysql){die('Could not connect: ' . mysql_error());}
//mysql_select_db("twittertest", $mysql);
mysql_select_db("db439006988", $mysql);
// main



$reds = getMembersFromList("TPM", "hill-republicans", $connection);
putMembersInDatabase($reds, "redlist");


?>