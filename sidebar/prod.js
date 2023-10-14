
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
  const url = "http://localhost/project/api/products.php";
  const prodname = document.getElementById("prodname").value;
  const prodprice = document.getElementById("prodprice").value;
  const prodquantity = document.getElementById("prodquantity").value;
  const prodcategory = document.getElementById("prodcategory").value;

  if (!prodname || !prodprice || !prodquantity || !prodcategory) {
    alert("Please fill in all the required fields.");
    return; // Exit the function if any field is empty
  }

  const json = {
    prodname: prodname,
    prodprice: prodprice,
    prodquantity: prodquantity,
    prodcategory: prodcategory,
  };

  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "addproduct");

  axios({
    url: url,
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
      alert(error);
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
        <td><button type="button" class="btn btn-primary" onclick='modalUpdate("${product.product_id}", "${product.product_name}", "${product.product_price}" ,"${category.category_id}" ,"${categoryName}" ,"${product.quantity}")'>Update</button></td>
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

        console.log(categoryUrl);



        if (products.length == 0) {
          

          alert("No Products Found");
        } else {

          console.log(products);

          displayProducts(products, categories);
          addPaginationButtons(products, categories);

        }
      })
    )
    .catch((error) => {
      alert(error);

    });
};

const setEventListener = () => {
  document.getElementById("btnAddProduct").addEventListener("click", () => {
    addProducts();
  });
};

showcategory();
showProducts();
setEventListener();
