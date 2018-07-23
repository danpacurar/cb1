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
		"speech": "quizz",
		"redirect": "quizz.html"
	}, {
		"speech": "evenimente cluj",
		"redirect": "evenimente.html"
	}, {
		"speech": "evenimente",
		"redirect": "evenimente.html"
	}, {
		"speech": "la revedere",
		"redirect": "home.html"
	}, {
		"speech": "bye bye",
		"redirect": "home.html"
	}, {
		"speech": "raspunde",
		"redirect": "primarul.html?room=boc"
	}, {
		"speech": "inchide",
		"redirect": "#",
		"action": "removeCaller"
	}]
};

//quizz play
var quiz = {
	"questions": [{
		"image": "img/quizz/jerry.png",
		"question": "Cine este personajul din imagine?",
		"answer1": ["Jerry"],
		"answer2": ["Tom"],
		"correctAnswer": "answer1"
	}, {
		"image": "img/quizz/popeye.png",
		"question": "Ce mananca Popey Marinarul?",
		"answer1": ["Spanac"],
		"answer2": ["Pietre"],
		"correctAnswer": "answer1"
	}, {
		"image": "img/quizz/4.png",
		"question": "Cat face 2+2?",
		"answer1": ["8", "opt"],
		"answer2": ["4", "patru"],
		"correctAnswer": "answer2"
	}, {
		"image": "img/quizz/albacazapada.jpg",
		"question": "Cati pitici sunt in povestea 'Alba Ca Zapada'?",
		"answer1": ["6", "sase"],
		"answer2": ["7", "sapte"],
		"correctAnswer": "answer2"
	}],
}
var currentRound = 0;
var correctAnswers = 0
var timeToDisplayQuestions = 60000; //ms
var hourGlassTime = timeToDisplayQuestions;
var quizMode = true;

function quizPlay(currentRound) {
	if (currentRound != quiz.questions.length) {
		displayQuestion(currentRound);
		hourglass('reset');
	} else {

		endQuiz();
	}
}

function hourglass(_status) {
	if (_status && _status == "reset") {
		hourGlassTime = timeToDisplayQuestions;
	}
	if (_status && _status == "pause") {
		hourGlassTime = timeToDisplayQuestions;
		return;
	}


	if (hourGlassTime >= 0) {
		setTimeout(function() {
			hourglass();
		}, 1000);
		hourGlassTime = hourGlassTime - 1000;
		updateTimer(hourGlassTime);
	} else {
		//goToTheNextQuestion
		hourGlassTime = timeToDisplayQuestions;
		currentRound = currentRound + 1;
		quizPlay(currentRound);
	}
}

function endQuiz() {
	currentRound = 0;

	quizMode = false;
	if (correctAnswers == quiz.questions.length)
		showResults("good");
	else {

		showResults("bad");
	}
	correctAnswers = 0;
	$('.quizPlay').empty();
}

function showResults(type) {
	//add ad
	if (type == "good")
		$('#goodResults').show();
	else {
		voicePages.pages.push({
			"speech": "da",
			"redirect": "quizz.html"
		}, {
			"speech": "nu",
			"redirect": "home.html"
		}, );
		$('#badResults').show();

	}
}

function updateTimer(_updateTimer) {
	procents = _updateTimer * 100 / timeToDisplayQuestions;

	if (procents > 60)
		$('#timer').css({
			'width': procents + "%",
			'background-color': '#9c03cf'
		});



	if (procents >= 30 & procents < 60)
		$('#timer').css({
			'width': procents + "%",
			'background-color': '#d37214'
		});
	if (procents < 30)
		$('#timer').css({
			'width': procents + "%",
			'background-color': '#d31414'
		});
}

function getAnswerAndValidate(answer) {

	//if true increase correctAnswers
	var flagAnswered = false;
	//searchinAnswer1
	answer = answer.toLowerCase().normalize(
		'NFD').replace(/[\u0300-\u036f]/g, "");
	for (var j = 0; j < quiz.questions[currentRound].answer1.length; j++) {
		quizAnswer = quiz.questions[currentRound].answer1[j].toLowerCase().normalize(
			'NFD').replace(/[\u0300-\u036f]/g, "")
		if (quizAnswer.match(answer)) {
			flagAnswered = true;
			if (quiz.questions[currentRound].correctAnswer == "answer1") {
				correctAnswers++;
				$('#answer1').addClass("true");
			} else {
				$('#answer1').addClass("false");
			}
		};
	}

	//searchinAnswer2
	for (var j = 0; j < quiz.questions[currentRound].answer2.length; j++) {
		quizAnswer = quiz.questions[currentRound].answer2[j].toLowerCase().normalize(
			'NFD').replace(/[\u0300-\u036f]/g, "");
		if (quizAnswer.match(answer)) {
			flagAnswered = true;
			if (quiz.questions[currentRound].correctAnswer == "answer2") {
				correctAnswers++;

				$('#answer2').addClass("true");
			} else {
				$('#answer2').addClass("false");
			}
		}
	}

	if (flagAnswered == true) {
		$('#rightAnswers').html(correctAnswers)
		currentRound = currentRound + 1;
		hourglass("pause");
		setTimeout(function() {
			resetStyleQuiz();
			quizPlay(currentRound);
		}, 3000);
	}

}

function resetStyleQuiz() {
	$('.answers').removeClass('true false');
	$('#timer').css("width", "100%");
	$(".voice-input").addClass("mic");
	$("#speech").val(" ");

}

function displayQuestion(currentRound) {
	var imageUrl = quiz.questions[currentRound].image;
	var question = quiz.questions[currentRound].question;
	var answer1 = quiz.questions[currentRound].answer1[0];
	var answer2 = quiz.questions[currentRound].answer2[0];
	var correctAnswer = quiz.questions[currentRound].answer2;

	$('#quiz-question').html(question);
	$('#quiz-image').attr("src", imageUrl);
	$('#quiz-image').attr("src", imageUrl);
	$('#answer1').html(answer1);
	$('#answer2').html(answer2);
}

quizPlay(0);
//end quiz play

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

	for (i = 0; i < textWordsArray.length; i++) {
		newText += censorship(textWordsArray[i]) + " "
		if (quizMode == true)
			getAnswerAndValidate(textWordsArray[i]);
	}

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


	if (quizMode == true && (_page != "inchide" && _page != "raspunde"))
		return;

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
