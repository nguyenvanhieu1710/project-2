var app = angular.module("MyProject", []);
app.controller("StoreCtrl", function ($scope, $http) {
  $scope.categoryList;
  $scope.productList;
  $scope.bestSellingProductList;
  $scope.brandList;
  $scope.currentPage = 1;
  $scope.pageSize = 5;

  // ================================================> Category <===============================================
  $scope.DisPlayCategory = function () {
    $scope.apiCall(current_url + "/api-user/category/get-all", function (data) {
      $scope.categoryList = data;
      $scope.loadProducts();
      // debugger;
    });
  };

  // ===============================================> Product <===============================================
  $scope.loadProducts = function () {
    $scope.apiCall(
      current_url +
        "/api-user/Product/page=" +
        $scope.currentPage +
        "&pageSize=" +
        $scope.pageSize,
      function (data) {
        $scope.productList = data;

        $scope.categoryList.forEach(function (category) {
          category.productCount = $scope.getProductCountForCategory(
            category.categoryId
          );
        });
        // debugger;
      }
    );
  };

  // =========================================> Best Selling Product <========================================================
  $scope.DisPlayBestSellingProduct = function () {
    $scope.apiCall(
      current_url + "/api-user/product/get-best-selling-product",
      function (data) {
        $scope.bestSellingProductList = data;
        // debugger;
      }
    );
  };

  // ==========================================> Brand <=====================================================
  $scope.getBrandList = function () {
    $scope.apiCall(current_url + "/api-user/product/get-all", function (data) {
      let brandCount = {};

      data.forEach((element) => {
        if (element.brand) {
          if (brandCount[element.brand]) {
            brandCount[element.brand]++;
          } else {
            brandCount[element.brand] = 1;
          }
        }
      });

      $scope.brandList = Object.keys(brandCount).map((brand) => ({
        brand: brand,
        count: brandCount[brand],
      }));
      // debugger;
    });
  };

  // ===========================================> Product Count For Category <=====================================================
  $scope.getProductCountForCategory = function (categoryId) {
    return $scope.productList.filter(function (product) {
      return product.categoryId === categoryId;
    }).length;
  };

  // ==========================================> Filter Product By Category <=====================================================
  $scope.filterProductsByCategory = function () {
    // debugger;
    if ($scope.productList.length === 0) {
      $scope.loadProducts();
      return;
    }

    var selectedCategoryIds = $scope.categoryList
      .filter(function (category) {
        return category.selected;
      })
      .map(function (category) {
        return category.categoryId;
      });

    $scope.productList = $scope.productList.filter(function (product) {
      return selectedCategoryIds.includes(product.categoryId);
    });
    // debugger;
  };

  // ==========================================> Filter Product By Price <=====================================================
  $scope.filterProductsByPrice = function () {
    if ($scope.productList.length === 0) {
      $scope.loadProducts();
      return;
    }

    var minPrice = parseFloat($scope.priceMin) || 0;
    var maxPrice = parseFloat($scope.priceMax) || 999999;

    $scope.productList = $scope.productList.filter(function (product) {
      return product.price >= minPrice && product.price <= maxPrice;
    });
    // debugger;
  };

  // ==========================================> Product Detail <=====================================================
  $scope.openProductDetail = function (product) {
    // debugger;
    window.location.href = "productDetail.html?productId=" + product.productId;
  };

  // ==============================================> Pagination <===============================================
  $scope.changePage = function (page) {
    $scope.currentPage = page;
    $scope.loadProducts();
  };

  $scope.nextPage = function () {
    $scope.currentPage++;
    $scope.loadProducts();
  };

  $scope.prevPage = function () {
    if ($scope.currentPage > 1) {
      $scope.currentPage--;
      $scope.loadProducts();
    }
  };

  $scope.setPageSize = function (size) {
    $scope.pageSize = size;
    $scope.loadProducts();
  };

  // ==============================================> Handle Cart <===============================================
  $scope.getCart = function () {
    return JSON.parse(localStorage.getItem("cart")) || [];
  };

  $scope.setCart = function (cart) {
    $scope.cart = cart;
    localStorage.setItem("cart", JSON.stringify(cart));
    $scope.updateCartSummary();
  };

  $scope.loadCart = function () {
    // debugger;
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.updateCartSummary();
  };

  // ======================================> Add to cart <================================================
  $scope.addToCart = function (product) {
    // debugger;
    let cart = $scope.getCart();

    let existingProduct = cart.find(
      (item) => item.productId === product.productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        quantity: 1,
        image: product.productImage,
        selected: false,
      });
    }

    $scope.setCart(cart);
    alert(`${product.productName} has been added to the cart!`);
  };

  // ======================================> Remove from cart <================================================
  $scope.removeFromCart = function (product) {
    $scope.cart = $scope.cart.filter(
      (item) => item.productId !== product.productId
    );
    $scope.setCart($scope.cart);
  };

  // ======================================> Update cart summary <================================================
  $scope.updateCartSummary = function () {
    $scope.totalQuantity = ($scope.cart || []).reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
    $scope.subtotal = ($scope.cart || []).reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
  };

  // ==============================================> call api <===============================================
  $scope.apiCall = function (url, successCallback) {
    $http({
      method: "GET",
      url: url,
    })
      .then(function (response) {
        successCallback(response.data);
      })
      .catch(function (error) {
        console.log("Request failed: " + error.data);
      });
  };

  // ==============================================> call function <===============================================
  $scope.DisPlayCategory();
  $scope.loadProducts();
  $scope.DisPlayBestSellingProduct();
  $scope.getBrandList();
  $scope.loadCart();
});
