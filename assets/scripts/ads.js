var baseURL = "https://citybitv2.azurewebsites.net/Content/";
displayAds();



function displayAds() {


  if ($.cookie('eventFilter') && $.cookie('eventFilter') != '') {
    $.get(
      "https://citybitv2.azurewebsites.net/api/GetEventByFilter?filter=" + $.cookie(
        'eventFilter'),
      function(data) {
        randomAd = 0;
        $.cookie('eventFilter', '');
        renderAd(data, 0)
      });
  } else {
    $.get("https://citybitv2.azurewebsites.net/api/Events", function(data) {
      randomAd = Math.floor(Math.random() * data.length);
      renderAd(data, randomAd);
    });

  }
}

function renderAd(_data, randomAd) {
  var eventId = _data[randomAd].Id;
  var description = _data[randomAd].Description;
  var title = _data[randomAd].Title;
  var location = _data[randomAd].Location;
  var period = _data[randomAd].Period;
  var type = _data[randomAd].Type;
  var qrCode = baseURL + 'qr/' + _data[randomAd].QrCodeUrl;
  var photo = baseURL + 'img/' + _data[randomAd].PhotoUrl;
  var videoUrl = _data[randomAd].VideoUrl;
  var timer = _data[randomAd].Timer;
  $('#ad-titlu').html(title);
  $('#ad-description').html(description);
  $('#ad-location').html(location);
  $('#ad-period').html(period);
  $('#ad-video').attr("src", videoUrl + "&muted=1");
  $('#ad-image').attr("src", photo);
  $('#ad-qr').attr("src", qrCode);
  $('#ad-button').html(type);
  $('.blurImage').css("background-image", "url(" + photo + ")");

  //update currentEvent
  $.ajax({
    url: "https://citybitv2.azurewebsites.net/api/setCurrentEvent",
    type: "get", //send it through get method
    data: {
      panelId: $.cookie('panelID'),
      eventId: eventId
    },
    success: function(response) {
      //Do Something
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });

  setTimeout(function() {
    window.location.replace("ads.html");
  }, timer);

}
