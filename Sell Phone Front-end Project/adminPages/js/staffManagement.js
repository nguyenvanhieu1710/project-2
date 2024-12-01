$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var staffId = "";
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

  var status = 1;
  $(".btn-add-staff").click(function () {
    status = 1;
  });

  $(".btn-update-staff").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-staff").click(function () {
    status = 3;
    deleteStaff();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addStaff();
    }
    if (status == 2) {
      updateStaff();
    }
    // if (status == 3) {
    //   deleteStaff();
    // }
  });

  function addStaff() {
    //   alert("Add Staff");
    // Retrieve and validate form data
    var staffName = $(".staffname").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();
    var position = $("input[name='position']").val();

    // Basic validation
    if (!staffName) {
      alert("Please enter a staffname.");
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
    if (!gender || gender === "Gender") {
      alert("Please select a gender.");
      return;
    }
    if (!address) {
      alert("Please enter an address.");
      return;
    }
    if (!position) {
      alert("Please enter a position.");
      return;
    }

    var raw_data = {
      staffId: 0,
      staffName: staffName,
      birthday: birthday + "T00:00:00.000Z",
      phoneNumber: phoneNumber,
      image: image ? image.name : "",
      gender: gender,
      address: address,
      position: position,
      deleted: false,
    };
    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Staff/create",
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
          alert("Add Staff Success");
          console.log("Add Staff Success");
          fetchStaffs(1, 5);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.staff-checkbox:checked").length === 0) {
      alert("Please select at least one staff to update.");
      return;
    }

    if ($("input.staff-checkbox:checked").length > 1) {
      alert("Choose only a staff to update.");
      return;
    }

    $(".staff-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      staffId = id;
    });
    // debugger;

    var staffFound = {};
    $.ajax({
      type: "GET",
      url: "http://localhost:4006/api-admin/Staff/get-data-by-id/" + staffId,
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
        staffFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find Staff Success");
          // console.log("Find Staff Success");
          // Cập nhật giá trị các trường trong modal
          $(".staffname").val(staffFound.staffName);
          let date = new Date(staffFound.birthday); // Tạo đối tượng Date từ chuỗi ngày
          let formattedDate = date.toISOString().split("T")[0]; // Chuyển sang yyyy-MM-dd
          $("input[name='date']").val(formattedDate);
          // $("input[name='date']").val(staffFound.birthday);
          $("input[name='phonenumber']").val(staffFound.phoneNumber);
          // $("#formFile")[0].files[0];
          $(".form-select").val(staffFound.gender);
          $("input[name='address']").val(staffFound.address);
          $("input[name='position']").val(staffFound.position);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update Staff"); // Thay đổi tiêu đề modal
          $(".modal-title").text("Update Staff"); // Nếu bạn muốn đặt tiêu đề từ class modal-title
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }
  function updateStaff() {
    // alert("Update Staff Success");
    // debugger;
    var staffName = $(".staffname").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();
    var position = $("input[name='position']").val();

    var raw_data = {
      staffId: staffId,
      staffName: staffName,
      birthday: birthday + "T00:00:00.000Z",
      phoneNumber: phoneNumber,
      image: image ? image.name : "",
      gender: gender,
      address: address,
      position: position,
      deleted: false,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Staff/update",
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
        alert("Update Staff Success");
        fetchStaffs(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteStaff() {
    if ($("input.staff-checkbox:checked").length === 0) {
      alert("Please select at least one staff to update.");
      return;
    }

    if ($("input.staff-checkbox:checked").length > 1) {
      alert("Choose only a staff to update.");
      return;
    }

    $(".staff-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
      let id = row.find("td").eq(0).text(); // Cột ID

      staffId = id;
    });

    // debugger;

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Staff/delete/" + staffId,
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
        alert("Delete Staff Success");
        fetchStaffs(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function searchStaff(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/staff/search-and-pagination?pageNumber=" +
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

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchStaff(searchValue, currentPage, pageSize);
    });

  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();
    data.forEach(function (staff, index) {
      var date = new Date(staff.birthday);
      var formattedDate = date.toLocaleDateString("vi-VN");
      var row = `<tr>
                     <th scope="row">
                         <input type="checkbox" class="staff-checkbox">
                     </th>
                     <td scope="row">${staff.staffId}</td>
                     <td>${staff.staffName}</td>
                     <td>${formattedDate}</td>
                     <td>${staff.phoneNumber}</td>
                     <td><img src="${staff.image}" alt="Image" width="30" height="30"></td>
                     <td>${staff.gender}</td>
                     <td>${staff.address}</td>
                     <td>${staff.position}</td>
                   </tr>`;
      tbody.append(row);
    });
  }

  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (staff, index) {
      var row = `<tr>
                     <td scope="row">${staff.staffId}</td>
                     <td>${staff.staffName}</td>
                     <td>${staff.phoneNumber}</td>
                     <td><img src="${staff.image}" alt="Image" width="30" height="30"></td>
                     <td>${staff.gender}</td>
                     <td>${staff.address}</td>
                     <td>${staff.position}</td>
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
      fetchStaffs(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchStaffs(currentPage, pageSize);
  });

  // Page number buttons click handlers
  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchStaffs(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchStaffs(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchStaffs(currentPage, pageSize);
  });

  function fetchStaffs(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/staff/page=${pageNumber}&pageSize=${pageSize}`,
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

  fetchStaffs(currentPage, pageSize);

  function fetchDeletedStaffs(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/staff/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        updateTableDeleted(response);
        updatePaginationButtons();
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  fetchDeletedStaffs(currentPage, pageSize);

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
