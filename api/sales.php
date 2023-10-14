<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Sales
{
    function addSales($json)
    {
        include "connection.php";

        $json = json_decode($json, true);
        $user = $json["user"];
        $salesprod = $json["salesprod"];
        $salescategory = $json["salescategory"];
        $salesquantity = $json["salesquantity"];
        $salescustomer = $json["customer_id"];

        try {
            // Retrieve the current quantity of the product
            $selectSql = "SELECT quantity FROM tblproducts WHERE product_id = :salesprod";
            $selectStmt = $conn->prepare($selectSql);
            $selectStmt->bindParam(":salesprod", $salesprod);
            $selectStmt->execute();

            if ($selectStmt->rowCount() > 0) {
                $row = $selectStmt->fetch(PDO::FETCH_ASSOC);
                $currentQuantity = $row["quantity"];

                // Calculate the new quantity after the sale
                $newQuantity = $currentQuantity - $salesquantity;

                // Update the product's quantity
                $updateSql = "UPDATE tblproducts SET quantity = :newQuantity WHERE product_id = :salesprod";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bindParam(":salesprod", $salesprod);
                $updateStmt->bindParam(":newQuantity", $newQuantity);
                $updateStmt->execute();

                // Insert the sales record
                $insertSql = "INSERT INTO tblsales(user_id,product_id, category_id, sales_quantity, customer_id) VALUES(:user,:salesprod, :salescategory, :salesquantity, :salescustomer)";
                $insertStmt = $conn->prepare($insertSql);
                $insertStmt->bindParam(":user", $user);
                $insertStmt->bindParam(":salesprod", $salesprod);
                $insertStmt->bindParam(":salescategory", $salescategory);
                $insertStmt->bindParam(":salesquantity", $salesquantity);
                $insertStmt->bindParam(":salescustomer", $salescustomer);
                $insertStmt->execute();

                $returnValue = 0;
                if ($insertStmt->rowCount() > 0) {
                    $returnValue = 1;
                }
            } else {
                $returnValue = -1; // Product not found
            }

            $selectStmt = null;
            $updateStmt = null;
            $insertStmt = null;
            $conn = null;
            return $returnValue;
        } catch (PDOException $e) {
            // Handle database errors here, e.g., log the error and return an error code
            return -1;
        }
    }

    function showSales()
    {
        include "connection.php";
    
        $userId = $_GET['userId'];
    
        $sql = "SELECT
            tblsales.sales_id,
            tblcategory.category_id,
            tblcategory.category_name,
            tblproducts.product_name,
            tblproducts.product_price,
            tblsales.sales_quantity,
            tblproducts.product_id,
            tblcustomer.customer_id,
            tblcustomer.customer_fname,
            tblcustomer.customer_lname
        FROM
            tblsales
        INNER JOIN tblproducts ON tblproducts.product_id = tblsales.product_id
        INNER JOIN tblcategory ON tblcategory.category_id = tblsales.category_id
        INNER JOIN tblcustomer ON tblcustomer.customer_id = tblsales.customer_id
        WHERE
            tblsales.user_id = $userId
        ORDER BY
            tblsales.sales_id DESC";
    
        $statement = $conn->prepare($sql);
        $statement->execute();
        $sales = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($sales) {
            echo json_encode($sales);
        } else {
            echo json_encode(array("message" => "No sales found"));
        }
    }
    


    function updateSales($json) {
        include "connection.php";
    
        $json = json_decode($json, true);
        $salesId = $json["salesId"];
        $newSalesQuantity = $json["salesQuantity"];
    
        try {
            // Check if the sales record exists
            $selectSql = "SELECT * FROM tblsales WHERE sales_id = :sales_id";
            $selectStmt = $conn->prepare($selectSql);
            $selectStmt->bindParam(":sales_id", $salesId);
            $selectStmt->execute();
    
            if ($selectStmt->rowCount() > 0) {
                // Get the old sales quantity
                $oldSalesQuantitySql = "SELECT sales_quantity, product_id FROM tblsales WHERE sales_id = :sales_id";
                $oldSalesQuantityStmt = $conn->prepare($oldSalesQuantitySql);
                $oldSalesQuantityStmt->bindParam(":sales_id", $salesId);
                $oldSalesQuantityStmt->execute();
                $row = $oldSalesQuantityStmt->fetch(PDO::FETCH_ASSOC);
                $oldSalesQuantity = $row["sales_quantity"];
                $salesprod = $row["product_id"];
    
                // Calculate the difference between the new and old sales quantity
                $quantityDifference = $newSalesQuantity - $oldSalesQuantity;
    
                // Update the sales record with the new sales quantity
                $updateSql = "UPDATE tblsales SET sales_quantity = :new_sales_quantity WHERE sales_id = :sales_id";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bindParam(":sales_id", $salesId);
                $updateStmt->bindParam(":new_sales_quantity", $newSalesQuantity);
                $updateStmt->execute();
    
                // Update the product's quantity based on the difference
                if ($quantityDifference != 0) {
                    $selectProductSql = "SELECT quantity FROM tblproducts WHERE product_id = :salesprod";
                    $selectProductStmt = $conn->prepare($selectProductSql);
                    $selectProductStmt->bindParam(":salesprod", $salesprod);
                    $selectProductStmt->execute();
    
                    if ($selectProductStmt->rowCount() > 0) {
                        $productRow = $selectProductStmt->fetch(PDO::FETCH_ASSOC);
                        $currentProductQuantity = $productRow["quantity"];
    
                        // Calculate the new product quantity

                        $newProductQuantity = $currentProductQuantity - $quantityDifference;
    
                        // Update the product's quantity
                        $updateProductSql = "UPDATE tblproducts SET quantity = :newProductQuantity WHERE product_id = :salesprod";
                        $updateProductStmt = $conn->prepare($updateProductSql);
                        $updateProductStmt->bindParam(":salesprod", $salesprod);
                        $updateProductStmt->bindParam(":newProductQuantity", $newProductQuantity);
                        $updateProductStmt->execute();
                    }
                }
    
                $returnValue = 0;
                if ($updateStmt->rowCount() > 0) {
                    $returnValue = 1; // Successfully updated
                }
            } else {
                $returnValue = -1; // Sales record not found
            }
    
            $selectStmt = null;
            $oldSalesQuantityStmt = null;
            $updateStmt = null;
            $updateProductStmt = null;
            $conn = null;
            return $returnValue;
        } catch (PDOException $e) {
            // Handle database errors here, e.g., log the error and return an error code
            return -1;
        }
    }
    

    function deleteSales($json) {
        include "connection.php";
      
        $json = json_decode($json, true);
        $salesId = $json["salesId"]; // Corrected variable name to "salesId"
      
        try {
            $sql = "DELETE FROM tblsales WHERE sales_id = :salesId";
      
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":salesId", $salesId); // Bind parameter as an integer
            $stmt->execute();
      
            $returnValue = 0;
            if ($stmt->rowCount() > 0) {
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
    


}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];

$sales = new Sales();
switch ($operation) {
    case "addSales":
        echo $sales->addSales($json);
        break;


    case "showSales":
        echo $sales->showSales();
        break;

    case "updateSales":
        echo $sales->updateSales($json);
        break;

        
    case "deleteSales":
        echo $sales->deleteSales($json);
        break;
}
