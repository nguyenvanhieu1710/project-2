var app = angular.module("MyProject", []);
app.controller("ProfileCtrl", function ($scope, $http) {
  var user = JSON.parse(localStorage.getItem("user"));
  var token = user.Token;
  $scope.profile;

  // =========================================> Profile <===============================================================================
  $scope.loadProfile = function () {
    $scope.apiCall(
      current_url + "/api-user/users/get-data-by-id/" + user.AccountId,
      function (data) {
        $scope.profile = data;
        // debugger;
      }
    );
  };
  // ==============================================> call api <===============================================
  $scope.apiCall = function (url, successCallback) {
    $http({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(function (response) {
        successCallback(response.data);
      })
      .catch(function (error) {
        console.log("Request failed: " + error.data);
      });
  };

  // ==============================================> call function <===============================================
  $scope.loadProfile();
});
