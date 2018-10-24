$(document).keydown(function(event){
	if (!(!options.enable_shortcuts || $("input").is(":focus") || $('#open-encoder').is(":visible"))) {
        if(event.which=="17") // Ctrl
            cntrlIsPressed = true;
        if(event.which=="32") // Ctrl + Space
            $('#originalImages canvas').remove();
        if(event.which=="9")  // Tab
            $('.app-navigation-logo-button').trigger('click');
        if(event.which=="85") // u
            $('#uploadimage').trigger('click');
        if(event.which=='83') { // s
            $('.app-header-search').trigger('click');
            return false; // to not search s
        }
        if(event.which=="187") // =
            isTheSameImage(imagesData[primaryImage], imagesData[secundaryImage]);

        if(event.which=='80') { // p
            if ($("body").hasClass("region-growth")) {
                regionGrowth(imagesData[mouseOverImage], mouseOverX, mouseOverY, 20);
            };
        }
    }
    console.log(event.which);
});


$(document).keyup(function(){
    cntrlIsPressed = false;
});

$(document).on('blur', function() {
    cntrlIsPressed = false;
});

$('.swal2-popup').on('keydown', function() { console.log('test')});