var app = angular.module("MyProject", []);
app.controller("AdminCtrl", function ($scope, $http) {
  $scope.Loading = function () {
    // $http({
    //   method: "GET",
    //   url: current_url + "/api-user/category/get-all",
    // })
    //   .then(function (response) {
    //     $scope.categoryList = response.data;
    //     // debugger;
    //   })
    //   .catch(function (error) {
    //     console.log("Request failed: " + error.data);
    //   });
    debugger;
    console.log("Request failed: " + error.data);
    alert("Request failed: ");
  };

  $scope.Loading();
});
