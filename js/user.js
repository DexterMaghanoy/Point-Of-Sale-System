const login = () => {
    const url = "http://localhost/project/api/user.php";
    const json = {
      username: document.getElementById("txtUsernames").value,
      pword: document.getElementById("txtPasswords").value


    };
  


    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "login");
    

    axios({
      url: url,
      method: "post",
      data: formData,
    }).then((response) => {
      if (response.data == 0) {
        alert("Login Failed");


      } else {
       

        alert("Login Success");
        sessionStorage.setItem('userid', response.data.user_id);

        sessionStorage.setItem('fullname', response.data.user_fullname);

        sessionStorage.setItem('username', response.data.user_username);
     
        sessionStorage.setItem('password', response.data.user_password);



           window.location = "dashboard.html";

      }
    });
  };

  
  const register = () => {
    document.getElementById("blankModalTitle").innerText = "Register";
    document.getElementById("blankModalMainDiv").innerText = "";
    document.getElementById("blankModalMainDiv2").innerText = "";
    document.getElementById("blankModalFooterDiv").innerText = "";
  
    var myHtml = `
     <label for="txtFullname" class="form-label mt-2">Full Name</label>
      <input type="text" id="txtFullname" class="form-control form-control-sm">
      <label for="txtUsername" class="form-label mt-2">Username</label>
      <input type="text" id="txtUsername" class="form-control form-control-sm">
      <label for="txtPassword" class="form-label mt-2">Password</label>
      <input type="password" id="txtPassword" class="form-control form-control-sm">
      <label for="txtCPassword" class="form-label mt-2">Retype Password</label>
      <input type="password" id="txtCPassword" class="form-control form-control-sm"> 
      `;
  
    document.getElementById("blankModalMainDiv").innerHTML = myHtml;
  
    const btnRegister = document.createElement("button");
    btnRegister.innerText = "Register";
    btnRegister.classList.add("btn", "btn-primary", "mt-3", "btn-sm", "w-300");
    btnRegister.onclick = () => {
      saveRegistration();
    };
  
    document.getElementById("blankModalMainDiv2").append(btnRegister);
  
    const myModal = new bootstrap.Modal(document.getElementById("blankModal"), {
      keyboard: true,
      backdrop: "static",
    });
    myModal.show();
  };
  
  const saveRegistration = () => {
    const url = "http://localhost/project/api/user.php";
    const json = {
      fullname: document.getElementById("txtFullname").value,
      username: document.getElementById("txtUsername").value,
      pword: document.getElementById("txtPassword").value,
    };
  
    
    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "signup");
  
    if (
      document.getElementById("txtFullname").value == "" &&
      document.getElementById("txtUsername").value == "" &&
      document.getElementById("txtPassword").value == ""
    ) {
      alert("Please Input All Values");
      return;
    } else if (
      !document.getElementById("txtFullname").value == "" &&
      document.getElementById("txtUsername").value == "" &&
      document.getElementById("txtPassword").value == ""
    ) {
      alert("Please Enter Username & Password");
      return;
    } else if (
      document.getElementById("txtFullname").value == "" &&
      !document.getElementById("txtUsername").value == "" &&
      !document.getElementById("txtPassword").value == ""
    ) {
      alert("Please Enter Full Name");
      return;
    } else if (
      !document.getElementById("txtFullname").value == "" &&
      !document.getElementById("txtUsername").value == "" &&
      document.getElementById("txtPassword").value == ""
    ) {
      alert("Please Enter Username & Password");
      return;
    }
  
    if (
      document.getElementById("txtPassword").value !==
        document.getElementById("txtCPassword").value ||
      document.getElementById("txtCPassword").value !==
        document.getElementById("txtPassword").value
    ) {
      alert("Error Password/Confirm Passsword Not Match");
      return;
    }
  


    axios({
      url: url,
      method: "post",
      data: formData,
    }).then((response) => {
      if (response.data == 0) {
        alert("Error Invalid");
      } else {
        alert("Successfully Registered");



        alert(response.data.user_password);

        const myModal = bootstrap.Modal.getInstance(
          document.getElementById("blankModal")
        );
        myModal.hide();
      }
    });
  };


    
    document.getElementById("btnLogin").addEventListener("click", () => {
      login();
    });
    document.getElementById("linkRegister").addEventListener("click", () => {
      register();
    });


