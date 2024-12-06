$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var newsId = "";

  let currentPage = 1;
  const pageSize = 5;

  // Modal create bootstrap
  const exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );

  // Modal trash can bootstrap
  const trashCanModal = new bootstrap.Modal(
    document.getElementById("trashCanModal")
  );

  // ================================> handle button <===================================
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
    deleteVirtualNews();
    // deleteNews();
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

  // ===============================> validate <===================================
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

  // ==================================> add news <===============================================================
  async function addNews() {
    var newsName = $("input[name='newsName']").val();
    var content = $("textarea[name='content']").val();
    var newsImage = $("input[name='newsImage']").val();
    var postingDate = $("input[name='postingDate']").val();
    var personPostingId = $("input[name='personPostingId']").val();

    if (validate() == false) {
      return;
    }

    let newsImg = await uploadImage();

    var raw_data = {
      newsId: 0,
      newsName: newsName,
      content: content,
      newsImage: newsImg,
      postingDate: postingDate,
      personPostingId: personPostingId,
      deleted: false,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/News/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
      data: JSON.stringify(raw_data),
    })
      .done(function (data) {
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Add News Success");
          console.log("Add News Success");
          fetchNews(1, 5);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> turn on modal to update <=========================================================
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
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

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

  // ======================================> update news <===========================================================
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
          exampleModal.hide();
          fetchNews(1, 5);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =======================================> delete news <===========================================================
  function deleteNews(newsId) {
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
        fetchNews(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =========================================> delete virtual news <==================================================================
  function deleteVirtualNews() {
    if ($("input.news-checkbox:checked").length === 0) {
      alert("Please select at least one news to update.");
      return;
    }

    if ($("input.news-checkbox:checked").length > 1) {
      alert("Choose only a news to update.");
      return;
    }

    var newsName;
    var content;
    var newsImage;
    var postingDate;
    var personPostingId;

    $(".news-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      newsName = row.find("td").eq(1).text();
      content = row.find("td").eq(2).text();
      newsImage = row.find("td").eq(3).text();
      postingDate = row.find("td").eq(4).text();
      personPostingId = row.find("td").eq(5).text();

      newsId = id;
    });

    var raw_data = {
      newsId: newsId,
      newsName: newsName,
      content: content,
      newsImage: newsImage,
      postingDate: postingDate,
      personPostingId: personPostingId,
      deleted: true,
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
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete Virtual News Success");
        fetchDeletedNews(currentPage, pageSize);
        fetchNews(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> search news <===========================================================
  function searchNews(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/news/search-and-pagination?pageNumber=" +
        currentPage +
        "&pageSize=" +
        pageSize +
        "&name=" +
        name,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        updateTable(data);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> search news <===========================================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchNews(searchValue, currentPage, pageSize);
    });

  // =====================================> update table <===========================================================
  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();

    data.forEach(function (news, index) {
      var row = `<tr>
                       <th scope="row">
                           <input type="checkbox" class="news-checkbox">
                       </th>
                       <td>${news.newsId}</td>
                       <td>${news.newsName}</td>
                       <td>${news.content}</td>
                       <td><img src="${news.newsImage}" alt="News Image" width="30" height="30"></td> 
                       <td>${news.postingDate}</td> 
                       <td>${news.personPostingId}</td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> update table deleted <===========================================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();

    data.forEach(function (news, index) {
      var row = `<tr>
                       <td>${news.newsId}</td>
                       <td>${news.newsName}</td>
                       <td>${news.content}</td>
                       <td><img src="${news.newsImage}" alt="News Image" width="30" height="30"></td> 
                       <td>${news.postingDate}</td> 
                       <td>${news.personPostingId}</td>
                       <td>
                           <button type="button" class="btn btn-primary btn-restore">Restore</button>
                           <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                       </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> restore news <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const news = {
      newsId: currentRow.find("td").eq(0).text(),
      newsName: currentRow.find("td").eq(1).text(),
      content: currentRow.find("td").eq(2).text(),
      newsImage: currentRow.find("td").eq(3).text(),
      postingDate: currentRow.find("td").eq(4).text(),
      personPostingId: currentRow.find("td").eq(5).text(),
      deleted: false,
    };

    restoreNews(news);
  });

  // ====================================> delete news <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const news = {
      newsId: currentRow.find("td").eq(0).text(),
    };

    deleteNews(news.newsId);
  });

  // ====================================> restore news <=============================================================
  function restoreNews(news) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/news/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(news),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          // success
          alert("Restore news success!");
          trashCanModal.hide();
          fetchNews(currentPage, pageSize);
          fetchDeletedNews(currentPage, pageSize);
        } else {
          alert("Error updating news: " + data.error);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> pagination <===========================================================
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

  // ====================================> fetch news <===========================================================
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

  fetchNews(currentPage, pageSize);

  // ===================================> fetch deleted news <===========================================================
  function fetchDeletedNews(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/news/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        $(".badge").text(response.length || 0);
        updateTableDeleted(response);
        updatePaginationButtons();
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  fetchDeletedNews(currentPage, pageSize);

  // ===================================> upload image <===========================================================
  function uploadImage() {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("newsImage").files[0];
      const formData = new FormData();
      formData.append("file", fileInput);

      $.ajax({
        type: "POST",
        url: "http://localhost:4006/api-admin/news/upload-image",
        data: formData,
        headers: { Authorization: "Bearer " + token },
        processData: false,
        contentType: false,
      })
        .done(function (data) {
          if (data && data.fullPath) {
            // alert(`File đã upload tại đường dẫn: ${data.fullPath}`);
            resolve(data.fullPath.toString());
          } else {
            alert("Upload thất bại.");
            reject("Upload failed.");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Request failed:", textStatus, errorThrown);
          alert("Đã có lỗi xảy ra khi tải lên.");
          reject(errorThrown);
        });
    });
  }
});
