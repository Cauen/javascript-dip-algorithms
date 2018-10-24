function isTheSameImage(image1Data, image2Data) {
	var image1Data = image1Data ? image1Data : imagesData[primaryImage];
    var image2Data = image2Data ? image2Data : imagesData[secundaryImage];
    if (!image1Data || !image2Data) { uploadFirstNotification(); return false; }

	if (image1Data.width == image2Data.width && image1Data.height == image2Data.height) {
		console.log(image1Data);
			console.log(image2Data);
		if (image1Data.data.length === image2Data.data.length && image1Data.data.every(function(value, index) { return value === image2Data.data[index]}))//(image1Data.data == image2Data.data) {
		{	
			swal("Same image!", "All pixels are the same", "success");

		} else {
			swal("Different Images", "Same size but different images", "warning");
		}
		
	} else {
		swal({
		  type: 'error',
		  title: 'Different Images',
		  text: 'Sizes not equal!',
		})
	}
} 

function whiteAndBlack(imageData) {

    if(!imageData)
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var indexOfArray = 0;
    if(!imageData) return false;

    var white = 0, black = 0;
    //Setting max and mins
    var maxR = -Infinity; var maxG = -Infinity; var maxB = -Infinity; var minR = Infinity ; var minG = Infinity ; var minB = Infinity ; //To Normalize
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            if(r > 254 && g > 254 && b > 254)
        		white++;

        	if(r < 1 && g < 1 && b < 1)
        		black++;


        }
    }
    var pixelsQnt = imageData.width * imageData.height;
    console.log({black: black, white: white, bPercent: (black/pixelsQnt*100 + "%"),wPercent: (white/pixelsQnt*100 + "%")});
} 

function isBlackAndWhiteImage (imageData, informFlag) {
    var imageData = imageData ? imageData : imagesData[primaryImage];
    if (!imageData) { uploadFirstNotification(); return false; }

    var indexOfArray = 0;
    var differentComponents = 0;
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];
            if(isNaN(r) || (isNaN(g) || isNaN(b)))
                break;
            if (!(r == g && g == b)) {
                if (informFlag)
                    swal(
                      'Colored Image!',
                      'The components of some pixel are different',
                      'error'
                    );
                console.log(imageData);
                console.log('R: ' + r + ", G: " + g + ", B: "+b);
                return false;
            }
        }
    }
    if(informFlag)
        swal(
          'Black and White image!',
          'All pixels have the same components',
          'success'
        )
    return true;
}

function calligraphy_effect (imageData) {
    //That was a error in Kirsh Algorithm
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            maskResult = [];
            maskResult[0] = convolutionMask(x,y,[[-1,-1,5],[0,-1,-3],[1,-1,-3],[-1,0,5],[1,0,-3],[-1,1,5],[0,1,-3],[1,1,-3]]);
            maskResult[1] = convolutionMask(x,y,[[-1,-1,-3],[0,-1,-3],[1,-1,-3],[-1,0,5],[1,0,-3],[-1,1,5],[0,1,5],[1,1,-3]]);
            maskResult[2] = convolutionMask(x,y,[[-1,-1,-3],[0,-1,-3],[1,-1,-3],[-1,0,-3],[1,0,-3],[-1,1,5],[0,1,5],[1,1,5]]);
            maskResult[3] = convolutionMask(x,y,[[-1,-1,-3],[0,-1,-3],[1,-1,-3],[-1,0,-3],[1,0,5],[-1,1,-3],[0,1,5],[1,1,5]]);
            maskResult[4] = convolutionMask(x,y,[[-1,-1,-3],[0,-1,-3],[1,-1,5],[-1,0,-3],[1,0,5],[-1,1,-3],[0,1,-3],[1,1,5]]);
            maskResult[5] = convolutionMask(x,y,[[-1,-1,-3],[0,-1,5],[1,-1,5],[-1,0,-3],[1,0,5],[-1,1,-3],[0,1,-3],[1,1,-3]]);
            maskResult[6] = convolutionMask(x,y,[[-1,-1,5],[0,-1,5],[1,-1,5],[-1,0,-3],[1,0,-3],[-1,1,-3],[0,1,-3],[1,1,-3]]);
            maskResult[7] = convolutionMask(x,y,[[-1,-1,5],[0,-1,5],[1,-1,-3],[-1,0,5],[1,0,-3],[-1,1,-3],[0,1,-3],[1,1,-3]]);
            var sumComponentsArray = maskResult.map((e) => (e.sumOfR + e.sumOfG + e.sumOfB));
            var max = Math.max.apply(null,sumComponentsArray);
            var indexOfBigger = sumComponentsArray.indexOf(max);

            bidimensionalCopy.data[y][x].r = maskResult[indexOfBigger].sumOfR;
            bidimensionalCopy.data[y][x].g = maskResult[indexOfBigger].sumOfG;
            bidimensionalCopy.data[y][x].b = maskResult[indexOfBigger].sumOfB;
            bidimensionalCopy.data[y][x].a = 255;
        }
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function visionBreaker (imageData, value) {
    if(!imageData)
        imageData = imagesData[primaryImage];
    if(!imageData) {
        uploadFirstNotification();
        return false;
    }

    var ComponentsArray = [];
    var pos = 0;
    var finalPixel;
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var thisPixel = imageData.data[pos++];
            if (thisPixel <= value)
                finalPixel = 0; 
            else
                finalPixel = 255;
            Array.prototype.push.apply(ComponentsArray, [finalPixel,finalPixel,finalPixel,255]);
        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);
}