// The transformation codes for this file are an override of the native pixel manipulation functions
// Source code at https://github.com/supermattydomain/canvas.currentTransform.js

$( "li" ).on( "click", "#transformations", function() {
	
	canvasTransformations.width = window.innerWidth ;
	canvasTransformations.height = window.innerHeight;

	var imageToTransform = imagesData[primaryImage];
	console.log('Opening Image ' + primaryImage + ' to transform');
	console.log('TESTEEEEEEEz');
	if (!imageToTransform) { uploadFirstNotification(); return false; }
	jQuery('#transformations-open').click();
	var widthToPut = window.innerWidth/2 - imageToTransform.width/2;
	var heightToPut = window.innerHeight * 0.35 - imageToTransform.height/2;
	putImageData(contextTransform, imageToTransform, widthToPut , heightToPut, 0, 0, imageToTransform.height, imageToTransform.width);

	jQuery("#scaley [type=range]").trigger('input'); //fix color
	//contextTransform.putImageData(imageToTransform, widthToPut, heightToPut);
});

jQuery('#uiContainer').on('input', 'input[type=text]', function () {
	var $fatherDiv = $(this).closest(".gman-widget-outer");
	$( $fatherDiv ).children( "input[type=range]" ).val($(this).val());
	jQuery("#angle [type=range]").trigger('input');

});

jQuery('.transformations-modal').on('click', '#reflect_x', function() {
	console.log('Reflection in X');
	var valueScaleX = jQuery("#scalex input[type=text]").val();
	
	jQuery("#scalex input[type=text]").val(parseFloat(valueScaleX) * -1);
	jQuery("#scalex input[type=range]").val(parseFloat(valueScaleX) * -1);
	
	jQuery("#scalex [type=range]").trigger('input');
});

jQuery('.transformations-modal').on('click', '#reflect_y', function() {
	console.log('Reflection in Y');
	var valueScaleY = jQuery("#scaley input[type=text]").val();
	jQuery("#scaley input[type=text]").val(parseFloat(valueScaleY) * -1);
	jQuery("#scaley input[type=range]").val(parseFloat(valueScaleY) * -1);

	jQuery("#scaley [type=range]").trigger('input');
});

jQuery('#x, #y, #angle, #scalex, #scaley, #skewx, #skewy').on('input','input[type=range]', function() {
	imgz.src = canvasArray[primaryImage].toDataURL();

	//console.log($(this));
	var $fatherDiv = $(this).closest(".gman-widget-outer");
	$( $fatherDiv ).children(".gman-widget-value").children( "input[type=text]" ).val($(this).val());

	imgz.onload = function() {
    	contextTransform.clearRect(0,0,canvasTransformations.width,canvasTransformations.height);
		contextTransform.saveCaue();

		//Translating
		var imageToTransform = imagesData[primaryImage];
		var widthToPut = window.innerWidth/2 - imageToTransform.width/2;
		var heightToPut = window.innerHeight * 0.35 - imageToTransform.height/2;
		var dx = parseInt(jQuery('#x input[type=text]').val()) + widthToPut;
		var dy = parseInt(jQuery('#y input[type=text]').val()) + heightToPut;
		//console.log({dx, dy});
    	contextTransform.transformCaue( 1,  0,  0,
    							    1, dx, dy);
    	//Rotating
    	var angle = jQuery('#angle input[type=text]').val();
    	angle = angle*Math.PI/180;
    	var c = Math.cos(angle);
    	var s = Math.sin(angle);
    	contextTransform.transformCaue( c,  s, -s,
    					   			c,  0,  0 );

    	//Scaling
    	var sx = jQuery('#scalex input[type=text]').val();
    	var sy = jQuery('#scaley input[type=text]').val();
    	contextTransform.transformCaue(sx,  0,  0, sy,  0,  0)

    	//Skew 
    	var skewony = jQuery('#skewy input[type=text]').val();
    	var skewonx = jQuery('#skewx input[type=text]').val();
    	contextTransform.transformCaue(1,skewony,skewonx,1,0,0);
    	
		contextTransform.drawImage(imgz,0,0);
	    contextTransform.restoreCaue();
	};
});

$('body').on("click", "#applyTransformations", function() {
	canvasTransformations.width = window.innerWidth ;
	canvasTransformations.height = window.innerHeight;
	var imageToTransform = imagesData[primaryImage];
	var widthToPut = window.innerWidth/2 - imageToTransform.width/2;
	var heightToPut = window.innerHeight * 0.35 - imageToTransform.height/2;
	//putImageData(contextTransform, imageToTransform, 0 , 0, 0, 0, imageToTransform.height, imageToTransform.width);
	//contextTransform.putImageData(imageToTransform, widthToPut, heightToPut);
	putImageData(contextTransform, imageToTransform, widthToPut , heightToPut, 0, 0, imageToTransform.height, imageToTransform.width);

	$("#uiContainer #x input, #uiContainer #y input, #uiContainer #angle input, #uiContainer #skewx input, #uiContainer #skewy input").val("0");
	$("#uiContainer #scalex input, #uiContainer #scaley input").val("1");

	noty({
		text: 'Imagem recarregada',
		type: 'success',
		layout: 'topRight',
		timeout: 1500
	});
	jQuery("#scaley [type=range]").trigger('input'); //Fix color
    

});

var imgz = new Image;
var canvasTransformations = document.getElementById('canvas-transformations');
var contextTransform = canvasTransformations.getContext('2d');
