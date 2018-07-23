var connection = new RTCMultiConnection();

// this line is VERY_important
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

// all below lines are optional; however recommended.

connection.session = {
  audio: true,
  video: true
};

connection.sdpConstraints.mandatory = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true
};

connection.onstream = function(event) {
  // callAlert.send('hello everyone');
  document.getElementById('videos-container').appendChild(
    event.mediaElement);


};

//var predefinedRoomId = prompt('Please enter room-id', '1982');
var qs = (function(a) {
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p = a[i].split('=', 2);
    if (p.length == 1)
      b[p[0]] = "";
    else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
})(window.location.search.substr(1).split('&'));
predefinedRoomId = qs['room'];
connection.openOrJoin(predefinedRoomId);
