var token = localStorage.getItem("staff");
var categoryId = "";

function displayCategory() {
  // debugger;
  $.ajax({
    type: "GET",
    url: "http://localhost:4006/api-admin/Category/page=1&pageSize=5",
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
// displayCategory();

var status = 1;
$(".btn-add-category").click(function () {
  status = 1;
});

$(".btn-update-category").click(function () {
  status = 2;
  TurnOnModalToUpdate();
});

$(".btn-delete-category").click(function () {
  status = 3;
  deleteCategory();
});

$(".btn-handle-func").click(function () {
  if (status == 1) {
    // debugger;
    addCategory();
  }
  if (status == 2) {
    updateCategory();
  }
  // if (status == 3) {
  //   deleteCategory();
  // }
});

function addCategory() {
  var categoryName = $("input[name='categoryName']").val();
  var categoryImage = $("#categoryImage")[0].files[0];
  var dadCategoryId = $("input[name='dadCategoryId']").val();

  if (!categoryName) {
    alert("Please enter a category name.");
    return;
  }
  if (!categoryImage) {
    alert("Please select a category image.");
    return;
  }
  if (!dadCategoryId) {
    alert("Please enter a dad category ID.");
    return;
  }

  // debugger;

  var raw_data = {
    categoryId: 0,
    categoryName: categoryName,
    categoryImage: categoryImage.name,
    dadCategoryId: dadCategoryId,
  };
  // debugger;
  $.ajax({
    type: "POST",
    url: "http://localhost:4006/api-admin/category/create",
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
        alert("Category added successfully.");
        console.log("Category added successfully.");
        displayCategory();
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("Request failed: ", textStatus, errorThrown);
    });
}

function TurnOnModalToUpdate() {
  if ($("input.category-checkbox:checked").length === 0) {
    alert("Please select at least one category to update.");
    return;
  }

  if ($("input.category-checkbox:checked").length > 1) {
    alert("Choose only one category to update.");
    return;
  }

  $(".category-checkbox:checked").each(function () {
    let row = $(this).closest("tr");
    let id = row.find("td").eq(0).text();
    categoryId = id;
  });

  // debugger;
  $.ajax({
    type: "GET",
    url:
      "http://localhost:4006/api-admin/category/get-data-by-id/" + categoryId,
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
        $("input[name='categoryName']").val(data.categoryName);
        // $("#categoryImage")[0].files[0];
        $("input[name='dadCategoryId']").val(data.dadCategoryId);

        var modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );
        modal.show();
        $("#exampleModalLabel").text("Update Category");
      } else {
        alert("Error retrieving category data: " + data.error);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("Request failed: ", textStatus, errorThrown);
    });
}

function updateCategory() {
  var categoryName = $("input[name='categoryName']").val();
  var categoryImage = $("#categoryImage")[0].files[0];
  var dadCategoryId = $("input[name='dadCategoryId']").val();

  if (!categoryName) {
    alert("Please enter a category name.");
    return;
  }
  if (!categoryImage) {
    alert("Please select a category image.");
    return;
  }
  if (!dadCategoryId) {
    alert("Please enter a dad category ID.");
    return;
  }

  // debugger;

  var raw_data = {
    categoryId: categoryId,
    categoryName: categoryName,
    categoryImage: categoryImage.name,
    dadCategoryId: dadCategoryId,
  };

  $.ajax({
    type: "POST",
    url: "http://localhost:4006/api-admin/category/update",
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
        alert("Update category success!");
        displayCategory();
      } else {
        alert("Error updating category: " + data.error);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("Request failed: ", textStatus, errorThrown);
    });
}

function deleteCategory() {
  if ($("input.category-checkbox:checked").length === 0) {
    alert("Please select at least one category to update.");
    return;
  }

  if ($("input.category-checkbox:checked").length > 1) {
    alert("Choose only a category to update.");
    return;
  }

  $(".category-checkbox:checked").each(function () {
    // Lấy dòng (tr) chứa checkbox này
    let row = $(this).closest("tr");

    // Lấy thông tin từ các cột trong dòng
    let id = row.find("td").eq(0).text(); // Cột ID

    categoryId = id;
    // debugger;
  });

  $.ajax({
    type: "POST",
    url: "http://localhost:4006/api-admin/category/delete/" + categoryId,
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
      alert("Delete category Success");
      displayCategory();
    })
    .fail(function () {
      console.log("Request failed: ", textStatus, errorThrown);
    });
}

function updateTable(categories) {
  const tbody = $("tbody");
  tbody.empty();
  categories.forEach((category) => {
    const row = `<tr>
                       <th><input type="checkbox" class="category-checkbox"></th>
                       <td>${category.categoryId}</td>
                      <td>${category.categoryName}</td>
                      <td><img src="${category.categoryImage}" alt="Category Image" width="50" height="50"></td>
                      <td>${category.dadCategoryId}</td>
                     </tr>`;
    tbody.append(row);
  });
}

$(document).ready(function () {
  let currentPage = 1;
  const pageSize = 5;

  // Fetch initial page
  fetchCategory(currentPage, pageSize);

  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchCategory(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchCategory(currentPage, pageSize);
  });

  // Page number buttons click handlers
  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchCategory(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchCategory(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchCategory(currentPage, pageSize);
  });

  function fetchCategory(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/category/page=${pageNumber}&pageSize=${pageSize}`,
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
