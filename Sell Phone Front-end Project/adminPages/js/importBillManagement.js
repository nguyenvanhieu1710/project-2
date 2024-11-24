$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var importBillId = "";

  var status = 1;
  $(".btn-add-importBill").click(function () {
    status = 1;
  });

  $(".btn-update-importBill").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-importBill").click(function () {
    status = 3;
    deleteImportBill();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addImportBill();
    }
    if (status == 2) {
      updateImportBill();
    }
    // if (status == 3) {
    //   deleteImportBill();
    // }
  });

  function addImportBill() {
    var importBillName = $("input[name='importBillName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    // Basic validation
    if (!importBillName) {
      alert("Please enter a importBill name.");
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
      importBillId: 0,
      importBillName: importBillName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: false,
    };
    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/ImportBill/create",
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
          alert("Add ImportBill Success");
          console.log("Add ImportBill Success");
          fetchImportBills(1, 5);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.importBill-checkbox:checked").length === 0) {
      alert("Please select at least one importBill to update.");
      return;
    }

    if ($("input.importBill-checkbox:checked").length > 1) {
      alert("Choose only a importBill to update.");
      return;
    }

    $(".importBill-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      importBillId = id;
    });
    //   debugger;

    var importBillFound = {};
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/ImportBill/get-data-by-id/" +
        importBillId,
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
        importBillFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find ImportBill Success");
          // console.log("Find ImportBill Success");

          $("input[name='importBillName']").val(importBillFound.importBillName);
          $("input[name='phoneNumber']").val(importBillFound.phoneNumber);
          $("input[name='address']").val(importBillFound.address);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update ImportBill"); // Thay đổi tiêu đề modal
          $(".modal-title").text("Update ImportBill"); // Nếu bạn muốn đặt tiêu đề từ class modal-title
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }
  function updateImportBill() {
    // alert("Update ImportBill Success");
    // debugger;
    var importBillName = $("input[name='importBillName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    var raw_data = {
      importBillId: importBillId,
      importBillName: importBillName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: false,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/ImportBill/update",
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
        alert("Update ImportBill Success");
        fetchImportBills(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteImportBill() {
    if ($("input.importBill-checkbox:checked").length === 0) {
      alert("Please select at least one importBill to update.");
      return;
    }

    if ($("input.importBill-checkbox:checked").length > 1) {
      alert("Choose only a importBill to update.");
      return;
    }

    $(".importBill-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      importBillId = id;
    });

    // debugger;

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/ImportBill/delete/" + importBillId,
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
        alert("Delete ImportBill Success");
        fetchImportBills(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function updateTable(data) {
    var tbody = $("tbody");
    tbody.empty();
    data.forEach(function (importBill, index) {
      var row = `<tr>
                       <th scope="row">
                           <input type="checkbox" class="importBill-checkbox">
                       </th>
                       <td scope="row">${importBill.importBillId}</td>
                       <td>${importBill.supplierId}</td>
                       <td>${importBill.staffId}</td>
                       <td>${importBill.inputDay}</td>
                     </tr>`;
      tbody.append(row);
    });
  }

  let currentPage = 1;
  const pageSize = 5;

  fetchImportBills(currentPage, pageSize);

  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchImportBills(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchImportBills(currentPage, pageSize);
  });

  // Page number buttons click handlers
  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchImportBills(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchImportBills(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchImportBills(currentPage, pageSize);
  });

  function fetchImportBills(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/importBill/page=${pageNumber}&pageSize=${pageSize}`,
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

  function moveToTrash() {}
});
