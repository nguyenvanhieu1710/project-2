var app = angular.module("MyProject", []);

app.controller("NewsCtrl", function ($scope, $http) {
  $scope.newsList;

  $http({
    method: "GET",
    url: current_url + "/api-user/news/get-all",
  })
    .then(function (response) {
      debugger;
      $scope.newsList = response.data;
    })
    .catch(function (error) {
      console.log("Request failed: " + error.data);
    });
});
