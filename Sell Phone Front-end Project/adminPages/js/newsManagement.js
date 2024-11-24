$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var newsId = "";

  var status = 1;
  $(".btn-add-news").click(function () {
    status = 1;
  });

  $(".btn-update-news").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-news").click(function () {
    status = 3;
    deleteNews();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addNews();
    }
    if (status == 2) {
      updateNews();
    }
    // if (status == 3) {
    //   deleteNews();
    // }
  });

  function validate() {
    var newsName = $("input[name='newsName']").val();
    var content = $("textarea[name='content']").val();
    var newsImage = $("input[name='newsImage']").val();
    var postingDate = $("input[name='postingDate']").val();
    var personPostingId = $("input[name='personPostingId']").val();

    // Validate News Name
    if (!newsName) {
      alert("Please enter a News Name.");
      return false;
    }

    // Validate Content
    if (!content) {
      alert("Please enter the content.");
      return false;
    }

    // Validate News Image
    if (!newsImage) {
      alert("Please upload a News Image.");
      return false;
    }

    // Validate Posting Date
    if (!postingDate) {
      alert("Please select a Posting Date.");
      return false;
    }

    // Validate Person Posting ID
    if (!personPostingId) {
      alert("Please enter the Person Posting ID.");
      return false;
    }

    return true;
  }

  function addNews() {
    // Lấy giá trị từ các trường trong form
    var newsName = $("input[name='newsName']").val();
    var content = $("textarea[name='content']").val();
    var newsImage = $("input[name='newsImage']").val();
    var postingDate = $("input[name='postingDate']").val();
    var personPostingId = $("input[name='personPostingId']").val();

    // Kiểm tra tính hợp lệ của các trường dữ liệu trước khi thực hiện thêm tin tức
    if (validate() == false) {
      return; // Dừng lại nếu validation không thành công
    }

    // Dữ liệu sẽ được gửi đến API
    var raw_data = {
      newsId: 0, // Nếu đang tạo mới tin tức, ID có thể là 0
      newsName: newsName,
      content: content, // Thêm content vào raw_data
      newsImage: newsImage,
      postingDate: postingDate,
      personPostingId: personPostingId,
      deleted: false, // Nếu bạn cần đánh dấu tin tức chưa xóa
    };

    // Gửi dữ liệu qua AJAX
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/News/create",
      headers: {
        Authorization: "Bearer " + token, // Token để xác thực người dùng
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
      data: JSON.stringify(raw_data), // Chuyển dữ liệu thành JSON trước khi gửi
    })
      .done(function (data) {
        // Kiểm tra nếu API trả về lỗi
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error); // Hiển thị thông báo lỗi
          console.log(data.error); // In lỗi ra console
        } else {
          alert("Add News Success"); // Thông báo thành công
          console.log("Add News Success");
          fetchNewss(1, 5); // Gọi lại hàm fetchNewss để cập nhật danh sách tin tức
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // In lỗi nếu có lỗi khi gửi yêu cầu AJAX
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.news-checkbox:checked").length === 0) {
      alert("Please select at least one news to update.");
      return;
    }

    if ($("input.news-checkbox:checked").length > 1) {
      alert("Choose only a news to update.");
      return;
    }

    $(".news-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      newsId = id;
    });
    //   debugger;

    var newsFound = {};
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/News/get-data-by-id/" + newsId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // console.log(data);
        // alert(data);
        newsFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find News Success");
          // console.log("Find News Success");

          $("input[name='newsName']").val(newsFound.newsName);
          $("input[name='quantity']").val(newsFound.quantity);
          $("input[name='price']").val(newsFound.price);
          $("textarea[name='description']").val(newsFound.description);
          $("input[name='brand']").val(newsFound.brand);
          // $("input[name='newsImage']").val(newsFound.newsImage);
          $("input[name='star']").val(newsFound.star);
          $("input[name='categoryId']").val(newsFound.categoryId);
          $("textarea[name='newsDetail']").val(newsFound.newsDetail);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update News");
          $(".modal-title").text("Update News");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }
  function updateNews() {
    // alert("Update News Success");
    // debugger;
    var newsName = $("input[name='newsName']").val();
    var quantity = $("input[name='quantity']").val();
    var price = $("input[name='price']").val();
    var description = $("textarea[name='description']").val();
    var brand = $("input[name='brand']").val();
    var newsImage = $("input[name='newsImage']").val();
    var star = $("input[name='star']").val();
    var categoryId = $("input[name='categoryId']").val();
    var newsDetail = $("textarea[name='newsDetail']").val();

    if (validate() == false) {
      return;
    }

    var raw_data = {
      newsId: newsId,
      newsName: newsName,
      quantity: quantity,
      price: price,
      description: description,
      brand: brand,
      newsImage: newsImage,
      star: star,
      categoryId: categoryId,
      newsDetail: newsDetail,
      deleted: false,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/News/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(raw_data),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // console.log(data);
        // alert(data);
        // debugger;
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        } else {
          alert("Update News Success");
          // Đóng modal sau khi cập nhật thành công
          //     $("#exampleModal").modal("hide");
          //   var modal = new bootstrap.Modal(
          //     document.getElementById("exampleModal")
          //   );
          //   modal.hide();
          fetchNewss(1, 5);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteNews() {
    if ($("input.news-checkbox:checked").length === 0) {
      alert("Please select at least one news to update.");
      return;
    }

    if ($("input.news-checkbox:checked").length > 1) {
      alert("Choose only a news to update.");
      return;
    }

    $(".news-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      newsId = id;
    });

    // debugger;

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/News/delete/" + newsId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete News Success");
        fetchNewss(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function updateTable(data) {
    var tbody = $("tbody");
    tbody.empty();

    data.forEach(function (news, index) {
      var row = `<tr>
                       <th scope="row">
                           <input type="checkbox" class="news-checkbox">
                       </th>
                       <td>${news.newsId}</td>
                       <td>${news.newsName}</td>
                       <td>${news.content}</td>
                       <td><img src="${news.newsImage}" alt="News Image" width="50"></td> 
                       <td>${news.postingDate}</td> 
                       <td>${news.personPostingId}</td>
                   </tr>`;
      tbody.append(row);
    });
  }

  let currentPage = 1;
  const pageSize = 5;

  fetchNews(currentPage, pageSize);

  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchNews(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchNews(currentPage, pageSize);
  });

  // Page number buttons click handlers
  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchNews(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchNews(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchNews(currentPage, pageSize);
  });

  function fetchNews(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/news/page=${pageNumber}&pageSize=${pageSize}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        updateTable(response);
        updatePaginationButtons();
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  // Update pagination button states
  function updatePaginationButtons() {
    // if đang ở trang đầu tiên thì ẩn btn previous
    $(".btn-previous").toggleClass("disabled", currentPage === 1);
    // $(".btn-next").toggleClass("disabled", currentPage === totalPages);

    // Adjust active class for current page button
    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  function moveToTrash() {}
});
