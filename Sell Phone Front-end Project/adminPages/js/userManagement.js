$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var userId = "";

  let currentPage = 1;
  const pageSize = 5;

  // Modal bootstrap
  const exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );

  // Modal bootstrap
  const trashCanModal = new bootstrap.Modal(
    document.getElementById("trashCanModal")
  );

  var status = 1;
  $(".btn-add-user").click(function () {
    status = 1;
  });

  $(".btn-update-user").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-user").click(function () {
    status = 3;
    deleteUser();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addUser();
    }
    if (status == 2) {
      updateUser();
    }
    // if (status == 3) {
    //   deleteUser();
    // }
  });

  async function addUser() {
    //   alert("Add User");
    // Retrieve and validate form data
    var userName = $(".username").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();

    // Basic validation
    if (!userName) {
      alert("Please enter a username.");
      return;
    }
    if (!birthday) {
      alert("Please enter a birthday.");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter a phone number.");
      return;
    }
    if (!image) {
      alert("Please choose an image.");
      return;
    }
    if (!gender || gender === "Gender") {
      alert("Please select a gender.");
      return;
    }
    if (!address) {
      alert("Please enter an address.");
      return;
    }

    let imageUser = await uploadImage();
    // debugger;
    var raw_data = {
      userId: 0,
      userName: userName,
      birthday: birthday + "T00:00:00.000Z",
      phoneNumber: phoneNumber,
      image: imageUser,
      gender: gender,
      address: address,
      ranking: "string",
      deleted: false,
    };
    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Users/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
      data: JSON.stringify(raw_data),
    })
      .done(function (data) {
        // console.log(data);
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          alert("Add User Success");
          console.log("Add User Success");
          fetchUsers(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.user-checkbox:checked").length === 0) {
      alert("Please select at least one user to update.");
      return;
    }

    if ($("input.user-checkbox:checked").length > 1) {
      alert("Choose only a user to update.");
      return;
    }

    $(".user-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      userId = id;
      // debugger;
    });
    // debugger;

    var userFound = {};
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/Users/get-data-by-id/" + userId,
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
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find User Success");
          // console.log("Find User Success");

          $(".username").val(data.userName);
          let date = new Date(data.birthday); // Tạo đối tượng Date từ chuỗi ngày
          let formattedDate = date.toISOString().split("T")[0]; // Chuyển sang yyyy-MM-dd
          $("input[name='date']").val(formattedDate);
          $("input[name='phonenumber']").val(data.phoneNumber);
          // $("#formFile")[0].files[0];
          $(".form-select").val(data.gender);
          $("input[name='address']").val(data.address);
          $("input[name='ranking']").val(data.ranking);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update User"); // Thay đổi tiêu đề modal
          $(".modal-title").text("Update User"); // Nếu bạn muốn đặt tiêu đề từ class modal-title
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }
  function updateUser() {
    // alert("Update User Success");
    // debugger;
    var userName = $(".username").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();
    var raw_data = {
      userId: userId,
      userName: userName,
      birthday: birthday + "T00:00:00.000Z",
      phoneNumber: phoneNumber,
      image: image ? image.name : "",
      gender: gender,
      address: address,
      ranking: "string",
      deleted: false,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Users/update",
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
        // Đóng modal sau khi cập nhật thành công
        // $("#exampleModal").modal("hide");
        var modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );
        modal.hide();
        alert("Update User Success");
        fetchUsers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteUser() {
    if ($("input.user-checkbox:checked").length === 0) {
      alert("Please select at least one user to update.");
      return;
    }

    if ($("input.user-checkbox:checked").length > 1) {
      alert("Choose only a user to update.");
      return;
    }

    $(".user-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      userId = id;
      // debugger;
    });

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Users/delete/" + userId,
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
        alert("Delete User Success");
        fetchUsers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function searchUsers(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/users/search-and-pagination?pageNumber=" +
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

  // Search
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchUsers(searchValue, currentPage, pageSize);
    });

  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();
    data.forEach(function (user, index) {
      var row = `<tr>
                     <th scope="row">
                         <input type="checkbox" class="user-checkbox">
                     </th>
                     <td scope="row">${user.userId}</td>
                     <td>${user.userName}</td>
                     <td>${user.birthday}</td>
                     <td>${user.phoneNumber}</td>
                     <td><img src="${user.image}" alt="Image" width="30" height="30"></td>
                     <td>${user.gender}</td>
                     <td>${user.address}</td>
                     <td>${user.ranking}</td>
                   </tr>`;
      tbody.append(row);
    });
  }

  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (user, index) {
      var row = `<tr>
                     <td scope="row">${user.userId}</td>
                     <td>${user.userName}</td>
                     <td>${user.birthday}</td>
                     <td>${user.phoneNumber}</td>
                     <td><img src="${user.image}" alt="Image" width="30" height="30"></td>
                     <td>${user.gender}</td>
                     <td>${user.address}</td>
                     <td>${user.ranking}</td>
                     <td>
                      <button type="button" class="btn btn-primary">Restore</button>
                      <button type="button" class="btn btn-danger">Delete</button>
                     </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchUsers(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchUsers(currentPage, pageSize);
  });

  // Page number buttons click handlers
  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchUsers(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchUsers(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchUsers(currentPage, pageSize);
  });

  function fetchUsers(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/users/page=${pageNumber}&pageSize=${pageSize}`,
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

  // Fetch initial page
  fetchUsers(currentPage, pageSize);

  function fetchDeletedUsers(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/Users/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

  fetchDeletedUsers(currentPage, pageSize);

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

  function uploadImage() {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("formFile").files[0];
      const formData = new FormData();
      formData.append("file", fileInput);

      $.ajax({
        type: "POST",
        url: "http://localhost:4006/api-admin/users/upload-image",
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
