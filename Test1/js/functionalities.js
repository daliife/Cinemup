/*
https://www.behance.net/gallery/20331189/Tivibu
https://www.behance.net/gallery/43161663/Mapping-Go-
https://www.behance.net/gallery/44941465/025-Smart-TV-App
*/

var JSONresponse;
var showingInfo = false;

function httpGetAsync(theUrl, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getJSON(xmlHttp.responseText);
            
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}

function getJSON(json){
	
	//Parse response to JSON format
	JSONresponse = JSON.parse(json);
	console.log(JSONresponse);

	//Fil page info
	fillInfo(JSONresponse);

}

function fillInfo(film){
	
	var source   = $("#info-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(film);
	$(".info-panel").html(renderedTemplate)

}

function fillTopInfo(film){
	
	var source   = $("#top-template").html();
	var template = Handlebars.compile(source);
	var renderedTemplate = template(film);
	$(".top-list").html(renderedTemplate)

}

function showInfo(){
	
	if(showingInfo){ 
		$(".info-panel").hide();
		$(".menu-panel").show();
		showingInfo = false;
	}else{
		$(".info-panel").show();
		$(".menu-panel").hide();
		showingInfo = true;
	}

}

function updateClock(){
	
	var date = new Date()
	var am = date.getHours() < 12 ? 'a.m.' : 'p.m.';
	var newTime = date.getHours() + ":" + date.getMinutes() + " " + am;
	var optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	var newDate = date.toLocaleString('en-US', optionsDate);
	$(".time").html(newTime);
	$(".date").html(newDate);

}

function changeInfoMain(){
	$(".title-name").html("hello");
	
}

function updateFocus(){
	$('.active').removeClass('active');
	$('.slick-center .focus').addClass('active');
}

window.onload = function() {

	updateClock();
	setInterval(updateClock, 60000);

	//httpGetAsync("https://api.themoviedb.org/3/movie/popular?api_key=e23c818ec74b3447e740a6d758f88ddc&language=en-US", getJSON);
	httpGetAsync("http://www.omdbapi.com/?t=shooter&y=&plot=short&r=json", getJSON);

	$(".info-panel").hide();
	$(".menu-panel").show();

	document.addEventListener('keydown', function (e) {
    	var e = e || e.keyCode;

    	if (e.keyCode == '13') {
    		console.log("info - key ENTER pressed");
    		showInfo();
    	}
    	if (e.keyCode == '27') { 
    		console.log("info - key ESC pressed");
    		
    	}    	
    	if (e.keyCode == '37') { 
    		console.log("info - key LEFT pressed");
    		$(".test").slick('slickPrev');
    		updateFocus();
    		
    	}
    	if (e.keyCode == '38') { 
    		console.log("info - key UP pressed");
    		changeInfoMain();
    		
    	}
    	if (e.keyCode == '39') { 
    		console.log("info - key RIGHT pressed");
    		$(".test").slick('slickNext');
    		updateFocus();
    		
    	}
    	if (e.keyCode == '40') { 
    		console.log("info - key DOWN pressed");
    		
    	}    	    	    	
	});
};

$(document).ready(function(){
	
	$('.test').slick({
	  centerMode: true,
	  dots: false,
	  arrows: false,
	  adaptiveHeight: true,
	  infinite: true,
	  centerPadding: '80px',
	  slidesToShow: 5,
	  responsive: [
	    {
	      breakpoint: 768,
	      settings: {
	        arrows: false,
	        centerMode: true,
	        centerPadding: '40px',
	        slidesToShow: 3
	      }
	    },
	    {
	      breakpoint: 480,
	      settings: {
	        arrows: false,
	        centerMode: true,
	        centerPadding: '40px',
	        slidesToShow: 1
	      }
	    }
	  ]
	});
});
