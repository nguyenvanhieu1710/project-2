$(document).ready(function () {
  var token = localStorage.getItem("staff");
  var categoryId = "";

  let currentPage = 1;
  const pageSize = 5;

  // Modal bootstrap
  const exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );

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
    // deleteCategory();
    deleteVirtualCategory();
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

  async function addCategory() {
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
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Category added successfully.");
          console.log("Category added successfully.");
          exampleModal.hide();
          fetchCategory(currentPage, pageSize);
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
          alert("Update category success!");
          exampleModal.hide();
          fetchCategory(currentPage, pageSize);
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
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

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
        exampleModal.hide();
        fetchCategory(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteVirtualCategory() {
    if ($("input.category-checkbox:checked").length === 0) {
      alert("Please select at least one category to update.");
      return;
    }

    if ($("input.category-checkbox:checked").length > 1) {
      alert("Choose only a category to update.");
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

    // alert(JSON.stringify(raw_data));

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
          // success
          alert("Delete virtual category success!");
          fetchCategory(currentPage, pageSize);
          fetchDeletedCategory(currentPage, pageSize);
        } else {
          alert("Error updating category: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

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
          // success
          alert("Restore category success!");
          fetchCategory(currentPage, pageSize);
          fetchDeletedCategory(currentPage, pageSize);
        } else {
          alert("Error updating category: " + data.error);
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

  fetchCategory(currentPage, pageSize);

  function fetchDeletedCategory(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/Category/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

  fetchDeletedCategory(currentPage, pageSize);

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
            // alert(`File đã upload tại đường dẫn: ${data.fullPath}`);
            resolve(data.fullPath.toString());
          } else {
            alert("Upload thất bại.");
            reject("Upload failed.");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Request failed:", textStatus, errorThrown);
          alert("Đã có lỗi xảy ra khi tải lên.");
          reject(errorThrown);
        });
    });
  }
});
