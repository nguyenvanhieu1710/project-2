$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var importBillId = "";

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

  // Modal importBill Details bootstrap
  const importBillDetailsModal = new bootstrap.Modal(
    document.getElementById("importBillDetailsModal")
  );

  // ================================> handle button <===================================
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
    deleteVirtualImportBill();
    // deleteImportBill();
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

  // ===============================> add importBill <===================================
  function addImportBill() {
    var supplierId = $("input[name='supplierId']").val();
    var staffId = $("input[name='staffId']").val();
    var inputDay = $("input[name='inputDay']").val();

    var importBillDetails = [];
    $("input[name='productId[]']").each(function (index) {
      var productId = $(this).val();
      var importPrice = $("input[name='importPrice[]']").eq(index).val();
      var importQuantity = $("input[name='importQuantity[]']").eq(index).val();

      if (productId && importPrice && importQuantity) {
        importBillDetails.push({
          productId: productId,
          importPrice: importPrice,
          importQuantity: importQuantity,
        });
      }
    });

    if (!supplierId || !staffId || !inputDay) {
      alert("Please fill in all required fields.");
      return;
    }

    var raw_data = {
      supplierId: supplierId,
      staffId: staffId,
      inputDay: inputDay,
      listjson_importBillDetail: importBillDetails,
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
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error: " + data.error, "error");
          // console.log(data.error);
        } else {
          Swal.fire("Success!", "Add importBill success!", "success");
          // console.log("Add ImportBill Success");
          fetchImportBills(1, 5);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> turn on modal to update <===================================
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

  // ===============================> update importBill <===================================
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

  // ================================> delete importBill <===================================
  function deleteImportBill(importBillId) {
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

  // =========================================> delete virtual importBill <==================================================================
  function deleteVirtualImportBill() {
    if ($("input.importBill-checkbox:checked").length === 0) {
      alert("Please select at least one importBill to update.");
      return;
    }

    if ($("input.importBill-checkbox:checked").length > 1) {
      alert("Choose only a importBill to update.");
      return;
    }

    var importBillName;
    var content;
    var importBillImage;
    var postingDate;
    var personPostingId;

    $(".importBill-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      importBillName = row.find("td").eq(1).text();
      content = row.find("td").eq(2).text();
      importBillImage = row.find("td").eq(3).text();
      postingDate = row.find("td").eq(4).text();
      personPostingId = row.find("td").eq(5).text();

      importBillId = id;
    });

    var raw_data = {
      importBillId: importBillId,
      importBillName: importBillName,
      content: content,
      importBillImage: importBillImage,
      postingDate: postingDate,
      personPostingId: personPostingId,
      deleted: true,
    };
    // debugger;

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
        alert("Delete Virtual ImportBill Success");
        fetchDeletedImportBill(currentPage, pageSize);
        fetchImportBill(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ================================> search importBill <===================================
  function searchImportBill(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/importBill/search-and-pagination?pageNumber=" +
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

  // ================================> search importBill <===================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchImportBill(searchValue, currentPage, pageSize);
    });

  // ===============================> update table <===================================
  function updateTable(data) {
    var tbody = $("#activeTable tbody");
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
                       <td>
                         <button type="button" class="btn btn-primary btn-sm btn-import-bill-detail">Import Bill Detail</button>
                       </td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ===============================> update table deleted <===================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (importBill, index) {
      var row = `<tr>
                       <td scope="row">${importBill.importBillId}</td>
                       <td>${importBill.supplierId}</td>
                       <td>${importBill.staffId}</td>
                       <td>${importBill.inputDay}</td>
                       <td>
                         <button type="button" class="btn btn-primary">Restore</button>
                         <button type="button" class="btn btn-danger">Delete</button>
                       </td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> open import Bill detail <=============================================================
  $("#activeTable tbody").on("click", ".btn-import-bill-detail", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const importBill = {
      importBillId: currentRow.find("td").eq(0).text(),
    };

    openImportBillDetail(importBill.importBillId);
  });

  // ====================================> restore importBill <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const importBill = {
      importBillId: currentRow.find("td").eq(0).text(),
      importBillName: currentRow.find("td").eq(1).text(),
      content: currentRow.find("td").eq(2).text(),
      importBillImage: currentRow.find("td").eq(3).text(),
      postingDate: currentRow.find("td").eq(4).text(),
      personPostingId: currentRow.find("td").eq(5).text(),
      deleted: false,
    };

    restoreImportBill(importBill);
  });

  // ====================================> delete importBill <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const importBill = {
      importBillId: currentRow.find("td").eq(0).text(),
    };

    deleteImportBill(importBill.importBillId);
  });

  // ====================================> restore importBill <=============================================================
  function restoreImportBill(importBill) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/importBill/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(importBill),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          // success
          alert("Restore importBill success!");
          trashCanModal.hide();
          fetchImportBill(currentPage, pageSize);
          fetchDeletedImportBill(currentPage, pageSize);
        } else {
          alert("Error updating importBill: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function openImportBillDetail(importBillId) {
    importBillDetailsModal.show();
  }

  // ================================> pagination <===================================
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

  // =================================> fetch data để hiển thị lên table <===================================

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

  fetchImportBills(currentPage, pageSize);

  // ===================================> fetch data deleted <===================================
  function fetchDeletedImportBills(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/importBill/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        $(".badge").text(response.length || 0);
        updateTable(response);
        updatePaginationButtons();
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  fetchDeletedImportBills(currentPage, pageSize);

  // =====================================> handle interface <================================================================
  // JavaScript for adding dynamic fields for import bill details
  document
    .getElementById("addDetailButton")
    .addEventListener("click", function () {
      const container = document.getElementById("importBillDetailsContainer");
      const newDetail = document.createElement("div");
      newDetail.classList.add("row", "mb-3");
      newDetail.innerHTML = `
      <div class="col-md-4">
          <label for="productId" class="form-label">Product ID</label>
          <input type="number" name="productId[]" class="form-control border" placeholder="Enter Product ID">
      </div>
      <div class="col-md-4">
          <label for="importPrice" class="form-label">Import Price</label>
          <input type="number" name="importPrice[]" class="form-control border" placeholder="Enter Import Price">
      </div>
      <div class="col-md-4">
          <label for="importQuantity" class="form-label">Import Quantity</label>
          <input type="number" name="importQuantity[]" class="form-control border" placeholder="Enter Quantity">
      </div>
  `;
      container.appendChild(newDetail);
    });
});
