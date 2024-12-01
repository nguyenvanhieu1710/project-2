document.addEventListener("DOMContentLoaded", function () {
  var countdownDate = new Date("December 31, 2024 23:59:59").getTime();

  var countdownFunction = setInterval(function () {
    var now = new Date().getTime();

    // Tìm khoảng cách giữa bây giờ và ngày kết thúc
    var distance = countdownDate - now;

    // Tính toán thời gian cho ngày, giờ, phút, và giây
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    // Nếu bộ đếm ngược kết thúc, hiển thị số 0
    if (distance < 0) {
      clearInterval(countdownFunction);
      document.getElementById("days").innerHTML = "0";
      document.getElementById("hours").innerHTML = "0";
      document.getElementById("minutes").innerHTML = "0";
      document.getElementById("seconds").innerHTML = "0";
    }
  }, 1000);
});
