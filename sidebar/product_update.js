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
  btnUpdate.classList.add("btn", "btn-success", "mt-3", "btn-sm", "w-300");
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
        alert("Product update failed");
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


