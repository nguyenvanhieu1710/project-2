var user = localStorage.getItem("user");
var myAccount = document.getElementById("my-account");
myAccount.addEventListener("click", function (e) {
  e.preventDefault();
  if (user) {
    window.location.href = "profile.html";
  } else {
    window.location.href = "login.html";
  }
});
