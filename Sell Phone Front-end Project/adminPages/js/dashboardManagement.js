$(document).ready(function () {
  var token = localStorage.getItem("admin");
  var bestSellingProduct = [];
  // ==================================> fetch products <================================================
  function fetchProducts() {
    const url = `http://localhost:4006/api-admin/product/get-all`;
    apiCall("GET", url, null, function (response) {
      $(".total-quantity-product").text(response.length);
    });
  }

  // ===================================> fetch order <================================================
  function fetchOrder() {
    const url = `http://localhost:4006/api-admin/Bill/get-all`;
    apiCall("GET", url, null, function (response) {
      let purchaseOrders = new Array(12).fill(0);
      let salesOrders = new Array(12).fill(0);

      response.forEach((order) => {
        const month = new Date(order.dayBuy).getMonth();

        if (
          order.orderStatus === "Pending Confirmation" ||
          order.orderStatus === "Shipping"
        ) {
          purchaseOrders[month]++;
        } else if (order.orderStatus === "Delivered") {
          salesOrders[month]++;
        }
      });

      areaChart.updateSeries([
        { name: "Purchase Orders", data: purchaseOrders },
        { name: "Sales Orders", data: salesOrders },
      ]);

      $(".total-quantity-purchase-orders").text(
        purchaseOrders.reduce((a, b) => a + b, 0)
      );
      $(".total-quantity-sales-orders").text(
        salesOrders.reduce((a, b) => a + b, 0)
      );
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
        let quantity = bestSellingProduct.map((item) => item.quantity);
        updateChart(productNames, quantity);
        // debugger;
      },
      error: function (error) {
        console.error("Request failed: ", error);
      },
    });
  }

  function getUser() {
    const url = "http://localhost:4006/api-admin/Users/get-all";
    apiCall("GET", url, null, function (response) {
      $(".total-customers").text(response.length);
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

  // =========================================> Chart <=======================================================
  // ===================================> update chart top 5 products <================================================
  function updateChart(productNames, quantity) {
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
          data: quantity,
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#bar-chart"), options);
    chart.render();
  }

  // ==========================================> area chart <=========================================================
  const areaChartOptions = {
    series: [
      {
        name: "Purchase Orders",
        data: [],
      },
      {
        name: "Sales Orders",
        data: [],
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
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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

  const areaChart = new ApexCharts(
    document.querySelector("#area-chart"),
    areaChartOptions
  );
  areaChart.render();

  // =======================================> call functions <=========================================================
  fetchProducts();
  fetchOrder();
  getBestSellingProduct();
  getUser();
});
