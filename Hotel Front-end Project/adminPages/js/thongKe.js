// ---------- CHARTS ----------

// BAR CHART (Top 5 Phòng/Loại phòng)
const barChartOptions = {
  series: [
    {
      data: [50, 40, 35, 60, 45], // Dữ liệu số lượng phòng của các loại phòng
    },
  ],
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
  xaxis: {
    categories: [
      "Phòng Đơn",
      "Phòng Đôi",
      "Phòng Gia Đình",
      "Phòng VIP",
      "Phòng Suite",
    ], // Các loại phòng
  },
  yaxis: {
    title: {
      text: "Số Lượng Phòng",
    },
  },
};

const barChart = new ApexCharts(
  document.querySelector("#bar-chart"),
  barChartOptions
);
barChart.render();

// AREA CHART (Đặt phòng và Check-out hàng tháng)
const areaChartOptions = {
  series: [
    {
      name: "Đặt Phòng",
      data: [120, 135, 140, 150, 160, 180, 200], // Số lượng đặt phòng trong các tháng
    },
    {
      name: "Check-out",
      data: [110, 120, 125, 130, 140, 150, 160], // Số lượng khách check-out trong các tháng
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
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
  ], // Các tháng trong năm
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: "Số Lượng Đặt Phòng",
      },
    },
    {
      opposite: true,
      title: {
        text: "Số Lượng Check-out",
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
