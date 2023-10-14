
// API links

const userId = sessionStorage.getItem("userid");

const categoryUrl = `http://localhost/project/api/category.php?userId=${userId}`;
const apiUrlProducts = `http://localhost/project/api/products.php?userId=${userId}`;

const itemsPerPage = 5; // Number of products to display per page
let currentPage = 1;    // Current page

// Function to display a subset of products based on the current page
const displayProducts = (products, categories) => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageProducts = products.slice(startIdx, endIdx);

  getAllRecord(pageProducts, categories);
};

// Function to handle "Next" button click
const nextPage = (products, categories) => {
  if (currentPage < Math.ceil(products.length / itemsPerPage)) {
    currentPage++;
    displayProducts(products, categories);
    updatePrevButtonVisibility();
  }
  updateNextButtonVisibility(products);
};

// Function to handle "Previous" button click
const prevPage = (products, categories) => {
  if (currentPage > 1) {
    currentPage--;
    displayProducts(products, categories);
    updateNextButtonVisibility(products);
  }
  updatePrevButtonVisibility();
};

// Function to update "Next" button visibility
const updateNextButtonVisibility = (products) => {
  const nextBtn = document.getElementById("nextBtn");
  if (currentPage === Math.ceil(products.length / itemsPerPage)) {
    nextBtn.style.display = "none"; // Hide "Next" button on the last page
  } else {
    nextBtn.style.display = "inline-block"; // Show "Next" button when not on the last page
  }
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

// Function to add "Next" and "Previous" buttons
const addPaginationButtons = (products, categories) => {
  const paginationDiv = document.getElementById("paginationDiv");
  
  paginationDiv.innerHTML = `
  <button class="btn btn-info" id="prevBtn" style="display: none;"> <- Previous</button>
`;

paginationDiv.innerHTML += `
  <button class="btn btn-info" id="nextBtn">Next -></button>
`;
  document.getElementById("prevBtn").addEventListener("click", () => {
    prevPage(products, categories);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    nextPage(products, categories);
  });

  updatePrevButtonVisibility(); // Initial visibility check for "Previous" button
  updateNextButtonVisibility(products); // Initial visibility check for "Next" button
};




// Create or Add New Product
const addProducts = () => {

  const userId = sessionStorage.getItem("userid");
  const user = userId;

  const prodname = document.getElementById("prodname").value;
  const prodprice = document.getElementById("prodprice").value;
  const prodquantity = document.getElementById("prodquantity").value;
  const prodcategory = document.getElementById("prodcategory").value;

  if (!prodname || !prodprice || !prodquantity || !prodcategory) {
    alert("Please fill in all the required fields.");
    return; // Exit the function if any field is empty
  }

  const json = {
    user:user,
    prodname: prodname,
    prodprice: prodprice,
    prodquantity: prodquantity,
    prodcategory: prodcategory,
  };

  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "addproduct");

  axios({
    url: apiUrlProducts,
    method: "post",
    data: formData,
  }).then((response) => {
    if (response.data == 0) {
      alert("Login Failed");
    } else {
      alert("Product Added Successfully");
      location.reload();
    }
  });
};


// To Show the Category List in Select Tag
const getAllCategory = (rdCategory) => {
  const selectElement = document.getElementById("prodcategory");
  selectElement.setAttribute("class", "form-select form-select-sm mb-3");
  selectElement.setAttribute("aria-label", ".form-select-sm example");

  rdCategory.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.category_id;
    option.text = category.category_name;
    selectElement.appendChild(option);
  });
};

const showcategory = () => {
  const formData = new FormData();
  formData.append("operation", "showCategory");

  axios({
    url: categoryUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.length == 0) {
        alert("No Categories Found");
      } else {
        getAllCategory(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};




// Read or Show/Display
const getAllRecord = (rdProducts, rdCategory) => {
  const mainDiv = document.getElementById("blankTable");
  var html = ` <br> 
    <table class="table table-hover table-dark" style="text-align: center;">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Product Price</th>
          <th>Quantity</th>
          <th>Category</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
  `;
  

  rdProducts.forEach((product) => {
    const category = rdCategory.find(
      (cat) => cat.category_id == product.category_id
    );
    const categoryName = category ? category.category_name : "N/A";

    html += `
      <tr>
        <td>${product.product_id}</td>
        <td>${product.product_name}</td>
        <td>${product.product_price}</td>
        <td>${product.quantity}</td>
         <td>${categoryName}</td>
        <td><button type="button" class="btn btn-primary" onclick='modalUpdate("${product.product_id}", "${product.product_name}", "${product.product_price}" ,"${product.category_id}" ,"${categoryName}" ,"${product.quantity}")'>Update</button></td>
        <td><button type="button" class="btn btn-danger" onclick='deleteProduct("${product.product_id}")'>Delete</button></td>
      </tr>
    `;


  });




  html += `
      </tbody>
    </table>
  `;

  mainDiv.innerHTML = html;

};

const showProducts = () => {
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
          displayProducts(products, categories);
          addPaginationButtons(products, categories);
        }
      })
    )
    .catch((error) => {
     console.log(error);

    });
};



