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

  // ===================================> handle button <===========================================
  var status = 1;
  $(".btn-add-staff").click(function () {
    status = 1;
    $("#exampleModalLabel").text("Create Staff");
  });

  $(".btn-update-staff").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-staff").click(function () {
    status = 3;
    deleteVirtualStaff();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addStaff();
    }
    if (status == 2) {
      updateStaff();
    }
  });

  // ===================================> validate staff data <===========================================
  function validateStaffData(
    staffName,
    birthday,
    phoneNumber,
    gender,
    address,
    position
  ) {
    if (!staffName) {
      Swal.fire("Warning!", "Please enter a staff name.", "warning");
      return false;
    }
    if (!birthday) {
      Swal.fire("Warning!", "Please enter a birthday.", "warning");
      return false;
    }
    if (!phoneNumber) {
      Swal.fire("Warning!", "Please enter a phone number.", "warning");
      return false;
    }
    if (!gender || gender === "Gender") {
      Swal.fire("Warning!", "Please select a gender.", "warning");
      return false;
    }
    if (!address) {
      Swal.fire("Warning!", "Please enter an address.", "warning");
      return false;
    }
    if (!position) {
      Swal.fire("Warning!", "Please enter a position.", "warning");
      return false;
    }
    return true;
  }

  // ===================================> add staff <===========================================
  function addStaff() {
    // Retrieve and validate form data
    var staffName = $(".staffname").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();
    var position = $("input[name='position']").val();

    if (
      !validateStaffData(
        staffName,
        birthday,
        phoneNumber,
        gender,
        address,
        position
      )
    ) {
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
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Warning!", data.error, "warning");
        } else {
          Swal.fire("Success!", "Add Staff Success", "success");
          exampleModal.hide();
          fetchStaffs(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===================================> turn on modal to update <===========================================
  function TurnOnModalToUpdate() {
    if ($("input.staff-checkbox:checked").length === 0) {
      Swal.fire(
        "Success!",
        "Please select at least one staff to update.",
        "success"
      );
      return;
    }

    if ($("input.staff-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one staff to update.",
        "warning"
      );
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
        staffFound = data;
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
          // console.log(data.error);
        } else {
          $(".staffname").val(staffFound.staffName);
          let date = new Date(staffFound.birthday);
          let formattedDate = date.toISOString().split("T")[0]; // Chuyển sang yyyy-MM-dd
          $("input[name='date']").val(formattedDate);
          // $("input[name='date']").val(staffFound.birthday);
          $("input[name='phonenumber']").val(staffFound.phoneNumber);
          // $("#formFile")[0].files[0];
          $(".form-select").val(staffFound.gender);
          $("input[name='address']").val(staffFound.address);
          $("input[name='position']").val(staffFound.position);

          exampleModal.show();

          $("#exampleModalLabel").text("Update Staff");
          $(".modal-title").text("Update Staff");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> update staff <================================================
  async function updateStaff() {
    var staffName = $(".staffname").val();
    var birthday = $("input[name='date']").val();
    var phoneNumber = $("input[name='phonenumber']").val();
    var image = $("#formFile")[0].files[0];
    var gender = $(".form-select").val();
    var address = $("input[name='address']").val();
    var position = $("input[name='position']").val();

    if (
      !validateStaffData(
        staffName,
        birthday,
        phoneNumber,
        gender,
        address,
        position
      )
    ) {
      return;
    }

    let imageUser = await uploadImage();

    var raw_data = {
      staffId: staffId,
      staffName: staffName,
      birthday: birthday + "T00:00:00.000Z",
      phoneNumber: phoneNumber,
      image: imageUser,
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", "Update staff failed: " + data.error, "error");
        }
        exampleModal.hide();
        Swal.fire("Success!", "Update staff success.", "success");
        fetchStaffs(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // =====================================> delete staff <================================================
  function deleteStaff(staffId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
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
        // debugger;
        if (data.error != null && data.error != "undefined") {
          Swal.fire(
            "Success!",
            "Delete staff failed: " + data.error,
            "success"
          );
        }
        Swal.fire("Success!", "Delete staff success.", "success");
        fetchStaffs(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ======================================> delete virtual staff <===========================================================
  function deleteVirtualStaff() {
    if ($("input.staff-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one staff to delete.",
        "warning"
      );
      return;
    }

    if ($("input.staff-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one staff to update.",
        "warning"
      );
      return;
    }

    var staffName;
    var birthday;
    var phoneNumber;
    var image;
    var gender;
    var address;
    var position;

    $(".staff-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      staffName = row.find("td").eq(1).text();
      birthday = row.find("td").eq(2).text();
      phoneNumber = row.find("td").eq(3).text();
      image = row.find("td").eq(4).text();
      gender = row.find("td").eq(5).text();
      address = row.find("td").eq(6).text();
      position = row.find("td").eq(7).text();

      staffId = id;
      // debugger;
    });

    // Chuyển đổi birthday từ dd/MM/yyyy sang yyyy-MM-dd
    let formattedBirthday = null;
    if (birthday) {
      let parts = birthday.split("/"); // Tách chuỗi
      if (parts.length === 3) {
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1; // Tháng bắt đầu từ 0 trong Date
        let year = parseInt(parts[2], 10);
        let parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate)) {
          // Định dạng yyyy-MM-dd
          formattedBirthday = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
        }
      }
    }

    var raw_data = {
      staffId: staffId,
      staffName: staffName,
      birthday: formattedBirthday,
      phoneNumber: phoneNumber,
      image: image || "",
      gender: gender,
      address: address,
      position: position,
      deleted: true,
    };

    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Staff/update",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(raw_data),
      processData: false,
      contentType: "application/json",
    })
      .done(function (data) {
        if (data.error != null && data.error != "undefined") {
          Swal.fire("Error!", data.error, "error");
        }
        // debugger;
        Swal.fire("Success!", "Delete vritual staff success.", "warning");
        fetchDeletedStaffs(currentPage, pageSize);
        fetchStaffs(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> search staff <=============================================================
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

  // ===================================> search staff <=============================================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchStaff(searchValue, currentPage, pageSize);
    });

  // ===================================> update table <=============================================================
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

  // ====================================> update table deleted <=============================================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (staff, index) {
      var row = `<tr>
                     <td scope="row">${staff.staffId}</td>
                     <td>${staff.staffName}</td>
                     <td>${staff.birthday}</td>
                     <td>${staff.phoneNumber}</td>
                     <td><img src="${staff.image}" alt="Image" width="30" height="30"></td>
                     <td>${staff.gender}</td>
                     <td>${staff.address}</td>
                     <td>${staff.position}</td>
                     <td>
                      <button type="button" class="btn btn-primary btn-restore">Restore</button>
                      <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                     </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> restore staff <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const staff = {
      staffId: currentRow.find("td").eq(0).text(),
      staffName: currentRow.find("td").eq(1).text(),
      birthday: currentRow.find("td").eq(2).text(),
      phoneNumber: currentRow.find("td").eq(3).text(),
      image: currentRow.find("td").eq(4).find("img").attr("src"),
      gender: currentRow.find("td").eq(5).text(),
      address: currentRow.find("td").eq(6).text(),
      position: currentRow.find("td").eq(7).text(),
      deleted: false,
    };

    restoreStaff(staff);
  });

  // ====================================> delete staff <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const staff = {
      staffId: currentRow.find("td").eq(0).text(),
    };

    deleteStaff(staff.staffId);
  });

  // ====================================> restore staff <=============================================================
  function restoreStaff(staff) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/staff/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(staff),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore staff success.", "success");
          trashCanModal.hide();
          fetchStaffs(currentPage, pageSize);
          fetchDeletedStaffs(currentPage, pageSize);
        } else {
          Swal.fire("Error!", "Error updating staff: " + data.error, "error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ====================================> pagination <=============================================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchStaffs(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchStaffs(currentPage, pageSize);
  });

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

  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ===================================> fetch staffs <=============================================================
  function fetchStaffs(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/staff/page=${pageNumber}&pageSize=${pageSize}`;

    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
    });
  }

  // ====================================> fetch deleted staffs <=============================================================
  function fetchDeletedStaffs(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/staff/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    apiCall("GET", url, null, function (response) {
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

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

  // =====================================> upload image <=============================================================
  function uploadImage() {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("formFile").files[0];
      const formData = new FormData();
      formData.append("file", fileInput);

      $.ajax({
        type: "POST",
        url: "http://localhost:4006/api-admin/staff/upload-image",
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

  // ======================================> call function <=============================================================
  fetchDeletedStaffs(currentPage, pageSize);
  fetchStaffs(currentPage, pageSize);
});
