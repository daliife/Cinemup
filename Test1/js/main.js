var checkTime;
var JSONresponse;
var showingInfo = false;

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('init() called');
    
    document.addEventListener('visibilitychange', function() {
    	
    	httpGetAsync("http://www.omdbapi.com/?t=starwars&y=&plot=short&r=json", getJSON); //Peticion de datos a OMDB
    	
    	//httpGetAsync("https://api.themoviedb.org/3/movie/330459?api_key=e23c818ec74b3447e740a6d758f88ddc&language=en-US", getJSON);
    	$(".info-panel").hide(); //Escondemos la ventana secundaria
    	$(".menu").show(); //Mostramos el menu principal
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        	$(".info-panel").hide(); //Escondemos los datos de peliculas
        	$(".menu").show(); //Siempre mostramos el menu inicial
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	var e = e || e.keycode;
    	switch(e.KeyCode){
    	case '37': //LEFT arrow
    		console.log("LEFT");
    		$(".test").slick('slickPrev');
    		break;
    	case 38: //UP arrow
    		$(".test").slick('slickPrev');
    		break;
    	case 39: //RIGHT arrow
    		$(".test").slick('slickNext');
    		break;
    	case 40: //DOWN arrow
    		break;
    	case 13: //OK button
    		showInfo(); 
    		break;
    	case 10009: //RETURN button
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
};
// window.onload can work without <body onload="">
window.onload = init;

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('divbutton1').innerHTML='Current time: ' + h + ':' + m + ':' + s;
    setTimeout(startTime, 10);
}

function checkTime(i) {
    if (i < 10) {
        i='0' + i;
    }
    return i;
}
/*Alterna entre el menu inicial y las ventanas de información */
function showInfo(){
	if(showingInfo){ 
		$(".info-panel").hide();
		$(".menu").show();
		showingInfo = false;
	}else{
		$(".info-panel").show();
		$(".menu").hide();
		showingInfo = true;
	}
}
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

$(document).ready(function(){
	
	$('.test').slick({
	  centerMode: true,
	  dots: false,
	  arrows: false,
	  adaptiveHeight: true,
	  infinite: true,
	  centerPadding: '100px',
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
