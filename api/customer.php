<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Customer{
    function addCustomer($json){
        include "connection.php";

        $json = json_decode($json, true);
        $user = $json["user"];
        $customerFirstName = $json["customerFirstName"];
        $customerLastName = $json["customerLastName"];

        $sql = "INSERT INTO tblcustomer(user_id, customer_fname, customer_lname) VALUES(:user, :customerFirstName, :customerLastName)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user", $user);
        $stmt->bindParam(":customerFirstName", $customerFirstName);
        $stmt->bindParam(":customerLastName", $customerLastName);
        $stmt->execute();
        $returnValue = 0;
        if($stmt->rowCount() > 0){
            $returnValue = 1;
        }
        $stmt = null;
        $conn = null;
        return $returnValue;
    }


    function showCustomer(){
        include "connection.php";
    
        $userId = $_GET['userId'];
        
        // Get all the customers for the specific user_id
        $sql = "SELECT * FROM tblcustomer WHERE user_id = ${userId} ORDER BY tblcustomer.customer_id DESC;";
        $statement = $conn->prepare($sql);
        $statement->execute();
    
        $customers = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($customers) {
            echo json_encode($customers);
        } else {
            echo json_encode(array("message" => "No customers found"));
        }
    }
    




    function updateCustomer($json) {
        include "connection.php";
    
        $json = json_decode($json, true);
        $customer_id = $json["customer_id"];
        $customerfname = $json["customerFName"];
        $customerlname = $json["customerLName"];
    
            $sql = "UPDATE tblcustomer SET customer_fname = :customerfname, customer_lname = :customerlname WHERE customer_id = :customer_id";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":customer_id", $customer_id);
            $stmt->bindParam(":customerfname", $customerfname);
            $stmt->bindParam(":customerlname", $customerlname);
            $stmt->execute();
            
            $returnValue = 0;
            if ($stmt->rowCount() > 0) {
                $returnValue = 1;
            }
            
            $stmt = null;
            $conn = null;
            return $returnValue;
     
    }



    function deleteCustomer($json) {
        include "connection.php";

        $json = json_decode($json, true);
        $customer_id = $json["customer_id"]; // You need to pass the category ID to identify the category to delete.

        $sql = "DELETE FROM tblcustomer WHERE customer_id = :customer_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":customer_id", $customer_id);
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

$user = new Customer();
switch($operation){
    case "addCustomer":
        echo $user->addCustomer($json);
        break;
 
        case "showCustomer":
            echo $user->showCustomer();
            break;
     

            case "updateCustomer":
                echo $user->updateCustomer($json);
                break;
                
            case "deleteCustomer":
                echo $user->deleteCustomer($json);
                break;


            
}
?>