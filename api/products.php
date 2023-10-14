<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Product {
    function addproduct($json){
        include "connection.php";
    
        $json = json_decode($json, true);

        $user = $json["user"];
        $prodname = $json["prodname"];
        $prodprice = $json["prodprice"];
        $prodquantity = $json["prodquantity"];
        $categoryid = $json["prodcategory"]; // Updated key to match JavaScript
    
            $sql = "INSERT INTO tblproducts(user_id,product_name, product_price, quantity, category_id) VALUES(:user,:prodname, :prodprice, :prodquantity, :categoryid)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":user", $user);
            $stmt->bindParam(":prodname", $prodname);
            $stmt->bindParam(":prodprice", $prodprice);
            $stmt->bindParam(":prodquantity", $prodquantity);
            $stmt->bindParam(":categoryid", $categoryid);
            $stmt->execute();
    
            $returnValue = 0;
            if($stmt->rowCount() > 0){
                $returnValue = 1;
            }
    
            $stmt = null;
            $conn = null;
            return $returnValue;
 
    }
    

function showproduct(){
    include "connection.php";

    $userId = $_GET['userId'];
        
    // Get all the customers for the specific user_id
    $sql = "SELECT * FROM tblproducts WHERE user_id = ${userId} ORDER BY tblproducts.product_id DESC;";

        $statement = $conn->prepare($sql);
        $statement->execute();
        $products = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($products) {
            echo json_encode($products);
        } else {
            echo json_encode(array("message" => "No customers found"));
        }


}

function updateproduct(){
    include "connection.php";

     $json = isset($_POST['json']) ? $_POST['json'] : "";
     $data = json_decode($json, true);

    $productId = $data["productId"]; // Update key to "productId"
    $productName = $data["productName"]; // Update key to "productName"
    $productPrice = $data["productPrice"]; // Update key to "productPrice"
    $quantity = $data["quantity"];// Update key to "quantity"
    $categoryId = $data["categoryId"]; // Update key to "categoryId"

    try {
        $sql = "UPDATE tblproducts SET product_name = :prodname, product_price = :prodprice, quantity = :quantity, category_id = :category_id WHERE product_id = :productid";
       
           
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":productid", $productId);
        $stmt->bindParam(":prodname", $productName);
        $stmt->bindParam(":prodprice", $productPrice);
        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":category_id", $categoryId);
        $stmt->execute();

        $returnValue = 0;
        if($stmt->rowCount() > 0){
            $returnValue = 1;
          }

        $stmt = null;
        $conn = null;
        return $returnValue;
    } catch (PDOException $e) {
        // Handle database errors here, e.g., log the error and return an error code
        return -1;
        }
}


function deleteProduct($json) {
    include "connection.php";

    $json = json_decode($json, true);
    $product_id = $json["product_id"]; // You need to pass the category ID to identify the category to delete.

    $sql = "DELETE FROM tblproducts WHERE product_id = :product_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":product_id", $product_id);
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

$user = new Product();
switch($operation){
case "addproduct":
    echo $user->addproduct($json);
    break;

case "showproduct":
    $user->showproduct();
    break;


    case "updateproduct":
        $user->updateproduct();
        break;

        case "deleteProduct":
        echo $user->deleteProduct($json);

    break;
}
