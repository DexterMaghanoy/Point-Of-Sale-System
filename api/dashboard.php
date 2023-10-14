<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class ProductCount{
   
    function showProductCount(){


        $userId = $_GET['userId'];
        
        
        include "connection.php";
        // Get the count of all products
        $sql = "SELECT COUNT(*) AS total_products FROM `tblproducts` WHERE user_id = ${userId};";


        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $total_products = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($total_products) {
            return json_encode($total_products);
        } else {
            return json_encode(array("message" => "No products found"));
        }
    }


    function showCategoryCount(){
        include "connection.php";

        $userId = $_GET['userId'];

        // Get the count of all products
        $sql = "SELECT COUNT(*) AS total_category FROM `tblcategory` WHERE user_id = ${userId};";

        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $total_category = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($total_category) {
            return json_encode($total_category);
        } else {
            return json_encode(array("message" => "No category found"));
        }
    }



    
    function showCustomerCount(){
        include "connection.php";
        // Get the count of all products



        $userId = $_GET['userId'];

        $sql = "SELECT COUNT(*) AS total_customer FROM `tblcustomer`  WHERE user_id = ${userId};";

        

        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $total_customer = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($total_customer) {
            return json_encode($total_customer);
        } else {
            return json_encode(array("message" => "No customer found"));
        }
    }




    function showSalesCount(){
        include "connection.php";
        // Get the count of all products

        
        $userId = $_GET['userId'];

        $sql = "SELECT COUNT(*) AS total_sales FROM `tblsales` WHERE user_id = ${userId};";

        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $total_customer = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($total_customer) {
            return json_encode($total_customer);
        } else {
            return json_encode(array("message" => "No sales found"));
        }
    }


    function showTotalSales() {
        include "connection.php";
    
        // Get the user ID from the GET request (assuming it's properly sanitized)
        $userId = $_GET['userId'];
    
        $sql = "SELECT SUM(tblproducts.product_price * tblsales.sales_quantity) AS all_total_sales
        FROM tblsales
        INNER JOIN tblproducts ON tblproducts.product_id = tblsales.product_id
        WHERE tblproducts.user_id = $userId";


        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $all_total_sales = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($all_total_sales) {
            return json_encode($all_total_sales);
        } else {
            return json_encode(array("message" => "No sales found"));
        }
    }
    


    function  showAllProductValue(){
        include "connection.php";

        $userId = $_GET['userId'];

        $sql = "SELECT SUM(`product_price` * `quantity`) AS `Total_Product_Value`
        FROM `tblproducts`  WHERE user_id = $userId";

        $statement = $conn->prepare($sql);
        $statement->execute();
        
        $Total_Product_Value = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        if ($Total_Product_Value) {
            return json_encode($Total_Product_Value);
        } else {
            return json_encode(array("message" => "No Products Found"));
        }
    }

   


}

$operation = $_POST['operation'];

$user = new ProductCount();
switch($operation){
    case "showProductCount":
        echo $user->showProductCount();
        break;


        case "showCategoryCount":
            echo $user->showCategoryCount();
            break;


                  case "showCustomerCount":
            echo $user->showCustomerCount();
            break;



            case "showSalesCount":
                echo $user->showSalesCount();
                break;


                
            case "showTotalSales":
                echo $user->showTotalSales();
                break;


                case "showAllProductValue":
                    echo $user->showAllProductValue();
                    break;
    
}
?>


