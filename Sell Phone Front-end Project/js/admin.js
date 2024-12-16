// ==================================> Jquery <===============================
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

// ===================================> Jquery <===============================
$(document).ready(function () {
  // ===============================> Default page <========================================
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

  // ==============================> Handle click change page <========================================
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

  // ===============================> Handle click nav <========================================
  // handle click nav change active
  $("ul.list-item li").on("click", function () {
    $("ul.list-item li").removeClass("active");

    $(this).addClass("active");
  });
});

// ===============================> Dropdown menu <========================================
let hideTimeout;

document.querySelector(".dropdown").addEventListener("mouseover", function () {
  const dropdownMenu = this.querySelector(".dropdown-menu");

  clearTimeout(hideTimeout);

  dropdownMenu.style.display = "block";
});

document.querySelector(".dropdown").addEventListener("mouseout", function () {
  const dropdownMenu = this.querySelector(".dropdown-menu");

  hideTimeout = setTimeout(() => {
    dropdownMenu.style.display = "none";
  }, 3000);
});

// ===============================> Change theme <========================================
const bodyElement = document.body;
const themeToggle = document.getElementById("toggleTheme");

themeToggle.addEventListener("click", function () {
  const contentElement = document.getElementById("content");

  if (bodyElement.classList.contains("light-theme")) {
    bodyElement.classList.replace("light-theme", "dark-theme");
    // Swal.fire("Success", "Theme changed to dark", "success");
  } else {
    bodyElement.classList.replace("dark-theme", "light-theme");
    // Swal.fire("Success", "Theme changed to light", "success");
  }
});

window.onload = function () {
  // bodyElement.classList.add("light-theme");
};

// ===============================> Change language <========================================
const translations = {
  en: {
    users: "Users",
    staff: "Staff",
    supplier: "Supplier",
    news: "News",
    advertisements: "Advertisements",
    products: "Products",
    category: "Category",
    voucher: "Voucher",
    importBill: "Import Bill",
    sellBill: "Sell Bill",
    orders: "Orders",
    dashboard: "Dashboard",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    logout: "Logout",
  },
  vi: {
    users: "Người dùng",
    staff: "Nhân viên",
    supplier: "Nhà cung cấp",
    news: "Tin tức",
    advertisements: "Quảng cáo",
    products: "Sản phẩm",
    category: "Danh mục",
    voucher: "Voucher",
    importBill: "Hóa đơn nhập",
    sellBill: "Hóa đơn bán",
    orders: "Đơn hàng",
    dashboard: "Bảng điều khiển",
    settings: "Cấu hình",
    theme: "Giao diện",
    language: "Ngôn ngữ",
    logout: "Đăng xuất",
  },
};

let currentLanguage = "en";

document.getElementById("languageButton").addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "vi" : "en";
  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.getAttribute("data-translate");
    const icon = el.querySelector("i, span.fa, span.fas, span.fa-solid");
    const textContainer = el.childNodes[el.childNodes.length - 1];

    if (icon && textContainer.nodeType === Node.TEXT_NODE) {
      textContainer.textContent = ` ${translations[currentLanguage][key]}`;
    } else {
      el.textContent = translations[currentLanguage][key];
    }
  });
});
