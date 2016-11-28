/*
https://www.behance.net/gallery/20331189/Tivibu
https://www.behance.net/gallery/43161663/Mapping-Go-
https://www.behance.net/gallery/44941465/025-Smart-TV-App
*/

var JSONresponse;
var showingDescription = false;
var showingFilms = false;
var LANGUAGE_RESPONSE = "en-US";
var FADE_TIME = 1000;
var API_KEY = "e23c818ec74b3447e740a6d758f88ddc";
var UPDATE_TIME_CLOCK = 60000;
var petition_parameter = "popular";

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
	
	console.log("...FINISHED HTTP MENU");

	//Deletion and creation of new div to reset slick trash
	$('#creation-list').empty();
	var iDiv = document.createElement('div');
	iDiv.className = 'film-list';
	document.getElementById('creation-list').appendChild(iDiv);

	//Parse response to JSON format
	JSONresponse = JSON.parse(json);
	console.log(JSONresponse);

	//Complie Handlebars and add to the html
	var source   = $("#menu-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(JSONresponse);
	$(".film-list").empty();
	$(".film-list").html(renderedTemplate);
	$(".focus").first().addClass("active");
	
	//Refresh text to match info
	changeWindow(1);
	initializeSlick();
	updateFocus();
	
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

	//Render description template
	var source   = $("#info-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(JSONresponse);
	$(".info-panel").html(renderedTemplate);

	//Modfy gradient to fit image
	$('.gradient').width($('.background-photo').width());
	console.log("...FINISHED HTTP MOVIE DESCRIPTION");

}

function changeWindow(option){
	
	switch(option){
		case 1:
			$(".selector-panel").fadeOut(FADE_TIME);
			$(".menu-panel").fadeIn(FADE_TIME);
			showingFilms = true;
			showingDescription = false;
		break;
		case 2:
			$(".menu-panel").fadeOut(FADE_TIME);
			$(".info-panel").fadeIn(FADE_TIME);
			showingDescription = true;
			showingFilms = false;
		break;
		case 3:
			$(".info-panel").fadeOut(FADE_TIME);
			$(".menu-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingFilms = true;	
		break;
		case 4:
			$('.film-list').slick('unslick');	
			initializeSlick();
			updateFocus();
			$(".menu-panel").fadeOut(FADE_TIME);
			$(".selector-panel").fadeIn(FADE_TIME);
			showingDescription = false;
			showingFilms = false;
		break;		
	}

}

function updateClock(){
	
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

function updateFocus(){
	
	//Change focus class
	$('.active').removeClass('active');
	$('.slick-center .focus').addClass('active');

	//Update information text (title and rating)
	var title = $(".active").attr('data-title');
	var rating = $(".active").attr('data-vote');
	var starsFilled = Math.round(rating * 5 / 10);
	var starsEmpty = 5 - starsFilled;
	var starsRating = '<i class="fa fa-star" aria-hidden="true"></i>'.repeat(starsFilled) + '<i class="fa fa-star-o" aria-hidden="true"></i>'.repeat(starsEmpty) + "  " + rating;
	$(".title-name").html(title);
	$(".title-rating").html(starsRating);

	//Fill image background
	var path_image = $(".active").attr('data-backgroundimage');
	$('.background-photo').fadeOut('slow',function(){
        $(this).attr('src',path_image).fadeIn(FADE_TIME, 'swing');
    });

	//Fill info about focus film
	console.log("STARTING HTTP MOVIE DESCRIPTION...");
	var id = $(".active").attr('data-id');
	getHttpRequestDescription("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + API_KEY + "&language=" + LANGUAGE_RESPONSE, getJSONMenu);

}

window.onload = function() {

	updateClock();
	setInterval(updateClock, UPDATE_TIME_CLOCK);

	$(".menu-panel").hide()
	$(".info-panel").hide()

	if(!showingFilms && !showingDescription){
		$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
	        controllerProvider.onFocused(function(event, originalEvent) {
	        	$(event.currentTarget).css( 'border', '1px solid white');
	        });
	        controllerProvider.onBlurred(function(event, originalEvent) {
	        	$(event.currentTarget).css( 'border', '1px solid transparent');
	        });
	        controllerProvider.onSelected(function(event, originalEvent){
	        	var petition = $(event.currentTarget).attr('data-petitiontype');
	 	 		var fill_info = $(event.currentTarget).children("h1").html();
	 	 		$('#petition-type').html(fill_info);
	 	 		console.log("STARTING HTTP MOVIE MENU...");
	 	 		getHttpRequestMenu("https://api.themoviedb.org/3/movie/" + petition + "?api_key=" + API_KEY + "&language=" +LANGUAGE_RESPONSE, getJSONDescription);
				
			});
	    });
	}
	

	document.addEventListener('keydown', function (e) {
    	
    	var e = e || e.keyCode;

    	if (e.keyCode == '13') {
    		console.log("info - key ENTER pressed");
    		if(showingFilms){
    			changeWindow(2);
    		}
    	}
    	if (e.keyCode == '27') { 
    		console.log("info - key ESC pressed");
    		if (showingFilms) { changeWindow(4)};
    		if (showingDescription) { changeWindow(3)};
    	}    	
    	if (e.keyCode == '37') { 
    		console.log("info - key LEFT pressed");
    		if(showingFilms){
				$(".film-list").slick('slickPrev');
				updateFocus();
    		}
    	}
    	if (e.keyCode == '38') { 
    		console.log("info - key UP pressed");	
    	}
    	if (e.keyCode == '39') { 
    		console.log("info - key RIGHT pressed");
    		if(showingFilms){
	    		$(".film-list").slick('slickNext');
	    		updateFocus();	
    		}
    	}
    	if (e.keyCode == '40') { 
    		console.log("info - key DOWN pressed");
    	}    	    	    	
	});

};

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
