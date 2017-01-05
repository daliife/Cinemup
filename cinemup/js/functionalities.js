
//Constant parameters
var LANGUAGE_RESPONSE = "en-US";					//Language of the received JSON petitions
var FADE_TIME = 1000;								//Value of transition's fade in miliseconds
var API_KEY = "e23c818ec74b3447e740a6d758f88ddc";	//Personal API KEY to make petitions to "themoviedb"
var UPDATE_TIME_CLOCK = 60000;						//Refresh time of the clock in miliseconds

//Boolean flags
var showingDescription = false;
var showingFilms = false;
var showingTrailer = false;
var showingImages = false;
var isPlayingTrailer = false;
var isPaused = false;
var isShowingInstructions = false;

//Needed variables
var youtube_id;
var typeVideo;
var JSONresponse;

window.onload = function() {

	//Update the time and date every UPDATE_TIME_CLOCK ms
	updateClock();
	setInterval(updateClock, UPDATE_TIME_CLOCK);

	//Hiding all unnecessary panels
	$(".menu-panel").hide();	
	$(".info-panel").hide();
	$(".trailer-panel").hide();
	$(".images-panel").hide();
	$(".instructions-panel").hide();
	
	//CAPH functions for the main menu selector
	if(!showingFilms && !showingDescription && !showingTrailer && !showingImages){
		$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
	        controllerProvider.onFocused(function(event, originalEvent) {
	        	$(event.currentTarget).children('.option-image').css('opacity', '1');
	        	$(event.currentTarget).children('.option-type').css('opacity', '1');
	        	$(event.currentTarget).children('.option-image')
	        	.css({
	        	   'filter'         : 'blur(0px)',
	        	   '-webkit-filter' : 'blur(0px)',
	        	   '-moz-filter'    : 'blur(0px)',
	        	   '-o-filter'      : 'blur(0px)',
	        	   '-ms-filter'     : 'blur(0px)'
	        	});
	        });	        
	        controllerProvider.onBlurred(function(event, originalEvent) {
	        	$(event.currentTarget).children('.option-image').css('opacity', '0.4');
	        	$(event.currentTarget).children('.option-type').css('opacity', '0.8');
	        	$(event.currentTarget).children('.option-image')
	        	.css({
	        	   'filter'         : 'blur(5px)',
	        	   '-webkit-filter' : 'blur(5px)',
	        	   '-moz-filter'    : 'blur(5px)',
	        	   '-o-filter'      : 'blur(5px)',
	        	   '-ms-filter'     : 'blur(5px)'
	        	});
	        });	        
	        controllerProvider.onSelected(function(event, originalEvent){
	        	var petition = $(event.currentTarget).attr('data-petitiontype');
	        	typeVideo = $(event.currentTarget).attr('data-videotype');
	 	 		var fill_info = $(event.currentTarget).children("h1").html();
	 	 		$('#petition-type').html(fill_info);
	 	 		console.log("STARTING HTTP MOVIE MENU...");
	 	 		getHttpRequestMenu("https://api.themoviedb.org/3/" + typeVideo + "/" + petition + "?api_key=" + API_KEY + "&language=" + LANGUAGE_RESPONSE, getJSONDescription);				
			});
	    });
	}
	
	//Listen key events
	keyController();

};

