<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class User {
function saveUserUpdate($json) { // Accept $json as a parameter
        include "connection.php";

        // Decode the JSON string to an associative array
        $data = json_decode($json, true);

        $user_id = $data["user_id"];
        $userFullName = $data["userFullName"];
        $userName = $data["userName"];
        $userNewPassWord = $data["userNewPassWord"];

        $sql = "UPDATE tblusers SET user_fullname = :userFullName, user_username = :userName, user_password = :userNewPassWord WHERE user_id = :user_id";

        $stmt = $conn->prepare($sql);
        // Use bindValue instead of bindParam
        $stmt->bindValue(":user_id", $user_id);
        $stmt->bindValue(":userFullName", $userFullName);
        $stmt->bindValue(":userName", $userName);
        $stmt->bindValue(":userNewPassWord", $userNewPassWord);
        $stmt->execute();

        $returnValue = 0;
        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
        }

        $stmt = null;
        $conn = null;
        return $returnValue;
    }
}


$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];

$user = new User();
switch ($operation) {
    case "saveUserUpdate":
        echo $user->saveUserUpdate($json);
        break;



}
