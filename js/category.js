const userId = sessionStorage.getItem("userid");


const categoryUrl = `http://localhost/project/api/category.php?userId=${userId}`;

const itemsPerPage = 4; // Number of items to display per page
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

// Function to update "Next" button visibility
const updateNextButtonVisibility = (data) => {
  const nextBtn = document.getElementById("nextBtn");
  if (currentPage === Math.ceil(data.length / itemsPerPage)) {
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


// Create Or Add
document.getElementById("btnAddCategory").addEventListener("click", () => {
  addCategory();
});

const addCategory = () => {

  const userId = sessionStorage.getItem("userid");
  const user = userId;
  const categoryname = document.getElementById("categoryname").value;
  const categorycode = document.getElementById("categorycode").value;

  if (!categoryname || !categorycode ) {
    alert("Please fill in all the required fields.");
    return; // Exit the function if any field is empty
  }

  const json = {
    user:user,
    categoryname: categoryname,
    categorycode: categorycode,
  };


  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "addCategory");

  axios({
    url: categoryUrl,
    method: "post",
    data: formData,
  }).then((response) => {
    if (response.data == 0) {


      alert("Category Not Added");
    } else {

      alert("Category Added Successfully");
      location.reload();
    }
  });
};

// Function to display table data
const getAllRecord = (rdCategory) => {



  const mainDiv = document.getElementById("blankTable");
  var html = `<br>
        <table class="table table-hover table-dark">
            <thead>
                <tr>
                    <th>Category ID</th>
                    <th>Category Name</th>
                    <th>Code</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
    `;
  rdCategory.forEach((category) => {
    html += `
              <tr>
                  <td>${category.category_id}</td>
                  <td>${category.category_name}</td>
                  <td>${category.category_code}</td>
                  <td><button type="button" id="btnUpdate" class="btn btn-primary" onclick='UpdateCategoryModal("${category.category_id}", "${category.category_name}", "${category.category_code}")'>Update</td>
                  <td><button type="button" class="btn btn-danger" onclick='CategoryDelete("${category.category_id}")'>Delete</button></td>
              </tr>
          `;
  });

  html += `
        </tbody>
        </table>
    `;

  mainDiv.innerHTML = html;
};

// Read or Show/Display
const showCategory = () => {
  const formData = new FormData();
  formData.append("operation", "showCategory");
  axios({

    url: categoryUrl,
    method: "POST",
    data: formData,
  })
    .then((response) => {
      if (response.data.length == 0) {
        alert("No Category Found");
      } else {
        displayData(response.data); // Display data for the first page
        addPaginationButtons(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Edit or Update
UpdateCategoryModal = (categoryId, categoryName, categoryCode) => {
  document.getElementById("blankModalTitle").innerText = "Update Category";
  document.getElementById("blankModalMainDiv").innerText = "";
  document.getElementById("blankModalMainDiv2").innerText = "";
  document.getElementById("blankModalFooterDiv").innerText = "";

  var myHtml = `
    <label for="categoryId" class="form-label mt-2">Category Id:</label>
    <input type="text" id="categoryId" class="form-control form-control-sm" value="${categoryId}" readonly>

    <label for="categoryName" class="form-label mt-2">Category Name:</label>
    <input type="text" id="categoryName" class="form-control form-control-sm" value="${categoryName}" >

    <label for="categoryCode" class="form-label mt-2">Code:</label>
    <input type="text" id="categoryCode" class="form-control form-control-sm" value="${categoryCode}" >
  `;

  document.getElementById("blankModalMainDiv").innerHTML = myHtml;

  const btnRegister = document.createElement("button");
  btnRegister.innerText = "Update";

  btnRegister.classList.add("btn", "btn-primary", "mt-3", "btn-sm", "w-300");

  btnRegister.onclick = () => {
    saveCategoryUpdate();
  };

  document.getElementById("blankModalMainDiv2").append(btnRegister);

  const myModal = new bootstrap.Modal(document.getElementById("blankModal"), {
    keyboard: true,
    backdrop: "static",
  });
  myModal.show();
};

const saveCategoryUpdate = () => {
  const json = {
    category_id: document.getElementById("categoryId").value,
    categoryname: document.getElementById("categoryName").value,
    categorycode: document.getElementById("categoryCode").value,
  };

  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "updateCategory");

  axios({
    url: categoryUrl,
    method: "post",
    data: formData,
  }).then((response) => {
    if (response.data == 0) {
      alert("Error Invalid");
    } else {
      alert("Successfully Updated");
      const myModal = bootstrap.Modal.getInstance(
        document.getElementById("blankModal")
      );
      myModal.hide();
      location.reload();
    }
  });
};

// Delete Category
const CategoryDelete = (categoryId) => {
  const confirmDelete = window.confirm("Do you want to delete this category?");
  if (confirmDelete) {
    const json = {
      category_id: categoryId,
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "deleteCategory");

    axios({
      url: categoryUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        if (response.data == 0) {
          alert("Error Invalid");
        } else {
          alert("Successfully Deleted");
          location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while deleting the category.");
      });
  }
};

// Call showCategory to initialize the table and pagination
showCategory();
