var ads = [{
  brand_name: 'avon',
  brand_logo: 'img/women/brand-title.png',
  brand_video: 'assets/avon-video.mp4',
  brand_info: 'img/women/brand-text.png'
}, {
  brand_name: 'ciucas',
  brand_logo: 'img/men/brand-title.png',
  brand_video: 'assets/ciucas.mp4',
  brand_info: 'img/men/brand-text.png'
}, {
  brand_name: 'hawkers',
  brand_logo: 'img/hawkers/brand-title.png',
  brand_video: 'assets/hawkers.mp4',
  brand_info: 'img/hawkers/brand-text.png'
}, {
  brand_name: 'grant',
  brand_logo: 'img/grant/brand-title.png',
  brand_video: 'assets/readingglasses.mp4',
  brand_info: 'img/grant/brand-text.png'

}];

var scan = true;

/*
Show Ad Method
**************************/

function showMainPanel(panelId) {
  $('#' + panelId).css("display", "block");
}

function hideMainPanel(panelId) {
  $('#' + panelId).css("display", "none");
}

function showAdPanel(panelId) {
  $('#' + panelId).css("visibility", "visible");
}

function hideAdPanel(panelId) {
  $('#' + panelId).css("visibility", "hidden");
}


function playAd(adName) {

  for (var i = 0; i < ads.length; i++) {

    if (ads[i].brand_name == adName) {
      brandLogo = ads[i].brand_logo;
      brandVideo = ads[i].brand_video;
      brandInfo = ads[i].brand_info;
      break;
    }

  }

  showAdPanel("adPanel");
  hideMainPanel("mainPanel");

  $('#brand-video').attr("src", brandVideo);
  $('#brand-logo').attr("src", brandLogo);
  $('#brand-text').attr("src", brandInfo);
  $('#brand-video').css("position", "relative");

  $('#brand-video').get(0).play();

  var vid = $('#brand-video').get(0)
  vid.onended = function() {
    hideAdPanel("adPanel");
    showMainPanel("mainPanel");
    scan = true;
  }

}



// var myJson=JSON.stringify(myFace);
// var getDetails = JSON.parse(myJson);

// var theFace = getDetails[0];
function checkFace(face) {
  //stop face scanner
  scan = false;
  debugger;

  var getGender = face.faceAttributes.gender;
  var getGlasses = face.faceAttributes.glasses;
  selectAd(getGender, getGlasses);
};

// checkFace(theFace);


function selectAd(gender, glasses) {

  if (glasses == 'Sunglasses' || glasses == 'SunGlasses') {
    playAd('hawkers');
  } else if (glasses == 'ReadingGlasses') {
    playAd('grant');
  } else if (gender == 'male') {
    playAd('ciucas');
  } else if (gender == 'female') {
    playAd('avon');
  }

}



/*
 *********************************/
window.onload = function() {
  var video = document.getElementById('video');
  // var brand_video = document.getElementById('brand-video');
  var brand_video = $('#brand-video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var tracker = new tracking.ObjectTracker('face');
  var brandVideoElement = brand_video.get(0);


  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);
  tracking.track('#video', tracker, {
    camera: true
  });

  tracker.on('track', function(event) {
    if (scan == true) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      event.data.forEach(function(rect) {


        var hidden_canvas = document.querySelector('canvas'),
          context = hidden_canvas.getContext('2d');
        var width = video.videoWidth,
          height = video.videoHeight;

        if (width && height) {
          hidden_canvas.width = width;
          hidden_canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
          var image = hidden_canvas.toDataURL('image/png').replace(
            "image/png", "image/octet-stream");
        }


        //face detected - call microsoft for facerecognition
        console.log('process Images');
        processImage(image);



      });
    } //end if scan==true

  });



};


function processImage(_imageReceived) {
  // **********************************************
  // *** Update or verify the following values. ***
  // **********************************************

  // Replace the subscriptionKey string value with your valid subscription key.
  var subscriptionKey = "bd8312a39d6246f0934214c61c231f21";

  // Replace or verify the region.
  //
  // You must use the same region in your REST API call as you used to obtain your subscription keys.
  // For example, if you obtained your subscription keys from the westus region, replace
  // "westcentralus" in the URI below with "westus".
  //
  // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
  // a free trial subscription key, you should not need to change this region.
  var uriBase =
    "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

  // Request parameters.
  var params = {
    "returnFaceId": "true",
    "returnFaceLandmarks": "false",
    "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
  };

  // Display the image.
  // var sourceImageUrl = document.getElementById("inputImage").value;
  //    document.querySelector("#sourceImage").src = sourceImageUrl;

  // Perform the REST API call.
  $.ajax({
    url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",
        subscriptionKey);
    },

    type: "POST",
    processData: false,
    contentType: 'application/octet-stream',
    // Request body.
    //data: '{"url": ' + '"' + sourceImageUrl + '"}',
    data: makeblob(_imageReceived)

  })

  .done(function(data) {
    // Show formatted JSON on webpage.
    // $("#responseTextArea").val(JSON.stringify(data, null, 2));
    //console.log(JSON.stringify(data, null, 2));
    // var theFace=JSON.stringify(data, null, 2);

    //var theFace=JSON.parse(data);
    var theFace = data[0];
    if (theFace != undefined)
      checkFace(theFace);
  })

  .fail(function(jqXHR, textStatus, errorThrown) {
    // Display error message.
    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" +
      jqXHR.status + "): ";
    errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(
        jqXHR.responseText).message) ?
      jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR
        .responseText).error.message;
    alert(errorString);
  });
};


makeblob = function(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], {
      type: contentType
    });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}
