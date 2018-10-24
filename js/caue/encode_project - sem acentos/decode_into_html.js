function decodeImage() {
	var imageText = getCodedImageHtml();
	$("#summernote").summernote("code", imageText);
	$('#summernote').summernote('destroy');
	$('#open-encoder').modal('show');
	$('#generateCoded').hide();
	$('#editSummer').show();
}

function getCodedImageHtml(imageData) {
    if(!imageData)
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    console.log(imageData);
    var randomValueR = (imageData.data[imageData.data.length - 4] == (imageData.data[0] - 31)) ? imageData.data[imageData.data.length - 4] : false;
    var randomValueG = (imageData.data[imageData.data.length - 3] == (imageData.data[1] - 31)) ? imageData.data[imageData.data.length - 3] : false;
    var randomValueB = (imageData.data[imageData.data.length - 2] == (imageData.data[2] - 31)) ? imageData.data[imageData.data.length - 2] : false;
    if (randomValueR !== false && randomValueG !== false && randomValueB !== false) // Can be 0
    	console.log('Coded Image');
    else {
    	console.log('Not coded Image');
    	//return false;
    }

    console.log(randomValueR + " " + randomValueG + " " + randomValueB);

    var string = "";
    
    /*var indexOfArray = 0;
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            if (r > randomValueR && r < randomValueR + 128)
            	var rString = String.fromCharCode(r-randomValueR); 
            var g = imageData.data[indexOfArray++];
            if (g > randomValueG && g < randomValueG + 128)
            	var gString = String.fromCharCode(g-randomValueG); 
            var b = imageData.data[indexOfArray++];
            if (b > randomValueB && b < randomValueB + 128)
            	var bString = String.fromCharCode(b-randomValueB); 
            var a = imageData.data[indexOfArray++];

            if (rString && gString && bString)
            	string += rString + gString + bString;

        }
    }*/

    var indexOfArray = 4;
    // -1 é o ultimo 255
    // -2 é o B, -3 é o G, -4 é o R do pixel que guarda o padrão
    // -5, -6 e -7 serão os últimos pixels
    while (indexOfArray <= imageData.data.length - 5) {
			var r = imageData.data[indexOfArray++];
            if (r > randomValueR && r < (randomValueR + 128))
            	//var rString = getMyChar(r-randomValueR);
            	var rString = String.fromCharCode(r-randomValueR);
            else
                var rString = false;
            var g = imageData.data[indexOfArray++];
            if (g > randomValueG && g < (randomValueG + 128))
            	//var gString = getMyChar(g-randomValueG);
            	var gString = String.fromCharCode(g-randomValueG);
            else
                var gString = false;
            var b = imageData.data[indexOfArray++];
            if (b > randomValueB && b < (randomValueB + 128))
            	//var bString = getMyChar(b-randomValueB);
            	var bString = String.fromCharCode(b-randomValueB);
            else
                var bString = false; 
            indexOfArray++;

            if (rString && gString && bString)
            	string += rString + gString + bString;
            else if ((rString || gString || bString) && (indexOfArray > (imageData.data.length) - 7)) { // Testing if last pixel haves data
            	if (rString) string += rString;
            	if (gString) string += gString;
            	if (bString) string += bString;
            }
    }

    return string;
}