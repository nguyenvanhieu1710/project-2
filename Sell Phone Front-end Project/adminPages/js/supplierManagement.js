$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var supplierId = "";

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

  // ===================================> handle button <===========================================
  var status = 1;
  $(".btn-add-supplier").click(function () {
    status = 1;
    $("#exampleModalLabel").text("Create Supplier");
  });

  $(".btn-update-supplier").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-supplier").click(function () {
    status = 3;
    deleteVirtualSupplier();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addSupplier();
    }
    if (status == 2) {
      updateSupplier();
    }
  });

  // ===================================> handle validate <===================================
  function validateSupplierForm() {
    const supplierName = document
      .querySelector("input[name='supplierName']")
      .value.trim();
    const phoneNumber = document
      .querySelector("input[name='phoneNumber']")
      .value.trim();
    const address = document
      .querySelector("input[name='address']")
      .value.trim();

    if (!supplierName) {
      Swal.fire("Warning!", "Please enter a supplier name!", "warning");
      return false;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      Swal.fire(
        "Warning!",
        "Please enter a valid phone number (10-15 digits)!",
        "warning"
      );
      return false;
    }

    if (!address) {
      Swal.fire("Warning!", "Please enter an address!", "warning");
      return false;
    }

    return true;
  }

  // ===================================> add supplier <===========================================
  function addSupplier() {
    var supplierName = $("input[name='supplierName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    if (!validateSupplierForm()) return;

    var raw_data = {
      supplierId: 0,
      supplierName: supplierName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: false,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Supplier/create",
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
          Swal.fire("Error!", "Add Supplier Failed: " + data.error, "error");
          // console.log(data.error);
        } else {
          Swal.fire("Success!", "Add Supplier Success.", "success");
          exampleModal.hide();
          fetchSuppliers(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> update supplier <===========================================
  function TurnOnModalToUpdate() {
    if ($("input.supplier-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one supplier to update.",
        "warning"
      );
      return;
    }

    if ($("input.supplier-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a supplier to update.", "warning");
      return;
    }

    $(".supplier-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      supplierId = id;
    });
    //   debugger;

    var supplierFound = {};
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/Supplier/get-data-by-id/" + supplierId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // debugger;
        supplierFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error finding supplier: " + data.error, "error");
          console.log(data.error);
        } else {
          // debugger;
          $("input[name='supplierName']").val(supplierFound.supplierName);
          $("input[name='phoneNumber']").val(supplierFound.phoneNumber);
          $("input[name='address']").val(supplierFound.address);

          exampleModal.show();

          $("#exampleModalLabel").text("Update Supplier");
          $(".modal-title").text("Update Supplier");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> update supplier <===========================================
  function updateSupplier() {
    // debugger;
    var supplierName = $("input[name='supplierName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    if (!validateSupplierForm()) return;

    var raw_data = {
      supplierId: supplierId,
      supplierName: supplierName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: false,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Supplier/update",
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
          Swal.fire(
            "Error!",
            "Error updating supplier: " + data.error,
            "error"
          );
        } else {
          exampleModal.hide();
          Swal.fire("Success!", "Supplier updated successfully.", "success");
          fetchSuppliers(currentPage, pageSize);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> delete supplier <===========================================
  function deleteSupplier(supplierId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Supplier/delete/" + supplierId,
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
          Swal.fire(
            "Error!",
            "Error deleting supplier: " + data.error,
            "error"
          );
        }
        Swal.fire("Success!", "Supplier deleted successfully.", "success");
        fetchSuppliers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> delete virtual supplier <===========================================
  function deleteVirtualSupplier() {
    if ($("input.supplier-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one supplier to update.",
        "warning"
      );
      return;
    }

    if ($("input.supplier-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a supplier to update.", "warning");
      return;
    }

    var supplierName;
    var phoneNumber;
    var address;

    $(".supplier-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      supplierName = row.find("td").eq(1).text();
      phoneNumber = row.find("td").eq(2).text();
      address = row.find("td").eq(3).text();

      supplierId = id;
      // debugger;
    });

    var raw_data = {
      supplierId: supplierId,
      supplierName: supplierName,
      phoneNumber: phoneNumber,
      address: address,
      deleted: true,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Supplier/update",
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
          Swal.fire(
            "Error!",
            "Delete Virtual Supplier Failed: " + data.error,
            "error"
          );
        }
        fetchDeletedSuppliers(currentPage, pageSize);
        fetchSuppliers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> search supplier <=============================================================
  function searchSupplier(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/supplier/search-and-pagination?pageNumber=" +
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

  // =====================================> search supplier <=============================================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchSupplier(searchValue, currentPage, pageSize);
    });

  // =======================================> update table <=============================================================
  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();
    data.forEach(function (supplier, index) {
      var row = `<tr>
                     <th scope="row">
                         <input type="checkbox" class="supplier-checkbox">
                     </th>
                     <td scope="row">${supplier.supplierId}</td>
                     <td>${supplier.supplierName}</td>
                     <td>${supplier.phoneNumber}</td>
                     <td>${supplier.address}</td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ======================================> update table deleted <=============================================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (supplier, index) {
      var row = `<tr>
                     <td scope="row">${supplier.supplierId}</td>
                     <td>${supplier.supplierName}</td>
                     <td>${supplier.phoneNumber}</td>
                     <td>${supplier.address}</td>
                     <td>
                      <button type="button" class="btn btn-primary btn-restore">Restore</button>
                      <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                     </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ======================================> restore supplier <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const supplier = {
      supplierId: currentRow.find("td").eq(0).text(),
      supplierName: currentRow.find("td").eq(1).text(),
      phoneNumber: currentRow.find("td").eq(2).text(),
      address: currentRow.find("td").eq(3).text(),
      deleted: false,
    };

    restoreSupplier(supplier);
  });

  // =====================================> delete supplier <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const supplier = {
      supplierId: currentRow.find("td").eq(0).text(),
    };

    deleteSupplier(supplier.supplierId);
  });

  // ======================================> restore supplier <=============================================================
  function restoreSupplier(supplier) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/supplier/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(supplier),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore supplier success!", "success");
          trashCanModal.hide();
          fetchSuppliers(currentPage, pageSize);
          fetchDeletedSuppliers(currentPage, pageSize);
        } else {
          Swal.fire(
            "Error!",
            "Error updating supplier: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> pagination <=============================================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchSuppliers(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchSuppliers(currentPage, pageSize);
  });

  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchSuppliers(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchSuppliers(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchSuppliers(currentPage, pageSize);
  });

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ======================================> fetch supplier <=============================================================
  function fetchSuppliers(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/supplier/page=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
    });
  }

  // =======================================> fetch deleted supplier <=============================================================
  function fetchDeletedSuppliers(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/supplier/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

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

  // =======================================> call function <=============================================================
  fetchSuppliers(currentPage, pageSize);
  fetchDeletedSuppliers(currentPage, pageSize);
});
