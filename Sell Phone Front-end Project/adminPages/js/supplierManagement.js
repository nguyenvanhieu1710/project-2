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
  });

  $(".btn-update-supplier").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-supplier").click(function () {
    status = 3;
    deleteVirtualSupplier();
    // deleteSupplier();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addSupplier();
    }
    if (status == 2) {
      updateSupplier();
    }
    // if (status == 3) {
    //   deleteSupplier();
    // }
  });

  // ===================================> add supplier <===========================================
  function addSupplier() {
    var supplierName = $("input[name='supplierName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

    // Basic validation
    if (!supplierName) {
      alert("Please enter a supplier name.");
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
        // console.log(data);
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Add Supplier Success");
          console.log("Add Supplier Success");
          fetchSuppliers(1, 5);
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
      alert("Please select at least one supplier to update.");
      return;
    }

    if ($("input.supplier-checkbox:checked").length > 1) {
      alert("Choose only a supplier to update.");
      return;
    }

    $(".supplier-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

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
        // console.log(data);
        // alert(data);
        supplierFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find Supplier Success");
          // console.log("Find Supplier Success");

          $("input[name='supplierName']").val(supplierFound.supplierName);
          $("input[name='phoneNumber']").val(supplierFound.phoneNumber);
          $("input[name='address']").val(supplierFound.address);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update Supplier"); // Thay đổi tiêu đề modal
          $(".modal-title").text("Update Supplier"); // Nếu bạn muốn đặt tiêu đề từ class modal-title
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> update supplier <===========================================
  function updateSupplier() {
    // alert("Update Supplier Success");
    // debugger;
    var supplierName = $("input[name='supplierName']").val();
    var phoneNumber = $("input[name='phoneNumber']").val();
    var address = $("input[name='address']").val();

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
        alert("Update Supplier Success");
        fetchSuppliers(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> delete supplier <===========================================
  function deleteSupplier() {
    if ($("input.supplier-checkbox:checked").length === 0) {
      alert("Please select at least one supplier to update.");
      return;
    }

    if ($("input.supplier-checkbox:checked").length > 1) {
      alert("Choose only a supplier to update.");
      return;
    }

    $(".supplier-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      supplierId = id;
    });

    // debugger;

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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete Supplier Success");
        fetchSuppliers(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> delete virtual supplier <===========================================
  function deleteVirtualSupplier() {
    if ($("input.supplier-checkbox:checked").length === 0) {
      alert("Please select at least one supplier to update.");
      return;
    }

    if ($("input.supplier-checkbox:checked").length > 1) {
      alert("Choose only a supplier to update.");
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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete Virtual Supplier Success");
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
          // success
          alert("Restore supplier success!");
          trashCanModal.hide();
          fetchSuppliers(currentPage, pageSize);
          fetchDeletedSuppliers(currentPage, pageSize);
        } else {
          alert("Error updating supplier: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> pagination <=============================================================
  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchSuppliers(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchSuppliers(currentPage, pageSize);
  });

  // Page number buttons click handlers
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

  // ======================================> fetch supplier <=============================================================
  function fetchSuppliers(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/supplier/page=${pageNumber}&pageSize=${pageSize}`,
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

  fetchSuppliers(currentPage, pageSize);

  // =======================================> fetch deleted supplier <=============================================================
  function fetchDeletedSuppliers(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/supplier/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

  fetchDeletedSuppliers(currentPage, pageSize);
});
