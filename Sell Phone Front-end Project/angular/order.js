var app = angular.module("MyProject", []);

app.controller("OrderCtrl", function ($scope, $http, $timeout) {
  $scope.orderList;
  $scope.allOrders = [];
  $scope.selectedOrder;
  var user = JSON.parse(localStorage.getItem("user"));
  var userId = user.AccountId;
  var currentPage = 1;
  var pageSize = 20;

  // ===============================================> Order <===============================================
  $scope.getAllOrderOfUser = function () {
    let apiUrl = `${current_url}/api-user/orders/get-data-by-userId-and-pagination?userId=${userId}&pageNumber=${currentPage}&pageSize=${pageSize}`;

    $scope.apiCall(apiUrl, function (data) {
      $scope.orderList = data;
      $scope.allOrders = data;
    });
  };

  // ==============================================> Get Order By Status <===============================================
  $scope.getOrderByStatus = function (status) {
    if (status === "All Orders") {
      $scope.getAllOrderOfUser();
      return;
    }
    let orderByStatus = $scope.allOrders.filter(function (item) {
      return item.orderStatus === status;
    });

    $timeout(function () {
      $scope.orderList = orderByStatus.length > 0 ? orderByStatus : [];
    }, 100);

    $scope.getAllOrderOfUser();
  };

  // ===============================================> pagination <===============================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      $scope.getAllOrderOfUser();
      updatePaginationButtons();
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    $scope.getAllOrderOfUser();
    updatePaginationButtons();
  });

  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    $scope.getAllOrderOfUser();
    updatePaginationButtons();
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    $scope.getAllOrderOfUser();
    updatePaginationButtons();
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    $scope.getAllOrderOfUser();
    updatePaginationButtons();
  });

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".store-pagination .page-item").removeClass("active");

    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }
  // ==============================================> End pagination <===============================================

  // ===========================================> Search <===============================================
  $scope.searchOrderByProductName = function () {
    $scope.apiCall(
      `${current_url}/api-user/Orders/search-by-productname?productName=${$scope.searchText}`,
      function (data) {
        $scope.orderList = data;
      }
    );
  };

  // =====================================> Calculate total price for an order <=============================
  $scope.calculateTotalPrice = function (order) {
    let totalPrice = 0;
    order.listjson_orderDetail.forEach(function (orderDetail) {
      totalPrice +=
        orderDetail.quantity * orderDetail.price - orderDetail.discountAmount;
    });
    return totalPrice;
  };

  // ===========================================> View Order Details <===============================================
  $scope.viewDetails = function (order) {
    $scope.selectedOrder = order;
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
  $scope.getAllOrderOfUser();
  $scope.loadCart();
});
