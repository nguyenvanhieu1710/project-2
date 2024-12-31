var app = angular.module("MyProject", []);

app.controller("CheckoutCtrl", function ($scope, $http) {
  $scope.cart = [];

  // =====================================> Calculate total <===========================================
  $scope.calculateTotal = function () {
    const selectedItems = $scope.cart.filter((item) => item.selected);

    $scope.totalPrice = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    $scope.discount = 0;
    $scope.totalAfterDiscount = $scope.totalPrice - $scope.discount;
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
    $scope.calculateTotal();
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

  // =====================================> call function <===============================================
  $scope.loadCart();
});
