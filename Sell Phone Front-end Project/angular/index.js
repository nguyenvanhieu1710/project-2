var app = angular.module("MyProject", []);
app.controller("IndexCtrl", function ($scope, $http) {
  $scope.categoryList;
  $scope.productList;
  $scope.bestSellingProductList;
  $scope.cart;
  $scope.productHasBeenSearched;

  // ==========================================> Category <=====================================================
  $scope.DisPlayCategory = function () {
    $http({
      method: "GET",
      url: current_url + "/api-user/category/get-all",
    })
      .then(function (response) {
        $scope.categoryList = response.data;
        // debugger;
      })
      .catch(function (error) {
        console.log("Request failed: " + error.data);
      });
  };

  // ===========================================> Product <=====================================================
  $scope.DisPlayProduct = function () {
    $http({
      method: "GET",
      url: current_url + "/api-user/product/get-all",
    })
      .then(function (response) {
        $scope.productList = response.data;
        makeScript("js/main.js");
        // debugger;
      })
      .catch(function (error) {
        console.log("Request failed: " + error.data);
      });
  };

  // ==========================================> Best Selling Product <=====================================================
  $scope.DisPlayBestSellingProduct = function () {
    $http({
      method: "GET",
      url: current_url + "/api-user/product/get-best-selling-product",
    })
      .then(function (response) {
        $scope.bestSellingProductList = response.data;
        makeScript("js/main.js");
        // debugger;
      })
      .catch(function (error) {
        console.log("Request failed: " + error.data);
      });
  };

  // ==========================================> Product Detail <=====================================================
  $scope.openProductDetail = function (product) {
    // debugger;
    window.location.href = "productDetail.html?productId=" + product.productId;
  };

  //================================================> Cart <=================================================
  $scope.loadCart = function () {
    // debugger;
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.updateCartSummary();
  };

  // ========================================> Add to cart <================================================
  $scope.addToCart = function (product) {
    // debugger;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
      });
    }

    $scope.cart = cart;
    $scope.updateCartInStorage();
    $scope.updateCartSummary();
    alert(`${product.productName} đã được thêm vào giỏ hàng!`);
  };

  // =======================================> Update cart in storage <================================================
  $scope.updateCartInStorage = function () {
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  // ======================================> Remove from cart <================================================
  $scope.removeFromCart = function (product) {
    $scope.cart = $scope.cart.filter(
      (item) => item.productId !== product.productId
    );
    $scope.updateCartInStorage();
    $scope.updateCartSummary();
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

  // ======================================> Search product <================================================
  $scope.SearchProduct = function (productName) {
    // debugger;
    document.getElementById("product-has-been-searched").style.display =
      "block";

    $scope.productHasBeenSearched = [];

    $http({
      method: "GET",
      url: current_url + "/api-user/product/search/" + productName,
    })
      .then(function (response) {
        // debugger;
        $scope.productHasBeenSearched = response.data;

        setTimeout(() => {
          const slider = $(".products-slick");
          if (slider.hasClass("slick-initialized")) {
            slider.slick("unslick");
          }

          slider.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: true,
            dots: false,
            appendArrows: "#slick-nav-10",
          });
        }, 0);
      })
      .catch(function (error) {
        console.error("Request failed: ", error.data);
      });
  };

  // =====================================> Default Layout <================================================
  $scope.defaultLayout = function () {
    document.getElementById("product-has-been-searched").style.display = "none";
  };

  // =====================================> call function <================================================
  $scope.DisPlayCategory();
  $scope.DisPlayProduct();
  $scope.DisPlayBestSellingProduct();
  $scope.loadCart();
  $scope.defaultLayout();
});
