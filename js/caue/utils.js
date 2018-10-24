function getBidimensonalData(imageData) {
	var bidimensional_data = [];
	var indexOfArray = 0;
	if(!imageData) return false;
	for (var y = 0; y < imageData.height; y++) {
		var thisLine = [];
	    for (var x = 0; x < imageData.width; x++) {
			var r = imageData.data[indexOfArray++];
			var g = imageData.data[indexOfArray++];
			var b = imageData.data[indexOfArray++];
			var a = imageData.data[indexOfArray++];
			var pixel = {r,g,b,a};
			thisLine.push(pixel);
	    }
	    bidimensional_data.push(thisLine);
  	}
  	bidimensionalImage = {height: imageData.height, width: imageData.width, data: bidimensional_data};
  	return bidimensionalImage;
}

function getImageDataFromBidimensionalArray(bidimensionalArray) {
	var imageData = {};
	imageData.height = bidimensionalArray.height;
	imageData.width = bidimensionalArray.width;
	imageData.data = [];
	for (var i =0; i<imageData.height; i++) {
		for (var j = 0; j < imageData.width; j++) {
			imageData.data.push(bidimensionalArray.data[i][j].r);
			imageData.data.push(bidimensionalArray.data[i][j].g);
			imageData.data.push(bidimensionalArray.data[i][j].b);
			imageData.data.push(255);
		}
	}
	return imageData;
}

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function randomizePixels(imageData) {

    if(!imageData)
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var indexOfArray = 0;
    if(!imageData) return false;

    var majorArray = [];
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];
            var array = [r,g,b,a];
            majorArray.push(array);

        }
    }

    var newData = [];
    var randomArray = shuffle(majorArray);
    for (var i =0; i<randomArray.length; i++) {
    	newData.push(randomArray[i][0]);
    	newData.push(randomArray[i][1]);
    	newData.push(randomArray[i][2]);
    	newData.push(randomArray[i][3]);
    }

    function shuffle(array) {
    	var m = array.length, t, i;

		  // While there remain elements to shuffle…
	  	while (m) {

		    // Pick a remaining element…
		    i = Math.floor(Math.random() * m--);

		    // And swap it with the current element.
		    t = array[m];
		    array[m] = array[i];
		    array[i] = t;
		}

		return array;
	}

    var image = {height: imageData.height, width: imageData.width, data: newData};
  	return image;
} 