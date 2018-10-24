$(document).ready(function(){
    $('.editor-summernote').summernote({
    });
    
    $(window).resize();
});

var myRandomAscii = ["", "p", "q", "7", "#", "z", ":", "Ê", "?", "ú", "@", "j", "È", "T", "D", "Z", "í", "/", "á", "F", "(", "Ó", "X", "U", "M", ",", "Ç", "<", "Ô", "5", " ", "y", "ó", "â", "l", "Ú", "W", "[", "{", "1", "\n", "S", "ô", "s", ">", "f", "3", "ª", "P", "_", "-", "a", "o", "À", "L", "}", "ê", "'", "Q", "R", "Á", "N", "C", "~", "k", ".", "$", "^", "G", "e", "\"", "Y", "9", ")", "ã", "|", "g", "2", "*", "6", "w", "i", "n", "A", "]", "ç", "0", "!", "t", "u", "v", "%", "O", "8", "d", "H", "é", "Â", "E", "h", "\\", "°", "è", "É", "Í", "x", "4", "b", "V", "c", "B", "&", "m", "à", "J", "I", "+", "K", "=", "Ã", "r", ";", "`"];

function getMyChar( whatToGet ) {
    if (!whatToGet) return "";
    
    if (Number.isInteger(whatToGet))
    	return myRandomAscii[whatToGet];
    else if (myRandomAscii.indexOf(whatToGet) !== -1)
    	return myRandomAscii.indexOf(whatToGet);
    else 
    	return false;
}

function generateCodedImageCall() {
	var textareaValue = $('#summernote').summernote('code');
	generateCodedImage(textareaValue);
	$('#closeEncode').trigger('click');
}

$( "li" ).on( "click", "#codify-open", function() {
	
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

function generateCodedImage(text) {
	if (!text) 
		return false;

	var sumToR = randomIntFromInterval(0,127);
	var sumToG = randomIntFromInterval(0,127);
	var sumToB = randomIntFromInterval(0,127);
	//sumToR = sumToG = sumToB;
	console.log('SumTO: '+ sumToR +" " + sumToG +" "+sumToB);
	
	var pixelArray = [];
	for (var i = 0; i < text.length;) {
		if (text[i])
			//var R = text[i++].charCodeAt(0) + sumToR;
			var R = getMyChar(text[i++]) + sumToR;
			//var R = (getMyChar(text[i++]) !== false ) ? getMyChar(text[i++]) + sumToR : sumToR;
		else {
			var R = generateRandomNumberRestriction(sumToR, sumToR+128);
			var G = generateRandomNumberRestriction(sumToG, sumToG+128);
			var B = generateRandomNumberRestriction(sumToB, sumToB+128);
			pixelArray.push([R,G,B,255]);
			break;
		}
		if (text[i])
			//var G = text[i++].charCodeAt(0) + sumToG;
			var G = getMyChar(text[i++]) + sumToG;
			//var G = (getMyChar(text[i++]) !== false ) ? getMyChar(text[i++]) + sumToG : sumToG;
		else {
			var G = generateRandomNumberRestriction(sumToG, sumToG+128);
			var B = generateRandomNumberRestriction(sumToB, sumToB+128);
			pixelArray.push([R,G,B,255]);
			break;
		}
		if (text[i])
			//var B = text[i++].charCodeAt(0) + sumToB;
			var B = getMyChar(text[i++]) + sumToB;
			//var B = (getMyChar(text[i++]) !== false ) ? getMyChar(text[i++]) + sumToB : sumToB;
		else {
			var B = generateRandomNumberRestriction(sumToB, sumToB+128);
			pixelArray.push([R,G,B,255]);
			break;
		}
		//console.log('Character "'+text[i]+'", code:' + character );
		pixelArray.push([R,G,B,255]);
	}

	console.log(pixelArray);

	var textLength = text.length;
	console.log('Quantidade de caracteres: ' + textLength);

	var defaul = (Math.ceil(Math.sqrt(textLength)));
	//var dimensions =  defaul + randomIntFromInterval(parseInt(defaul*0.25), parseInt(defaul * 0.75));
	var dimensions = defaul;
	dimensions = parseInt(dimensions * 4/5);

	console.log('Dimensions: ' + dimensions)

	//Fill randomly
	while (pixelArray.length < dimensions*dimensions - 2) {
		R = generateRandomNumberRestriction(sumToR, sumToR+128);
		G = generateRandomNumberRestriction(sumToG, sumToG+128);
		B = generateRandomNumberRestriction(sumToB, sumToB+128);
		// pixelArray.push([R,G,B,255]);
		var position = randomIntFromInterval(0, pixelArray.length-1);
		pixelArray.splice(position, 0, [R,G,B,255]);
	}

	pixelArray.splice(0, 0, [sumToR + 85,sumToG + 31,sumToB + 20,255]);
	pixelArray.splice(99999999, 0, [sumToR,sumToG,sumToB,255]);

	console.log(pixelArray);


	// Putting in image data
	var iData = [];
	for (var i = 0; i < pixelArray.length; i++) {
		iData.push(pixelArray[i][0]);
		iData.push(pixelArray[i][1]);
		iData.push(pixelArray[i][2]);
		iData.push(pixelArray[i][3]);
	}

	var imageData = {height: dimensions, width: dimensions, data: iData};

	//console.log(imageData);
	addImage(imageData,'Coded');

	function generateRandomNumberRestriction (minNotPerm, maxNotPerm) {
		do {
			generated = randomIntFromInterval(0,255);
		} while (generated >= minNotPerm && generated <= maxNotPerm)
		return generated;
	}

	function randomIntFromInterval(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
}