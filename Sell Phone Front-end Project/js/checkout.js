var token = localStorage.getItem("admin");
// get user from local storage
var user = JSON.parse(localStorage.getItem("user"));
var userId = user.AccountId;
var staffId = "";
var voucherId = "";

// ============================================> button place order <================================================================
document
  .getElementById("placeOrderBtn")
  .addEventListener("click", function (e) {
    e.preventDefault();

    // field
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    // các input radio có name là payment
    const paymentMethods = document.getElementsByName("payment");
    let selectedMethod = null;

    for (const method of paymentMethods) {
      if (method.checked) {
        selectedMethod = method.id;
        break;
      }
    }

    if (!selectedMethod) {
      Swal.fire("Warning!", "Please select a method to pay", "warning");
      return;
    }

    const termsCheckbox = document.getElementById("terms");
    if (!termsCheckbox.checked) {
      Swal.fire(
        "Warning!",
        "Please agree to the terms and conditions",
        "warning"
      );
      return;
    }

    // ================> start add order <================================================================
    if (userId == null || userId == undefined || userId == "") {
      Swal.fire("Warning!", "Please login to place order", "warning");
      return;
    }
    if (staffId == null || staffId == undefined || staffId == "") {
      Swal.fire("Warning!", "Please select a staff to place order", "warning");
      return;
    }
    if (voucherId == null || voucherId == undefined || voucherId == "") {
      Swal.fire(
        "Warning!",
        "Please select a voucher to place order",
        "warning"
      );
      return;
    }
    // get product from cart in local storage
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart.length <= 0) {
      console.error("Cart is empty || Cart is not valid!");
      return;
    }

    var orderDetail = cart
      .filter((item) => item.selected === true)
      .map((item) => {
        return {
          orderDetailId: 0,
          orderId: 0,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discountAmount: 0,
          voucherId: voucherId,
          orderDetailStatus: 0,
        };
      });
    const now = new Date();
    const isoString = now.toISOString();
    // create order
    var order = {
      orderId: 0,
      userId: userId,
      staffId: staffId,
      orderStatus: "Pending Confirmation",
      dayBuy: isoString,
      deliveryAddress: address ? address : "Hung Yen",
      evaluate: 5,
      deleted: false,
      listjson_orderDetail: orderDetail,
    };
    // debugger;
    // add order to database
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-user/Orders/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(order),
      processData: false,
      success: function (data) {
        Swal.fire("Success", "Order created successfully", "success").then(
          () => {
            // delete product from cart in local storage
            var updatedCart = cart.filter((item) => item.selected !== true);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            // ============================> change page <=====================================
            // debugger;
            switch (selectedMethod) {
              case "payment-1":
                window.location.href = "payment.html";
                break;
              case "payment-2":
                Swal.fire(
                  "Success",
                  "Please wait for order confirmation",
                  "success"
                );
                window.location.href = "order.html";
                break;
              case "payment-3":
                window.location.href = "payment.html";
                break;
              default:
                Swal.fire("Error", "Invalid payment method!", "error");
                break;
            }
          }
        );
      },
      error: function (xhr, status, error) {
        console.error(error);
      },
    });
    // ===========================> end add order <=============================================
  });

//   ===========================> get staffId <=====================================
function getStaffId() {
  // get staffId from database
  $.ajax({
    type: "GET",
    url: `http://localhost:4006/api-admin/staff/page=1&pageSize=1`,
    headers: { Authorization: "Bearer " + token },
    success: function (response) {
      //   debugger;
      if (response && response.length > 0) {
        staffId = response[0].staffId;
      } else {
        console.error("No found staff!");
      }
      //   debugger;
    },
    error: function (error) {
      console.error("Request failed: ", error);
    },
  });
}

// ==========================> get voucherId <=====================================
function getVoucherId() {
  // get voucherId from database
  $.ajax({
    type: "GET",
    url: "http://localhost:4006/api-admin/Voucher/get-all",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    processData: false,
    success: function (data) {
      //   debugger;
      if (data && data.length > 0) {
        voucherId = data[0].voucherId;
      } else {
        console.error("No found voucher!");
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}

// ==========================> call function <=====================================
getStaffId();
getVoucherId();
