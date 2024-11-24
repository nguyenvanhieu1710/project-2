var app = angular.module("MyProject", []);

app.controller("OrderCtrl", function ($scope, $http) {
  $scope.orderList;

  $http({
    method: "GET",
    url: current_url + "/api-user/orders/get-all",
  })
    .then(function (response) {
      //   debugger;
      $scope.orderList = response.data;
    })
    .catch(function (error) {
      console.log("Request failed: " + error.data);
    });
});
