$( "li" ).on( "click", "#transformations", function() {
	
	canvasTransformations.width = window.innerWidth ;
	canvasTransformations.height = window.innerHeight;

	var imageToTransform = imagesData[primaryImage];
	console.log('Opening Image ' + primaryImage + ' to transform');
	console.log('TESTEEEEEEE');
	if (!imageToTransform) { uploadFirstNotification(); return false; }
	jQuery('#transformations-open').click();
	var widthToPut = window.innerWidth/2 - imageToTransform.width/2;
	var heightToPut = window.innerHeight * 0.35 - imageToTransform.height/2;
	putImageData(contextTransform, imageToTransform, widthToPut , heightToPut, 0, 0, imageToTransform.height, imageToTransform.width);

	jQuery("#scaley [type=range]").trigger('input'); //fix color
	//contextTransform.putImageData(imageToTransform, widthToPut, heightToPut);
});

jQuery('#uiContainer').on('input', 'input[type=text]', function () {
	console.log($(this).val());
	var $fatherDiv = $(this).closest(".gman-widget-outer");
	$( $fatherDiv ).children( "input[type=range]" ).val($(this).val());
	jQuery("#angle [type=range]").trigger('input');

});

jQuery('.transformations-modal').on('click', '#reflect_x', function() {
	console.log('Reflection in X');
	var valueScaleX = jQuery("#scalex input[type=text]").val();
	if (valueScaleX == '-1') {
		jQuery("#scalex input[type=text]").val('1');
		jQuery("#scalex input[type=range]").val('1');
	}
	else  {
		jQuery("#scalex input[type=text]").val('-1');
		jQuery("#scalex input[type=range]").val('-1');
	}
	jQuery("#scalex [type=range]").trigger('input');
});

jQuery('.transformations-modal').on('click', '#reflect_y', function() {
	console.log('Reflection in Y');
	var valueScaleX = jQuery("#scaley input[type=text]").val();
	if (valueScaleX == '-1') {
		jQuery("#scaley input[type=text]").val('1');
		jQuery("#scaley input[type=range]").val('1');
	}
	else  {
		jQuery("#scaley input[type=text]").val('-1');
		jQuery("#scaley input[type=range]").val('-1');
	}
	jQuery("#scaley [type=range]").trigger('input');
});

jQuery('#x, #y, #angle, #scalex, #scaley, #skewx, #skewy').on('input','input[type=range]', function() {
	imgz.src = canvasArray[primaryImage].toDataURL();

	console.log($(this));
	var $fatherDiv = $(this).closest(".gman-widget-outer");
	$( $fatherDiv ).children(".gman-widget-value").children( "input[type=text]" ).val($(this).val());

	imgz.onload = function() {
    	contextTransform.clearRect(0,0,canvasTransformations.width,canvasTransformations.height);
		contextTransform.save();

		//Translating
		var imageToTransform = imagesData[primaryImage];
		var widthToPut = window.innerWidth/2 - imageToTransform.width/2;
		var heightToPut = window.innerHeight * 0.35 - imageToTransform.height/2;
		var dx = parseInt(jQuery('#x input[type=text]').val()) + widthToPut;
		var dy = parseInt(jQuery('#y input[type=text]').val()) + heightToPut;
		console.log({dx, dy});
    	contextTransform.transform( 1,  0,  0,
    							    1, dx, dy);
    	//Rotating
    	var angle = jQuery('#angle input[type=text]').val();
    	angle = angle*Math.PI/180;
    	var c = Math.cos(angle);
    	var s = Math.sin(angle);
    	contextTransform.transform( c,  s, -s,
    					   			c,  0,  0 );

    	//Scaling
    	var sx = jQuery('#scalex input[type=text]').val();
    	var sy = jQuery('#scaley input[type=text]').val();
    	contextTransform.transform(sx,  0,  0, sy,  0,  0)

    	//Skew 
    	var skewony = jQuery('#skewy input[type=text]').val();
    	var skewonx = jQuery('#skewx input[type=text]').val();
    	contextTransform.transform(1,skewony,skewonx,1,0,0);
    	
		contextTransform.drawImage(imgz,0,0);
	    contextTransform.restore();
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
		text: 'Reloaded Image',
		type: 'success',
		layout: 'topRight',
		timeout: 1500
	});
	jQuery("#scaley [type=range]").trigger('input'); //Fix color
    

});

var imgz = new Image;
var canvasTransformations = document.getElementById('canvas-transformations');
var contextTransform = canvasTransformations.getContext('2d');
