// var user = localStorage.getItem('user');
// if (user != null) {
//     window.location.href = "index.html";
// }

$("#err").html("");
$("#errReg").html("");
function Login(e) {
  e.preventDefault();
  const form_data = new FormData();
  form_data.append("accountName", $("#username").val());
  form_data.append("password", $("#password").val());
  // debugger;
  $.ajax({
    type: "POST",
    url: "http://localhost:4006/api/token",
    processData: false,
    contentType: false,
    data: form_data,
  })
    .done(function (data) {
      // debugger;
      if (data != null && data.error != null && data.error != "undefined") {
        Swal.fire("Error", data.error, "error");
        console.log(data.error);
      } else {
        Swal.fire("Success", "Login successful", "success");
        // debugger;
        if (data.Role == "Admin") {
          localStorage.setItem("admin", data.Token);
          window.location.href = "admin.html";
        } else if (data.Role == "Staff") {
          localStorage.setItem("staff", data.Token);
          window.location.href = "admin.html";
        } else if (data.Role == "User") {
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "index.html";
        }
      }
    })
    .fail(function () {
      console.log("Request failed: ", textStatus, errorThrown);
      $("#err").html("Account or password is incorrect");
    });
}

function Register(e) {
  e.preventDefault();
  const data = {
    accountName: $("#usernameForRegister").val(),
    password: $("#passwordForRegister").val(),
  };
  // debugger;
  $.ajax({
    type: "POST",
    url: "http://localhost:4006/api-user/Users/register",
    contentType: "application/json",
    data: JSON.stringify(data),
  })
    .done(function (data) {
      // debugger;
      if (data != null && data.error != null && data.error != "undefined") {
        Swal.fire("Error", data.error, "error");
        console.log(data.error);
      } else {
        Swal.fire("Success", data.message, "success");
      }
    })
    .fail(function () {
      console.log("Request failed: ", textStatus, errorThrown);
      $("#errReg").html("Account or password is incorrect");
    });
}
