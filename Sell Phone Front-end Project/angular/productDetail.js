var app = angular.module("MyProject", []);

app.controller("ProductDetailCtrl", function ($scope, $http) {
  $scope.product;
  $scope.productRelatedList;

  var params = new URLSearchParams(window.location.search); // Lấy phần query string sau dấu ?
  var productId = params.get("productId");
  // debugger;
  // ==============================================> Product Detail <===============================================
  $scope.loadProduct = function () {
    $scope.apiCall(
      current_url + "/api-user/product/get-data-by-id/" + productId,
      function (data) {
        $scope.product = data;
        makeScript("js/main.js");
        // debugger;
      }
    );
  };

  // =============================================> Get Stars <===============================================
  $scope.getStars = function (star) {
    star = parseInt(star) || 0;
    const fullStars = new Array(star).fill("filled");
    const emptyStars = new Array(5 - star).fill("empty");
    return fullStars.concat(emptyStars);
  };

  // ==============================================> Related Product <===============================================
  $scope.RelatedProduct = function () {
    $scope.apiCall(current_url + "/api-user/product/get-all", function (data) {
      $scope.productRelatedList = data;
    });
    // $scope.apiCall(
    //   current_url + "/api-user/product/get-data-by-id/" + productId,
    //   function (data) {
    //     var currentProductBrand = data.brand;
    //     debugger;
    //     $scope.apiCall(
    //       current_url + "/api-user/product/get-all",
    //       function (data) {
    //         $scope.productRelatedList = data.filter(
    //           (item) =>
    //             item.brand === currentProductBrand &&
    //             item.id !== $scope.product.id
    //         );
    //         setTimeout(() => {
    //           const slider = $(".products-slick");
    //           if (slider.hasClass("slick-initialized")) {
    //             slider.slick("unslick");
    //           }

    //           slider.slick({
    //             slidesToShow: 4,
    //             slidesToScroll: 1,
    //             autoplay: true,
    //             autoplaySpeed: 2000,
    //             arrows: true,
    //             dots: false,
    //             appendArrows: "#slick-nav-1",
    //           });
    //         }, 0);
    //         makeScript("js/main.js");
    //         debugger;
    //       }
    //     );
    //   }
    // );
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
    Swal.fire(
      "Success!",
      `${product.productName} has been added to the cart!`,
      "success"
    );
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

  // ===============================================> call function <===============================================
  $scope.loadCart();
  $scope.loadProduct();
  $scope.RelatedProduct();
});
