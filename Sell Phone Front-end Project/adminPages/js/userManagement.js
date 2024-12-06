$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var userId = "";

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

  // ===================================> handle button <===========================================
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
    deleteVirtualUser();
    // deleteUser();
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

  // ====================================> add user <===========================================
  async function addUser() {
    // Retrieve and validate form data
    var userName = $(".username").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();

    // Basic validation
    if (!userName) {
      Swal.fire("Warning!", "Please enter a username!", "warning");
      return;
    }
    if (!birthday) {
      Swal.fire("Warning!", "Please enter a birthday!", "warning");
      return;
    }
    if (!phoneNumber) {
      Swal.fire("Warning!", "Please enter a phone number!", "warning");
      return;
    }
    if (!image) {
      Swal.fire("Warning!", "Please select an image!", "warning");
      return;
    }
    if (!gender || gender === "Gender") {
      Swal.fire("Warning!", "Please select a gender!", "warning");
      return;
    }
    if (!address) {
      Swal.fire("Warning!", "Please enter an address!", "warning");
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
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error adding user: " + data.error, "error");
          // console.log(data.error);
        } else {
          Swal.fire("Success!", "Add user success!", "success");
          // console.log("Add User Success");
          fetchUsers(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> turn on modal to update <===========================================
  function TurnOnModalToUpdate() {
    if ($("input.user-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one user to update.",
        "warning"
      );
      return;
    }

    if ($("input.user-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only one user to update.", "warning");
      return;
    }

    $(".user-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      let username = row.find("td").eq(1).text();
      let birthday = row.find("td").eq(2).text();
      let phonenumber = row.find("td").eq(3).text();
      // let imageSrc = row.find("td").eq(4).find("img").attr("src");
      let gender = row.find("td").eq(5).text();
      let address = row.find("td").eq(6).text();
      let ranking = row.find("td").eq(7).text();

      $(".username").val(username);

      // Chuyển đổi ngày tháng về định dạng yyyy-MM-dd
      if (birthday) {
        let formattedDate = new Date(birthday).toISOString().split("T")[0];
        $("input[name='date']").val(formattedDate);
      } else {
        $("input[name='date']").val("");
      }

      $("input[name='phonenumber']").val(phonenumber);
      $(".form-select").val(gender);
      $("input[name='address']").val(address);
      $("input[name='ranking']").val(ranking);

      // if (imageSrc) {
      //   $("#formFile").next().attr("src", imageSrc);
      // } else {
      //   $("#formFile").next().attr("src", "images/anh-trang.png");
      // }

      userId = id;
      // debugger;
    });
    // debugger;

    exampleModal.show();

    // Cập nhật tiêu đề modal
    $("#exampleModalLabel").text("Update User");
    $(".modal-title").text("Update User");
  }

  // =====================================> update user <==========================================================
  async function updateUser() {
    // debugger;
    var userName = $(".username").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();
    var ranking = $("input[name='ranking']").val();

    let imageUser = await uploadImage();

    var raw_data = {
      userId: userId,
      userName: userName,
      birthday: birthday + "T00:00:00.000Z",
      phoneNumber: phoneNumber,
      image: imageUser,
      gender: gender,
      address: address,
      ranking: ranking,
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
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error: " + data.error, "success");
        }
        exampleModal.hide();
        Swal.fire("Success!", "Update User Success!", "success");
        fetchUsers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> delete user <==========================================================
  function deleteUser(userId) {
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
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error updating user: " + data.error, "error");
        }
        Swal.fire("Success!", "Delete Actual User Success!", "success");
        fetchUsers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> delete virtual user <==========================================================
  function deleteVirtualUser() {
    if ($("input.user-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one user to update.",
        "warning"
      );
      return;
    }

    if ($("input.user-checkbox:checked").length > 1) {
      Swal.fire("Warning!", "Choose only one user to update.", "warning");
      return;
    }

    var userName;
    var birthday;
    var phoneNumber;
    var image;
    var gender;
    var address;
    var ranking;

    $(".user-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      userName = row.find("td").eq(1).text();
      birthday = row.find("td").eq(2).text();
      phoneNumber = row.find("td").eq(3).text();
      image = row.find("td").eq(4).text();
      gender = row.find("td").eq(5).text();
      address = row.find("td").eq(6).text();
      ranking = row.find("td").eq(7).text();

      userId = id;
      // debugger;
    });

    var raw_data = {
      userId: userId,
      userName: userName,
      birthday: birthday,
      phoneNumber: phoneNumber,
      image: image,
      gender: gender,
      address: address,
      ranking: ranking,
      deleted: true,
    };

    // debugger;
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
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Error updating user: " + data.error, "error");
        }
        Swal.fire("Success!", "Delete Virtual User Success!", "success");
        fetchDeletedUsers(currentPage, pageSize);
        fetchUsers(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =====================================> search user <=============================================================
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

  // =======================================> search user <========================================================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchUsers(searchValue, currentPage, pageSize);
    });

  // ======================================> update table <========================================================================
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

  // ======================================> update table deleted <=============================================================
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
                      <button type="button" class="btn btn-primary btn-restore">Restore</button>
                      <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                     </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ======================================> restore user <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const user = {
      userId: currentRow.find("td").eq(0).text(),
      userName: currentRow.find("td").eq(1).text(),
      birthday: currentRow.find("td").eq(2).text(),
      phoneNumber: currentRow.find("td").eq(3).text(),
      image: currentRow.find("td").eq(4).find("img").attr("src"),
      gender: currentRow.find("td").eq(5).text(),
      address: currentRow.find("td").eq(6).text(),
      ranking: currentRow.find("td").eq(7).text(),
      deleted: false,
    };

    restoreUser(user);
  });

  // ======================================> delete user <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const user = {
      userId: currentRow.find("td").eq(0).text(),
    };

    deleteUser(user.userId);
  });

  // ======================================> restore user <=============================================================
  function restoreUser(user) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/users/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(user),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore user success!", "success");
          trashCanModal.hide();
          fetchUsers(currentPage, pageSize);
          fetchDeletedUsers(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error updating user: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> pagination <========================================================================
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

  // ========================================> fetch users <=======================================================
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

  fetchUsers(currentPage, pageSize);

  // =======================================> fetch deleted users <================================================
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

  // =======================================> upload image <=============================================================
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
            // Swal.fire(
            //   "Success!",
            //   `File đã upload tại đường dẫn: ${data.fullPath}`,
            //   "success"
            // );
            resolve(data.fullPath.toString());
          } else {
            Swal.fire("Error!", "Upload thất bại!", "error");
            reject("Upload failed.");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Request failed:", textStatus, errorThrown);
          Swal.fire("Error!", "Đã có lỗi xảy ra khi tải lên.", "error");
          reject(errorThrown);
        });
    });
  }
});
