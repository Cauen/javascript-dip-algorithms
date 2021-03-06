function generateEncryptedAesImageCall() {
	var textareaValue = $('#summernote').summernote('code');
	generateEncryptedAesImage(textareaValue);
	$('#closeEncode').trigger('click');
}

function generateRandomArray(maxSize) {
	var array = [];
	var string = "";
	for (var i = 0; i < maxSize; i++) {
		var myRandom = Math.floor(Math.random()*(255-0+1)+0);
		string += myRandom+", ";
		array.push(myRandom);
	}
	return array;
	console.log(string);
}

function decryptAesImage() {
	var imageText = decryptAesImageWithImageData();
	if (!imageText) return false
	$("#summernote").summernote("code", imageText);
	$('#summernote').summernote('destroy');
	$('#open-encoder').modal('show');
	$('#open-encoder .btn-primary').hide();
	$('#editSummer').show();
}

function decryptAesImageWithImageData(imageData) {
	if(!imageData)
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var textLengthPlusSalt;
    for (var i = imageData.data.length; i>=0;) {
    	if (imageData.data[--i] !== 255) { //B
    		console.log('A BUG, A NOT WITH 255 VALUE');
    		break;
    	}
    	if (imageData.data[--i] !== 0) { //B
    		textLengthPlusSalt = i;
    		break;
    	}
    	if (imageData.data[--i] !== 0) { //G
    		textLengthPlusSalt = i;
    		break;
    	}
    	if (imageData.data[--i] !== 0) { //R
    		textLengthPlusSalt = i;
    		break;
    	}
    }

    //console.log(textLengthPlusSalt);

    var currentColor = 1;
    var stringArray = [];
    for (var i = 0; i<=textLengthPlusSalt; i++, currentColor++) {
    	if (currentColor == 4) {
    		currentColor = 0;
    		continue;
    	} else
    	if (currentColor == 1) {
    		stringArray.push(imageData.data[i]); // R
    	} else
    	if (currentColor == 2) {
    		stringArray.push(imageData.data[i]); // G
    	} else
    	if (currentColor == 3) {
    		stringArray.push(imageData.data[i]); // B
    	}
    	
    }

    //console.log(stringArray);
    var key = [95, 223, 132, 243, 238, 13, 76, 49, 37, 185, 202, 83, 47, 147, 13, 72, 48, 142, 19, 101, 71, 178, 65, 58, 193, 137, 65, 57, 248, 0, 19, 209, 216, 230, 179, 106, 107, 3, 148, 20, 180, 152, 216, 88, 114, 54, 245, 39, 103, 152, 55, 142, 64, 158, 55, 44, 27, 153, 253, 13, 200, 243, 73, 2, 216, 132, 173, 132, 22, 182, 143, 72, 98, 157, 228, 129, 149, 131, 193, 59, 162, 230, 19, 164, 124, 58, 10, 110, 228, 143, 208, 24, 248, 45, 253, 156, 191, 118, 131, 97, 189, 166, 188, 185, 197, 38, 86, 6, 152, 158, 178, 12, 69, 146, 178, 155, 243, 233, 99, 167, 11, 11, 115, 223, 48, 135, 189, 229, 162, 78, 108, 2, 10, 72, 171, 221, 122, 238, 129, 84, 16, 139, 20, 4, 153, 95, 177, 183, 188, 156, 140, 231, 146, 226, 70, 170, 132, 156, 74, 159, 106, 146, 251, 182, 39, 225, 73, 250, 150, 113, 147, 154, 158, 81, 235, 90, 141, 168, 181, 176, 250, 187, 112, 78, 207, 57, 85, 98, 25, 162, 143, 141, 10, 189, 69, 140, 96, 131, 192, 60, 171, 159, 221, 43, 197, 216, 199, 105, 25, 41, 225, 9, 17, 111, 90, 223, 255, 228, 151, 151, 83, 222, 95, 116, 116, 115, 1, 121, 15, 216, 3, 124, 161, 75, 170, 230, 118, 88, 124, 181, 35, 180, 229, 141, 173, 56, 149, 137, 233, 106, 35, 153, 83, 30, 30, 160, 202, 4, 171, 191, 217, 173, 124, 29, 71, 57, 21, 89, 32, 101, 187, 176, 190, 200, 63, 244, 244, 62, 91, 204, 30, 43, 245, 145, 183, 90, 205, 78, 115, 83, 224, 29, 99, 128, 243, 236, 231, 74, 125, 112, 87, 241, 156, 162, 21, 187, 156, 122, 124, 179, 30, 153, 50, 255, 3, 109, 199, 160, 33, 43, 144, 8, 115, 90, 124, 128, 237, 246, 39, 250, 3, 95, 6, 61, 197, 52, 207, 235, 128, 173, 234, 246, 120, 113, 78, 101, 115, 30, 108, 22, 36, 114, 1, 162, 242, 5, 9, 99, 12, 143, 34, 61, 200, 19, 64, 165, 44, 151, 64, 0, 208, 115, 160, 145, 96, 201, 246, 22, 32, 32, 254, 156, 242, 14, 32, 83, 30, 165, 154, 102, 61, 205, 115, 199, 192, 217, 252, 59, 58, 0, 237, 131, 249, 76, 253, 128, 49, 236, 220, 102, 199, 38, 31, 107, 142, 39, 88, 152, 20, 52, 76, 96, 24, 39, 74, 249, 126, 24, 242, 217, 176, 197, 82, 114, 97, 175, 23, 145, 199, 125, 78, 86, 231, 96, 86, 113, 107, 118, 158, 72, 222, 11, 2, 82, 66, 48, 203, 171, 129, 93, 170, 218, 53, 254, 243, 253, 54, 178, 247, 226, 5, 95, 255, 54, 231, 91, 212, 190, 189, 141, 150, 93, 109, 76, 187, 39, 217, 75, 60, 39, 182, 142, 236, 246, 20, 52, 170, 73, 143, 25, 126, 194, 189, 178, 71, 140, 86, 94, 102, 141, 244, 5];
	//
	var key = key.slice((((stringArray.length+7)**3)%256), ((stringArray.length+7)**3%256)+16);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
	var decryptedBytes = aesCtr.decrypt(stringArray);

	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

	if(decryptedText[decryptedText.length - 1].charCodeAt(0) !== 3 && decryptedText[decryptedText.length - 2].charCodeAt(0) !== 2 && decryptedText[decryptedText.length - 3].charCodeAt(0) !== 1)  {
		noty({
			text: 'Not AES encrypted image',
			type: 'error',
			layout: 'topRight',
			timeout: 1500
		});
		return false;
	}
	

	decryptedText = decryptedText.slice(0, -3);
	console.log(decryptedText);

	return decryptedText;
}

