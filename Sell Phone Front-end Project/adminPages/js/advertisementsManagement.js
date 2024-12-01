$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var advertisementId = "";

  let currentPage = 1;
  const pageSize = 5;

  const exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );

  var status = 1;
  $(".btn-add-advertisement").click(function () {
    status = 1;
  });

  $(".btn-update-advertisement").click(function () {
    status = 2;
    TurnOnModalToUpdate();
  });

  $(".btn-delete-advertisement").click(function () {
    status = 3;
    deleteAdvertisement();
  });

  $(".btn-handle-func").click(function () {
    if (status == 1) {
      addAdvertisement();
      var modal = new bootstrap.Modal(document.getElementById("exampleModal"));
      modal.hide();
    }
    if (status == 2) {
      updateAdvertisement();
      var modal = new bootstrap.Modal(document.getElementById("exampleModal"));
      modal.hide();
    }
    // if (status == 3) {
    //   deleteAdvertisement();
    // }
  });

  async function addAdvertisement() {
    var advertisementName = $("input[name='advertisementName']").val();
    var advertisementImage = $("input[name='advertisementImage']")[0].files[0];
    var location = $("input[name='location']").val();
    var advertiserId = $("input[name='advertiserId']").val();

    // Basic validation
    if (!advertisementName) {
      alert("Please enter an advertisement name.");
      return;
    }
    if (!advertisementImage) {
      alert("Please select an advertisement image.");
      return;
    }
    if (!location) {
      alert("Please enter a location.");
      return;
    }
    if (!advertiserId) {
      alert("Please enter an advertiser ID.");
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
        // console.log(data);
        //   debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // debugger;
          alert("Add Advertisement Success");
          console.log("Add Advertisement Success");

          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.hide();

          fetchAdvertisements(1, 5);
        }
      })
      .fail(function () {
        // debugger;
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function TurnOnModalToUpdate() {
    if ($("input.advertisement-checkbox:checked").length === 0) {
      alert("Please select at least one advertisement to update.");
      return;
    }

    if ($("input.advertisement-checkbox:checked").length > 1) {
      alert("Choose only a advertisement to update.");
      return;
    }

    $(".advertisement-checkbox:checked").each(function () {
      // Lấy dòng (tr) chứa checkbox này
      let row = $(this).closest("tr");

      // Lấy thông tin từ các cột trong dòng
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
        // console.log(data);
        // alert(data);
        // debugger;
        if (data != null && data.error != null && data.error != "undefined") {
          alert(data.error);
          console.log(data.error);
        } else {
          // alert("Find Advertisement Success");
          // console.log("Find Advertisement Success");
          $("input[name='advertisementName']").val(data.advertisementName);
          // $("input[name='advertisementImage']")[0].files[0];
          $("input[name='location']").val(data.location);
          $("input[name='advertiserId']").val(data.advertiserId);

          // Mở modal sau khi dữ liệu đã được cập nhật
          // $("#exampleModal").modal("show");
          var modal = new bootstrap.Modal(
            document.getElementById("exampleModal")
          );
          modal.show();

          $("#exampleModalLabel").text("Update Advertisement"); // Thay đổi tiêu đề modal
          $(".modal-title").text("Update Advertisement"); // Nếu bạn muốn đặt tiêu đề từ class modal-title
        }
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }
  function updateAdvertisement() {
    // alert("Update Advertisement Success");
    // debugger;

    var advertisementName = $("input[name='advertisementName']").val();
    var advertisementImage = $("input[name='advertisementImage']")[0].files[0];
    var location = $("input[name='location']").val();
    var advertiserId = $("input[name='advertiserId']").val();

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
        alert("Update Advertisement Success");
        fetchAdvertisements(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

  function deleteAdvertisement() {
    if ($("input.advertisement-checkbox:checked").length === 0) {
      alert("Please select at least one advertisement to update.");
      return;
    }

    if ($("input.advertisement-checkbox:checked").length > 1) {
      alert("Choose only a advertisement to update.");
      return;
    }

    $(".advertisement-checkbox:checked").each(function () {
      let row = $(this).closest("tr");

      let id = row.find("td").eq(0).text();

      advertisementId = id;
    });

    // debugger;

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
        // console.log(data);
        // alert(data);
        if (data.error != null && data.error != "undefined") {
          alert(data.error);
        }
        alert("Delete Advertisement Success");
        fetchAdvertisements(1, 5);
      })
      .fail(function () {
        console.log("Request failed: ", textStatus, errorThrown);
      });
  }

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

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const searchValue = document.getElementById("searchInput").value;

      searchAdvertisement(searchValue, currentPage, pageSize);
    });

  function updateTable(data) {
    var tbody = $("tbody");
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

  // Previous button click handler
  $(".btn-previous").on("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchAdvertisements(currentPage, pageSize);
    }
  });

  // Next button click handler
  $(".btn-next").on("click", function (e) {
    e.preventDefault();
    currentPage++;
    fetchAdvertisements(currentPage, pageSize);
  });

  // Page number buttons click handlers
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

  function fetchAdvertisements(pageNumber, pageSize) {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/advertisement/page=${pageNumber}&pageSize=${pageSize}`,
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

  fetchAdvertisements(currentPage, pageSize);

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
