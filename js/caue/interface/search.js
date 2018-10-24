jQuery("#searchFunction").on("input", function() {
	searchFunctions($("#searchFunction").val());
});

$("#searchFunction").on('blur', function() {
    setTimeout(function(){
        $('li.fi ul').removeClass('haveSought');
        $('li.fi ul').removeClass('haveSoughtz');
        $('li.fi a').removeClass('soughtFound').show();
        $("#searchFunction").css('border-color', '#dbe0e400');
    }, 300);
	
});

$("#searchFunction").on('focus', function() {
    $("#searchFunction").css('border-color', '#DBE0E4');
});

$(".app-header-search").submit(function() {
    if ($uniqueFound) {
        $($uniqueFound).trigger('click');
        console.log($uniqueFound);
    }
    else {
        noty({
            text: 'More than one function found, and can not be run on enter',
            type: 'error',
            layout: 'topRight',
            timeout: 2500
        });
        $('li.fi > ul a:not(.soughtFound)').hide();
    }
    return false;
});


var $searchIn = jQuery("li.fi a:not(.open-submenu)");
var $uniqueFound; var lastFound; var timer;
function searchFunctions(sought) {
	clearInterval(timer);
	var biggerOffset = 0;
    if (sought.length == 0) {
        $('li.fi ul').removeClass('haveSought');
        $('li.fi ul').removeClass('haveSoughtz');
        $('li.fi a').removeClass('soughtFound').show();
        console.log('TESTE');
        $("#searchFunction").css('border-color', '#DBE0E4');
        return false;
    }
	var founds = 0;
    $uniqueFound = undefined;
	sought = sought.toUpperCase();
	$('li.fi ul').removeClass('haveSought');
	$('li.fi ul').removeClass('haveSoughtz');
	$('li.fi a').removeClass('soughtFound');
    $('li.fi a').show();

	$($searchIn).each(function( index ) {
		var thisFunction = $( this ).text().toUpperCase();

		

		if (thisFunction.indexOf(sought) !== -1) { // if found
			founds++;
			var father = $(this).closest('li.fi');
			$(this).addClass('soughtFound');
			$(father).children('ul').addClass('haveSoughtz');
            lastFound = $(this);
            biggerOffset = Math.max($(this).offset().top, biggerOffset);
			
		} 

		var cnt = $(".remove-just-this").contents();
		$(".remove-just-this").replaceWith(cnt);
	});
    if(founds == 1) {
        $uniqueFound = lastFound;
        
        $("#searchFunction").css('border-color', '#0a9f2669');

        
    }

    if(founds == 0) {
        $("#searchFunction").css('border-color', '#ff002238');
    }
    if(founds > 1) {
        $("#searchFunction").css('border-color', '#DBE0E4');
    }


	timer = setTimeout(function(){ 
		console.log(lastFound);
		$('.haveSoughtz').addClass('haveSought');
		console.log('Bigger offset: '+ biggerOffset);
    	console.log('Offset: ' + $(lastFound).offset().top);
    	//$('#mCSB_1').animate({ scrollTop: 0 }, 'fast');
    	$('#mCSB_1').animate({ scrollTop: ($(lastFound).offset().top-$( window ).height() + 50) }, 'fast');
	}, 150);
    //Scroll to last found
    
}