$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var productId = "";
  var categoryIdList = [];

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

  // ================================> handle button <===================================
  var status = 1;
  $(".btn-add-product").click(function () {
    status = 1;
    $("#exampleModalLabel").text("Create Product");
  });

  $(".btn-update-product").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-product").click(function () {
    status = 3;
    deleteVirtualProduct();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addProduct();
    }
    if (status == 2) {
      updateProduct();
    }
  });

  // ===================================> validate <===================================
  function validate() {
    var productName = $("input[name='productName']").val();
    var quantity = $("input[name='quantity']").val();
    var price = $("input[name='price']").val();
    var description = $("textarea[name='description']").val();
    var brand = $("input[name='brand']").val();
    var productImage = $("input[name='productImage']").val();
    var star = $("input[name='star']").val();
    var categoryId = $("input[name='categoryId']").val();
    var productDetail = $("textarea[name='productDetail']").val();

    // Validate Product Name
    if (!productName) {
      Swal.fire("Warning!", "Please enter a Product Name.", "warning");
      return false;
    }

    // Validate Quantity
    if (!quantity) {
      Swal.fire("Warning!", "Please enter a Quantity.", "warning");
      return false;
    } else if (quantity <= 0) {
      Swal.fire("Warning!", "Quantity must be greater than zero.", "warning");
      return false;
    }

    // Validate Price
    if (!price) {
      Swal.fire("Warning!", "Please enter a Price.", "warning");
      return false;
    } else if (price <= 0) {
      Swal.fire("Warning!", "Price must be greater than zero.", "warning");
      return false;
    }

    // Validate Description
    if (!description) {
      Swal.fire("Warning!", "Please enter a Description.", "warning");
      return false;
    }

    // Validate Brand
    if (!brand) {
      Swal.fire("Warning!", "Please enter a Brand.", "warning");
      return false;
    }

    // Validate Product Image
    if (!productImage) {
      Swal.fire("Warning!", "Please upload a Product Image.", "warning");
      return false;
    }

    // Validate Star Rating
    if (!star) {
      Swal.fire("Warning!", "Please enter a Star rating.", "warning");
      return false;
    } else if (star < 1 || star > 5) {
      Swal.fire("Warning!", "Star rating must be between 1 and 5.", "warning");
      return false;
    }

    // Validate Category ID
    if (!categoryId) {
      Swal.fire("Warning!", "Please enter a Category ID.", "warning");
      return false;
    }

    // Validate Product Details
    if (!productDetail) {
      Swal.fire("Warning!", "Please enter Product Details.", "warning");
      return false;
    }
  }

  // ===================================> add product <===================================
  async function addProduct() {
    var productName = $("input[name='productName']").val();
    var quantity = $("input[name='quantity']").val();
    var price = $("input[name='price']").val();
    var description = $("textarea[name='description']").val();
    var brand = $("input[name='brand']").val();
    var productImage = $("input[name='productImage']").val();
    var star = $("input[name='star']").val();
    var categoryId = $("input[name='categoryId']").val();
    var productDetail = $("textarea[name='productDetail']").val();

    if (validate() == false) {
      return;
    }

    let productImg = await uploadImage();

    var raw_data = {
      productId: 0,
      productName: productName,
      quantity: quantity,
      price: price,
      description: description,
      brand: brand,
      productImage: productImg,
      star: star,
      categoryId: categoryId,
      productDetail: productDetail,
      deleted: false,
    };
    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Product/create",
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
          Swal.fire("Error!", data.error, "error");
        } else {
          Swal.fire("Success!", "Add Product Success.", "success");
          exampleModal.hide();
          fetchProducts(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> turn on modal to update <===================================
  function TurnOnModalToUpdate() {
    if ($("input.product-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one product to update.",
        "warning"
      );
      return;
    }

    if ($("input.product-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "You can only update one product at a time.",
        "warning"
      );
      return;
    }

    $(".product-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      productId = id;
    });
    //   debugger;

    var productFound = {};
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/Product/get-data-by-id/" + productId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        productFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
        } else {
          $("input[name='productName']").val(productFound.productName);
          $("input[name='quantity']").val(productFound.quantity);
          $("input[name='price']").val(productFound.price);
          $("textarea[name='description']").val(productFound.description);
          $("input[name='brand']").val(productFound.brand);
          // $("input[name='productImage']").val(productFound.productImage);
          $("input[name='star']").val(productFound.star);
          $("input[name='categoryId']").val(productFound.categoryId);
          $("textarea[name='productDetail']").val(productFound.productDetail);

          exampleModal.show();

          $("#exampleModalLabel").text("Update Product");
          $(".modal-title").text("Update Product");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> update product <===================================
  function updateProduct() {
    var productName = $("input[name='productName']").val();
    var quantity = $("input[name='quantity']").val();
    var price = $("input[name='price']").val();
    var description = $("textarea[name='description']").val();
    var brand = $("input[name='brand']").val();
    var productImage = $("input[name='productImage']").val();
    var star = $("input[name='star']").val();
    var categoryId = $("input[name='categoryId']").val();
    var productDetail = $("textarea[name='productDetail']").val();

    if (validate() == false) {
      return;
    }

    var raw_data = {
      productId: productId,
      productName: productName,
      quantity: quantity,
      price: price,
      description: description,
      brand: brand,
      productImage: productImage,
      star: star,
      categoryId: categoryId,
      productDetail: productDetail,
      deleted: false,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Product/update",
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
          Swal.fire("Success!", "Product updated successfully.", "success");
          exampleModal.hide();
          fetchProducts(currentPage, pageSize);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> delete product <===================================
  function deleteProduct(productId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Product/delete/" + productId,
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
          Swal.fire("Error!", data.error, "error");
        }
        Swal.fire("Success!", "Product deleted successfully.", "success");
        trashCanModal.hide();
        fetchDeletedProducts(currentPage, pageSize);
        fetchProducts(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =========================================> delete virtual product <==================================================================
  function deleteVirtualProduct() {
    if ($("input.product-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one product to update.",
        "warning"
      );
      return;
    }

    if ($("input.product-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "You can only update one product at a time.",
        "warning"
      );
      return;
    }

    var productName;
    var quantity;
    var price;
    var description;
    var brand;
    var star;
    var categoryId;
    var productImage;
    var productDetail;

    $(".product-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      productName = row.find("td").eq(1).text();
      quantity = row.find("td").eq(2).text();
      price = row.find("td").eq(3).text();
      description = row.find("td").eq(4).text();
      brand = row.find("td").eq(5).text();
      star = row.find("td").eq(6).text();
      categoryId = row.find("td").eq(7).text();
      productImage = row.find("td").eq(8).text();
      productDetail = "string";

      productId = id;
    });

    var raw_data = {
      productId: productId,
      productName: productName,
      quantity: quantity,
      price: price,
      description: description,
      brand: brand,
      star: star,
      categoryId: categoryId,
      productImage: productImage,
      productDetail: productDetail,

      deleted: true,
    };
    // debugger;

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Product/update",
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
        Swal.fire("Success!", "Delete Virtual Product Success", "success");
        fetchDeletedProducts(currentPage, pageSize);
        fetchProducts(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> search product <===================================
  function searchProduct(name, currentPage, pageSize) {
    const url =
      "http://localhost:4006/api-admin/product/search-and-pagination?pageNumber=" +
      currentPage +
      "&pageSize=" +
      pageSize +
      "&name=" +
      name;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
    });
  }

  // ====================================> search product <===================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchProduct(searchValue, currentPage, pageSize);
    });

  // ====================================> update product <===================================
  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();
    data.forEach(function (product, index) {
      var row = `<tr>
                     <th scope="row">
                         <input type="checkbox" class="product-checkbox">
                     </th>
                     <td scope="row">${product.productId}</td>
                     <td>${product.productName}</td>
                     <td>${product.quantity}</td>
                     <td>${product.price}</td>
                     <td>${product.description}</td>
                     <td>${product.brand}</td>
                     <td>${product.star}</td>
                     <td>${product.categoryId}</td>
                     <td><img src="${product.productImage}" alt="Product Image" width="30" height="30"></td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> update table deleted <===================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (product, index) {
      var row = `<tr>                     
                     <td scope="row">${product.productId}</td>
                     <td>${product.productName}</td>
                     <td>${product.quantity}</td>
                     <td>${product.price}</td>
                     <td>${product.description}</td>
                     <td>${product.brand}</td>
                     <td>${product.star}</td>
                     <td>${product.categoryId}</td>
                     <td><img src="${product.productImage}" alt="Product Image" width="30" height="30"></td>
                     <td>
                       <button type="button" class="btn btn-primary btn-restore">Restore</button>
                       <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                     </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> restore product <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const product = {
      productId: currentRow.find("td").eq(0).text(),
      productName: currentRow.find("td").eq(1).text(),
      quantity: currentRow.find("td").eq(2).text(),
      price: currentRow.find("td").eq(3).text(),
      description: currentRow.find("td").eq(4).text(),
      brand: currentRow.find("td").eq(5).text(),
      star: currentRow.find("td").eq(6).text(),
      categoryId: currentRow.find("td").eq(7).text(),
      productImage: currentRow.find("td").eq(8).text(),
      deleted: false,
    };

    restoreProduct(product);
  });

  // ====================================> delete product <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const product = {
      productId: currentRow.find("td").eq(0).text(),
    };

    deleteProduct(product.productId);
  });

  // ====================================> restore product <=============================================================
  function restoreProduct(product) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/product/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(product),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore product successfully!", "success");
          trashCanModal.hide();
          fetchDeletedProducts(currentPage, pageSize);
          fetchProducts(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error updating product: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> pagination <===================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchProducts(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchProducts(currentPage, pageSize);
  });

  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchProducts(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchProducts(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchProducts(currentPage, pageSize);
  });

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ==================================> fetch products <================================================
  function fetchProducts(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/product/page=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
    });
  }

  // ===================================> fetch products deleted <================================================
  function fetchDeletedProducts(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/product/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

  // ===================================> upload image <===================================
  function uploadImage() {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("productImage").files[0];
      const formData = new FormData();
      formData.append("file", fileInput);

      $.ajax({
        type: "POST",
        url: "http://localhost:4006/api-admin/product/upload-image",
        data: formData,
        headers: { Authorization: "Bearer " + token },
        processData: false,
        contentType: false,
      })
        .done(function (data) {
          if (data && data.fullPath) {
            // Swal.fire(
            //   "Success!",
            //   `File has been uploaded at: ${data.fullPath}`,
            //   "success"
            // );
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
          Swal.fire(
            "Warning!",
            "An error occurred while uploading the file.",
            "warning"
          );
          reject(errorThrown);
        });
    });
  }

  // ==========================================> get category id list <===========================================================
  function getCategoryIdList() {
    const url = "http://localhost:4006/api-admin/category/get-all";
    apiCall("GET", url, null, function (response) {
      response.forEach((element) => {
        categoryIdList.push(element.categoryId);
      });
    });
  }

  // ==========================================> render category id list <===========================================================
  let isListVisible = false;
  function renderCategoryIdList() {
    const categoryIdListDiv = document.getElementById("categoryIdList");
    const toggleButton = document.getElementById("btnViewCategoryIdList");

    if (isListVisible) {
      categoryIdListDiv.style.display = "none";
      toggleButton.textContent = "View Category Id List";
      isListVisible = false;
    } else {
      categoryIdListDiv.innerHTML = "";
      if (categoryIdList.length === 0) {
        categoryIdListDiv.innerHTML = `
          <div class="alert alert-info">No category found. Please fetch the list first.</div>
        `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        categoryIdList.forEach((categoryId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `Category ID: ${categoryId}`;
          listGroup.appendChild(listItem);
        });

        categoryIdListDiv.appendChild(listGroup);
      }

      categoryIdListDiv.style.display = "block";
      toggleButton.textContent = "Hide Category Id List";
      isListVisible = true;
    }
  }

  // ==========================================> button view category id list <===========================================================
  document
    .getElementById("btnViewCategoryIdList")
    .addEventListener("click", renderCategoryIdList);

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
  getCategoryIdList();
  fetchProducts(currentPage, pageSize);
  fetchDeletedProducts(currentPage, pageSize);
});
