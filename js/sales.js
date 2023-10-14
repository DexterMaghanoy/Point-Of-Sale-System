const userId = sessionStorage.getItem("userid");


const urlSales = `http://localhost/project/api/sales.php?userId=${userId}`;



const urlCustomer = `http://localhost/project/api/customer.php?userId=${userId}`;

const apiUrlProducts = `http://localhost/project/api/products.php?userId=${userId}`;
const categoryUrl = `http://localhost/project/api/category.php?userId=${userId}`;




// Pagination
const addPaginationButtons = (data) => {
  const paginationDiv = document.getElementById("paginationDiv");
  
  paginationDiv.innerHTML = `
    <button class="btn btn-info" id="prevBtn" style="display: none;"> <- Previous</button>
  `;

  paginationDiv.innerHTML += `
    <button class="btn btn-info" id="nextBtn">Next -></button>
  `;

  document.getElementById("prevBtn").addEventListener("click", () => {
    prevPage(data);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    nextPage(data);
  });

  updatePrevButtonVisibility(); // Initial visibility check for "Previous" button
  updateNextButtonVisibility(data); // Initial visibility check for "Next" button
};

// Function to update "Previous" button visibility
const updatePrevButtonVisibility = () => {
  const prevBtn = document.getElementById("prevBtn");
  if (currentPage === 1) {
    prevBtn.style.display = "none"; // Hide "Previous" button on the first page
  } else {
    prevBtn.style.display = "inline-block"; // Show "Previous" button when not on the first page
  }
};

// Function to update "Next" button visibility
const updateNextButtonVisibility = (data) => {
  const nextBtn = document.getElementById("nextBtn");
  if (currentPage === Math.ceil(data.length / itemsPerPage)) {
    nextBtn.style.display = "none"; // Hide "Next" button on the last page
  } else {
    nextBtn.style.display = "inline-block"; // Show "Next" button when not on the last page
  }
};

const itemsPerPage = 5; // Number of items to display per page
let currentPage = 1;    // Current page

// Function to display a subset of data based on the current page
const displayData = (data) => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageData = data.slice(startIdx, endIdx);

  getAllRecord(pageData);
};

// Function to handle "Next" button click
const nextPage = (data) => {
  if (currentPage < Math.ceil(data.length / itemsPerPage)) {
    currentPage++;
    displayData(data);
    updatePrevButtonVisibility(); // Update "Previous" button visibility
  }
  updateNextButtonVisibility(data);
};

// Function to handle "Previous" button click
const prevPage = (data) => {
  if (currentPage > 1) {
    currentPage--;
    displayData(data);
    updateNextButtonVisibility(data); // Update "Next" button visibility
  }
  updatePrevButtonVisibility(); // Update "Previous" button visibility
};




// Create or Add New Sales
const addSales = () => {

  const userId = sessionStorage.getItem("userid");
  const user = userId;

  const selectElement = document.getElementById("salesProd");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const productId = selectedOption.getAttribute("prodId");

  const category = document.getElementById("salesCategoryName");
  const categoryId = category.getAttribute("CategoryId");

  const quantity = document.getElementById("salesQuantity").value;

  // Get the selected customer's ID from the customerSelect select element
  const customerSelect = document.getElementById("customerSelect");
  const selectedCustomerId = customerSelect.value;




  if (!productId || !quantity || !selectedCustomerId) {

    alert("Please fill in all the required fields.");
    return; // Exit the function if any field is empty
  }

  const json = {
    user: user,
    salesprod: productId,
    salescategory: categoryId,
    salesquantity: quantity,
    customer_id: selectedCustomerId, // Include the selected customer's ID
  };

  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "addSales");

  axios({
    url: urlSales,
    method: "post",
    data: formData,
  })
    .then((response) => {
      if (response.data === 0) {
        alert("Sales not Added!!!");
      } else {
        alert("Sales Added Successfully");
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error adding sales:", error);
      alert("An error occurred while adding sales.");
    });
};