function generateEncryptedAesImage(text) {
	if (!text) 
		return false;

	console.log(text);
	console.log(text.length);

	text += String.fromCharCode(1);
	text += String.fromCharCode(2);
	text += String.fromCharCode(3);
	
	/*AES_Init();

	var block=new Array(text.length);
	for(var i=0;i<text.length;i++){
		block[i]=text.charCodeAt(i);
	}

	console.log(block);

	var key = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
	var key = generateRandomArray(32);
	console.log(key);
	
	AES_ExpandKey(key);
	AES_Encrypt(block, key);
	console.log(block);

	AES_Done();*/

	//---------------------------------------------
	var key = [95, 223, 132, 243, 238, 13, 76, 49, 37, 185, 202, 83, 47, 147, 13, 72, 48, 142, 19, 101, 71, 178, 65, 58, 193, 137, 65, 57, 248, 0, 19, 209, 216, 230, 179, 106, 107, 3, 148, 20, 180, 152, 216, 88, 114, 54, 245, 39, 103, 152, 55, 142, 64, 158, 55, 44, 27, 153, 253, 13, 200, 243, 73, 2, 216, 132, 173, 132, 22, 182, 143, 72, 98, 157, 228, 129, 149, 131, 193, 59, 162, 230, 19, 164, 124, 58, 10, 110, 228, 143, 208, 24, 248, 45, 253, 156, 191, 118, 131, 97, 189, 166, 188, 185, 197, 38, 86, 6, 152, 158, 178, 12, 69, 146, 178, 155, 243, 233, 99, 167, 11, 11, 115, 223, 48, 135, 189, 229, 162, 78, 108, 2, 10, 72, 171, 221, 122, 238, 129, 84, 16, 139, 20, 4, 153, 95, 177, 183, 188, 156, 140, 231, 146, 226, 70, 170, 132, 156, 74, 159, 106, 146, 251, 182, 39, 225, 73, 250, 150, 113, 147, 154, 158, 81, 235, 90, 141, 168, 181, 176, 250, 187, 112, 78, 207, 57, 85, 98, 25, 162, 143, 141, 10, 189, 69, 140, 96, 131, 192, 60, 171, 159, 221, 43, 197, 216, 199, 105, 25, 41, 225, 9, 17, 111, 90, 223, 255, 228, 151, 151, 83, 222, 95, 116, 116, 115, 1, 121, 15, 216, 3, 124, 161, 75, 170, 230, 118, 88, 124, 181, 35, 180, 229, 141, 173, 56, 149, 137, 233, 106, 35, 153, 83, 30, 30, 160, 202, 4, 171, 191, 217, 173, 124, 29, 71, 57, 21, 89, 32, 101, 187, 176, 190, 200, 63, 244, 244, 62, 91, 204, 30, 43, 245, 145, 183, 90, 205, 78, 115, 83, 224, 29, 99, 128, 243, 236, 231, 74, 125, 112, 87, 241, 156, 162, 21, 187, 156, 122, 124, 179, 30, 153, 50, 255, 3, 109, 199, 160, 33, 43, 144, 8, 115, 90, 124, 128, 237, 246, 39, 250, 3, 95, 6, 61, 197, 52, 207, 235, 128, 173, 234, 246, 120, 113, 78, 101, 115, 30, 108, 22, 36, 114, 1, 162, 242, 5, 9, 99, 12, 143, 34, 61, 200, 19, 64, 165, 44, 151, 64, 0, 208, 115, 160, 145, 96, 201, 246, 22, 32, 32, 254, 156, 242, 14, 32, 83, 30, 165, 154, 102, 61, 205, 115, 199, 192, 217, 252, 59, 58, 0, 237, 131, 249, 76, 253, 128, 49, 236, 220, 102, 199, 38, 31, 107, 142, 39, 88, 152, 20, 52, 76, 96, 24, 39, 74, 249, 126, 24, 242, 217, 176, 197, 82, 114, 97, 175, 23, 145, 199, 125, 78, 86, 231, 96, 86, 113, 107, 118, 158, 72, 222, 11, 2, 82, 66, 48, 203, 171, 129, 93, 170, 218, 53, 254, 243, 253, 54, 178, 247, 226, 5, 95, 255, 54, 231, 91, 212, 190, 189, 141, 150, 93, 109, 76, 187, 39, 217, 75, 60, 39, 182, 142, 236, 246, 20, 52, 170, 73, 143, 25, 126, 194, 189, 178, 71, 140, 86, 94, 102, 141, 244, 5];
	//
	var key = key.slice((((text.length+7)**3)%256), ((text.length+7)**3%256)+16);
	//var key = generateRandomArray(500);

	// Convert text to bytes
	var textBytes = aesjs.utils.utf8.toBytes(text);

	var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

	console.log(textBytes);
	var block = aesCtr.encrypt(textBytes);
	console.log(block);

	/*var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	console.log(encryptedHex);

	var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

	var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
	var decryptedBytes = aesCtr.decrypt(encryptedBytes);

	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
	console.log(decryptedText);*/

	//--------------------------------------------------

	var pixelArray = [];
	for (var i = 0; i < block.length;) {
		if (block[i] !== undefined)
			var R = block[i++];
		else {
			var R = 0;
			var G = 0;
			var B = 0;
			pixelArray.push([R,G,B,255]);
			break;
		}
		if (block[i] !== undefined)
			var G = block[i++];
		else {
			var G = 0;
			var B = 0;
			pixelArray.push([R,G,B,255]);
			break;
		}
		if (block[i] !== undefined)
			var B = block[i++];
		else {
			var B = 0;
			pixelArray.push([R,G,B,255]);
			break;
		}
		pixelArray.push([R,G,B,255]);
	}

	var textLength = text.length;
	dimensions = getMin(textLength/3);

	//Fill randomly
	while (pixelArray.length < (dimensions.height*dimensions.width)) {
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

	//console.log(imageData);
	addImage(imageData,'AES');
}