$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var billId = "";
  let currentPage = 1;
  const pageSize = 5;

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
  });

  $(".btn-update-bill").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-bill").click(function () {
    status = 3;
    deleteBill();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addBill();
    }
    if (status == 2) {
      updateBill();
    }
    // if (status == 3) {
    //   deleteBill();
    // }
  });

  // ====================================> add bill <==========================================
  function addBill() {
    var billName = $("input[name='billName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    // Basic validation
    if (!billName) {
      alert("Please enter a bill name.");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter a phone number.");
      return;
    }
    if (!address) {
      alert("Please enter an address.");
      return;
    }

    var raw_data = {
      billId: 0,
      billName: billName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: false,
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
        // console.log(data);
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Add Bill Success");
          console.log("Add Bill Success");
          fetchBills(1, 5);
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
      alert("Please select at least one bill to update.");
      return;
    }

    if ($("input.bill-checkbox:checked").length > 1) {
      alert("Choose only a bill to update.");
      return;
    }

    $(".bill-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      billId = id;
    });
    //   debugger;

    var billFound = {};
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
        // console.log(data);
        // alert(data);
        billFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find Bill Success");
          // console.log("Find Bill Success");

          $("input[name='billName']").val(billFound.billName);
          $("input[name='phoneNumber']").val(billFound.phoneNumber);
          $("input[name='address']").val(billFound.address);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update Bill"); // Thay đổi tiêu đề modal
          $(".modal-title").text("Update Bill"); // Nếu bạn muốn đặt tiêu đề từ class modal-title
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> update bill <==========================================
  function updateBill() {
    // alert("Update Bill Success");
    // debugger;
    var billName = $("input[name='billName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    var raw_data = {
      billId: billId,
      billName: billName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: false,
    };

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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        // Đóng modal sau khi cập nhật thành công
        // $("#exampleModal").modal("hide");
        var modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );
        modal.hide();
        alert("Update Bill Success");
        fetchBills(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> delete bill <==========================================
  function deleteBill() {
    if ($("input.bill-checkbox:checked").length === 0) {
      alert("Please select at least one bill to update.");
      return;
    }

    if ($("input.bill-checkbox:checked").length > 1) {
      alert("Choose only a bill to update.");
      return;
    }

    $(".bill-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      billId = id;
    });

    // debugger;

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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete Bill Success");
        fetchBills(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =====================================> search bill <==========================================
  function searchSellBill(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/bill/search-and-pagination?pageNumber=" +
        currentPage +
        "&pageSize=" +
        pageSize +
        "&name=" +
        name,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        updateTable(data);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
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
                            <button type="button" class="btn btn-primary btn-sm btn-order-detail">Oredr Detail</button>
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
                            <button type="button" class="btn btn-danger btn-delete">Delete</button>
                         </td>
                       </tr>`;
      tbody.append(row);
    });
  }

  $("#activeTable tbody").on("click", ".btn-order-detail", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const importBill = {
      importBillId: currentRow.find("td").eq(0).text(),
    };

    openOrderDetail(importBill.importBillId);
  });

  function openOrderDetail(importBillId) {
    orderDetailsModal.show();

    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/bill/get-data-by-id/" + importBillId,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        // console.log(data);
        // updateOrderDetailTable(data);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> pagination <==========================================================
  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchBills(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchBills(currentPage, pageSize);
  });

  // Page number buttons click handlers
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

  // Update pagination button states
  function updatePaginationButtons() {
    // if đang ở trang đầu tiên thì ẩn btn previous
    $(".btn-previous").toggleClass("disabled", currentPage === 1);
    // $(".btn-next").toggleClass("disabled", currentPage === totalPages);

    // Adjust active class for current page button
    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ===================================> fetch data <==========================================================
  function fetchBills(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/bill/page=${pageNumber}&pageSize=${pageSize}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        updateTable(response);
        updatePaginationButtons();
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  fetchBills(currentPage, pageSize);

  // ====================================> fetch data deleted <==========================================================
  function fetchDeletedBills(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/bill/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        $(".badge").text(response.length || 0);
        updateTableDeleted(response);
        updatePaginationButtons();
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  fetchDeletedBills(currentPage, pageSize);
});
