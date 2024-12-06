var app = angular.module("MyProject", []);

app.controller("CartCtrl", function ($scope, $http) {
  $scope.cart = [];

  // ====================================> Cart <===========================================
  $scope.loadCart = function () {
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.calculateTotal();
  };

  // =====================================> Calculate total <===========================================
  $scope.calculateTotal = function () {
    $scope.totalPrice = $scope.cart.reduce((total, item) => {
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

  // =====================================> call function <===========================================
  $scope.loadCart();
});
