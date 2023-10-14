userUrl ="http://localhost/project/api/user.php";

const userId = sessionStorage.getItem("userid");
const userFullName = sessionStorage.getItem("fullname");

const userName = sessionStorage.getItem("username");
const userPassword = sessionStorage.getItem("password");


const setData = () => {
  
  const userIdInput = document.getElementById("UserIdInput");

  userIdInput.placeholder = userId;

  const userFullNameInput = document.getElementById("UserFullNameInput");
  userFullNameInput.placeholder = userFullName;

  const userNameInput = document.getElementById("UserNameInput");
  userNameInput.placeholder = userName;

  const userPasswordInput = document.getElementById("UserPasswordInput");

  // Count the number of letters in the password
  const letterCount = userPassword.replace(/[^a-zA-Z0-9]/g, "").length;
  const asterisks = "*".repeat(letterCount);
  userPasswordInput.placeholder = asterisks;

  const UserUpdate = document.getElementById("UpdateUserInfo");

  const btnUserUpdate = document.createElement("button"); // "button" is the correct element type
  btnUserUpdate.innerText = "Update";
  btnUserUpdate.classList.add("btn", "btn-info", "mt-3", "btn-sm");
  btnUserUpdate.onclick = () => {

    userUpdate();
    
  };
  UserUpdate.appendChild(btnUserUpdate);
}


// Edit or Update
userUpdate = () => {





  document.getElementById("blankModalTitle").innerText = "Update Category";
  document.getElementById("blankModalMainDiv").innerText = "";
  document.getElementById("blankModalMainDiv2").innerText = "";
  document.getElementById("blankModalFooterDiv").innerText = "";




  var myHtml = `

  <label for="userCurrentPassWord" class="form-label mt-2">Current Password:</label>
  <input type="password" id="userCurrentPassWord" class="form-control form-control-sm" placeholder="Enter Current Password" >

  <br>

    <label for="userFullName" class="form-label mt-2">User Fullname:</label>
    <input type="text" id="userFullName" class="form-control form-control-sm" placeholder="${userFullName}" >

    <label for="userName" class="form-label mt-2">Username:</label>
    <input type="text" id="userName" class="form-control form-control-sm" placeholder="${userName}" >


    <label for="userPassWord" class="form-label mt-2">New Password:</label>
    <input type="password" id="userPassWord" class="form-control form-control-sm" placeholder="Enter New Password">

    <label for="userRetypePassWord" class="form-label mt-2">Retype New Password:</label>
    <input type="password" id="userRetypePassWord" class="form-control form-control-sm" placeholder="Retype your New Password" >
  `;

  document.getElementById("blankModalMainDiv").innerHTML = myHtml;

  const btnUpdateUser = document.createElement("button");
  btnUpdateUser.innerText = "Update";

  btnUpdateUser.classList.add("btn", "btn-primary", "mt-3", "btn-sm", "w-300");

  btnUpdateUser.onclick = () => {
    saveUserUpdate();
  };

  document.getElementById("blankModalMainDiv2").append(btnUpdateUser);

  const myModal = new bootstrap.Modal(document.getElementById("blankModal"), {
    keyboard: true,
    backdrop: "static",
  });
  myModal.show();
};



const saveUserUpdate = () => {

  const url = "http://localhost/project/api/profile.php";

  const json = {
    user_id:userId,
    userFullName: document.getElementById("userFullName").value,
    userName: document.getElementById("userName").value,
    userNewPassWord: document.getElementById("userPassWord").value,
  };



    if
    (
      document.getElementById("userCurrentPassWord").value === "" ||
      document.getElementById("userFullName").value  === "" ||
      document.getElementById("userName").value === "" ||
      document.getElementById("userPassWord").value === "" ||
      document.getElementById("userRetypePassWord").value === ""
    )
    {
      alert("Please Input All Values");
      return;
    }


   else if
    (
      document.getElementById("userCurrentPassWord").value !== userPassword 
    )
    {
      alert("Incorrect Current Password!!!");
      return;
    }
   else if
   (
     document.getElementById("userPassWord").value !== document.getElementById("userRetypePassWord").value
   )
   {
     alert("New Password Don't Match!!");
     return;
   }

  
  const formData = new FormData();
  formData.append("json", JSON.stringify(json));
  formData.append("operation", "saveUserUpdate");


  axios({
    url: url,
    method: "post",
    data: formData,
  }).then((response) => {


  console.log(response.data);

    if (response.data == 0) {
      alert("Error Invalid");
    } else {
      alert("Successfully Updated");
      const myModal = bootstrap.Modal.getInstance(
        document.getElementById("blankModal")
      );
      myModal.hide();

      alert("User Information Updated!! You will be Redirected to Login page!!");
      sessionStorage.clear();
      window.location.href = "index.html";
    }
  });
};


setData();
