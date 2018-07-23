var accessToken = "7f109c1f355c4e62815409938d71594f",
	subscriptionKey = "ec7424ff360f4084878df87d7f81b73a",
	baseUrl = "https://api.api.ai/v1/",
	$speechInput, // The input element, the speech box
	$recBtn, // Toggled recording button value
	recognition, // Used for accessing the HTML5 Speech Recognition API
	messageRecording = "Recording...",
	messageCouldntHear = "say what?",
	messageInternalError = "Oh no, there has been an internal server error",
	messageSorry = "I'm sorry, I don't have the answer to that yet.";
var redirectPage = "";
voicePages = {
	"pages": [{
		"speech": "acasa",
		"redirect": "index.html"
	}, {
		"speech": "servus cluj",
		"redirect": "ads.html"
	}, {
		"speech": "quiz",
		"redirect": "quizz.html"
	}, {
		"speech": "joaca",
		"redirect": "quizz.html"
	}, {
		"speech": "quizz",
		"redirect": "quizz.html"
	}, {
		"speech": "evenimente cluj",
		"redirect": "evenimente.html"
	}, {
		"speech": "evenimente",
		"redirect": "evenimente.html"
	}, {
		"speech": "reclame",
		"redirect": "ads.html"
	}, {
		"speech": "primarie",
		"redirect": "primarie.html"
	}, {
		"speech": "primaria",
		"redirect": "primarie.html"
	}, {
		"speech": "buletin",
		"redirect": "buletin.html"
	}, {
		"speech": "masca",
		"redirect": "cartePostala.html"
	}, {
		"speech": "carte postala",
		"redirect": "cartePostala.html"
	}, {
		"speech": "poza",
		"redirect": "cartePostala.html"
	}, {
		"speech": "act de identitate",
		"redirect": "buletin.html"
	}, {
		"speech": "identitate",
		"redirect": "buletin.html"
	}, {
		"speech": "instructor",
		"redirect": "trainer.html?room=rares"
	}, {
		"speech": "antrenor",
		"redirect": "trainer.html?room=rares"
	}, {
		"speech": "trainer",
		"redirect": "trainer.html?room=rares"
	}, {
		"speech": "conecteaza",
		"redirect": "connect.html?room=france"
	}, {
		"speech": "conect",
		"redirect": "connect.html?room=france"
	}, {
		"speech": "la revedere",
		"redirect": "ads.html"
	}, {
		"speech": "bye bye",
		"redirect": "ads.html"
	}, {
		"speech": "vremea",
		"redirect": "vremea.html"
	}, {
		"speech": "thank you",
		"redirect": "thank-you.html"
	}, {
		"speech": "multumim",
		"redirect": "thank-you.html"
	}, {
		"speech": "raspunde",
		"redirect": "#",
		"action": "answerCaller"
	}, {
		"speech": "inchide",
		"redirect": "#",
		"action": "removeCaller"
	}, {
		"speech": "inapoi",
		"redirect": "primarie.html"
	}]
};

$(document).ready(function() {
	$speechInput = $("#speech");
	$recBtn = $("#rec");


	setTimeout(function() {
		$recBtn.trigger('click');
	}, 3000);

	$speechInput.keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			send();
		}
	});

	$recBtn.on("click", function(event) {
		switchRecognition();
	});

	$(".debug__btn").on("click", function() {
		$(this).next().toggleClass("is-active");
		return false;
	});
});

function switchRecognition() {
	if (recognition) {
		stopRecognition();
	} else {
		startRecognition();
	}
}

function startRecognition() {
	recognition = new webkitSpeechRecognition();
	recognition.continuous = false;
	recognition.interimResults = false;
	recognition.onstart = function(event) {
		respond(messageRecording);
		updateRec();
	};
	recognition.onresult = function(event) {
		recognition.onend = null;

		var text = "";
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			text += event.results[i][0].transcript;
		}

		setInput(text);
		changePage(text);
		stopRecognition();
	};
	recognition.onend = function() {
		//respond(messageCouldntHear);
		stopRecognition();
	};
	recognition.lang = "ro-RO";
	recognition.start();
}

function stopRecognition() {
	if (recognition) {
		recognition.stop();
		recognition = null;
	}
	updateRec();
	startRecognition();
}

function setInput(text) {
	//filter text to display
	var textWordsArray = text.split(" ");
	var newText = "";

	for (i = 0; i < textWordsArray.length; i++)
		newText += censorship(textWordsArray[i]) + " "


	$speechInput.val(newText);
	$(".voice-input").removeClass("mic");

}

function updateRec() {
	$recBtn.text(recognition ? "Stop" : "Speak");
}



function prepareResponse(val) {

	var spokenResponse = val.result.speech;
	// actionResponse = val.result.action;
	// respond()
	respond(spokenResponse);

	var debugJSON = JSON.stringify(val, undefined, 2);
	debugRespond(debugJSON); // Print JSON to Debug window
}

function debugRespond(val) {
	$("#response").text(val);
}

function respond(val) {
	if (val == "") {
		val = messageSorry;
	}

	if (val !== messageRecording) {
		var msg = new SpeechSynthesisUtterance();
		msg.voiceURI = "native";
		msg.text = val;
		msg.lang = "ro-RO";
		window.speechSynthesis.speak(msg);
	}
	$("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(
		val);
}

function changePage(_page) {
	//var voicePages = [];

	_page = _page.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

	for (var i = 0; voicePages.pages.length > i; i += 1) {
		if (voicePages.pages[i].speech === _page) {
			if (voicePages.pages[i].action) {
				window[voicePages.pages[i].action]();
			} else {
				$('.grow').addClass('now');
				redirectPage = voicePages.pages[i].redirect;
				setTimeout(function() {
					window.location.replace(redirectPage);
				}, 3000);
			}
		}
	}
}

function censorship(word) {
	var badWords = ['pula', 'penis', 'dick', 'fuck', 'pussy']
	for (var j = 0; j < badWords.length; j++) {
		if (badWords[j].match(word)) return niceWords();
	}
	return word;
}

function niceWords() {
	var niceWords = ['Fluffy Unicorn', 'LOVE', '@*#*!', 'IVE']
	randomWord = Math.floor(Math.random() * niceWords.length);
	return niceWords[randomWord];
}



function backHistory() {
	window.history.back();
}
