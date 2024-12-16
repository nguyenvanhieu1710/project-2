$(document).ready(function () {
  var token = localStorage.getItem("staff");
  var categoryId = "";

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

  // ===============================> handle button <===================================
  var status = 1;
  $(".btn-add-category").click(function () {
    status = 1;
    $("#exampleModalLabel").text("Add Category");
  });

  $(".btn-update-category").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-category").click(function () {
    status = 3;
    deleteVirtualCategory();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addCategory();
    }
    if (status == 2) {
      updateCategory();
    }
  });

  // ===============================> validate data <===================================
  function validateCategoryData(categoryName, categoryImage, dadCategoryId) {
    if (!categoryName) {
      Swal.fire("Warning!", "Please enter a category name.", "warning");
      return false;
    }
    if (!categoryImage) {
      Swal.fire("Warning!", "Please select a category image.", "warning");
      return false;
    }
    if (!dadCategoryId) {
      Swal.fire("Warning!", "Please enter a dad category ID.", "warning");
      return false;
    }
    return true;
  }

  // ==============================> add category <===================================
  async function addCategory() {
    var categoryName = $("input[name='categoryName']").val();
    var categoryImage = $("#categoryImage")[0].files[0];
    var dadCategoryId = $("input[name='dadCategoryId']").val();

    if (!validateCategoryData(categoryName, categoryImage, dadCategoryId)) {
      return;
    }

    let categoryImg = await uploadImage();

    // debugger;

    var raw_data = {
      categoryId: 0,
      categoryName: categoryName,
      categoryImage: categoryImg,
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
          Swal.fire("Error!", "Error adding category: " + data.error, "error");
          console.log(data.error);
        } else {
          Swal.fire("Success!", "Category added successfully.", "success");
          exampleModal.hide();
          fetchCategory(currentPage, pageSize);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> turn on modal to update <===================================
  function TurnOnModalToUpdate() {
    if ($("input.category-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one category to update.",
        "warning"
      );
      return;
    }

    if ($("input.category-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only one category to update.", "warning");
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

          exampleModal.show();
          $("#exampleModalLabel").text("Update Category");
        } else {
          Swal.fire(
            "Error!",
            "Error retrieving category data: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> update category <===================================
  function updateCategory() {
    var categoryName = $("input[name='categoryName']").val();
    var categoryImage = $("#categoryImage")[0].files[0];
    var dadCategoryId = $("input[name='dadCategoryId']").val();

    if (!validateCategoryData(categoryName, categoryImage, dadCategoryId)) {
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
          Swal.fire("Success!", "Category updated successfully!", "success");
          exampleModal.hide();
          fetchCategory(currentPage, pageSize);
        } else {
          Swal.fire(
            "Error!",
            "Error updating category: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================> delete category <===================================
  function deleteCategory(categoryId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire(
            "Error!",
            "Error deleting category: " + data.error,
            "error"
          );
        }
        Swal.fire("Success!", "Category deleted successfully!", "success");
        trashCanModal.hide();
        fetchDeletedCategory(currentPage, pageSize);
        fetchCategory(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> delete virtual category <===================================
  function deleteVirtualCategory() {
    if ($("input.category-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one category to update.",
        "warning"
      );
      return;
    }

    if ($("input.category-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only a category to update.", "warning");
      return;
    }

    // data
    var categoryName;
    var price;
    var minimumPrice;
    var quantity;
    var startDay;
    var endDate;

    $(".category-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      categoryName = row.find("td").eq(1).text();
      price = row.find("td").eq(2).text();
      minimumPrice = row.find("td").eq(3).text();
      quantity = row.find("td").eq(4).text();
      startDay = row.find("td").eq(5).text();
      endDate = row.find("td").eq(6).text();

      categoryId = id;
      // debugger;
    });

    var raw_data = {
      categoryId: categoryId,
      categoryName: categoryName,
      price: parseFloat(price),
      minimumPrice: parseFloat(minimumPrice),
      quantity: quantity,
      startDay: startDay,
      endDate: endDate,
      deleted: true,
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
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Delete virtual category success.", "success");
          fetchCategory(currentPage, pageSize);
          fetchDeletedCategory(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> update table <===================================
  function updateTable(categories) {
    const tbody = $("#activeTable tbody");
    tbody.empty();
    categories.forEach((category) => {
      const row = `<tr>
                       <th><input type="checkbox" class="category-checkbox"></th>
                       <td>${category.categoryId}</td>
                      <td>${category.categoryName}</td>
                      <td><img src="${category.categoryImage}" alt="Category Image" width="30" height="30"></td>
                      <td>${category.dadCategoryId}</td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ===============================> update table deleted <==================================
  function updateTableDeleted(categories) {
    const tbody = $("#deletedTable tbody");
    tbody.empty();
    categories.forEach((category) => {
      const row = `<tr>                       
                      <td>${category.categoryId}</td>
                      <td>${category.categoryName}</td>
                      <td><img src="${category.categoryImage}" alt="Category Image" width="30" height="30"></td>
                      <td>${category.dadCategoryId}</td>
                      <td>
                          <button class="btn btn-primary btn-restore">Restore</button>
                          <button class="btn btn-danger btn-deleteActual">Delete</button>
                      </td>
                     </tr>`;
      tbody.append(row);
    });
  }

  // ==============================> restore category <==================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const category = {
      categoryId: currentRow.find("td").eq(0).text(),
      categoryName: currentRow.find("td").eq(1).text(),
      categoryImage: currentRow.find("td").eq(2).text(),
      dadCategoryId: currentRow.find("td").eq(3).text(),
    };

    restoreCategory(category);
  });

  // =============================> delete actual category <==================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const category = {
      categoryId: currentRow.find("td").eq(0).text(),
      categoryName: currentRow.find("td").eq(1).text(),
      categoryImage: currentRow.find("td").eq(2).text(),
      dadCategoryId: currentRow.find("td").eq(3).text(),
    };

    deleteCategory(category.categoryId);
  });

  // ==============================> restore category <==================================
  function restoreCategory(category) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/category/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(category),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore category success.", "success");
          trashCanModal.hide();
          fetchCategory(currentPage, pageSize);
          fetchDeletedCategory(currentPage, pageSize);
        } else {
          Swal.fire(
            "Error!",
            "Error updating category: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================> pagination <===================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchCategory(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchCategory(currentPage, pageSize);
  });

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

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ===============================> fetch category <================================
  function fetchCategory(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/category/page=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
    });
  }

  // ==============================> fetch category deleted <================================
  function fetchDeletedCategory(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/Category/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

  // ===============================> upload image <===================================
  function uploadImage() {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("categoryImage").files[0];
      const formData = new FormData();
      formData.append("file", fileInput);

      $.ajax({
        type: "POST",
        url: "http://localhost:4006/api-admin/category/upload-image",
        data: formData,
        headers: { Authorization: "Bearer " + token },
        processData: false,
        contentType: false,
      })
        .done(function (data) {
          if (data && data.fullPath) {
            // Swal.fire("Success!", `File upload at ${data.fullPath}`, "success");
            resolve(data.fullPath.toString());
          } else {
            Swal.fire(
              "Error!",
              "File upload failed. Please try again later.",
              "error"
            );
            reject("Upload failed.");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Request failed:", textStatus, errorThrown);
          reject(errorThrown);
        });
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

  // ========================================> call function <==================================================
  fetchCategory(currentPage, pageSize);
  fetchDeletedCategory(currentPage, pageSize);
});
