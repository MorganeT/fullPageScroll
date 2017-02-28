Params = {
	"duration" : 500 // duree pour atteinte la page en question
}


var pageActive = 0 ;
var myPages = [];


$.fn.hasClassRegEx = function(regex) // Fonction recuperee sur le web
{
	var classes = $(this).attr('class'); 
	if(!classes || !regex)
	{ 
		return false; 
	} 
	classes = classes.split(' '); 
	var len = classes.length; 
	for(var i=0; i<len; i++) 
	{
		if(classes[i].match(regex))
		{
			nombre = classes[i].replace(regex,""); 
			return nombre; 
		} 
	} return false; 
};

function scrollTo(page) // Va a la page en question
{
	id = page.attr("id");
	history.pushState({ path: this.path }, '', "#"+id);

	offset = page.offset().top ;
	$('body,html').stop(false,true).animate(
	{
		scrollTop : offset
	},Params.duration);
}

function changePage(direction)
{
	pageActive+= direction;
	checkPageActive();
	scrollTo(myPages[pageActive]);
}

function checkPageActive() // Ajout de classes
{
	var id= pageActive+1 ;
	$("* [class^='scrollToPage-']").removeClass("active");
	$(".scrollToPage-"+id).addClass("active");
	if(pageActive == 0) {$(".prevPage").addClass("disabled"); } else {$(".prevPage").removeClass("disabled"); } 
	if(pageActive == myPages.length-1) {$(".nextPage").addClass("disabled"); } else {$(".nextPage").removeClass("disabled"); } 
}

$(document).ready(function()
{
	// recuperation de l ancre
	var ancre = location.hash ;
	ancre = ancre.substring(1);

	// Pour chaque .scrollPage on l ajout à myPages 
	$(".scrollPage").each(function(){
		myPages.push($(this));
	});

	var temp = 0 ;

	// recuperation de la page active
	myPages.forEach(function(page)
	{
		if(page.attr("id") == ancre)
		{
			pageActive = temp ;
		}

		temp ++;
	});

	checkPageActive();

	scrollTo(myPages[pageActive]);

	$(window).on("wheel", function(event) 
	{
		if(!$("body,html").is(":animated"))
		{
			if (event.originalEvent.deltaY >= 0) // Scroll vers le bas
			{
				if(pageActive<myPages.length -1) // Si il y a une page plus bas
				{
					changePage(1);
				}
			}
			else // Scroll vers le haut
			{
				if(pageActive>0) // Si il y a une page plus haut
				{
					changePage(-1);
				}
			}
		}
	});

	$(".nextPage").click(function(event){ // clic sur bouton suivant
		event.preventDefault();
		if(pageActive<myPages.length -1)
		{
			changePage(1);
		}
	});

	$(".prevPage").click(function(event){ // clic sur bouton precedent
		event.preventDefault();
		if(pageActive>0)
		{
			changePage(-1);
		}
	});

	$("*[class^='scrollToPage-']").click(function(){ // clic sur un numero de page
		number = $(this).hasClassRegEx("scrollToPage-");
		if(number)
		{
			pageActive= number-1 ;
			checkPageActive();
			scrollTo(myPages[pageActive]);
		}
	});

});
