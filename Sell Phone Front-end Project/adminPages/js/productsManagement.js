$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var productId = "";

  let currentPage = 1;
  const pageSize = 5;

  var status = 1;
  $(".btn-add-product").click(function () {
    status = 1;
  });

  $(".btn-update-product").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-product").click(function () {
    status = 3;
    deleteProduct();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addProduct();
    }
    if (status == 2) {
      updateProduct();
    }
    // if (status == 3) {
    //   deleteProduct();
    // }
  });

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
      alert("Please enter a Product Name.");
      return false;
    }

    // Validate Quantity
    if (!quantity) {
      alert("Please enter a Quantity.");
      return false;
    } else if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return false;
    }

    // Validate Price
    if (!price) {
      alert("Please enter a Price.");
      return false;
    } else if (price <= 0) {
      alert("Price must be greater than zero.");
      return false;
    }

    // Validate Description
    if (!description) {
      alert("Please enter a Description.");
      return false;
    }

    // Validate Brand
    if (!brand) {
      alert("Please enter a Brand.");
      return false;
    }

    // Validate Product Image
    if (!productImage) {
      alert("Please upload a Product Image.");
      return false;
    }

    // Validate Star Rating
    if (!star) {
      alert("Please enter a Star rating.");
      return false;
    } else if (star < 1 || star > 5) {
      alert("Star rating must be between 1 and 5.");
      return false;
    }

    // Validate Category ID
    if (!categoryId) {
      alert("Please enter a Category ID.");
      return false;
    }

    // Validate Product Details
    if (!productDetail) {
      alert("Please enter Product Details.");
      return false;
    }
  }

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
        // console.log(data);
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Add Product Success");
          console.log("Add Product Success");
          fetchProducts(1, 5);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.product-checkbox:checked").length === 0) {
      alert("Please select at least one product to update.");
      return;
    }

    if ($("input.product-checkbox:checked").length > 1) {
      alert("Choose only a product to update.");
      return;
    }

    $(".product-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

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
        // console.log(data);
        // alert(data);
        productFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find Product Success");
          // console.log("Find Product Success");

          $("input[name='productName']").val(productFound.productName);
          $("input[name='quantity']").val(productFound.quantity);
          $("input[name='price']").val(productFound.price);
          $("textarea[name='description']").val(productFound.description);
          $("input[name='brand']").val(productFound.brand);
          // $("input[name='productImage']").val(productFound.productImage);
          $("input[name='star']").val(productFound.star);
          $("input[name='categoryId']").val(productFound.categoryId);
          $("textarea[name='productDetail']").val(productFound.productDetail);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update Product");
          $(".modal-title").text("Update Product");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }
  function updateProduct() {
    // alert("Update Product Success");
    // debugger;
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
        // console.log(data);
        // alert(data);
        // debugger;
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        } else {
          alert("Update Product Success");
          // Đóng modal sau khi cập nhật thành công
          //     $("#exampleModal").modal("hide");
          //   var modal = new bootstrap.Modal(
          //     document.getElementById("exampleModal")
          //   );
          //   modal.hide();
          fetchProducts(1, 5);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteProduct() {
    if ($("input.product-checkbox:checked").length === 0) {
      alert("Please select at least one product to update.");
      return;
    }

    if ($("input.product-checkbox:checked").length > 1) {
      alert("Choose only a product to update.");
      return;
    }

    $(".product-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      productId = id;
    });

    // debugger;

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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete Product Success");
        fetchProducts(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function searchProduct(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/product/search-and-pagination?pageNumber=" +
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

      searchProduct(searchValue, currentPage, pageSize);
    });

  function updateTable(data) {
    var tbody = $("tbody");
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

  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchProducts(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchProducts(currentPage, pageSize);
  });

  // Page number buttons click handlers
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

  function fetchProducts(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/product/page=${pageNumber}&pageSize=${pageSize}`,
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

  fetchProducts(currentPage, pageSize);

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
