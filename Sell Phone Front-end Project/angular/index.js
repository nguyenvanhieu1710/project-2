var app = angular.module("MyProject", []);
app.controller("IndexCtrl", function ($scope, $http) {
  $scope.categoryList;
  $scope.productList;
  $scope.bestSellingProductList;
  $scope.cart;

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

  $scope.openProductDetail = function (product) {
    // debugger;
    window.location.href = "productDetail.html?productId=" + product.productId;
  };

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
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.productName} đã được thêm vào giỏ hàng!`);
  };

  $scope.loadCart = function () {
    // debugger;
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
  };

  $scope.getTotalQuantity = function () {
    return ($scope.cart || []).reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  };

  $scope.getSubtotal = function () {
    return ($scope.cart || []).reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
  };

  $scope.removeFromCart = function (product) {
    $scope.cart = $scope.cart.filter(
      (item) => item.productId !== product.productId
    );
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.DisPlayCategory();
  $scope.DisPlayProduct();
  $scope.DisPlayBestSellingProduct();
  $scope.loadCart();
});
