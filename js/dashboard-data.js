
// Function to display the product count
const displayProductCount = (count) => {
  const mainDiv = document.getElementById("allProducts");
  mainDiv.innerHTML = count;
};

const userId = sessionStorage.getItem("userid");

const dashboardUrl = `http://localhost/project/api/dashboard.php?userId=${userId}`;

// Read or Show/Display
const showProdCount = () => {
  const formData = new FormData();
  formData.append("operation", "showProductCount");

  axios({
    url: dashboardUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.message == "No products found") {
        alert("No Products Found");
      } else {
        // Extract the count value from the response and display it
        const count = response.data[0].total_products;
        displayProductCount(count);
      }
    })
    .catch((error) => {
      alert(error);
    });
};



// Function to display the product count
const displayCategoryCount = (count) => {
  const mainDiv = document.getElementById("allCategory");
  mainDiv.innerHTML = count;
};


// Read or Show/Display
const showCatCount = () => {
  const formData = new FormData();
  formData.append("operation", "showCategoryCount");

  axios({
    url: dashboardUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.message == "No products found") {
        alert("No Products Found");
      } else {
        // Extract the count value from the response and display it
        const count = response.data[0].total_category;
        displayCategoryCount(count);
      }
    })
    .catch((error) => {
      alert(error);
    });
};




// Function to display the product count
const displayCustomerCount = (count) => {
  const mainDiv = document.getElementById("allCustomer");
  mainDiv.innerHTML = count;
};


// Read or Show/Display
const showCustomerCount = () => {
  const formData = new FormData();
  formData.append("operation", "showCustomerCount");

  axios({
    url: dashboardUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.message == "No products found") {
        alert("No Products Found");
      } else {
        // Extract the count value from the response and display it
        const count = response.data[0].total_customer;
        displayCustomerCount(count);
      }
    })
    .catch((error) => {
      alert(error);
    });
};





// Function to display the product count
const displaySalesCount = (count) => {
  const mainDiv = document.getElementById("allSales");
  mainDiv.innerHTML = count;
};


// Read or Show/Display
const showSalesCount = () => {
  const formData = new FormData();
  formData.append("operation", "showSalesCount");

  axios({
    url: dashboardUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.message == "No products found") {
        alert("No Products Found");
      } else {
        // Extract the count value from the response and display it
        const count = response.data[0].total_sales;

        displaySalesCount(count);
      }
    })
    .catch((error) => {
      alert(error);
    });
};



// Function to display the product count
const displayTotalSales = (count) => {
  const mainDiv = document.getElementById("totalSales");

  mainDiv.innerHTML = count;
};


// Read or Show/Display
const showTotalSales = () => {
  const formData = new FormData();
  formData.append("operation", "showTotalSales");

  axios({
    url: dashboardUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data == "No products found") {
        alert("No Products Found");
      } else {
        // Extract the count value from the response and display it
        const count = response.data[0].all_total_sales;

        console.log(response.data);


        displayTotalSales(count);
      }
    })
    .catch((error) => {
      alert(error);
    });
};


// Function to display the product count
const displayTotalProductValue = (count) => {
  const mainDiv = document.getElementById("allProductValue");
  mainDiv.innerHTML = count;
};


// Read or Show/Display
const showAllProductValue = () => {
  const formData = new FormData();
  formData.append("operation", "showAllProductValue");

  axios({
    url: dashboardUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.message == "No products found") {
        alert("No Products Found");
      } else {
        // Extract the count value from the response and display it
        const count = response.data[0].Total_Product_Value;


        displayTotalProductValue(count);
      }
    })
    .catch((error) => {
      alert(error);
    });
};





showAllProductValue();


showCatCount();
showProdCount();
showCustomerCount();

showSalesCount();

showTotalSales();
