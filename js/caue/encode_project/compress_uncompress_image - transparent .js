function getMin(pixels) {
	var first = Math.sqrt(pixels);
	var round = Math.round(first);
	if (first > round)
		return ({width: round+1, height: round});
	else
		return ({width: round, height: round});
}
/*
var myRandomAscii = ["", "p", "q", "7", "#", "z", ":", "Ê", "?", "ú", "@", "j", "È", "T", "D", "Z", "í", "/", "á", "F", "(", "Ó", "X", "U", "M", ",", "Ç", "<", "Ô", "5", " ", "y", "ó", "â", "l", "Ú", "W", "[", "{", "1", "\n", "S", "ô", "s", ">", "f", "3", "ª", "P", "_", "-", "a", "o", "À", "L", "}", "ê", "'", "Q", "R", "Á", "N", "C", "~", "k", ".", "$", "^", "G", "e", "\"", "Y", "9", ")", "ã", "|", "g", "2", "*", "6", "w", "i", "n", "A", "]", "ç", "0", "!", "t", "u", "v", "%", "O", "8", "d", "H", "é", "Â", "E", "h", "\\", "°", "è", "É", "Í", "x", "4", "b", "V", "c", "B", "&", "m", "à", "J", "I", "+", "K", "=", "Ã", "r", ";", "`"];

function getMyChar( whatToGet ) {
    if (!whatToGet) return "";
    
    if (Number.isInteger(whatToGet))
    	return myRandomAscii[whatToGet];
    else if (myRandomAscii.indexOf(whatToGet) !== -1)
    	return myRandomAscii.indexOf(whatToGet);
    else 
    	return false;
}*/

function generateCompressedImageCall() {
	var textareaValue = $('#summernote').summernote('code');
	compressImage(textareaValue);
	$('#closeEncode').trigger('click');
}

function compressImage(text) {
	if (!text) 
		return false;
	
	var pixelArray = [];
	for (var i = 0; i < text.length;) {
		if (text[i])
			var R = text[i++].charCodeAt(0);
		else {
			var R = 0;
			var G = 0;
			var B = 0;
			var A = 255;
			pixelArray.push([R,G,B,A]);
			break;
		}
		if (text[i])
			var G = text[i++].charCodeAt(0);
		else {
			var G = 0;
			var B = 0;
			var A = 255;
			pixelArray.push([R,G,B,A]);
			break;
		}
		if (text[i])
			var B = text[i++].charCodeAt(0);
		else {
			var B = 0;
			var A = 255;
			pixelArray.push([R,G,B,A]);
			break;
		}
		if (text[i])
			var A = text[i++].charCodeAt(0);
		else {
			var A = 255;
			pixelArray.push([R,G,B,A]);
			break;
		}
		//console.log('Character "'+text[i]+'", code:' + character );
		pixelArray.push([R,G,B,A]);
	}

	console.log(pixelArray);
	var textLength = text.length;
	console.log('Quantidade de caracteres: ' + textLength);
	dimensions = getMin(textLength/4);

	//Fill randomly
	while (pixelArray.length < dimensions.height*dimensions.width) {
		R = 0;
		G = 0;
		B = 0;
		pixelArray.push([R,G,B,255]);
	}

	// Putting in image data
	var iData = [];
	for (var i = 0; i < pixelArray.length; i++) {
		iData.push(pixelArray[i][0]);
		iData.push(pixelArray[i][1]);
		iData.push(pixelArray[i][2]);
		iData.push(pixelArray[i][3]);
	}

	var imageData = {height: dimensions.height, width: dimensions.width, data: iData};
	console.log(imageData);

	//console.log(imageData);
	addImage(imageData);

}

function unCompress(imageData) {
    if(!imageData)
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var string = "";
    for (var i = 0; i < imageData.data.length; i++) {
    	//string += getMyChar(imageData.data[i]);
    	if (imageData.data[i] == 0) break;

		string += String.fromCharCode(imageData.data[i]);
    }

    console.log(string);
    return string;
}