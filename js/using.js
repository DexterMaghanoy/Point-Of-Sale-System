const initialize = () => {
  const userElement = document.getElementById("user");
  const fullname = sessionStorage.getItem("fullname");

  if (window.location.href.includes("index.html")) {
    // If on the "index.html" page
    if (fullname != null) {
      // If a user is already logged in, proceed to the dashboard
      window.location.href = "dashboard.html";
    }
  } else {
    if (fullname == null) {
      // If not logged in and not on "index.html", clear session storage and redirect
      sessionStorage.clear();
      window.location.href = "index.html";
    } else {
      userElement.innerHTML = ` ${fullname} `;
    }
  }
}

initialize();

// logout
document.getElementById("LogOut").addEventListener("click", () => {
  const confirmDelete = window.confirm("Do you want to Log Out?");
  if (confirmDelete) {
    sessionStorage.clear();
    window.location.href = "index.html";
  }
});