const modalUpdate = (productId, productName, productPrice, categoryId, categoryName,quantity) => {

  document.getElementById("blankModalTitle").innerText = "Update Product";
  document.getElementById("blankModalMainDiv").innerHTML = "";
  document.getElementById("blankModalMainDiv2").innerHTML = "";
  document.getElementById("blankModalFooterDiv").innerHTML = "";

  var myHtml = `
    <label for="prodIdUpdate" class="form-label mt-2">Product Id:</label>
    <input type="text" id="prodIdUpdate" class="form-control form-control-sm" value="${productId}" readonly>

    <label for="prodNameUpdate" class="form-label mt-2">Product Name:</label>
    <input type="text" id="prodNameUpdate" class="form-control form-control-sm" value="${productName}" >

    <label for="prodPriceUpdate" class="form-label mt-2">Product Price:</label>
    <input type="text" id="prodPriceUpdate" class="form-control form-control-sm" value="${productPrice}">
    <label for="prodquantityUpdate" class="form-label mt-2">Quantity:</label>
    <input type="text" id="prodquantityUpdate" class="form-control form-control-sm" value="${quantity}">
  `;

  // Add the category name to the select tag as an option
  const selectElement = document.createElement("select");
  selectElement.setAttribute("class", "form-select form-select-lg mb-3");
  selectElement.setAttribute("aria-label", ".form-select-lg example");
  selectElement.id = "prodcategoryUpdate";
  
  const option = document.createElement("option");
  option.text = categoryName;
  option.value = categoryId;



  selectElement.appendChild(option);

  myHtml += `
    <label for="prodcategoryUpdate" class="form-label mt-2">Category:</label>
    ${selectElement.outerHTML}<br>
  `;
  
  document.getElementById("blankModalMainDiv").innerHTML = myHtml;

  // Call showCategoriesUpdate to populate other categories if needed
  showCategoriesUpdate(categoryId);

  const btnUpdate = document.createElement("button");
  btnUpdate.innerText = "Update";
  btnUpdate.classList.add("btn", "btn-primary", "mt-3", "btn-sm", "w-300");
  btnUpdate.onclick = () => {

    saveUpdate();
  };

  document.getElementById("blankModalMainDiv2").appendChild(btnUpdate);
  const myModal = new bootstrap.Modal(document.getElementById("blankModal"), {
    keyboard: true,
    backdrop: "static",
  });
  myModal.show();
};

// Function to create and populate categories in a select element
const getAllCategoryUpdate = (categories, selectId) => {
    const selectElement = document.getElementById(selectId);
  
    // Populate the rest of the options
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.category_id;
      option.text = category.category_name;
      selectElement.appendChild(option);
    });
  
    
  };



  
// Function to fetch and display categories
const showCategoriesUpdate = (selectedCategoryId) => {
  const formData = new FormData();
  formData.append("operation", "showCategory");

  axios({
    url: categoryUrl, // Replace with your API URL
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.length == 0) {
        alert("No Categories Found");
      } else {
        const selectId = "prodcategoryUpdate"; // Define select element ID
        getAllCategoryUpdate(response.data, selectId);
        // Set the selected category (if available)
        if (selectedCategoryId) {
          document.getElementById(selectId).value = selectedCategoryId;

        }
      }
    })
    .catch((error) => {
      alert(error);
    });
};



// Update Save
const saveUpdate = () => {
  const json = {
    productId: document.getElementById("prodIdUpdate").value,
    productName: document.getElementById("prodNameUpdate").value,
    productPrice: document.getElementById("prodPriceUpdate").value,
    quantity: document.getElementById("prodquantityUpdate").value,
    categoryId: document.getElementById("prodcategoryUpdate").value,
  };

  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "updateproduct");

  axios({
    url: apiUrlProducts,

    method: "POST",

    data: formData,
  })
    .then((response) => {
      if (response.data == 0) {
        alert("Product Updated Successfully");
        location.reload();

      } else {
        alert("Product updated successfully");
        location.reload();
      }
    })
    .catch((error) => {
      alert("Error updating product: " + error);
    });
};



// Delete
const deleteProduct = (productId) => {
  const confirmDelete = window.confirm("Do you want to delete this product?");
  if (confirmDelete) {
      const json = {
          product_id: productId // Match the variable name to the PHP code
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(json));
      formData.append("operation", "deleteProduct");

      axios({
          url: apiUrlProducts, // Correct URL where products.php is hosted
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




const setEventListener = () => {
  document.getElementById("btnAddProduct").addEventListener("click", () => {
    addProducts();
  });
};

showcategory();
showProducts();
setEventListener();
