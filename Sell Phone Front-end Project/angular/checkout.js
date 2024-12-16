var app = angular.module("MyProject", []);

app.controller("CheckoutCtrl", function ($scope, $http) {
  $scope.cart = [];

  // ======================================> Cart <===========================================
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

  // =====================================> call function <===============================================
  $scope.loadCart();
});
