var token = localStorage.getItem("staff");
var voucherId = "";

function displayVoucher() {
  // debugger;
  $.ajax({
    type: "GET",
    url: "http://localhost:4006/api-admin/Voucher/page=1&pageSize=5",
    headers: { Authorization: "Bearer " + token },
    success: function (response) {
      var data = response;
      // console.log(data);
      //   debugger;
      updateTable(data);
    },
    error: function (error) {
      console.error("Request failed: ", error);
    },
  });
}
// displayVoucher();

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
  deleteVoucher();
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
        displayVoucher();
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
    url: "http://localhost:4006/api-admin/voucher/get-data-by-id/" + voucherId,
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
        displayVoucher();
      } else {
        alert("Error updating voucher: " + data.error);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("Request failed: ", textStatus, errorThrown);
    });
}

function deleteVoucher() {
  if ($("input.voucher-checkbox:checked").length === 0) {
    alert("Please select at least one voucher to update.");
    return;
  }

  if ($("input.voucher-checkbox:checked").length > 1) {
    alert("Choose only a voucher to update.");
    return;
  }

  $(".voucher-checkbox:checked").each(function () {
    // Lấy dòng (tr) chứa checkbox này
    let row = $(this).closest("tr");

    // Lấy thông tin từ các cột trong dòng
    let id = row.find("td").eq(0).text(); // Cột ID

    voucherId = id;
    // debugger;
  });

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
      displayVoucher();
    })
    .fail(function () {
      console.log("Request failed: ", textStatus, errorThrown);
    });
}

function updateTable(vouchers) {
  const tbody = $("tbody");
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

$(document).ready(function () {
  let currentPage = 1;
  const pageSize = 5;

  // Fetch initial page
  fetchVouchers(currentPage, pageSize);

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
