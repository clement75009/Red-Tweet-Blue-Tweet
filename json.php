<?php
error_reporting(E_ALL);

//$mysqlTable = "blue";

// connection + test
//$mysqli = new mysqli("localhost", "root", "root", "twittertest");
$mysqli = new mysqli("db439006988.db.1and1.com", "dbo439006988", "sciences", "db439006988");

if ($mysqli->connect_errno) {
	printf("Échec de la connexion : %s\n", $mysqli->connect_error);
    exit();
}

// créer l'array
$tweetArray = array();

// requête 1 : les 50 tweets BLUE les + récents
// requête MySQL puis on met les résultats dans une array
// en utilisant une boucle while/fetch 

$blues = $mysqli->query("SELECT * FROM blue ORDER BY id DESC LIMIT 50"); 

while($row = mysqli_fetch_array ($blues))    {
	$imgURL = str_replace('_normal', '_bigger', $row['profile_image_url']);
	$tweet = array(
	        'id' => $row['id'],
	        'from_user' => $row['from_user'],
	        'from_user_name' => $row['from_user_name'],
	        'text' => $row['text'],
			'color' => 'blue',
			'created_at' => $row['created_at'],
			'profile_image_url' => $imgURL
	    );
	    array_push($tweetArray, $tweet);
	}

// requête 2 : les 50 tweets RED les + récents
$reds = $mysqli->query("SELECT * FROM red ORDER BY id DESC LIMIT 50"); 

while($row = mysqli_fetch_array ($reds))    {  
	// remplacer l'image _normal 48x48 par _bigger 73x73 (à tester)
	$imgURL = $row['profile_image_url']; /* str_replace('_normal', '_bigger', $row['profile_image_url']); */
	$tweet = array(
	        'id' => $row['id'],
	        'from_user' => $row['from_user'],
		    'from_user_name' => $row['from_user_name'],
	        'text' => $row['text'],
			'color' => 'red',
			'created_at' => $row['created_at'],
			'profile_image_url' => $imgURL
	    );
	    array_push($tweetArray, $tweet);
	}
	
// encoder l'array en json et l'afficher
$jsonstring = json_encode($tweetArray);
echo $jsonstring;

$file = 'json.json';

file_put_contents($file, $jsonstring);



// fermer la database (à vérifier)
//$result->close();

?>