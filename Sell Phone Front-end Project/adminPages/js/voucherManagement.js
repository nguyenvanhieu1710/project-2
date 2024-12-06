$(document).ready(function () {
  var token = localStorage.getItem("staff");
  var voucherId = "";

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
  $(".btn-add-voucher").click(function () {
    status = 1;
  });

  $(".btn-update-voucher").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-voucher").click(function () {
    status = 3;
    // deleteVoucher();
    deleteVirtualVoucher();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      // debugger;
      addVoucher();
    }
    if (status == 2) {
      updateVoucher();
    }
    // if (status == 3) {
    //   deleteVoucher();
    // }
  });

  // ==============================================> add voucher <===========================================
  function addVoucher() {
    var voucherName = $("input[name='voucherName']").val();
    var price = $("input[name='price']").val();
    var minimumPrice = $("input[name='minimumPrice']").val();
    var quantity = $("input[name='quantity']").val();
    var startDay = $("input[name='startDay']").val();
    var endDate = $("input[name='endDate']").val();

    if (!voucherName) {
      Swal.fire("Warning", "Please enter a voucher name.", "warning");
      return;
    }
    if (!price) {
      Swal.fire("Warning", "Please enter a price.", "warning");
      return;
    }
    if (!minimumPrice) {
      Swal.fire("Warning", "Please enter a minimum price.", "warning");
      return;
    }
    if (!quantity) {
      Swal.fire("Warning", "Please enter a quantity.", "warning");
      return;
    }
    if (!startDay) {
      Swal.fire("Warning", "Please enter a start day.", "warning");
      return;
    }
    if (!endDate) {
      Swal.fire("Warning", "Please enter an end date.", "warning");
      return;
    }
    // debugger;

    var raw_data = {
      voucherId: 0,
      voucherName: voucherName,
      price: parseFloat(price),
      minimumPrice: parseFloat(minimumPrice),
      quantity: parseInt(quantity),
      startDay: startDay + "T00:00:00.000Z",
      endDate: endDate + "T00:00:00.000Z",
      deleted: false,
    };
    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/voucher/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: "application/json",
      data: JSON.stringify(raw_data),
    })
      .done(function (data) {
        if (data && data.error) {
          Swal.fire("Error", data.error, "error");
          console.log(data.error);
        } else {
          Swal.fire("Success", "Voucher added successfully.", "success");
          fetchVouchers(currentPage, pageSize);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================================> turn on modal to update <===========================================
  function TurnOnModalToUpdate() {
    if ($("input.voucher-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one voucher to update.",
        "warning"
      );
      return;
    }

    if ($("input.voucher-checkbox:checked").length > 1) {
      Swal.fire("Warning", "Choose only one voucher to update.", "warning");
      return;
    }

    $(".voucher-checkbox:checked").each(function () {
      let row = $(this).closest("tr");
      let id = row.find("td").eq(0).text();
      voucherId = id;
    });

    // debugger;
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/voucher/get-data-by-id/" + voucherId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          $("input[name='voucherName']").val(data.voucherName);
          $("input[name='price']").val(data.price);
          $("input[name='minimumPrice']").val(data.minimumPrice);
          $("input[name='quantity']").val(data.quantity);
          $("input[name='startDay']").val(data.startDay.split("T")[0]);
          $("input[name='endDate']").val(data.endDate.split("T")[0]);

          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();
          $("#exampleModalLabel").text("Update Voucher");
        } else {
          Swal.fire(
            "Error!",
            "Error retrieving voucher data: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================================> update voucher <===========================================
  function updateVoucher() {
    var voucherName = $("input[name='voucherName']").val();
    var price = $("input[name='price']").val();
    var minimumPrice = $("input[name='minimumPrice']").val();
    var quantity = $("input[name='quantity']").val();
    var startDay = $("input[name='startDay']").val();
    var endDate = $("input[name='endDate']").val();

    if (!voucherName) {
      Swal.fire("Warning!", "Please enter a voucher name.", "warning");
      return;
    }
    if (!price) {
      Swal.fire("Warning!", "Please enter a price.", "warning");
      return;
    }
    if (!minimumPrice) {
      Swal.fire("Warning!", "Please enter a minimum price.", "warning");
      return;
    }
    if (!quantity) {
      Swal.fire("Warning!", "Please enter a quantity.", "warning");
      return;
    }
    if (!startDay) {
      Swal.fire("Warning!", "Please enter a start day.", "warning");
      return;
    }
    if (!endDate) {
      Swal.fire("Warning!", "Please enter an end date.", "warning");
      return;
    }

    // debugger;

    var raw_data = {
      voucherId: voucherId,
      voucherName: voucherName,
      price: parseFloat(price),
      minimumPrice: parseFloat(minimumPrice),
      quantity: quantity,
      startDay: startDay + "T00:00:00.000Z",
      endDate: endDate + "T00:00:00.000Z",
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/voucher/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(raw_data),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (!data.error) {
          var modal = bootstrap.Modal.getInstance(
            document.getElementById("exampleModal")
          );
          modal.hide();
          Swal.fire("Success", "Voucher updated successfully.", "success");
          fetchVouchers(currentPage, pageSize);
        } else {
          Swal.fire("Error", "Error updating voucher: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================================> delete voucher <===========================================
  function deleteVoucher(voucherId) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/voucher/delete/" + voucherId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error: " + data.error, "error");
        }
        Swal.fire("Success!", "Delete voucher success!", "success");
        fetchVouchers(currentPage, pageSize);
        fetchDeletedVouchers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================================> delete virtual voucher <===========================================
  function deleteVirtualVoucher() {
    // get voucherId
    if ($("input.voucher-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one voucher to update.",
        "warning"
      );
      return;
    }

    if ($("input.voucher-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one voucher to update.",
        "warning"
      );
      return;
    }

    $(".voucher-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      voucherId = id;
      // debugger;
    });

    // data
    var voucherName;
    var price;
    var minimumPrice;
    var quantity;
    var startDay;
    var endDate;

    // Find the voucher and get data
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/voucher/get-data-by-id/" + voucherId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          voucherName = data.voucherName;
          price = data.price;
          minimumPrice = data.minimumPrice;
          quantity = data.quantity;
          startDay = data.startDay;
          endDate = data.endDate;

          var raw_data = {
            voucherId: voucherId,
            voucherName: voucherName,
            price: parseFloat(price),
            minimumPrice: parseFloat(minimumPrice),
            quantity: quantity,
            startDay: startDay,
            endDate: endDate,
            deleted: true,
          };

          $.ajax({
            type: "POST",
            url: "http://localhost:4006/api-admin/voucher/update",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: JSON.stringify(raw_data),
            processData: false,
            contentType: false,
          })
            .done(function (data) {
              if (data && !data.error) {
                // debugger;
                Swal.fire(
                  "Success!",
                  "Delete virtual voucher success!",
                  "success"
                );
                fetchVouchers(currentPage, pageSize);
                fetchDeletedVouchers(currentPage, pageSize);
              } else {
                Swal.fire(
                  "Error!",
                  "Error updating voucher: " + data.error,
                  "error"
                );
              }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              console.log("Request failed: ", textStatus, errorThrown);
            });
        } else {
          // debugger;
          Swal.fire(
            "Error!",
            "Error retrieving voucher data: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================================> search voucher <===========================================
  function searchVoucher(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/voucher/search-and-pagination?pageNumber=" +
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

  // ==============================================> search voucher <===========================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchVoucher(searchValue, currentPage, pageSize);
    });

  // ==============================================> update table <===========================================
  function updateTable(vouchers) {
    const tbody = $("#activeTable tbody");
    tbody.empty();
    vouchers.forEach((voucher) => {
      const row = `<tr>
                       <th><input type="checkbox" class="voucher-checkbox"></th>
                       <td>${voucher.voucherId}</td>
                       <td>${voucher.voucherName}</td>
                       <td>${voucher.price}</td>
                       <td>${voucher.minimumPrice}</td>
                       <td>${voucher.quantity}</td>
                       <td>${voucher.startDay}</td>
                       <td>${voucher.endDate}</td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ==============================================> update table deleted <===========================================
  function updateTableDeleted(vouchers) {
    const tbody = $("#deletedTable tbody");
    tbody.empty();
    vouchers.forEach((voucher) => {
      const row = `<tr>
                         <td>${voucher.voucherId}</td>
                         <td>${voucher.voucherName}</td>
                         <td>${voucher.price}</td>
                         <td>${voucher.minimumPrice}</td>
                         <td>${voucher.quantity}</td>
                         <td>${voucher.startDay}</td>
                         <td>${voucher.endDate}</td>
                         <td>
                          <button class="btn btn-primary btn-restore">Restore</button>
                          <button class="btn btn-danger btn-deleteActual">Delete</button>
                         </td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ===============================================> restore voucher <=============================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;
    const voucher = {
      voucherId: currentRow.find("td:eq(0)").text(),
      voucherName: currentRow.find("td:eq(1)").text(),
      price: currentRow.find("td:eq(2)").text(),
      minimumPrice: currentRow.find("td:eq(3)").text(),
      quantity: currentRow.find("td:eq(4)").text(),
      startDay: currentRow.find("td:eq(5)").text(),
      endDate: currentRow.find("td:eq(6)").text(),
    };

    restoreVoucher(voucher);
  });

  // ==============================================> delete voucher <=============================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;
    const voucher = {
      voucherId: currentRow.find("td:eq(0)").text(),
    };
    deleteVoucher(voucher.voucherId);
  });

  // ==============================================> restore voucher <=============================================
  function restoreVoucher(voucher) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/voucher/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(voucher),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          // success
          Swal.fire("Success!", "Restore voucher success!", "success");
          trashCanModal.hide();
          fetchVouchers(currentPage, pageSize);
          fetchDeletedVouchers(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error updating voucher: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================================> pagination <=============================================
  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchVouchers(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchVouchers(currentPage, pageSize);
  });

  // Page number buttons click handlers
  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchVouchers(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchVouchers(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchVouchers(currentPage, pageSize);
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

  // ==============================================> fetch vouchers <=============================================
  function fetchVouchers(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/Voucher/page=${pageNumber}&pageSize=${pageSize}`,
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

  fetchVouchers(currentPage, pageSize);

  // ===============================================> fetch deleted vouchers <=============================================
  function fetchDeletedVouchers(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/Voucher/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

  fetchDeletedVouchers(currentPage, pageSize);
});
