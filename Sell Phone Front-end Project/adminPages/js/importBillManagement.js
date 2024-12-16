$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var importBillId = "";
  var supplierIdList = [];
  var staffIdList = [];
  var productIdList = [];

  let currentPage = 1;
  const pageSize = 10;

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
    $("#exampleModalLabel").text("Create Import Bill");
  });

  $(".btn-update-importBill").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-importBill").click(function () {
    status = 3;
    deleteVirtualImportBill();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addImportBill();
    }
    if (status == 2) {
      updateImportBill();
    }
  });

  // ===============================> validate data <===================================
  function validateImportBill() {
    var supplierId = $("input[name='supplierId']").val();
    var staffId = $("input[name='staffId']").val();
    var inputDay = $("input[name='inputDay']").val();

    if (!supplierId || supplierId.trim() === "") {
      Swal.fire("Warning!", "Please enter supplier ID.", "warning");
      return false;
    }

    if (!staffId || staffId.trim() === "") {
      Swal.fire("Warning!", "Please enter staff ID.", "warning");
      return false;
    }

    if (!inputDay || inputDay.trim() === "") {
      Swal.fire("Warning!", "Please enter input day.", "warning");
      return false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDay)) {
      Swal.fire("Warning!", "Please enter a valid input day.", "warning");
      return false;
    }

    $("input[name='productId[]']").each(function (index) {
      var productId = $(this).val();
      var importPrice = $("input[name='importPrice[]']").eq(index).val();
      var importQuantity = $("input[name='importQuantity[]']").eq(index).val();

      if (!productId || productId.trim() === "") {
        Swal.fire("Warning!", "Please enter product ID.", "warning");
        return false;
      }

      if (!importPrice || isNaN(importPrice) || parseFloat(importPrice) <= 0) {
        Swal.fire("Warning!", "Please enter a valid import price.", "warning");
        return false;
      }

      if (
        !importQuantity ||
        isNaN(importQuantity) ||
        parseInt(importQuantity) <= 0
      ) {
        Swal.fire(
          "Warning!",
          "Please enter a valid import quantity.",
          "warning"
        );
        return false;
      }
    });

    return true;
  }

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

    if (!validateImportBill()) {
      return;
    }

    var raw_data = {
      supplierId: supplierId,
      staffId: staffId,
      inputDay: inputDay,
      listjson_importBillDetail: importBillDetails,
    };

    debugger;
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
      Swal.fire(
        "Warning!",
        "Please select at least one importBill to update.",
        "warning"
      );
      return;
    }

    if ($("input.importBill-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a importBill to update.", "warning");
      return;
    }

    $(".importBill-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      importBillId = id;
    });
    //   debugger;

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
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("error!", data.error, "error");
          console.log(data.error);
        } else {
          $("input[name='supplierId']").val(data.supplierId);
          $("input[name='staffId']").val(data.staffId);
          $("input[name='inputDay']").val(data.inputDay);

          const importBillDetails = data.listjson_importBillDetail;
          $("#importBillDetailsContainer").empty();

          importBillDetails.forEach((detail, index) => {
            const detailRow = `
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="productId" class="form-label">Product ID</label>
              <input type="number" name="productId[]" class="form-control border" value="${detail.productId}" placeholder="Enter Product ID">
            </div>
            <div class="col-md-4">
              <label for="importPrice" class="form-label">Import Price</label>
              <input type="number" name="importPrice[]" class="form-control border" value="${detail.importPrice}" placeholder="Enter Import Price">
            </div>
            <div class="col-md-4">
              <label for="importQuantity" class="form-label">Import Quantity</label>
              <input type="number" name="importQuantity[]" class="form-control border" value="${detail.importQuantity}" placeholder="Enter Quantity">
            </div>
            <div class="col-md-4">
              <label for="importBillDetailId" class="form-label" style="visibility: hidden;">Import Bill Detail ID</label>
              <input type="hidden" name="importBillDetailId[]" class="form-control border" value="${detail.importBillDetailId}">
            </div>
          </div>
        `;

            $("#importBillDetailsContainer").append(detailRow);
          });

          exampleModal.show();
          $("#exampleModalLabel").text("Update ImportBill");
          $(".modal-title").text("Update ImportBill");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================> update importBill <===================================
  function updateImportBill() {
    var supplierId = $("input[name='supplierId']").val();
    var staffId = $("input[name='staffId']").val();
    var inputDay = $("input[name='inputDay']").val();

    var importBillDetails = [];
    $("input[name='productId[]']").each(function (index) {
      var productId = $(this).val();
      var importPrice = $("input[name='importPrice[]']").eq(index).val();
      var importQuantity = $("input[name='importQuantity[]']").eq(index).val();
      var importBillDetailId = $("input[name='importBillDetailId[]']")
        .eq(index)
        .val();

      if (productId && importPrice && importQuantity) {
        importBillDetails.push({
          importBillDetailId: importBillDetailId,
          importBillId: importBillId,
          productId: productId,
          importPrice: importPrice,
          importQuantity: importQuantity,
          importBillDetailStatus: 2, // 2 means "Update" in this context, 1 means "Add", 3 means "Delete"
        });
      }
    });

    if (!validateImportBill()) {
      return;
    }

    var raw_data = {
      importBillId: importBillId,
      supplierId: supplierId,
      staffId: staffId,
      inputDay: inputDay,
      listjson_importBillDetail: importBillDetails,
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
        }
        exampleModal.hide();
        Swal.fire("Success!", "Update ImportBill Success!", "success");
        fetchImportBills(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ================================> delete importBill <===================================
  function deleteImportBill(importBillId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Warning!", data.error, "warning");
        }
        Swal.fire("Success!", "Delete ImportBill Success!", "success");
        trashCanModal.hide();
        fetchImportBills(currentPage, pageSize);
        fetchDeletedImportBills(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =========================================> delete virtual importBill <==================================================================
  function deleteVirtualImportBill() {
    if ($("input.importBill-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one importBill to update.",
        "warning"
      );
      return;
    }

    if ($("input.importBill-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a importBill to update.", "warning");
      return;
    }

    var supplierId = null;
    var staffId = null;
    var inputDay = null;
    var listjson_importBillDetail = null;

    $(".importBill-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      importBillId = id;
    });

    // debugger;
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/importBill/get-data-by-id/" +
        importBillId,
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
          supplierId = data.supplierId;
          staffId = data.staffId;
          inputDay = data.inputDay;
          listjson_importBillDetail = data.listjson_importBillDetail;

          if (
            !supplierId ||
            !staffId ||
            !inputDay ||
            !listjson_importBillDetail
          ) {
            Swal.fire(
              "Warning!",
              "Can't delete virtual importBill.",
              "warning"
            );
            return;
          }

          var raw_data = {
            importBillId: importBillId,
            supplierId: supplierId,
            staffId: staffId,
            inputDay: inputDay,
            deleted: true,
            listjson_importBillDetail: listjson_importBillDetail,
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
              // debugger;
              if (data.error != null && data.error != "undefined") {
                Swal.fire("Error!", data.error, "error");
              } else {
                Swal.fire(
                  "Success!",
                  "Delete virtual importBill success.",
                  "success"
                );
                fetchDeletedImportBills(currentPage, pageSize);
                fetchImportBills(currentPage, pageSize);
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

  // ================================> search importBill <===================================
  function searchImportBill(name, currentPage, pageSize) {
    const url =
      "http://localhost:4006/api-admin/importBill/search-by-productname-and-pagination?pageNumber=" +
      currentPage +
      "&pageSize=" +
      pageSize +
      "&name=" +
      name;
    apiCall("GET", url, null, function (data) {
      updateTable(data);
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
    // debugger;
    var tbody = $("#activeTable tbody");
    tbody.empty();

    if (data.length < 0) {
      tbody.append(
        `<tr><td colspan="6" class="text-center">No import bills found</td></tr>`
      );
      return;
    }
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
                         <button type="button" class="btn btn-primary btn-restore">Restore</button>
                         <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                       </td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ===================================> update importBillDetailsModal <=============================================================
  function updateImportBillDetailsModal(data) {
    // debugger;
    var tbody = $("#importBillDetailsModal tbody");
    tbody.empty();

    data.listjson_importBillDetail.forEach(function (detail) {
      var row = `<tr>
                   <td>${detail.importBillDetailId}</td>
                   <td>${detail.productId}</td>
                   <td>${detail.importQuantity}</td>
                   <td>${detail.importPrice}</td>
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

  // =====================================> open import Bill detail <=============================================================
  function openImportBillDetail(importBillId) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/importBill/get-data-by-id/${importBillId}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        updateImportBillDetailsModal(response);
        importBillDetailsModal.show();
      },
      error: function (error) {
        console.error("Failed to fetch import bill details: ", error);
      },
    });
  }

  // ====================================> restore importBill <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const importBill = {
      importBillId: currentRow.find("td").eq(0).text(),
      supplierId: currentRow.find("td").eq(1).text(),
      staffId: currentRow.find("td").eq(2).text(),
      inputDay: currentRow.find("td").eq(3).text(),
    };

    var importBillId = importBill.importBillId;

    // debugger;
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/importBill/get-data-by-id/" +
        importBillId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // debugger;
        if (!data || typeof data !== "object") {
          Swal.fire("Error!", "Can't restore importBill", "error");
        } else {
          // debugger;
          listjson_importBillDetail = data.listjson_importBillDetail;

          var raw_data = {
            importBillId: importBillId,
            supplierId: importBill.supplierId,
            staffId: importBill.staffId,
            inputDay: importBill.inputDay,
            deleted: false,
            listjson_importBillDetail: listjson_importBillDetail,
          };

          restoreImportBill(raw_data);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
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
          Swal.fire("Success!", "Restore importBill success!", "success");
          trashCanModal.hide();
          fetchImportBills(currentPage, pageSize);
          fetchDeletedImportBills(currentPage, pageSize);
        } else {
          Swal.fire(
            "Error!",
            "Error restoring importBill: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ================================> pagination <===================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchImportBills(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchImportBills(currentPage, pageSize);
  });

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

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // =================================> fetch data <===================================
  function fetchImportBills(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/importBill/page=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
    });
  }

  // ===================================> fetch data deleted <===================================
  function fetchDeletedImportBills(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/importBill/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

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
  let isListVisible = false;
  function renderStaffIdList() {
    const staffIdListDiv = document.getElementById("staffIdList");
    const toggleButton = document.getElementById("btnViewStaffIdList");

    if (isListVisible) {
      staffIdListDiv.style.display = "none";
      toggleButton.textContent = "View Staff Id List";
      isListVisible = false;
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
      isListVisible = true;
    }
  }

  // ==========================================> button view staff id list <===========================================================
  document
    .getElementById("btnViewStaffIdList")
    .addEventListener("click", renderStaffIdList);

  // ==========================================> get Supplier id list <===========================================================
  function getSupplierIdList() {
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/Supplier/get-all",
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        response.forEach((element) => {
          supplierIdList.push(element.supplierId);
        });
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  // ==========================================> render Supplier id list <===========================================================
  let isSupplierIdListVisible = false;
  function renderSupplierIdList() {
    const supplierIdListDiv = document.getElementById("supplierIdList");
    const toggleButton = document.getElementById("btnViewSupplierIdList");

    if (isSupplierIdListVisible) {
      supplierIdListDiv.style.display = "none";
      toggleButton.textContent = "View Supplier Id List";
      isSupplierIdListVisible = false;
    } else {
      supplierIdListDiv.innerHTML = "";
      if (staffIdList.length === 0) {
        supplierIdListDiv.innerHTML = `
          <div class="alert alert-info">No supplier found. Please fetch the list first.</div>
        `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        supplierIdList.forEach((supplierId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `Supplier ID: ${supplierId}`;
          listGroup.appendChild(listItem);
        });

        supplierIdListDiv.appendChild(listGroup);
      }

      supplierIdListDiv.style.display = "block";
      toggleButton.textContent = "Hide Supplier Id List";
      isSupplierIdListVisible = true;
    }
  }

  // ==========================================> button view Supplier id list <===========================================================
  document
    .getElementById("btnViewSupplierIdList")
    .addEventListener("click", renderSupplierIdList);

  // ==========================================> get product id list <===========================================================
  function getProductIdList() {
    const url = "http://localhost:4006/api-admin/product/get-all";
    apiCall("GET", url, null, (response) => {
      // debugger
      response.forEach((element) => productIdList.push(element.productId));
      // debugger
    });
  }

  // ==========================================> render product id list <===========================================================
  let isProductIdListVisible = false;
  function renderProductIdList() {
    const productIdListDiv = document.getElementById("productIdList");
    const toggleButton = document.getElementById("btnViewProductIdList");

    if (isProductIdListVisible) {
      productIdListDiv.style.display = "none";
      toggleButton.textContent = "View Product Id List";
      isProductIdListVisible = false;
    } else {
      productIdListDiv.innerHTML = "";
      if (staffIdList.length === 0) {
        productIdListDiv.innerHTML = `
            <div class="alert alert-info">No product found. Please fetch the list first.</div>
          `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        productIdList.forEach((productId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `Product ID: ${productId}`;
          listGroup.appendChild(listItem);
        });

        productIdListDiv.appendChild(listGroup);
      }

      productIdListDiv.style.display = "block";
      toggleButton.textContent = "Hide Product Id List";
      isProductIdListVisible = true;
    }
  }

  // ==========================================> button view product id list <===========================================================
  document
    .getElementById("btnViewProductIdList")
    .addEventListener("click", renderProductIdList);

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
      <div class="col-md-4">
          <label for="importBillDetailId" class="form-label" style="visibility: hidden;">Import Bill Detail ID</label>
          <input type="hidden" name="importBillDetailId[]" class="form-control border" value="0">
      </div>
  `;
      container.appendChild(newDetail);
    });

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

  // ====================================> call function <===========================================================
  getStaffIdList();
  getSupplierIdList();
  getProductIdList();
  fetchImportBills(currentPage, pageSize);
  fetchDeletedImportBills(currentPage, pageSize);
});
