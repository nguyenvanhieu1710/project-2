var app = angular.module("MyProject", []);

app.controller("CartCtrl", function ($scope, $http) {
  $scope.cart = [];

  $scope.loadCart = function () {
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.calculateTotal();
  };

  $scope.calculateTotal = function () {
    $scope.totalPrice = $scope.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    $scope.discount = 0;
    $scope.totalAfterDiscount = $scope.totalPrice - $scope.discount;
  };

  $scope.updateCartInStorage = function () {
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.removeFromCart = function (product) {
    $scope.cart = $scope.cart.filter(
      (item) => item.productId !== product.productId
    );
    $scope.updateCartInStorage();
  };

  $scope.loadCart();
});
