var app = angular.module("MyProject", []);

app.controller("CartCtrl", function ($scope, $http) {
  $scope.cart = [];
  $scope.productList = [];

  // ====================================> Cart <===========================================
  $scope.loadCart = function () {
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.calculateTotal();
  };

  // =====================================> Calculate total <===========================================
  $scope.calculateTotal = function () {
    const selectedItems = $scope.cart.filter((item) => item.selected);

    $scope.totalPrice = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    $scope.discount = 0;
    $scope.totalAfterDiscount = $scope.totalPrice - $scope.discount;
  };

  // =====================================> Update cart in storage <===========================================
  $scope.updateCartInStorage = function () {
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  // =====================================> Remove from cart <===========================================
  $scope.removeFromCart = function (product) {
    $scope.cart = $scope.cart.filter(
      (item) => item.productId !== product.productId
    );
    $scope.updateCartInStorage();
  };

  // =====================================> Update selected status <===========================================
  $scope.updateSelectedStatus = function (productId, isSelected) {
    let cart = $scope.cart.map((item) => {
      if (item.productId === productId) {
        item.selected = isSelected;
      }
      return item;
    });
    $scope.cart = cart;
    $scope.updateCartInStorage();
    $scope.calculateTotal();
  };

  // =====================================> Update quantity <===========================================
  $scope.updateQuantity = function (productId, quantity) {
    if (quantity < 1) {
      alert("Quantity must be greater than zero.");
      return;
    }

    let product = $scope.productList.find(
      (item) => item.productId === productId
    );
    if (product && quantity > product.quantity) {
      alert(`Quantity cannot be greater than ${product.quantity}.`);
      return;
    }

    let cart = $scope.cart.map((item) => {
      if (item.productId === productId) {
        item.quantity = quantity;
      }
      return item;
    });

    $scope.cart = cart;
    $scope.updateCartInStorage();
    $scope.calculateTotal();
  };

  // ===========================================> Get All Product <=====================================================
  $scope.DisPlayProduct = function () {
    $scope.apiCall(current_url + "/api-user/product/get-all", function (data) {
      $scope.productList = data;
      // debugger;
    });
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

  // =====================================> call function <===========================================
  $scope.loadCart();
  $scope.DisPlayProduct();
});
