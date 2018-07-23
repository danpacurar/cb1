var callAlert = new RTCMultiConnection();
var pageToRedirect = "ads.html"
  // this line is VERY_important

callAlert.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

// if you want text chat
callAlert.session = {
  data: true
};

callAlert.join({
  sessionid: callAlert.channel,
  userid: callAlert.channel,
  extra: {},
  session: callAlert.session
});


callAlert.onopen = function(event) {
  // connection.send('hello everyone');

};

callAlert.onmessage = function(event) {

  if (event.data == 'primarul') {
    pageToRedirect = "primarul.html?room=boc"
    $('body').append(
      '<div class="caller"><span class="avatar"></span><span class="text answer">RASPUNDE</span><span class="text inchide">INCHIDE</span><p id="timer" class="timer"></p></div><audio autoplay loop id="callerSound">  <source src="sounds/iphone.mp3" type="audio/mpeg"></audio>'
    );

    //  window.location.replace('primarul.html?room=boc');
  }

  if (event.data == 'france') {
    pageToRedirect = "connect.html?room=france"
    $('body').append(
      '<div class="caller"><span class="avatar france"></span><span class="text answer">RASPUNDE</span><span class="text inchide">INCHIDE</span><p id="timer" class="timer"></p></div><audio autoplay loop id="callerSound">  <source src="sounds/iphone.mp3" type="audio/mpeg"></audio>'
    );

    //  window.location.replace('primarul.html?room=boc');
  }


  if (event.data == 'trainer') {
    pageToRedirect = "trainer.html?room=rares"
    $('body').append(
      '<div class="caller"><span class="avatar trainer"></span><span class="text answer">RASPUNDE</span><span class="text inchide">INCHIDE</span><p id="timer" class="timer"></p></div><audio autoplay loop id="callerSound">  <source src="sounds/iphone.mp3" type="audio/mpeg"></audio>'
    );

    //  window.location.replace('primarul.html?room=boc');
  }


  startTimer();

  //console.log(event.data);

};

callAlert.openOrJoin('callalert');


//help functions

var time = 30;

function startTimer() {
  setTimeout(function() {
    if (time >= 0) {
      $('#timer').html(time--)
      startTimer();
    } else {
      time = 30;
      removeCaller();
    }
  }, 1000);
}

function answerCaller() {
  window.location.replace(pageToRedirect);
}


function removeCaller() {



  document.getElementById('callerSound').pause()
  document.getElementById('callerSound').currentTime = 0
  $('.caller').remove();
  $('audio').remove();

};
