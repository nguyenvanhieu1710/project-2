(function ($) {
  "use strict";

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  // Click on a button to collapse the sidebar
  // tắt navigate khi click vào button collapse
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
  });
})(jQuery);

$(document).ready(function () {
  // mặc định là trang user management
  var defaultPage = $("a[data-page]").first().data("page");

  if (defaultPage) {
    $.ajax({
      url: defaultPage,
      success: function (result) {
        $("#content").html(result);
      },
      error: function (xhr, status, error) {
        console.error("Error loading default page:", error);
      },
    });
  }
  // handle click change page
  $("a[data-page]").on("click", function (e) {
    e.preventDefault();
    var page = $(this).data("page");

    $.ajax({
      url: page,
      success: function (result) {
        $("#content").html(result);
      },
      error: function (xhr, status, error) {
        console.error("Error loading page:", error);
      },
    });
  });

  // handle click nav change active
  $("ul.list-item li").on("click", function () {
    $("ul.list-item li").removeClass("active");

    $(this).addClass("active");
  });
});
