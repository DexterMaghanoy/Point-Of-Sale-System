<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Category{
    function addCategory($json){
        include "connection.php";

        $json = json_decode($json, true);
        $user = $json["user"];
        $categoryname = $json["categoryname"];
        $categorycode = $json["categorycode"];

        $sql = "INSERT INTO tblcategory(user_id,category_name, category_code) VALUES( :user,:categoryname, :categorycode)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user", $user);
        $stmt->bindParam(":categoryname", $categoryname);
        $stmt->bindParam(":categorycode", $categorycode);
        $stmt->execute();
        $returnValue = 0;
        if($stmt->rowCount() > 0){
            $returnValue = 1;
        }
        $stmt = null;
        $conn = null;
        return $returnValue;
    }

    function showCategory(){
        include "connection.php";
            
        $userId = $_GET['userId'];
        
        // Get all the customers for the specific user_id
        $sql = "SELECT * FROM tblcategory WHERE user_id = ${userId} ORDER BY tblcategory.category_id DESC;";

        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $categories = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($categories) {
            return json_encode($categories);
        } else {
            return json_encode(array("message" => "No categories found"));
        }
    }
    

    function updateCategory($json) {
        include "connection.php";

        $json = json_decode($json, true);
        $category_id = $json["category_id"]; // You need to pass the category ID to identify the category to update.
        $categoryname = $json["categoryname"];
        $categorycode = $json["categorycode"];

        $sql = "UPDATE tblcategory SET category_name = :categoryname, category_code = :categorycode WHERE category_id = :category_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":category_id", $category_id);
        $stmt->bindParam(":categoryname", $categoryname);
        $stmt->bindParam(":categorycode", $categorycode);
        $stmt->execute();
        $returnValue = 0;
        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
        }
        $stmt = null;
        $conn = null;
        return $returnValue;
    }
    

    
    function deleteCategory($json) {
        include "connection.php";

        $json = json_decode($json, true);
        $category_id = $json["category_id"]; // You need to pass the category ID to identify the category to delete.

        $sql = "DELETE FROM tblcategory WHERE category_id = :category_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":category_id", $category_id);
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

$user = new Category();
switch($operation){
    case "addCategory":
        echo $user->addCategory($json);
        break;
 
        case "showCategory":
            echo $user->showCategory();
            break;

            case "updateCategory":
                echo $user->updateCategory($json);
                break;


                case "deleteCategory":
                    echo $user->deleteCategory($json);
                    break;
            
}
?>