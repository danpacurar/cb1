function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//var panelID = makeid();
var panelID = 12345;
var expDate = new Date();

if ($.cookie('panelID') == 'undefined' || $.cookie('panelID') == null)
  $.cookie('panelID', panelID, {
    expires: 15 / 1440
  });
