


function generateEncryptedAesImageCall() {	

	swal({
			title: 'Define your Password',
			input: 'text',
			inputAttributes: {
			autocapitalize: 'off'
		},
		showCancelButton: true,
		confirmButtonText: 'Generate Image',
		showLoaderOnConfirm: true,
		preConfirm: (password) => {
			console.log(password);
			var textareaValue = $('#summernote').summernote('code');
			generateEncryptedAesImage(textareaValue, password);
			$('#closeEncode').trigger('click');
		},
	})
}

function callGenerate() {
	//var textareaValue = $('#summernote').summernote('code');
	//generateEncryptedAesImage(textareaValue, "123321");
	//$('#closeEncode').trigger('click');
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

	swal({
			title: 'What is your Password?',
			input: 'text',
			inputAttributes: {
			autocapitalize: 'off'
		},
		showCancelButton: true,
		confirmButtonText: 'Generate Image',
		showLoaderOnConfirm: true,
		preConfirm: (password) => {
			console.log(password);
			
			var imageText = decryptAesImageWithImageData(undefined, password);
			if (!imageText) return false
			$("#summernote").summernote("code", imageText);
			$('#summernote').summernote('destroy');
			$('#open-encoder').modal('show');
			$('#open-encoder .btn-primary').hide();
			$('#editSummer').show();
		},
	});

	
}

function decryptAesImageWithImageData(imageData, password) {
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
	var key = key.slice((((stringArray.length+7)**3)%256), ((stringArray.length+7)**3%256)+32);

	if (password) {
		var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
		var z = MD5(password);
		key = [];
		for (var i = 0; i < z.length; i++) {
			key.push(z[i].charCodeAt(0));
		}
	}

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
	var decryptedBytes = aesCtr.decrypt(stringArray);

	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

	if(decryptedText[decryptedText.length - 1].charCodeAt(0) !== 3 && decryptedText[decryptedText.length - 2].charCodeAt(0) !== 2 && decryptedText[decryptedText.length - 3].charCodeAt(0) !== 1)  {
		noty({
			text: 'Not AES encrypted image or wrong password',
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

function generateEncryptedAesImage(text, password) {
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
	var key = key.slice((((text.length+7)**3)%256), ((text.length+7)**3%256)+32);
	//var key = generateRandomArray(500);
	if (password) {
		var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
		var z = MD5(password);
		key = [];
		for (var i = 0; i < z.length; i++) {
			key.push(z[i].charCodeAt(0));
		}
	}
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