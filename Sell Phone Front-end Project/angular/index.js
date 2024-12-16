var app = angular.module("MyProject", []);
app.controller("IndexCtrl", function ($scope, $http, $timeout) {
  $scope.categoryList;
  $scope.productList;
  $scope.bestSellingProductList;
  $scope.cart;
  $scope.productHasBeenSearched;

  // ==========================================> Category <=====================================================
  $scope.DisPlayCategory = function () {
    $scope.apiCall(current_url + "/api-user/category/get-all", function (data) {
      $scope.categoryList = data;
      // debugger;
    });
  };

  // ===========================================> Product <=====================================================
  $scope.DisPlayProduct = function () {
    $scope.apiCall(current_url + "/api-user/product/get-all", function (data) {
      $scope.productList = data;
      makeScript("js/main.js");
      // debugger;
    });
  };

  // ==========================================> Best Selling Product <=====================================================
  $scope.DisPlayBestSellingProduct = function () {
    $scope.apiCall(
      current_url + "/api-user/product/get-best-selling-product",
      function (data) {
        $scope.bestSellingProductList = data;
        // debugger;
      }
    );
  };

  $scope.getProductByBrand = function (brand) {
    $scope.productList = [];
    // debugger;
    $scope.apiCall(current_url + "/api-user/product/get-all", function (data) {
      // debugger;
      $scope.productList = data.filter((product) => product.brand == brand);
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
          appendArrows: "#slick-nav-1",
        });
      }, 0);
    });
  };

  // ==========================================> Product Detail <=====================================================
  $scope.openProductDetail = function (product) {
    // debugger;
    window.location.href = "productDetail.html?productId=" + product.productId;
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
  //================================================> Cart <=================================================
  $scope.loadCart = function () {
    // debugger;
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.updateCartSummary();
  };

  // ========================================> Add to cart <================================================
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

  // =====================================> call function <================================================
  $scope.DisPlayCategory();
  $scope.DisPlayProduct();
  $scope.DisPlayBestSellingProduct();
  $scope.loadCart();
  $scope.defaultLayout();
});