// To Show the Product List in Select Tag
const getAllCategory = (rdProducts, rdCategory) => {
  const selectElement = document.getElementById("salesProd");
  const Price = document.getElementById("salesPrice");
  const Category = document.getElementById("salesCategoryName");

  // Populate the select element with product options
  rdProducts.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.product_id;
    option.text = product.product_name;
    option.setAttribute("prodId", product.product_id); // Add product ID attribute
    selectElement.appendChild(option);
  });

  // Add an event listener to update placeholders when the select changes
  selectElement.addEventListener("change", () => {
    const selectedProductId = selectElement.value;
    const selectedProduct = rdProducts.find(
      (product) => product.product_id == selectedProductId
    );

    if (selectedProduct) {
      // Set the Price placeholder to the selected product's price
      Price.placeholder = selectedProduct.product_price;
    } else {
      Price.placeholder = "0"; // Handle when no product is selected
    }

    const selectedCategoryId = selectedProduct.category_id;
    const selectedCategory = rdCategory.find(
      (category) => category.category_id == selectedCategoryId
    );

    if (selectedCategory) {
      // Set the Category name as the displayed value
      Category.value = selectedCategory.category_name;
    } else {
      Category.value = ""; // Clear the Category value if no category is found
    }

    // Set the Category ID as a custom data attribute
    Category.setAttribute("CategoryId", selectedCategoryId);
  });
};

// const apiCategory = "http://localhost/project/api/category.php";
// const apiProducts = "http://localhost/project/api/products.php";

const showAll = () => {
  const productFormData = new FormData();
  productFormData.append("operation", "showproduct");

  const categoryFormData = new FormData();
  categoryFormData.append("operation", "showCategory");

  axios
    .all([
      axios.post(apiUrlProducts, productFormData),
      axios.post(categoryUrl, categoryFormData),
    ])
    .then(
      axios.spread((productResponse, categoryResponse) => {
        const products = productResponse.data;
        const categories = categoryResponse.data;

        if (products.length == 0) {
          alert("No Products Found");
        } else {
          // Call the getAllCategory function to populate the select element
          getAllCategory(products, categories);
        }
      })
    )
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};


// Function to fetch and populate customer names
const populateCustomerSelect = () => {
  const customerSelect = document.getElementById("customerSelect");

  // Create a FormData object with the operation to fetch customer data
  const customerFormData = new FormData();
  customerFormData.append("operation", "showCustomer");

 

  // Fetch customer data from the API
  axios
      .post(urlCustomer, customerFormData)
      .then((response) => {
          const customers = response.data;

          // Loop through the customers and create an option element for each
          customers.forEach((customer) => {
              const option = document.createElement("option");
              option.value = customer.customer_id; // Set the customer ID as the option value
              option.text = `${customer.customer_fname} ${customer.customer_lname}`; // Display customer's full name
              customerSelect.appendChild(option);
          });
      })
      .catch((error) => {
          console.error("Error fetching customer data:", error);
      });
};

// Call the function to populate the customer select

