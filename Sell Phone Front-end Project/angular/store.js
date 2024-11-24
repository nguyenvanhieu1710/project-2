var app = angular.module("MyProject", []);
app.controller("StoreCtrl", function ($scope, $http) {
  $scope.categoryList;
  $scope.productList;
  $scope.currentPage = 1;
  $scope.pageSize = 5;
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

  $scope.loadProducts = function () {
    $http({
      method: "GET",
      url: `${current_url}/api-user/Product/page=${$scope.currentPage}&pageSize=${$scope.pageSize}`,
    })
      .then(function (response) {
        $scope.productList = response.data;
        // debugger;
      })
      .catch(function (error) {
        console.log("Request failed: " + error.data);
      });
  };

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

  $scope.addToCart = function (product) {
    debugger;
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

  $scope.DisPlayCategory();
  $scope.loadProducts();
});