function keyController(){
	
	document.addEventListener('keydown', function (e) {
    	
		var e = e || e.keyCode;
		
		//If the user push any button in when instructions toggled, it will hide automatically
		if(isShowingInstructions){
			$(".instructions-panel").fadeOut(FADE_TIME);
			isShowingInstructions = false;
		}
		
    	if (e.keyCode == TvKeyCode.KEY_ENTER) {
    		console.log("info - key ENTER pressed");
    		if(showingFilms){
    			changeWindow(3);
    			var id = $("#show-images").attr('data-id');
    			getHttpRequestImages("https://api.themoviedb.org/3/" + typeVideo + "/" + id + "/images?api_key=" + API_KEY + "&language=" + LANGUAGE_RESPONSE +"&include_image_language=en");
    			console.log("STARTED HTTP MOVIE IMAGES..."); 			
    		}else if(showingDescription){		
    			var focused = $('.active-button').attr('id');   			
    			switch(focused){
    				case 'play-trailer':
    					console.log('playing trailer...');
    	    			changeWindow(5);
    					document.getElementById('trailer').play();
    	    			isPlayingTrailer = true;
    	    			doAnimationPlayer(1);
    				break;
    				case 'show-images':
    					console.log('showing images...');
    					changeWindow(7);
    				break;
    				case 'close-window':
    					console.log('closing...');
    					changeWindow(4);
    				break;
    			}
    		}
    	}
    	//TODO: Change RED KEY for BACK button, but avoid closing app behaviour
    	if (e.keyCode == TvKeyCode.KEY_RED) { 
    		console.log("info - key INFO pressed");
    		if (showingFilms) { changeWindow(2); }
    		if (showingDescription) { changeWindow(4); }
    		if(showingImages){ changeWindow(8); }
    		if (showingTrailer) { 
    			changeWindow(6);  
    			document.getElementById('trailer').pause();
    			isPlayingTrailer = false;
			} 		
    	}    	
    	if (e.keyCode == TvKeyCode.KEY_PAUSE) { 
    		console.log("info - key PAUSE pressed");
    		if(showingTrailer && isPlayingTrailer && !isPaused){
    			document.getElementById('trailer').pause(); 
    			isPaused = true;
    			doAnimationPlayer(2);
    		}
    	}    	
    	if (e.keyCode == TvKeyCode.KEY_PLAY) { 
    		console.log("info - key PLAY pressed");
    		if(isPlayingTrailer && isPaused){
    			document.getElementById('trailer').play();
    			isPaused = false;
    			doAnimationPlayer(1);
    		}
    		if(showingTrailer && !isPlayingTrailer){
    			document.getElementById('trailer').play();
    			doAnimationPlayer(1);
    		}
    	} 	
    	if (e.keyCode == TvKeyCode.KEY_LEFT) { 
    		console.log("info - key LEFT pressed");
    		if(showingFilms){
				$(".film-list").slick('slickPrev');
				updateFocus(true);
    		}
    		if(showingDescription){
    			changeDescriptionFocus(2);
    		}
    	}
    	if (e.keyCode == TvKeyCode.KEY_RIGHT) { 
    		console.log("info - key RIGHT pressed");
    		if(showingFilms){
	    		$(".film-list").slick('slickNext');
	    		updateFocus(true);	
    		}
    		if(showingDescription){
    			changeDescriptionFocus(1);
    		}
    	}
    	if(e.keyCode == TvKeyCode.KEY_INFO){
    		if(!isShowingInstructions){
    			$(".instructions-panel").fadeIn(FADE_TIME);
    			isShowingInstructions = true;;
    		}
    	}
    	
	});
		
}

function changeDescriptionFocus(direction){
	
	var buttonFocused = $(".active-button");
	var parentFocused = $(".active-button").parent();
	
	switch(direction){
		case 1: //Right arrow
		if(parentFocused.next("div").length > 0) {
			buttonFocused.removeClass("active-button");
			parentFocused.next("div").children('button').addClass("active-button");
		}	
		break;
		case 2: //Left arrow
		if(parentFocused.prev("div").length > 0) {
			buttonFocused.removeClass("active-button");
			parentFocused.prev("div").children('button').addClass("active-button");
		}
		break;
	}
}