const showProducts = () => {
  const productFormData = new FormData();
  productFormData.append("operation", "showproduct");

  const categoryFormData = new FormData();
  categoryFormData.append("operation", "showCategory");

  axios
    .all([
      axios.post(apiCategory, productFormData),
      axios.post(apiProducts, categoryFormData),
    ])
    .then(
      axios.spread((productResponse, categoryResponse) => {
        const products = productResponse.data;
        const categories = categoryResponse.data;

        if (products.length == 0) {
          alert("No Products Found");
        } else {
          getAllRecord(products, categories);
        }
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

// Display Sales


const showSales = () => {
  const salesFormData = new FormData();
  salesFormData.append("operation", "showSales");

  axios({
    url: urlSales,
    method: "POST",
    data: salesFormData,
  }).then((response) =>{
    if(response.length == 0){
      alert("No Sales Found!!");
    }else{


      
      displayData(response.data);
      addPaginationButtons(response.data);
      // console.log(response.data)
    }
  }).catch((error) => {
    // console.error("Error fetching data:", error);
  })

 
};


const getAllRecord = (rdSales) => {

  const mainDiv = document.getElementById("blankTable");

  var html = ` <br> 
    <table class="table table-hover table-dark" style="text-align: center;">
      <thead>
        <tr>
          <th>Sales ID</th>
          <th>Customer Name</th>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
  `;



  rdSales.forEach((sale) => {


    
    salesId = sale.sales_id
    productName = sale.product_name
    categoryName = sale.category_name
   categoryId = sale.category_id 
   productId = sale.product_id
   priceId = sale.product_price
   quantity = sale.sales_quantity

   TotalPrice = sale.sales_quantity * sale.product_price



    html += `
    <tr>
    
    <td>${sale.sales_id}</td>
    <td>${sale.customer_fname} ${sale.customer_lname}</td>
    <td>${sale.product_name}</td>
    <td>${sale.category_name}</td>
    <td>${sale.product_price}</td>
    <td>${sale.sales_quantity}</td>



    
    <td>${TotalPrice}</td>
    <td><button type="button" class="btn btn-primary" onclick='salesUpdate("${salesId}", "${productName}", "${categoryName}", "${categoryId}", "${productId}", "${priceId}", "${quantity}")'>Update</button></td>
    <td><button type="button" class="btn btn-danger" onclick='SalesDelete("${sale.sales_id}")'>Delete</button></td>
    `
  });


  html+= `
    </tbody>
    </table>
  `

  mainDiv.innerHTML = html;

};



const setEventListener = () => {
  document.getElementById("btnAddSales").addEventListener("click", () => {

    addSales();

  });
};




// Update


const salesUpdate = (salesId, productName, categoryName, categoryId, productId, priceId, quantity) => {


  document.getElementById("blankModalTitle").innerText = "Update Product";
  document.getElementById("blankModalMainDiv").innerHTML = "";
  document.getElementById("blankModalMainDiv2").innerHTML = "";
  document.getElementById("blankModalFooterDiv").innerHTML = "";

  var myHtml = `
    <label for="salesIdUpdate" class="form-label mt-2">Product Id:</label>
    <input type="text" id="salesIdUpdate" class="form-control form-control-sm" value="${salesId}" readonly>

    <label for="salesProdNameUpdate" class="form-label mt-2">Product Name:</label>
    <input type="text" id="salesProdNameUpdate" class="form-control form-control-sm" value="${productName}" >

    <label for="salesProdPriceUpdate" class="form-label mt-2">Product Price:</label>
    <input type="text" id="salesProdPriceUpdate" class="form-control form-control-sm" value="${priceId}">

   
   
  `;
  const selectElement = document.createElement("select");
  selectElement.setAttribute("class", "form-select form-select-sm mb-3");
  selectElement.setAttribute("aria-label", ".form-select-sm example");
  selectElement.id = "salesProdCategoryUpdate";
  
  const option = document.createElement("option");
  option.text = categoryName;
  option.value = categoryId;

  selectElement.appendChild(option);

  myHtml += `
    <label for="salesProdCategoryUpdate" class="form-label mt-2">Category:</label>
    ${selectElement.outerHTML}
    `;
    myHtml += `
    <label for="salesProdQuantityUpdate" class="form-label mt-2">Quantity:</label>
    <input type="text" id="salesProdQuantityUpdate" class="form-control form-control-sm" value="${quantity}">
  `;

  document.getElementById("blankModalMainDiv").innerHTML = myHtml;

  const btnUpdate = document.createElement("button");
  btnUpdate.innerText = "Update";
  btnUpdate.classList.add("btn", "btn-primary", "mt-3", "btn-sm", "w-300");
  btnUpdate.onclick = () => {
    saveUpdate();
  };

  document.getElementById("blankModalMainDiv2").appendChild(btnUpdate);
  
  // Show the modal
  const myModal = new bootstrap.Modal(document.getElementById("blankModal"), {
    keyboard: true,
    backdrop: "static",
  });
  myModal.show();
};

const saveUpdate = () => {

    const selectElement = document.getElementById("salesProd");
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  const productId = selectedOption.getAttribute("prodId");


  const json = {

    salesprod: productId,

    salesId: document.getElementById("salesIdUpdate").value,

    salesQuantity: document.getElementById("salesProdQuantityUpdate").value,
  };





  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "updateSales");

  axios({
    url: urlSales,
    method: "post",
    data: formData,
  })
    .then((response) => {
      if (response.data === 0) {
        alert("Sales Update failed");
      } else {


        alert("Sales Updated successfully");
        location.reload();
      }
    })
    .catch((error) => {
      alert("Error Updating Sales: " + error);
    });
};



// Delete
const SalesDelete = (salesId) => {
  const confirmDelete = window.confirm("Do you want to delete this product?");
  if (confirmDelete) {
      const json = {
          salesId: salesId // Match the variable name to the PHP code
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(json));
      formData.append("operation", "deleteSales");

      axios({
          url: apiSales, 
          method: "post",
          data: formData,
      })
      .then((response) => {
          if (response.data == 0) {
              alert("Error: Invalid");
          } else {
              alert("Successfully Deleted");
              location.reload();
          }
      })
      .catch((error) => {
          console.error(error);
          alert("An error occurred while deleting the product.");
      });
  }
};




populateCustomerSelect();
showAll();
showSales();
setEventListener();
