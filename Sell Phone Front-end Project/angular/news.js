var app = angular.module("MyProject", []);

app.controller("NewsCtrl", function ($scope, $http) {
  var token = localStorage.getItem("admin");
  $scope.newsList;
  $scope.selectedNews;
  $scope.news;
  $scope.status; // 0: create, 1: update

  // ==============================================> handle status <===============================================
  $scope.handleStatus = function (status) {
    // debugger;
    $scope.status = status;
    if (status == 0) {
      $scope.modalTitle = "Create News";
    } else if (status == 1) {
      $scope.modalTitle = "Update News";
    }
  };

  // ==============================================> execute function <===============================================
  $scope.executeFunction = function () {
    if ($scope.status == 0) {
      $scope.addNews();
    } else if ($scope.status == 1) {
      $scope.updateNews();
    }
  };

  // ==============================================> Load News <===============================================
  $scope.loadNews = function () {
    $scope.apiCall(current_url + "/api-user/news/get-all", function (data) {
      $scope.newsList = data;
    });
  };

  // =============================================> select news <===================================
  $scope.selectNews = function (news) {
    $scope.selectedNews = news;
    // debugger;
  };

  // =============================================> add news <===================================
  $scope.addNews = async function () {
    var newsName = $scope.news.newsName;
    var content = $scope.news.content;
    var newsImage = $scope.news.newsImage;
    var postingDate = $scope.news.postingDate;
    var personPostingId = $scope.news.personPostingId;

    if (!newsName || !content || !postingDate || !personPostingId) {
      Swal.fire(
        "Warning!",
        "Please enter full information of news!",
        "warning"
      );
      return;
    }

    let newsImg = await uploadImage();
    if (!newsImg) {
      return;
    }

    var raw_data = {
      newsId: 0,
      newsName: newsName,
      content: content,
      newsImage: newsImg,
      postingDate: postingDate,
      personPostingId: personPostingId,
      deleted: false,
    };

    $http({
      method: "POST",
      url: current_url + "/api-user/News/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(raw_data),
    })
      .then(function (response) {
        if (response.data && response.data.error) {
          Swal.fire("Error!", "Error: " + response.data.error, "error");
          // console.log(response.data.error);
        } else {
          Swal.fire("Success!", "Add news success!", "success");
          $scope.loadNews();
        }
      })
      .catch(function (error) {
        console.log("Request failed: ", error);
      });
  };

  // =============================================> fill data to modal update <===================================
  $scope.fillDataToModalUpdate = function () {
    // debugger;
    $scope.modalTitle = "Update News";

    $scope.news = angular.copy($scope.selectedNews);

    $scope.news.newsId = $scope.selectedNews.newsId;
    $scope.news.newsName = $scope.selectedNews.newsName;
    $scope.news.content = $scope.selectedNews.content;
    $scope.news.newsImage = $scope.selectedNews.newsImage;
    $scope.news.postingDate = new Date($scope.news.postingDate);
    // $scope.news.postingDate = $scope.selectedNews.postingDate;
    $scope.news.personPostingId = $scope.selectedNews.personPostingId;

    $scope.status = 1;
  };

  // ============================================> update news <===================================
  $scope.updateNews = async function () {
    let newsImg = await uploadImage();
    if (!newsImg) {
      return;
    }

    var raw_data = {
      newsId: $scope.news.newsId,
      newsName: $scope.news.newsName,
      content: $scope.news.content,
      newsImage: newsImg,
      postingDate: $scope.news.postingDate,
      personPostingId: $scope.news.personPostingId,
      deleted: false,
    };

    // debugger;
    $http({
      method: "POST",
      url: current_url + "/api-user/News/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(raw_data),
    })
      .then(function (response) {
        if (response.data && response.data.error) {
          Swal.fire("Error!", "Error: " + response.data.error, "success");
          // console.log(response.data.error);
        } else {
          Swal.fire("Success!", "Update News Success!", "success");
          $scope.loadNews();
        }
      })
      .catch(function (error) {
        console.log("Request failed: ", error);
      });
  };

  // =============================================> delete news <===================================
  $scope.deleteNews = function () {
    // Lấy newsId từ selectedNews
    var newsId = $scope.selectedNews.newsId;

    // Gửi yêu cầu xóa tin tức
    $http({
      method: "POST",
      url: current_url + "/api-user/News/delete/" + newsId,
      headers: {
        Authorization: "Bearer " + token, // token từ nơi nào đó
        "Content-Type": "application/json",
      },
    }).then(
      function (response) {
        // Kiểm tra kết quả trả về
        if (response.data.error) {
          Swal.fire("Error!", "Error: " + response.data.error, "error");
        } else {
          Swal.fire("Success!", "Delete news success!", "success");
          $scope.loadNews();
        }
      },
      function (error) {
        console.error("Request failed: ", error);
      }
    );
  };

  // ============================================> upload image <================================
  async function uploadImage() {
    const fileInput = document.getElementById("newsImage").files[0]; // Lấy tệp ảnh từ input
    if (!fileInput) {
      alert("Chưa chọn tệp ảnh!");
      return null;
    }

    const formData = new FormData();
    formData.append("file", fileInput);

    try {
      // Gửi yêu cầu POST tới API để tải ảnh lên
      const response = await $http({
        method: "POST",
        url: "http://localhost:4006/api-user/news/upload-image",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: formData,
        transformRequest: angular.identity, // Giữ nguyên FormData
        headers: { "Content-Type": undefined },
      });

      // Kiểm tra nếu API trả về đường dẫn đầy đủ của ảnh
      if (response.data && response.data.fullPath) {
        return response.data.fullPath.toString(); // Trả về đường dẫn đầy đủ của ảnh
      } else {
        alert("Upload thất bại.");
        return null;
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Đã có lỗi xảy ra khi tải lên.");
      return null;
    }
  }

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

  // ============================================> call function <===================================
  $scope.loadNews();
});