function changeWindow(option){
	
	switch(option){
		case 1:
			$(".selector-panel").fadeOut(FADE_TIME);
			$(".menu-panel").fadeIn(FADE_TIME);
			showingFilms = true;
			showingTrailer = false;
			showingImages = false;
			isPlayingTrailer = false;
		break;
		case 2:
			$('.film-list').slick('unslick');	
			initializeSlick();
			updateFocus(true);
			$(".menu-panel").fadeOut(FADE_TIME);
			$(".selector-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingFilms = false;
			showingTrailer = false;
			showingImages = false;
			isPlayingTrailer = false;
		break;	
		case 3:
			$(".menu-panel").fadeOut(FADE_TIME);
			$(".info-panel").fadeIn(FADE_TIME);
			showingDescription = true;
			showingFilms = false;
			showingTrailer = false;
			showingImages = false;
			isPlayingTrailer = false;
		break;
		case 4:
			$(".info-panel").fadeOut(FADE_TIME);
			$(".menu-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingFilms = true;
			showingTrailer = false;
			showingImages = false;
			isPlayingTrailer = false;
			setTimeout(updateFocus, FADE_TIME);
		break;
		case 5:
			$(".info-panel").fadeOut(FADE_TIME);
			$(".trailer-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingDescription = false;
			showingFilms = false;
			showingTrailer = true;
			showingImages = false;
			isPlayingTrailer = false;
		break;	
		case 6:
			$(".trailer-panel").fadeOut(FADE_TIME);
			$(".info-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingDescription = true;
			showingFilms = false;
			showingTrailer = false;
			showingImages = false;
			isPlayingTrailer = false;
		break;
		case 7:
			$(".info-panel").fadeOut(FADE_TIME);
			$(".images-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingDescription = false;
			showingFilms = false;
			showingTrailer = false;
			showingImages = true;
			isPlayingTrailer = false;
		break;
		case 8:
			$(".images-panel").fadeOut(FADE_TIME);
			$(".info-panel").fadeIn(FADE_TIME);
			showingDescription = true;
			showingFilms = false;
			showingTrailer = false;
			showingImages = false;
			isPlayingTrailer = false;
		break;
		default:
			console.log("ERROR: Wrong changeWindow parameter.");
		break;
	}

}

function updateFocus(hasToUpdateBackground){
		
	//Change focus class
	$('.active').removeClass('active');
	$('.slick-center .focus').addClass('active');

	//Update information text (title and rating)
	var title = $(".active").attr('data-title');
	var rating = $(".active").attr('data-vote');
	var starsFilled = Math.floor(rating * 5 / 10);
	var starsSemiFilled = ((rating*5/10)-starsFilled) >= 0.5 ? 1 : 0; 
	var starsEmpty = 5 - starsFilled - starsSemiFilled;
	var starsRating = '<i class="fa fa-star" aria-hidden="true"></i>'.repeat(starsFilled) + '<i class="fa fa-star-half-o" aria-hidden="true"></i>'.repeat(starsSemiFilled) + '<i class="fa fa-star-o" aria-hidden="true"></i>'.repeat(starsEmpty) + "  " + rating;
	$(".title-name").html(title);
	$(".title-rating").html(starsRating);

	//Fill image background
	if(hasToUpdateBackground){
		var path_image = $(".active").attr('data-backgroundimage');
		$('.background-photo').fadeOut('slow',function(){
	        $(this).attr('src',path_image).fadeIn(FADE_TIME, 'swing');
	    })
	}

	//Fill info about focus film
	console.log("STARTING HTTP MOVIE DESCRIPTION...");
	var id = $(".active").attr('data-id');
	getHttpRequestDescription("https://api.themoviedb.org/3/" + typeVideo +"/" + id + "?api_key=" + API_KEY + "&language=" + LANGUAGE_RESPONSE + "&append_to_response=videos", getJSONMenu);

}

function getHttpRequestMenu(theUrl, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getJSONMenu(xmlHttp.responseText);
            
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}

function getJSONMenu(json){
	
	//Deletion and creation of new div to reset slick trash
	$('#creation-list').empty();
	var iDiv = document.createElement('div');
	iDiv.className = 'film-list';
	document.getElementById('creation-list').appendChild(iDiv);

	//Parse response to JSON format
	JSONresponse = JSON.parse(json);
	console.log(JSONresponse);
	console.log("...FINISHED HTTP MENU");
	
	//Compile Handlebars and add to the html
	var source   = $("#menu-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(JSONresponse);
	$(".film-list").empty();
	$(".film-list").html(renderedTemplate);
	$(".focus").first().addClass("active");
	
	//Refresh text to match info
	changeWindow(1);
	initializeSlick();
	updateFocus(true);
	
}

function getHttpRequestDescription(theUrl, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getJSONDescription(xmlHttp.responseText);
            
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}

function getJSONDescription(json){
	
	//Parse response to JSON format
	JSONresponse = JSON.parse(json);
	console.log(JSONresponse);
	console.log("...FINISHED HTTP MOVIE DESCRIPTION");

	//Render description template
	var source   = $("#info-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(JSONresponse);
	$(".info-panel").html(renderedTemplate);
	
	//Fill the url link on the video tag
	youtube_id = JSONresponse.videos.results[0].key;

}

function getHttpRequestImages(theUrl, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        	getJSONImages(xmlHttp.responseText); 
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}

function getJSONImages(json){
	
	//Parse response to JSON format
	JSONresponse = JSON.parse(json);
	console.log("...FINISHED HTTP MOVIE IMAGES");
	
	//Render Images template
	var source   = $("#images-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(JSONresponse.posters.slice(0,10));
	$(".images-panel").html(renderedTemplate);
		
}

function updateClock() {
	
	var date = new Date()
	var am = date.getHours() < 12 ? 'a.m.' : 'p.m.';
	var hour = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
	var minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
	var newTime = hour + ":" + minutes + " " + am;
	var optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	var newDate = date.toLocaleString( LANGUAGE_RESPONSE, optionsDate);
	$(".time").html(newTime);
	$(".date").html(newDate);

}

function initializeSlick(){	

	$('.film-list').slick({
	  centerMode: true,
	  dots: false,
	  arrows: false,
	  adaptiveHeight: true,
	  infinite: true,
	  centerPadding: '40px',
	  slidesToShow: 5,
	  adaptiveHeight: true
	});

}

function doAnimationPlayer(type){
	
	var image_path;
	switch(type){
		case 1:
			image_path = "images/play.png";
			break;
		case 2:
			image_path = "images/pause.png";
			break;
	}
	
	$("#icon-player").attr("src", image_path);
	$("#icon-player").show();
	$("#icon-player").fadeOut(FADE_TIME);
	
}

//TODO: Check if youtube api works or not and find alternatives
function initializeVideo(youtube_id){
	//$('.trailer-panel').empty();
	//var playerDiv = document.createElement('div');
	//playerDiv.id = 'player';
	//$('.trailer-panel').append(playerDiv);
}