$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var newsId = "";
  var userIdList = [];

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
    $("#exampleModalLabel").text("Create News");
  });

  $(".btn-update-news").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-news").click(function () {
    status = 3;
    deleteVirtualNews();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addNews();
    }
    if (status == 2) {
      updateNews();
    }
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
      Swal.fire("Warning!", "Please enter a News Name.", "warning");
      return false;
    }

    // Validate Content
    if (!content) {
      Swal.fire("Warning!", "Please enter the content.", "warning");
      return false;
    }

    // Validate News Image
    if (!newsImage) {
      Swal.fire("Warning!", "Please upload a News Image.", "warning");
      return false;
    }

    // Validate Posting Date
    if (!postingDate) {
      Swal.fire("Warning!", "Please select a Posting Date.", "warning");
      return false;
    }

    // Validate Person Posting ID
    if (!personPostingId) {
      Swal.fire("Warning!", "Please enter the Person Posting ID.", "warning");
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
          Swal.fire("Error!", data.error, "error");
          console.log(data.error);
        } else {
          Swal.fire("Success!", "Add News Success", "success");
          fetchNews(currentPage, pageSize);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> turn on modal to update <=========================================================
  function TurnOnModalToUpdate() {
    if ($("input.news-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one news to update.",
        "warning"
      );
      return;
    }

    if ($("input.news-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one news to update.",
        "warning"
      );
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
        newsFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
          console.log(data.error);
        } else {
          $("input[name='newsName']").val(newsFound.newsName);
          $("input[name='quantity']").val(newsFound.quantity);
          $("input[name='price']").val(newsFound.price);
          $("textarea[name='description']").val(newsFound.description);
          $("input[name='brand']").val(newsFound.brand);
          // $("input[name='newsImage']").val(newsFound.newsImage);
          $("input[name='star']").val(newsFound.star);
          $("input[name='categoryId']").val(newsFound.categoryId);
          $("textarea[name='newsDetail']").val(newsFound.newsDetail);

          exampleModal.show();

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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Success!", data.error, "success");
        } else {
          Swal.fire("Success!", "Update News Success.", "success");
          exampleModal.hide();
          fetchNews(currentPage, pageSize);
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =======================================> delete news <===========================================================
  function deleteNews(newsId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
        }
        Swal.fire("Success!", "Delete News Success.", "success");
        fetchNews(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =========================================> delete virtual news <==================================================================
  function deleteVirtualNews() {
    if ($("input.news-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one news to update.",
        "warning"
      );
      return;
    }

    if ($("input.news-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one news to update.",
        "warning"
      );
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
        }
        Swal.fire("Success!", "Delete Virtual News Success", "success");
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
          Swal.fire("Success!", "News has been restored!", "success");
          trashCanModal.hide();
          fetchNews(currentPage, pageSize);
          fetchDeletedNews(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error updating news: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> pagination <===========================================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchNews(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchNews(currentPage, pageSize);
  });

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

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

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
            // Swal.fire(
            //   "Success!",
            //   `File upload at ${data.fullPath}`,
            //   "success"
            // );
            resolve(data.fullPath.toString());
          } else {
            Swal.fire(
              "Error!",
              "File upload failed. Please try again later.",
              "error"
            );
            reject("Upload failed.");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Request failed:", textStatus, errorThrown);
          reject(errorThrown);
        });
    });
  }

  // ==========================================> get user id list <===========================================================
  function getUserIdList() {
    const url = "http://localhost:4006/api-admin/users/get-all";
    apiCall("GET", url, null, function (response) {
      response.forEach((element) => {
        userIdList.push(element.userId);
      });
    });
  }

  // ==========================================> render user id list <===========================================================
  let isListVisible = false;
  function renderUserIdList() {
    const personPostingListDiv = document.getElementById("personPostingList");
    const toggleButton = document.getElementById("btnViewPersonPostingList");

    if (isListVisible) {
      personPostingListDiv.style.display = "none";
      toggleButton.textContent = "View Person Posting Id List";
      isListVisible = false;
    } else {
      personPostingListDiv.innerHTML = "";
      if (userIdList.length === 0) {
        personPostingListDiv.innerHTML = `
          <div class="alert alert-info">No users found. Please fetch the list first.</div>
        `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        userIdList.forEach((userId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `User ID: ${userId}`;
          listGroup.appendChild(listItem);
        });

        personPostingListDiv.appendChild(listGroup);
      }

      personPostingListDiv.style.display = "block";
      toggleButton.textContent = "Hide Person Posting Id List";
      isListVisible = true;
    }
  }

  // ==========================================> button view user id list <===========================================================
  document
    .getElementById("btnViewPersonPostingList")
    .addEventListener("click", renderUserIdList);

  // ==========================================> api call <===========================================================
  function apiCall(method, url, data = null, successCallback) {
    return $.ajax({
      url: url,
      type: method,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (response) {
        if (successCallback) {
          successCallback(response);
        }
      },
      error: function (xhr, status, error) {
        console.error(error);
        Swal.fire("Error", "Error: " + error, "error");
      },
    });
  }

  // ====================================> call function <===========================================================
  getUserIdList();
  fetchNews(currentPage, pageSize);
  fetchDeletedNews(currentPage, pageSize);
});
