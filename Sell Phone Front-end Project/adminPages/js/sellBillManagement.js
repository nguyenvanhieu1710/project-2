$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var billId = "";
  var userIdList = [];
  var staffIdList = [];

  let currentPage = 1;
  const pageSize = 13;

  // Modal create bootstrap
  const exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );

  // Modal trash can bootstrap
  const trashCanModal = new bootstrap.Modal(
    document.getElementById("trashCanModal")
  );

  // Modal order details bootstrap
  const orderDetailsModal = new bootstrap.Modal(
    document.getElementById("orderDetailsModal")
  );

  // ====================================> handle button <===========================================
  var status = 1;
  $(".btn-add-bill").click(function () {
    status = 1;
    $("#exampleModal .modal-title").text("Create Bill");
  });

  $(".btn-update-bill").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-bill").click(function () {
    status = 3;
    deleteVirtualBill();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addBill();
    }
    if (status == 2) {
      updateBill();
    }
  });

  // ====================================> validate data <==========================================
  function validateData() {
    const userId = $("input[name='userId']").val();
    const staffId = $("input[name='staffId']").val();
    const orderStatus = $("select[name='orderStatus']").val();
    const dayBuy = $("input[name='dayBuy']").val();
    const deliveryAddress = $("input[name='deliveryAddress']").val();

    if (!userId || !staffId || !orderStatus || !dayBuy || !deliveryAddress) {
      Swal.fire("Warning!", "Please fill in all required fields!", "warning");
      return false;
    }

    let isValid = true;
    $("#orderDetailsContainer .row").each(function () {
      const quantity = $(this).find("input[name='quantity[]']").val();
      const price = $(this).find("input[name='price[]']").val();

      if (
        !quantity ||
        !price ||
        parseInt(quantity) <= 0 ||
        parseFloat(price) <= 0
      ) {
        isValid = false;
        Swal.fire(
          "Warning!",
          "Quantity and Price must be greater than zero!",
          "warning"
        );
        return false;
      }
    });

    return isValid;
  }

  // ====================================> add bill <==========================================
  function addBill() {
    if (!validateData()) {
      return;
    }
    var userId = $("input[name='userId']").val();
    var staffId = $("input[name='staffId']").val();
    var orderStatus = $("select[name='orderStatus']").val();
    var dayBuy = $("input[name='dayBuy']").val();
    var deliveryAddress = $("input[name='deliveryAddress']").val();
    var evaluate = $("input[name='evaluate']").val();

    const orderDetails = [];

    $("#orderDetailsContainer .row").each(function () {
      const detail = {
        orderDetailId:
          $(this).find("input[name='orderDetailId[]']").val() || null,
        productId: $(this).find("input[name='productId[]']").val() || null,
        quantity: $(this).find("input[name='quantity[]']").val() || null,
        price: $(this).find("input[name='price[]']").val() || null,
        discountAmount:
          $(this).find("input[name='discountAmount[]']").val() || 0,
        voucherId: $(this).find("input[name='voucherId[]']").val() || null,
        orderDetailStatus: $(this).find("input[name='status[]']").val() || "2",
      };
      orderDetails.push(detail);
    });

    const raw_data = {
      billId: billId,
      userId: userId,
      staffId: staffId,
      orderStatus: orderStatus,
      dayBuy: dayBuy,
      deliveryAddress: deliveryAddress,
      evaluate: evaluate,
      deleted: false,
      listjson_orderDetail: orderDetails,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Bill/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
      data: JSON.stringify(raw_data),
    })
      .done(function (data) {
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Warning!", data.error, "warning");
          // console.log(data.error);
        } else {
          exampleModal.hide();
          Swal.fire("Succeed!", "Add Bill Success", "success");
          fetchBills(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =====================================> turn on modal to update <==========================================
  function TurnOnModalToUpdate() {
    if ($("input.bill-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one bill to update.",
        "warning"
      );
      return;
    }

    if ($("input.bill-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a bill to update.", "warning");
      return;
    }

    $(".bill-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      billId = id;
    });

    // debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/Bill/get-data-by-id/" + billId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // debugger;
        if (!data) {
          Swal.fire("Error!", data.error, "error");
        } else {
          // debugger;
          $("input[name='userId']").val(data.userId || "");
          $("input[name='staffId']").val(data.staffId || "");
          $("select[name='orderStatus']").val(data.orderStatus || "");
          $("input[name='dayBuy']").val(
            data.dayBuy ? data.dayBuy.split("T")[0] : ""
          );
          $("input[name='deliveryAddress']").val(data.deliveryAddress || "");
          $("input[name='evaluate']").val(data.evaluate || "");

          const orderDetailsContainer = $("#orderDetailsContainer");
          orderDetailsContainer.empty();

          data.listjson_orderDetail.forEach((detail) => {
            const detailRow = `
              <div class="row mb-3">
                <div class="col-md-2">
                  <label for="orderDetailId" class="form-label">Order Detail ID</label>
                  <input type="number" name="orderDetailId[]" class="form-control border" value="${
                    detail.orderDetailId || ""
                  }" />
                </div>
                <div class="col-md-2">
                  <label for="productId" class="form-label">Product ID</label>
                  <input type="number" name="productId[]" class="form-control border" value="${
                    detail.productId || ""
                  }" />
                </div>
                <div class="col-md-2">
                  <label for="quantity" class="form-label">Quantity</label>
                  <input type="number" name="quantity[]" class="form-control border" value="${
                    detail.quantity || ""
                  }" />
                </div>
                <div class="col-md-2">
                  <label for="price" class="form-label">Price</label>
                  <input type="number" name="price[]" class="form-control border" value="${
                    detail.price || ""
                  }" />
                </div>
                <div class="col-md-2">
                  <label for="discountAmount" class="form-label">Discount Amount</label>
                  <input type="number" name="discountAmount[]" class="form-control border" value="${
                    detail.discountAmount || "0"
                  }" />
                </div>
                <div class="col-md-2">
                  <label for="voucherId" class="form-label">Voucher ID</label>
                  <input type="number" name="voucherId[]" class="form-control border" value="${
                    detail.voucherId || ""
                  }" />
                </div>
                <div class="col-md-2">
                  <label for="status" class="form-label">Status</label>
                  <input type="text" name="status[]" class="form-control border" value="${
                    detail.status || "2"
                  }" />
                </div>
              </div>
            `;
            orderDetailsContainer.append(detailRow);
          });

          exampleModal.show();

          $("#exampleModalLabel").text("Update Bill");
          $(".modal-title").text("Update Bill");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> update bill <==========================================
  function updateBill() {
    if (!validateData()) {
      return;
    }
    var userId = $("input[name='userId']").val();
    var staffId = $("input[name='staffId']").val();
    var orderStatus = $("select[name='orderStatus']").val();
    var dayBuy = $("input[name='dayBuy']").val();
    var deliveryAddress = $("input[name='deliveryAddress']").val();
    var evaluate = $("input[name='evaluate']").val();

    const orderDetails = [];

    $("#orderDetailsContainer .row").each(function () {
      const detail = {
        orderDetailId:
          $(this).find("input[name='orderDetailId[]']").val() || null,
        productId: $(this).find("input[name='productId[]']").val() || null,
        quantity: $(this).find("input[name='quantity[]']").val() || null,
        price: $(this).find("input[name='price[]']").val() || null,
        discountAmount:
          $(this).find("input[name='discountAmount[]']").val() || 0,
        voucherId: $(this).find("input[name='voucherId[]']").val() || null,
        orderDetailStatus: $(this).find("input[name='status[]']").val() || "2",
      };
      orderDetails.push(detail);
    });

    const raw_data = {
      orderId: billId,
      userId: userId,
      staffId: staffId,
      orderStatus: orderStatus,
      dayBuy: dayBuy,
      deliveryAddress: deliveryAddress,
      evaluate: evaluate,
      deleted: false,
      listjson_orderDetail: orderDetails,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Bill/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(raw_data),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
        } else {
          exampleModal.hide();
          Swal.fire("Success!", "Update Bill Success", "success");
          fetchBills(currentPage, pageSize);
          fetchDeletedBills(currentPage, pageSize);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> delete bill <==========================================
  function deleteBill(billId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Bill/delete/" + billId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "warning");
        } else {
          trashCanModal.hide();
          Swal.fire("Success!", "Delete Bill Success.", "success");
          fetchBills(currentPage, pageSize);
          fetchDeletedBills(currentPage, pageSize);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =========================================> delete virtual Bill <==================================================================
  function deleteVirtualBill() {
    if ($("input.bill-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one bill to update.",
        "warning"
      );
      return;
    }

    if ($("input.bill-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a bill to update.", "warning");
      return;
    }

    $(".bill-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      billId = id;
    });

    // debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/bill/get-data-by-id/" + billId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
          console.log(data.error);
        } else {
          // debugger;
          var userId = data.userId;
          var staffId = data.staffId;
          var orderStatus = data.orderStatus;
          var dayBuy = data.dayBuy;
          var deliveryAddress = data.deliveryAddress;
          var evaluate = data.evaluate;
          var listjson_orderDetail = data.listjson_orderDetail;

          var raw_data = {
            orderId: billId,
            userId: userId,
            staffId: staffId,
            orderStatus: orderStatus,
            dayBuy: dayBuy,
            deliveryAddress: deliveryAddress,
            evaluate: evaluate,
            deleted: true,
            listjson_orderDetail: listjson_orderDetail,
          };

          // debugger;
          $.ajax({
            type: "POST",
            url: "http://localhost:4006/api-admin/Bill/update",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: JSON.stringify(raw_data),
            processData: false,
            contentType: false,
          })
            .done(function (data) {
              // debugger;
              if (data.error != null && data.error != "undefined") {
                Swal.fire("Error!", data.error, "error");
              } else {
                Swal.fire(
                  "Success!",
                  "Delete virtual bill success.",
                  "success"
                );
                fetchDeletedBills(currentPage, pageSize);
                fetchBills(currentPage, pageSize);
              }
            })
            .fail(function () {
              console.log("Request failed: ", textStatus, errorThrown);
            });
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =====================================> search bill <==========================================
  function searchSellBill(name, currentPage, pageSize) {
    const url =
      "http://localhost:4006/api-admin/bill/search-by-username-and-pagination?pageNumber=" +
      currentPage +
      "&pageSize=" +
      pageSize +
      "&name=" +
      name;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
    });
  }

  // =====================================> search bill <==========================================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchSellBill(searchValue, currentPage, pageSize);
    });

  // ====================================> update table <==========================================================
  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();
    data.forEach(function (bill, index) {
      var row = `<tr>
                         <th scope="row">
                             <input type="checkbox" class="bill-checkbox">
                         </th>
                         <td scope="row">${bill.orderId}</td>
                         <td>${bill.userId}</td>
                         <td>${bill.staffId}</td>
                         <td>${bill.orderStatus}</td>
                         <td>${bill.dayBuy}</td>
                         <td>${bill.deliveryAddress}</td>
                         <td>${bill.evaluate}</td>
                         <td>
                            <button type="button" class="btn btn-primary btn-sm btn-order-detail">Order Detail</button>
                         </td>
                       </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> update table deleted <==========================================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (bill, index) {
      var row = `<tr>
                         <td scope="row">${bill.orderId}</td>
                         <td>${bill.userId}</td>
                         <td>${bill.staffId}</td>
                         <td>${bill.orderStatus}</td>
                         <td>${bill.dayBuy}</td>
                         <td>${bill.deliveryAddress}</td>
                         <td>${bill.evaluate}</td>
                         <td>
                            <button type="button" class="btn btn-primary btn-restore">Restore</button>
                            <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                         </td>
                       </tr>`;
      tbody.append(row);
    });
  }

  // ======================================> update order details modal <=============================================================
  function updateOrderDetailsModal(data) {
    // debugger;
    var tbody = $("#orderDetailsModal tbody");
    tbody.empty();

    data.listjson_orderDetail.forEach(function (detail) {
      var row = `<tr>
                 <td>${detail.orderDetailId}</td>
                 <td>${detail.productId}</td>
                 <td>${detail.quantity}</td>
                 <td>${detail.price}</td>
                 <td>${detail.discountAmount}</td>
                 <td>${detail.voucherId}</td>
               </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> open order detail <=============================================================
  $("#activeTable tbody").on("click", ".btn-order-detail", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const order = {
      orderId: currentRow.find("td").eq(0).text(),
    };

    openOrderDetail(order.orderId);
  });

  // =====================================> open import Bill detail <=============================================================
  function openOrderDetail(orderId) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/bill/get-data-by-id/${orderId}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        updateOrderDetailsModal(response);
        orderDetailsModal.show();
      },
      error: function (error) {
        console.error("Failed to fetch import bill details: ", error);
      },
    });
  }

  // ====================================> restore bill <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const bill = {
      billId: currentRow.find("td").eq(0).text(),
      userId: currentRow.find("td").eq(1).text(),
      staffId: currentRow.find("td").eq(2).text(),
      orderStatus: currentRow.find("td").eq(3).text(),
      dayBuy: currentRow.find("td").eq(4).text(),
      deliveryAddress: currentRow.find("td").eq(5).text(),
      evaluate: currentRow.find("td").eq(6).text(),
    };

    var billId = bill.billId;

    // debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/bill/get-data-by-id/" + billId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        debugger;
        if (!data || typeof data !== "object") {
          Swal.fire("Error!", "Can't restore bill", "error");
        } else {
          // debugger;
          var raw_data = {
            orderId: billId,
            userId: bill.userId,
            staffId: bill.staffId,
            orderStatus: bill.orderStatus,
            dayBuy: bill.dayBuy,
            deliveryAddress: bill.deliveryAddress,
            evaluate: bill.evaluate,
            deleted: false,
            listjson_orderDetail: data.listjson_orderDetail,
          };

          restoreBill(raw_data);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  });

  // ====================================> delete bill <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const bill = {
      billId: currentRow.find("td").eq(0).text(),
    };

    deleteBill(bill.billId);
  });

  // ====================================> restore bill <=============================================================
  function restoreBill(bill) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/bill/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bill),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore bill success!", "success");
          trashCanModal.hide();
          fetchBills(currentPage, pageSize);
          fetchDeletedBills(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error restoring bill: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> pagination <==========================================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchBills(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchBills(currentPage, pageSize);
  });

  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchBills(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchBills(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchBills(currentPage, pageSize);
  });

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ===================================> fetch data <==========================================================
  function fetchBills(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/bill/page=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
    });
  }

  // ====================================> fetch data deleted <==========================================================
  function fetchDeletedBills(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/bill/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      // debugger;
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

  // ==========================================> get user id list <===========================================================
  function getUserIdList() {
    const url = "http://localhost:4006/api-admin/users/get-all";
    apiCall("GET", url, null, function (response) {
      response.forEach((element) => {
        userIdList.push(element.userId);
      });
    });
  }

  // ==========================================> render user id list <===========================================================
  let isListVisible = false;
  function renderUserIdList() {
    const userIdListDiv = document.getElementById("userIdList");
    const toggleButton = document.getElementById("btnViewUserIdList");

    if (isListVisible) {
      userIdListDiv.style.display = "none";
      toggleButton.textContent = "View User Id List";
      isListVisible = false;
    } else {
      userIdListDiv.innerHTML = "";
      if (userIdList.length === 0) {
        userIdListDiv.innerHTML = `
          <div class="alert alert-info">No users found. Please fetch the list first.</div>
        `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        userIdList.forEach((userId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `User ID: ${userId}`;
          listGroup.appendChild(listItem);
        });

        userIdListDiv.appendChild(listGroup);
      }

      userIdListDiv.style.display = "block";
      toggleButton.textContent = "Hide User Id List";
      isListVisible = true;
    }
  }

  // ==========================================> button view user id list <===========================================================
  document
    .getElementById("btnViewUserIdList")
    .addEventListener("click", renderUserIdList);

  // ==========================================> get staff id list <===========================================================
  function getStaffIdList() {
    const url = "http://localhost:4006/api-admin/staff/get-all";
    apiCall("GET", url, null, function (response) {
      response.forEach((element) => {
        staffIdList.push(element.staffId);
      });
    });
  }

  // ==========================================> render staff id list <===========================================================
  let isStaffListVisible = false;
  function renderStaffIdList() {
    const staffIdListDiv = document.getElementById("staffIdList");
    const toggleButton = document.getElementById("btnViewStaffIdList");

    if (isStaffListVisible) {
      staffIdListDiv.style.display = "none";
      toggleButton.textContent = "View Staff Id List";
      isStaffListVisible = false;
    } else {
      staffIdListDiv.innerHTML = "";
      if (staffIdList.length === 0) {
        staffIdListDiv.innerHTML = `
          <div class="alert alert-info">No staff found. Please fetch the list first.</div>
        `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        staffIdList.forEach((staffId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `Staff ID: ${staffId}`;
          listGroup.appendChild(listItem);
        });

        staffIdListDiv.appendChild(listGroup);
      }

      staffIdListDiv.style.display = "block";
      toggleButton.textContent = "Hide Staff Id List";
      isStaffListVisible = true;
    }
  }

  // ==========================================> button view staff id list <===========================================================
  document
    .getElementById("btnViewStaffIdList")
    .addEventListener("click", renderStaffIdList);

  // ==========================================> api call <===========================================================
  function apiCall(method, url, data = null, successCallback) {
    return $.ajax({
      url: url,
      type: method,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (response) {
        if (successCallback) {
          successCallback(response);
        }
      },
      error: function (xhr, status, error) {
        console.error(error);
        Swal.fire("Error", "Error: " + error, "error");
      },
    });
  }

  // =======================================> add field order detail <==========================================================
  document
    .getElementById("addOrderDetailButton")
    .addEventListener("click", function () {
      const container = document.getElementById("orderDetailsContainer");
      const newDetail = document.createElement("div");
      newDetail.classList.add("row", "mb-3");
      newDetail.innerHTML = `
      <div class="col-md-2">
        <label for="orderDetailId" class="form-label">Order Detail ID</label>
        <input type="number" name="orderDetailId[]" class="form-control border" />
      </div>
      <div class="col-md-2">
        <label for="productId" class="form-label">Product ID</label>
        <input type="number" name="productId[]" class="form-control border" placeholder="Enter Product ID" />
      </div>
      <div class="col-md-2">
        <label for="quantity" class="form-label">Quantity</label>
        <input type="number" name="quantity[]" class="form-control border" placeholder="Enter Quantity" />
      </div>
      <div class="col-md-2">
        <label for="price" class="form-label">Price</label>
        <input type="number" name="price[]" class="form-control border" placeholder="Enter Price" />
      </div>
      <div class="col-md-2">
        <label for="discountAmount" class="form-label">Discount Amount</label>
        <input type="number" name="discountAmount[]" class="form-control border" placeholder="Enter Discount" />
      </div>
      <div class="col-md-2">
        <label for="voucherId" class="form-label">Voucher ID</label>
        <input type="number" name="voucherId[]" class="form-control border" placeholder="Enter Voucher ID" />
      </div>
      <div class="col-md-2">
        <label for="status" class="form-label">Status</label>
        <input type="text" name="status[]" class="form-control border" placeholder="Enter Status" />
      </div>
    `;
      container.appendChild(newDetail);
    });

  // ====================================> call function <===========================================================
  fetchBills(currentPage, pageSize);
  fetchDeletedBills(currentPage, pageSize);
  getUserIdList();
  getStaffIdList();
});
