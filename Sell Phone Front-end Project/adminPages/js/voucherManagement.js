$(document).ready(function () {
  var token = localStorage.getItem("staff");
  var voucherId = "";

  let currentPage = 1;
  const pageSize = 5;

  // Modal bootstrap
  const exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );

  // Modal bootstrap
  const trashCanModal = new bootstrap.Modal(
    document.getElementById("trashCanModal")
  );

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

  function addVoucher() {
    var voucherName = $("input[name='voucherName']").val();
    var price = $("input[name='price']").val();
    var minimumPrice = $("input[name='minimumPrice']").val();
    var quantity = $("input[name='quantity']").val();
    var startDay = $("input[name='startDay']").val();
    var endDate = $("input[name='endDate']").val();

    if (!voucherName) {
      alert("Please enter a voucher name.");
      return;
    }
    if (!price) {
      alert("Please enter a price.");
      return;
    }
    if (!minimumPrice) {
      alert("Please enter a minimum price.");
      return;
    }
    if (!quantity) {
      alert("Please enter a quantity.");
      return;
    }
    if (!startDay) {
      alert("Please enter a start day.");
      return;
    }
    if (!endDate) {
      alert("Please enter an end date.");
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
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Voucher added successfully.");
          console.log("Voucher added successfully.");
          fetchVouchers(currentPage, pageSize);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.voucher-checkbox:checked").length === 0) {
      alert("Please select at least one voucher to update.");
      return;
    }

    if ($("input.voucher-checkbox:checked").length > 1) {
      alert("Choose only one voucher to update.");
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
          alert("Error retrieving voucher data: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function updateVoucher() {
    var voucherName = $("input[name='voucherName']").val();
    var price = $("input[name='price']").val();
    var minimumPrice = $("input[name='minimumPrice']").val();
    var quantity = $("input[name='quantity']").val();
    var startDay = $("input[name='startDay']").val();
    var endDate = $("input[name='endDate']").val();

    if (!voucherName) {
      alert("Please enter a voucher name.");
      return;
    }
    if (!price) {
      alert("Please enter a price.");
      return;
    }
    if (!minimumPrice) {
      alert("Please enter a minimum price.");
      return;
    }
    if (!quantity) {
      alert("Please enter a quantity.");
      return;
    }
    if (!startDay) {
      alert("Please enter a start day.");
      return;
    }
    if (!endDate) {
      alert("Please enter an end date.");
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
          alert("Update voucher success!");
          fetchVouchers(currentPage, pageSize);
        } else {
          alert("Error updating voucher: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete voucher Success");
        fetchVouchers(currentPage, pageSize);
        fetchDeletedVouchers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteVirtualVoucher() {
    // get voucherId
    if ($("input.voucher-checkbox:checked").length === 0) {
      alert("Please select at least one voucher to update.");
      return;
    }

    if ($("input.voucher-checkbox:checked").length > 1) {
      alert("Choose only a voucher to update.");
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

          // alert(JSON.stringify(raw_data));

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
                // success
                alert("Delete virtual voucher success!");
                fetchVouchers(currentPage, pageSize);
                fetchDeletedVouchers(currentPage, pageSize);
              } else {
                alert("Error updating voucher: " + data.error);
              }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              console.log("Request failed: ", textStatus, errorThrown);
            });
        } else {
          // debugger;
          alert("Error retrieving voucher data: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

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

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchVoucher(searchValue, currentPage, pageSize);
    });

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

  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
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
    deleteVoucher(voucher.voucherId);
  });

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
          alert("Restore voucher success!");
          fetchVouchers(currentPage, pageSize);
          fetchDeletedVouchers(currentPage, pageSize);
        } else {
          alert("Error updating voucher: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

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
});
