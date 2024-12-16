$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var advertisementId = "";
  var staffIdList = [];

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
  $(".btn-add-advertisement").click(function () {
    status = 1;
    $("#exampleModalLabel").text("Add Advertisement");
  });

  $(".btn-update-advertisement").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-advertisement").click(function () {
    status = 3;
    deleteVirtualAdvertisement();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addAdvertisement();
    }
    if (status == 2) {
      updateAdvertisement();
    }
  });

  // ================================> validate data <======================================================
  function validateAdvertisement() {
    var advertisementName = $("input[name='advertisementName']").val();
    var advertisementImage = $("input[name='advertisementImage']")[0].files[0];
    var location = $("input[name='location']").val();
    var advertiserId = $("input[name='advertiserId']").val();

    if (!advertisementName || advertisementName.trim() === "") {
      Swal.fire("Warning!", "Please enter an advertisement name.", "warning");
      return false;
    }

    if (advertisementImage === undefined && !advertisementId) {
      Swal.fire("Warning!", "Please select an advertisement image.", "warning");
      return false;
    }

    if (!location || location.trim() === "") {
      Swal.fire("Warning!", "Please enter a location.", "warning");
      return false;
    }

    if (!advertiserId || advertiserId.trim() === "") {
      Swal.fire("Warning!", "Please enter an advertiser ID.", "warning");
      return false;
    }

    return true;
  }

  // ===============================> add advertisement <===================================
  async function addAdvertisement() {
    var advertisementName = $("input[name='advertisementName']").val();
    var advertisementImage = $("input[name='advertisementImage']")[0].files[0];
    var location = $("input[name='location']").val();
    var advertiserId = $("input[name='advertiserId']").val();

    if (!validateAdvertisement()) {
      return;
    }

    let advertisementImg = await uploadImage();

    // debugger;
    var raw_data = {
      advertisementId: 0,
      advertisementName: advertisementName,
      advertisementImage: advertisementImg,
      location: location,
      advertiserId: advertiserId,
      deleted: false,
    };
    // debugger;
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Advertisement/create",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
      data: JSON.stringify(raw_data),
    })
      .done(function (data) {
        //   debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire(
            "Error!",
            "Add Advertisement Failed: " + data.error,
            "error"
          );
          // console.log(data.error);
        } else {
          // debugger;
          Swal.fire("Success!", "Add Advertisement Success", "success");
          exampleModal.hide();
          fetchAdvertisements(currentPage, pageSize);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> tourn on modal to update <===================================
  function TurnOnModalToUpdate() {
    if ($("input.advertisement-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one advertisement to update.",
        "warning"
      );
      return;
    }

    if ($("input.advertisement-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one advertisement to update.",
        "warning"
      );
      return;
    }

    $(".advertisement-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      advertisementId = id;
    });
    //   debugger;

    var advertisementFound = {};
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/Advertisement/get-data-by-id/" +
        advertisementId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          Swal.fire(
            "Error!",
            "Find Advertisement Failed: " + data.error,
            "error"
          );
          // console.log(data.error);
        } else {
          $("input[name='advertisementName']").val(data.advertisementName);
          // $("input[name='advertisementImage']")[0].files[0];
          $("input[name='location']").val(data.location);
          $("input[name='advertiserId']").val(data.advertiserId);

          exampleModal.show();

          $("#exampleModalLabel").text("Update Advertisement");
          $(".modal-title").text("Update Advertisement");
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> update advertisement <===================================
  function updateAdvertisement() {
    var advertisementName = $("input[name='advertisementName']").val();
    var advertisementImage = $("input[name='advertisementImage']")[0].files[0];
    var location = $("input[name='location']").val();
    var advertiserId = $("input[name='advertiserId']").val();

    if (!validateAdvertisement()) {
      return;
    }

    var raw_data = {
      advertisementId: advertisementId,
      advertisementName: advertisementName,
      advertisementImage: advertisementImage,
      location: location,
      advertiserId: advertiserId,
      deleted: false,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Advertisement/update",
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
          Swal.fire(
            "Error!",
            "Error updating advertisement: " + data.error,
            "error"
          );
        }

        exampleModal.hide();
        Swal.fire("Success!", "Update Advertisement Success", "success");
        fetchAdvertisements(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> delete advertisement <===================================
  function deleteAdvertisement(advertisementId) {
    Swal.fire("Warning!", "Deletion is not allowed", "warning");
    return;
    $.ajax({
      type: "POST",
      url:
        "http://localhost:4006/api-admin/Advertisement/delete/" +
        advertisementId,
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
        Swal.fire("Success!", "Delete Advertisement Success", "success");
        fetchAdvertisements(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ===============================> delete virtual advertisement <===================================
  function deleteVirtualAdvertisement() {
    if ($("input.advertisement-checkbox:checked").length === 0) {
      Swal.fire(
        "Warning!",
        "Please select at least one advertisement to delete.",
        "warning"
      );
      return;
    }

    if ($("input.advertisement-checkbox:checked").length > 1) {
      Swal.fire(
        "Warning!",
        "Please select only one advertisement to delete.",
        "warning"
      );
      return;
    }

    var advertisementName;
    var advertisementImage;
    var location;
    var advertiserId;

    $(".advertisement-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();
      advertisementName = row.find("td").eq(1).text();
      advertisementImage = row.find("td").eq(2).text();
      location = row.find("td").eq(3).text();
      advertiserId = row.find("td").eq(4).text();

      advertisementId = id;
    });

    var raw_data = {
      advertisementId: advertisementId,
      advertisementName: advertisementName,
      advertisementImage: advertisementImage,
      location: location,
      advertiserId: advertiserId,
      deleted: true,
    };
    // debugger;

    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/Advertisement/update",
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
        Swal.fire(
          "Success!",
          "Delete Virtual Advertisement Success",
          "success"
        );
        fetchDeletedAdvertisements(currentPage, pageSize);
        fetchAdvertisements(currentPage, pageSize);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> search advertisement <===================================
  function searchAdvertisement(name, currentPage, pageSize) {
    $.ajax({
      type: "GET",
      url:
        "http://localhost:4006/api-admin/advertisement/search-and-pagination?pageNumber=" +
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

  // ==============================> search advertisement <===================================
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchAdvertisement(searchValue, currentPage, pageSize);
    });

  // =============================> update table <===================================
  function updateTable(data) {
    var tbody = $("#activeTable tbody");
    tbody.empty();
    data.forEach(function (advertisement, index) {
      var row = `<tr>
                     <th scope="row">
                         <input type="checkbox" class="advertisement-checkbox">
                     </th>
                     <td scope="row">${advertisement.advertisementId}</td>
                     <td scope="row">${advertisement.advertisementName}</td>
                     <td><img src="${advertisement.advertisementImage}" alt="Advertisement Image" width="30" height="30"></td>
                     <td>${advertisement.location}</td>
                      <td>${advertisement.advertiserId}</td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ==============================> update table deleted <===================================
  function updateTableDeleted(data) {
    var tbody = $("#deletedTable tbody");
    tbody.empty();
    data.forEach(function (advertisement, index) {
      var row = `<tr>
                     <td scope="row">${advertisement.advertisementId}</td>
                     <td scope="row">${advertisement.advertisementName}</td>
                     <td><img src="${advertisement.advertisementImage}" alt="Advertisement Image" width="30" height="30"></td>
                     <td>${advertisement.location}</td>
                      <td>${advertisement.advertiserId}</td>
                      <td>
                       <button type="button" class="btn btn-primary btn-restore">Restore</button>
                       <button type="button" class="btn btn-danger btn-deleteActual">Delete</button>
                      </td>
                   </tr>`;
      tbody.append(row);
    });
  }

  // ====================================> restore advertisement <=============================================================
  $("#deletedTable tbody").on("click", ".btn-restore", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const advertisement = {
      advertisementId: currentRow.find("td").eq(0).text(),
      advertisementName: currentRow.find("td").eq(1).text(),
      advertisementImage: currentRow.find("td").eq(2).text(),
      location: currentRow.find("td").eq(3).text(),
      advertiserId: currentRow.find("td").eq(4).text(),
      deleted: false,
    };

    restoreAdvertisement(advertisement);
  });

  // ====================================> delete advertisement <=============================================================
  $("#deletedTable tbody").on("click", ".btn-deleteActual", function () {
    const currentRow = $(this).closest("tr");
    // debugger;

    const advertisement = {
      advertisementId: currentRow.find("td").eq(0).text(),
    };

    deleteAdvertisement(advertisement.advertisementId);
  });

  // ====================================> restore advertisement <=============================================================
  function restoreAdvertisement(advertisement) {
    $.ajax({
      type: "POST",
      url: "http://localhost:4006/api-admin/advertisement/update",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(advertisement),
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        if (data && !data.error) {
          // debugger;
          Swal.fire("Success!", "Restore advertisement success!", "success");
          trashCanModal.hide();
          fetchAdvertisements(currentPage, pageSize);
          fetchDeletedAdvertisements(currentPage, pageSize);
        } else {
          Swal.fire(
            "Error!",
            "Error updating advertisement: " + data.error,
            "error"
          );
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  // ==============================> pagination <===================================
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchAdvertisements(currentPage, pageSize);
    }
  });

  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchAdvertisements(currentPage, pageSize);
  });

  $(".btn-onePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchAdvertisements(currentPage, pageSize);
  });

  $(".btn-twoPage").on("click", function (e) {
    e.preventDefault();
    currentPage = 2;
    fetchAdvertisements(currentPage, pageSize);
  });

  $(".btn-ThreePage").on("click", function (e) {
    e.preventDefault();
    currentPage = 3;
    fetchAdvertisements(currentPage, pageSize);
  });

  // ==============================> update pagination button <===================================
  function updatePaginationButtons() {
    $(".btn-previous").toggleClass("disabled", currentPage === 1);

    $(".pagination .page-item").removeClass("active");
    if (currentPage === 1) $(".btn-onePage").addClass("active");
    if (currentPage === 2) $(".btn-twoPage").addClass("active");
    if (currentPage === 3) $(".btn-ThreePage").addClass("active");
  }

  // ==============================> fetch data <===================================
  function fetchAdvertisements(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/advertisement/page=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      updateTable(response);
      updatePaginationButtons();
      // debugger;
    });
  }

  // =============================> fetch data deleted <===================================
  function fetchDeletedAdvertisements(pageNumber, pageSize) {
    const url = `http://localhost:4006/api-admin/advertisement/get-data-deleted-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    apiCall("GET", url, null, function (response) {
      $(".badge").text(response.length || 0);
      updateTableDeleted(response);
      updatePaginationButtons();
    });
  }

  // ==============================> upload image <===================================
  function uploadImage() {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("advertisementImage").files[0];
      const formData = new FormData();
      formData.append("file", fileInput);

      $.ajax({
        type: "POST",
        url: "http://localhost:4006/api-admin/advertisement/upload-image",
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
            Swal.fire("Error!", "Upload image failed!", "error");
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

  // ==========================================> get staff id list <===========================================================
  function getStaffIdList() {
    const url = "http://localhost:4006/api-admin/staff/get-all";
    apiCall("GET", url, null, function (response) {
      response.forEach((element) => {
        staffIdList.push(element.staffId);
      });
    });
  }

  // ==========================================> render staff id list <===========================================================
  let isListVisible = false;
  function renderStaffIdList() {
    const advertiserIdListDiv = document.getElementById("advertiserIdList");
    const toggleButton = document.getElementById("btnViewAdvertiserIdList");

    if (isListVisible) {
      advertiserIdListDiv.style.display = "none";
      toggleButton.textContent = "View Advertiser Id List";
      isListVisible = false;
    } else {
      advertiserIdListDiv.innerHTML = "";
      if (staffIdList.length === 0) {
        advertiserIdListDiv.innerHTML = `
          <div class="alert alert-info">No staff found. Please fetch the list first.</div>
        `;
      } else {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        staffIdList.forEach((staffId) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = `Staff ID: ${staffId}`;
          listGroup.appendChild(listItem);
        });

        advertiserIdListDiv.appendChild(listGroup);
      }

      advertiserIdListDiv.style.display = "block";
      toggleButton.textContent = "Hide Advertiser Id List";
      isListVisible = true;
    }
  }

  // ==========================================> button view staff id list <===========================================================
  document
    .getElementById("btnViewAdvertiserIdList")
    .addEventListener("click", renderStaffIdList);

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
  getStaffIdList();
  fetchAdvertisements(currentPage, pageSize);
  fetchDeletedAdvertisements(currentPage, pageSize);
});
