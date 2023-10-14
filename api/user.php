<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class User{
    function signup($json){
        include "connection.php";

        $json = json_decode($json, true);
        $username = $json["username"];
        $pword = $json["pword"];
        $fullname = $json["fullname"];

        $sql = "INSERT INTO tblusers(user_fullname, user_username, user_password) VALUES(:fullname, :username, :pword)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":pword", $pword);
        $stmt->bindParam(":fullname", $fullname);
        $stmt->execute();
        $returnValue = 0;
        if($stmt->rowCount() > 0){
            $returnValue = 1;
        }
        $stmt = null;
        $conn = null;
        return $returnValue;
    }

    function login($json){
     include "connection.php";

     $json = json_decode($json, true);
     $username = $json["username"];
     $pword = $json["pword"];

     $sql = "SELECT user_id, user_username, user_fullname,  user_password FROM tblusers WHERE user_username=:username AND user_password=:pword";
     $stmt = $conn->prepare($sql);
     $stmt->bindParam(":username", $username);
     $stmt->bindParam(":pword", $pword);
     $stmt->execute();
     $returnValue = 0;
     if($stmt->rowCount() > 0){
        $returnValue = $stmt->fetch(PDO::FETCH_ASSOC);
     }
     $stmt = null; $conn = null;
     return json_encode($returnValue);
    }



    function showUsers(){
        include "connection.php";
     
    $sql = 'SELECT * FROM tblusers ORDER BY tblusers.user_id DESC;';
        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $users = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($users) {
            return json_encode($users);
        } else {
            return json_encode(array("message" => "No categories found"));
        }
    }


 
}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];

$user = new User();
switch($operation){
    case "signup":
        echo $user->signup($json);
        break;
    case "login":
        echo $user->login($json);
           break;

           case "showUsers":
            echo $user->showUsers($json);
               break;

          
}
?>