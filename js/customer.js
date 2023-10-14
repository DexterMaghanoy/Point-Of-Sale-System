
const userId = sessionStorage.getItem("userid");

const urlCustomer = `http://localhost/project/api/customer.php?userId=${userId}`;
const urlUser =  "http://localhost/project/api/user.php";


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
document.getElementById("btnAddCustomer").addEventListener("click", () => {
  addCustomer();
});

const addCustomer = () => {

  const userId = sessionStorage.getItem("userid");
  const user = userId;
const customerFirstName = document.getElementById("customerFirstName").value;
const customerLastName = document.getElementById("customerLastName").value;

if (!customerFirstName || !customerLastName) {
  alert("Please fill in all the required fields.");
  return; // Exit the function if any field is empty
}

const json = {
  user:user,
  customerFirstName: customerFirstName,
  customerLastName: customerLastName,

};

const formData = new FormData();
formData.append("json", JSON.stringify(json));
formData.append("operation", "addCustomer");

axios({
  url: urlCustomer,
  method: "post",
  data: formData,
})
  .then((response) => {
    if (response.data == 0) {
      alert("Customer Not Added");
    } else {
      alert("Customer Added Successfully");
      location.reload();
    }
  })
  .catch((error) => {
    console.error(error);
    alert("An error occurred while adding the customer.");
  });
};



// Display Customer table
const getAllRecord = (rdCustomer) => {
  const mainDiv = document.getElementById("blankTable");
  var html = `
    <br>
    <table style="text-align:center;" class="table table-hover table-dark">
      <thead>
        <tr> 
          <th>Customer Id</th>
          <th>Customer Name</th>
          <th>Customer Surname</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
  `;

  rdCustomer.forEach((customer) => {

    html += `
      <tr>
        <td>${customer.customer_id}</td>
        <td>${customer.customer_fname}</td>
        <td>${customer.customer_lname}</td>
        <td><button type="button" class="btn btn-primary" onclick='UpdateCustomerModal("${customer.customer_id}", "${customer.customer_fname}", "${customer.customer_lname}")'>Update</button></td>
        <td><button type="button" class="btn btn-danger" onclick='CategoryDelete("${customer.customer_id}")'>Delete</button></td>
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
const showCustomer = () => {
  const formData = new FormData();



  formData.append("operation", "showCustomer");

  axios({
    url: urlCustomer,
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


// Update Customer
UpdateCustomerModal = (customerId, customerFName, customerLName) => {
  document.getElementById("blankModalTitle").innerText = "Update Category";
  document.getElementById("blankModalMainDiv").innerText = "";
  document.getElementById("blankModalMainDiv2").innerText = "";
  document.getElementById("blankModalFooterDiv").innerText = "";

  var myHtml = `
    <label for="customerId" class="form-label mt-2">Customer Id:</label>
    <input type="text" id="customerId" class="form-control form-control-sm" value="${customerId}" readonly>

    <label for="customerFName" class="form-label mt-2">Customer First Name:</label>
    <input type="text" id="customerFName" class="form-control form-control-sm" value="${customerFName}" >

    <label for="customerLName" class="form-label mt-2">Customer Last Name:</label>
    <input type="text" id="customerLName" class="form-control form-control-sm" value="${customerLName}" >
  `;

  document.getElementById("blankModalMainDiv").innerHTML = myHtml;

  const btnRegister = document.createElement("button");
  btnRegister.innerText = "Update";

  btnRegister.classList.add("btn", "btn-primary", "mt-3", "btn-sm", "w-300");

  btnRegister.onclick = () => {
    saveCustomerUpdate();
  };

  document.getElementById("blankModalMainDiv2").append(btnRegister);

  const myModal = new bootstrap.Modal(document.getElementById("blankModal"), {
    keyboard: true,
    backdrop: "static",
  });
  myModal.show();
};

const saveCustomerUpdate = () => {
  const json = {
    customer_id: document.getElementById("customerId").value,
    customerFName: document.getElementById("customerFName").value,
    customerLName: document.getElementById("customerLName").value,
  };

  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "updateCustomer");

  axios({
    url: urlCustomer,
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
const CategoryDelete = (customerId) => {
  const confirmDelete = window.confirm("Do you want to delete this category?");
  if (confirmDelete) {
    const json = {
      customer_id: customerId,
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "deleteCustomer");

    axios({
      url: urlCustomer,
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
        alert("An error occurred while deleting the customer.");
      });
  }
};



showCustomer();











