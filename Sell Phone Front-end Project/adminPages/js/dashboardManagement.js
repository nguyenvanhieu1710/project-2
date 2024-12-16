$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var bestSellingProduct = [];
  // ==================================> fetch products <================================================
  function fetchProducts() {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/product/get-all`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        $(".total-quantity-product").text(response.length);
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  // ===================================> fetch order <================================================
  function fetchOrder() {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/Bill/get-all`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        $(".total-quantity-purchase-orders").text(response.length);
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  // ===================================> get best selling product <================================================
  function getBestSellingProduct() {
    $.ajax({
      type: "GET",
      url: `http://localhost:4006/api-admin/product/get-best-selling-product`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // debugger;
        bestSellingProduct = response;
        let productNames = bestSellingProduct.map((item) => item.productName);
        updateChart(productNames);
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  // =========================================> Chart <=======================================================
  // ===================================> update chart top 5 products <================================================
  function updateChart(productNames) {
    const options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#246dec", "#cc3c43", "#367952", "#f5b74f", "#4f35a1"],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          horizontal: false,
          columnWidth: "40%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      xaxis: {
        categories: productNames,
      },
      series: [
        {
          name: "Sales Count",
          data: [10, 8, 6, 4, 2],
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#bar-chart"), options);
    chart.render();
  }

  // Tạo tùy chọn cấu hình cho biểu đồ vùng.
  // AREA CHART
  const areaChartOptions = {
    series: [
      {
        name: "Purchase Orders",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Sales Orders",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#4f35a1", "#246dec"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    markers: {
      size: 0,
    },
    yaxis: [
      {
        title: {
          text: "Purchase Orders",
        },
      },
      {
        opposite: true,
        title: {
          text: "Sales Orders",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  // chèn biểu đồ vào #area-chart
  const areaChart = new ApexCharts(
    document.querySelector("#area-chart"),
    areaChartOptions
  );
  areaChart.render();

  // =======================================> call functions <=========================================================
  fetchProducts();
  fetchOrder();
  getBestSellingProduct();
});
