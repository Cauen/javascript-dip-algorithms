function callFilter () {
    var imageData = imagesData[primaryImage];
    if (!imageData) { uploadFirstNotification(); return false; }

    swal({
        title: 'Setup Configs',
        type: 'question',
        html:
        '<label>Filter name</label><select class="form-control" id="filterName"><option value="AVERAGE">Average</option><option default value="MEDIAN">Median</option><option value="MODE">Mode</option><option value="MAX">Max</option><option value="MIN">Min</option></select><p>Average, Median, Mode, Max and Min</p><label>Convolution Height</label><input value="3" id="convHeight" class="swal2-input"><label>Convolution Width</label><input value="3" id="convWidth" class="swal2-input"><br><span>Leave empty to average</span>',
        focusConfirm: false,
        preConfirm: () => {
            var filterName = $("#filterName").val();
            var convHeight = $("#convHeight").val();
            var convWidth = $("#convWidth").val();
            lowPassFilters(imageData, convHeight, convWidth, filterName);
        },
        onOpen: () => {
            $('.swal2-popup').on('keydown', function(e) {
                if (e.keyCode == 13) {
                    $(".swal2-confirm").trigger('click');
                }
            });
        },
    });
}

function lowPassFilters (imageData, heightFilter, widthFilter, typeOfFilter) { //Postfix = 255 a -
	if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    typeOfFilter = typeOfFilter.toUpperCase();

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    //console.log(bidimensionalImage);


    var convArray = [];
    var convHeight = heightFilter;
    var convWidth = widthFilter;
    for (var convRow = 0; convRow < convHeight; convRow++) {
        var thisRow = [];
        for (var convColumn = 0; convColumn < convWidth; convColumn++) {
            thisRow.push(1);
        }
        convArray.push(thisRow);
    }
    var heightPosToSet = parseInt((convHeight-1)/2);
    var widthPosToSet = parseInt((convWidth-1)/2);
    console.log('Pixel do centro: ' + heightPosToSet + " " + widthPosToSet);
	
	var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];
            for (var convY = 0; convY < convHeight; convY++) {
                for (var convX = 0; convX < convWidth; convX++) {
                	var thisRow = bidimensionalImage.data[y + convY - heightPosToSet];
                	if (thisRow) {
                		var thisPixelOfConv = thisRow[x + convX - widthPosToSet];
						if (thisPixelOfConv)
							pixelNeighborhoodArray.push(thisPixelOfConv);
                	} else { // If nightboor goes out of array
                		//convX = convWidth; //Break internal loop
                		break;
                	}
                }
            }

            //Separating arrays
            var pixelNeighborhoodArrayRedComponent      = [];
            var pixelNeighborhoodArrayGreenComponent    = [];
            var pixelNeighborhoodArrayBlueComponent     = [];
            for (var pixel = 0; pixel<pixelNeighborhoodArray.length; pixel++) {
                pixelNeighborhoodArrayRedComponent.push(parseInt(pixelNeighborhoodArray[pixel].r));
                pixelNeighborhoodArrayGreenComponent.push(parseInt(pixelNeighborhoodArray[pixel].g));
                pixelNeighborhoodArrayBlueComponent.push(parseInt(pixelNeighborhoodArray[pixel].b));
            }

            var resultPixel;
            //Working with neighborhood
            switch (typeOfFilter) {
                case 'MODE':
                    resultPixelR = arr.modes(pixelNeighborhoodArrayRedComponent);
                    resultPixelG = arr.modes(pixelNeighborhoodArrayGreenComponent);
                    resultPixelB = arr.modes(pixelNeighborhoodArrayBlueComponent);
                    break;
                case 'MEDIAN':
                    resultPixelR = arr.median(pixelNeighborhoodArrayRedComponent);
                    resultPixelG = arr.median(pixelNeighborhoodArrayGreenComponent);
                    resultPixelB = arr.median(pixelNeighborhoodArrayBlueComponent);
                    break;
                case 'MAX':
                    resultPixelR = arr.max(pixelNeighborhoodArrayRedComponent);
                    resultPixelG = arr.max(pixelNeighborhoodArrayGreenComponent);
                    resultPixelB = arr.max(pixelNeighborhoodArrayBlueComponent);
                    break;
                case 'MIN':
                    resultPixelR = arr.min(pixelNeighborhoodArrayRedComponent);
                    resultPixelG = arr.min(pixelNeighborhoodArrayGreenComponent);
                    resultPixelB = arr.min(pixelNeighborhoodArrayBlueComponent);
                    break;

                default: 
                    resultPixelR = arr.mean(pixelNeighborhoodArrayRedComponent);
                    resultPixelG = arr.mean(pixelNeighborhoodArrayGreenComponent);
                    resultPixelB = arr.mean(pixelNeighborhoodArrayBlueComponent);
                    //console.log([resultPixelR, resultPixelG,resultPixelB]);

                    break;
            }
	        
			Array.prototype.push.apply(ComponentsArray, [parseInt(resultPixelR),parseInt(resultPixelG),parseInt(resultPixelB),255]);
            //console.log(pixelNeighborhoodArray);
        }
        console.log(imageData);
    }


    
    //console.log(convArray);

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
	addImage(ComponentsData);
}

function kuwahara3Colors(imageData, k) {
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    k = k - 1;

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];

            var varianceRed;
            var averageOfMinRed;
            // first mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            //console.log(pixelNeighborhoodArray);
            varianceRed = arr.variance(pixelNeighborhoodArray);
            averageOfMinRed = arr.mean(pixelNeighborhoodArray);

            var pixelNeighborhoodArray = [];
            // second mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceRed > arr.variance(pixelNeighborhoodArray)) {
                varianceRed = arr.variance(pixelNeighborhoodArray);
                averageOfMinRed = arr.mean(pixelNeighborhoodArray);
            }
            

            var pixelNeighborhoodArray = [];
            // third mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceRed > arr.variance(pixelNeighborhoodArray)) {
                varianceRed = arr.variance(pixelNeighborhoodArray);
                averageOfMinRed = arr.mean(pixelNeighborhoodArray);
            }

            var pixelNeighborhoodArray = [];
            // fourth mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceRed > arr.variance(pixelNeighborhoodArray)) {
                varianceRed = arr.variance(pixelNeighborhoodArray);
                averageOfMinRed = arr.mean(pixelNeighborhoodArray);
            }

            var varianceGreen;
            var averageOfMinGreen;
            var pixelNeighborhoodArray = [];
            // first mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            //console.log(pixelNeighborhoodArray);
            varianceGreen = arr.variance(pixelNeighborhoodArray);
            averageOfMinGreen = arr.mean(pixelNeighborhoodArray);

            var pixelNeighborhoodArray = [];
            // second mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceGreen > arr.variance(pixelNeighborhoodArray)) {
                varianceGreen = arr.variance(pixelNeighborhoodArray);
                averageOfMinGreen = arr.mean(pixelNeighborhoodArray);
            }
            

            var pixelNeighborhoodArray = [];
            // third mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceGreen > arr.variance(pixelNeighborhoodArray)) {
                varianceGreen = arr.variance(pixelNeighborhoodArray);
                averageOfMinGreen = arr.mean(pixelNeighborhoodArray);
            }

            var pixelNeighborhoodArray = [];
            // fourth mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceGreen > arr.variance(pixelNeighborhoodArray)) {
                varianceGreen = arr.variance(pixelNeighborhoodArray);
                averageOfMinGreen = arr.mean(pixelNeighborhoodArray);
            }

            var pixelNeighborhoodArray = [];
            var varianceBlue;
            var averageOfMinBlue;
            // first mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            //console.log(pixelNeighborhoodArray);
            varianceBlue = arr.variance(pixelNeighborhoodArray);
            averageOfMinBlue = arr.mean(pixelNeighborhoodArray);

            var pixelNeighborhoodArray = [];
            // second mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceBlue > arr.variance(pixelNeighborhoodArray)) {
                varianceBlue = arr.variance(pixelNeighborhoodArray);
                averageOfMinBlue = arr.mean(pixelNeighborhoodArray);
            }
            

            var pixelNeighborhoodArray = [];
            // third mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceBlue > arr.variance(pixelNeighborhoodArray)) {
                varianceBlue = arr.variance(pixelNeighborhoodArray);
                averageOfMinBlue = arr.mean(pixelNeighborhoodArray);
            }

            var pixelNeighborhoodArray = [];
            // fourth mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianceBlue > arr.variance(pixelNeighborhoodArray)) {
                varianceBlue = arr.variance(pixelNeighborhoodArray);
                averageOfMinBlue = arr.mean(pixelNeighborhoodArray);
            }

            Array.prototype.push.apply(ComponentsArray, [averageOfMinRed,averageOfMinGreen,averageOfMinBlue,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

}  

function kuwahara(imageData, k) {
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    k = k - 1;

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];

            var varianc;
            var averageOfMin;
            // first mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            //console.log(pixelNeighborhoodArray);
            varianc = arr.variance(pixelNeighborhoodArray);
            averageOfMin = arr.mean(pixelNeighborhoodArray);

            var pixelNeighborhoodArray = [];
            // second mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMin = arr.mean(pixelNeighborhoodArray);
            }
            

            var pixelNeighborhoodArray = [];
            // third mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMin = arr.mean(pixelNeighborhoodArray);
            }

            var pixelNeighborhoodArray = [];
            // fourth mask
            for (var convY = 0; convY < k; convY++) {
                for (var convX = 0; convX < k; convX++) {
                    var thisRow = bidimensionalImage.data[y + k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + k + convX];
                        if (thisPixelOfConv)
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    }
                }
            }
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMin = arr.mean(pixelNeighborhoodArray);
            }

            Array.prototype.push.apply(ComponentsArray, [averageOfMin,averageOfMin,averageOfMin,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

}

function callKuwahara() {
    var imageData = imagesData[primaryImage];
    if (!imageData) { uploadFirstNotification(); return false; }

    swal({
        title: 'Kuwahara',
        type: 'question',
        html:
        '<label>K</label><input value="3" id="kKuwahara" class="swal2-input"><br><span>Leave empty to k = 3</span>',
        focusConfirm: false,
        preConfirm: () => {
            var kKuwahara = $("#kKuwahara").val();
            kuwahara3Colorsv2(imageData, kKuwahara);
        },
        onOpen: () => {
            $('.swal2-popup').on('keydown', function(e) {
                if (e.keyCode == 13) {
                    $(".swal2-confirm").trigger('click');
                }
            });
        },
    });
}

function kuwahara3Colorsv2(imageData, k) {
    var t0 = performance.now();

    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    k = k - 1;

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];

            var varianc;
            var averageOfMin;
            // first mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                    } else {
                        break;
                    }
                }
            }
            //console.log("1: " + pixelNeighborhoodArray);
            varianc = arr.variance(pixelNeighborhoodArray);
            averageOfMinR = arr.mean(neighRed);
            averageOfMinG = arr.mean(neighGreen);
            averageOfMinB = arr.mean(neighBlue);

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // second mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y - k + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                    } else {
                        break;
                    }
                }
            }
            //console.log("2: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }
            

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // third mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                    } else {
                        break;
                    }
                }
            }
            //console.log("3: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // fourth mask
            for (var convY = 0; convY <= k; convY++) {
                for (var convX = 0; convX <= k; convX++) {
                    var thisRow = bidimensionalImage.data[y + convY];
                    if (thisRow) {
                        var thisPixelOfConv = thisRow[x + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                    } else {
                        break;
                    }
                }
            }
            //console.log("4: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }

            Array.prototype.push.apply(ComponentsArray, [averageOfMinR,averageOfMinG,averageOfMinB,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

}  

function tomitaTisuji(imageData, k) {

    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    k = k - 1;

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];

            var varianc;
            var averageOfMin;
            // first mask
            for (var convY = 0; convY <= k; convY++) {
                var thisRow = bidimensionalImage.data[y - k + convY];
                if (thisRow) {
                    for (var convX = 0; convX <= k; convX++) {                        
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                    }
                }
            }
            //console.log("1: " + pixelNeighborhoodArray);
            varianc = arr.variance(pixelNeighborhoodArray);
            averageOfMinR = arr.mean(neighRed);
            averageOfMinG = arr.mean(neighGreen);
            averageOfMinB = arr.mean(neighBlue);

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // second mask
            for (var convY = 0; convY <= k; convY++) {
                var thisRow = bidimensionalImage.data[y - k + convY];
                if (thisRow) {
                    for (var convX = 0; convX <= k; convX++) {
                        
                            var thisPixelOfConv = thisRow[x + convX];
                            if (thisPixelOfConv) {
                                pixelNeighborhoodArray.push(thisPixelOfConv.r);
                                neighRed.push(thisPixelOfConv.r);
                                neighGreen.push(thisPixelOfConv.g);
                                neighBlue.push(thisPixelOfConv.b);
                            }
                        
                    }
                }
            }
            //console.log("2: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }
            

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // third mask
            for (var convY = 0; convY <= k; convY++) {
                var thisRow = bidimensionalImage.data[y + convY];
                if (thisRow) {
                    for (var convX = 0; convX <= k; convX++) {
                        
                        var thisPixelOfConv = thisRow[x - k + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                        
                    }
                }
            }
            //console.log("3: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // fourth mask
            for (var convY = 0; convY <= k; convY++) {
                var thisRow = bidimensionalImage.data[y + convY];
                if (thisRow) {
                    for (var convX = 0; convX <= k; convX++) {
                        var thisPixelOfConv = thisRow[x + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                        
                    }
                }
            }
            //console.log("4: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }

            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];
            // fourth mask
            for (var convY = 0; convY <= k; convY++) {
                var thisRow = bidimensionalImage.data[y - parseInt(k/2) + convY];
                if (thisRow) {
                    for (var convX = 0; convX <= k; convX++) {
                        var thisPixelOfConv = thisRow[x - parseInt(k/2) + convX];
                        if (thisPixelOfConv) {
                            pixelNeighborhoodArray.push(thisPixelOfConv.r);
                            neighRed.push(thisPixelOfConv.r);
                            neighGreen.push(thisPixelOfConv.g);
                            neighBlue.push(thisPixelOfConv.b);
                        }
                        
                    }
                }
            }
            //console.log("5: " + pixelNeighborhoodArray);
            if (varianc > arr.variance(pixelNeighborhoodArray)) {
                varianc = arr.variance(pixelNeighborhoodArray);
                averageOfMinR = arr.mean(neighRed);
                averageOfMinG = arr.mean(neighGreen);
                averageOfMinB = arr.mean(neighBlue);
            }

            Array.prototype.push.apply(ComponentsArray, [averageOfMinR,averageOfMinG,averageOfMinB,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

}  

function nagaoeMatsuyama() {
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js

    var masks =     [
                        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]],
                        [[-2,-1],[-2,0],[-2,1],[-1,-1],[-1,0],[-1,1],[0,0]],
                        [[-1,1],[-1,2],[0,0],[0,1],[0,2],[1,1],[1,2]],
                        [[0,0],[1,-1],[1,0],[1,1],[2,-1],[2,0],[2,1]],
                        [[-1,-2],[-1,-1],[0,-2],[0,-1],[0,0],[1,-2],[1,-1]],
                        [[-2,-2],[-2,-1],[-1,-2],[-1,-1],[-1,0],[0,-1],[0,0]],
                        [[-2,1],[-2,2],[-1,0],[-1,1],[-1,2],[0,0],[0,1]],
                        [[0,0],[0,1],[1,0],[1,1],[1,2],[2,1],[2,2]],
                        [[0, -1],[0,0],[1,-2],[1,-1],[1,0],[2,-2],[2,-1]],
                    ];

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];

            var averages = getMinRGBofArrayOfMaks(x, y);
            var averageOfMinR = averages.averageR;
            var averageOfMinG = averages.averageG;
            var averageOfMinB = averages.averageB;
            /* 1 MASK BEFORE FUNCTIONS { 
                if (thisPixelOfConv = bidimensionalImage.data[y][x]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y-1][x-1]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y-1][x]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y-1][x+1]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y][x-1]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y][x]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y][x+1]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y+1][x-1]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y+1][x]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }
                if (thisPixelOfConv = bidimensionalImage.data[y+1][x+1]) { 
                    pixelNeighborhoodArray.push(thisPixelOfConv.r);
                    neighRed.push(thisPixelOfConv.r);
                    neighGreen.push(thisPixelOfConv.g);
                    neighBlue.push(thisPixelOfConv.b); 
                }  }*/

            Array.prototype.push.apply(ComponentsArray, [averageOfMinR,averageOfMinG,averageOfMinB,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

    function getNeighborhoodArrayOfMask (maskArray,x,y) {
        //loop inside all mask
        var neighRed = [];
        var neighGreen = [];
        var neighBlue = [];
        for(var i = 0; i < maskArray.length; i++) {
            var thisRow = bidimensionalImage.data[y+maskArray[i][0]];
            if (thisRow) {
                var thisPixel = thisRow[x+maskArray[i][1]];
                if (thisPixel) {
                    neighRed.push(thisPixel.r);
                    neighGreen.push(thisPixel.g);
                    neighBlue.push(thisPixel.b);
                }
            }
            else
                continue;
        
        }

        return {nr: neighRed, ng: neighGreen, nb: neighBlue};
    }

    function getMinRGBofArrayOfMaks (x, y) {
        var averageOfMinR;
        var averageOfMinG;
        var averageOfMinB;
        var minVariance = Infinity;

        for (var i =0; i<masks.length; i++){
            var neighborhood = getNeighborhoodArrayOfMask(masks[i], x, y);
            if (minVariance > arr.variance(neighborhood.nr)) {
                minVariance = arr.variance(neighborhood.nr);
                averageOfMinR = arr.mean(neighborhood.nr);
                averageOfMinG = arr.mean(neighborhood.ng);
                averageOfMinB = arr.mean(neighborhood.nb);
            }
        }

        return {averageR: averageOfMinR, averageG: averageOfMinG, averageB: averageOfMinB}
    }

}  

function somboonkaew() {
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js

    var masks = [
                    [[-2,-2],[-1,-1],[-1,1],[0,0],[1,-1],[1,1],[2,2]],
                    [[-2,2],[-1,-1],[-1,1],[0,0],[1,-1],[1,1],[2,-2]],
                    [[-1,0],[0,-2],[0,-1],[0,0],[0,1],[0,2],[1,0]],
                    [[-2,0],[-1,0],[0,-1],[0,0],[0,1],[1,0],[2,0]],
                    [[-1,-1],[-1,0],[-1,1],[0,0],[1,-1],[1,0],[1,1]],
                    [[-1,-1],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,1]],
                    [[-1,-1],[-1,0],[0,-1],[0,0],[0,1],[1,0],[1,1]],
                    [[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0]],
                    [[-1,0],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]],
                    [[-1,-1],[-1,,],[0,-1],[0,0],[0,1],[1,-1],[1,0]],
                    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,0]],
                    [[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,0],[1,1]],
                ];

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];

            var averages = getMinRGBofArrayOfMaks(x, y);
            var averageOfMinR = averages.averageR;
            var averageOfMinG = averages.averageG;
            var averageOfMinB = averages.averageB;
            Array.prototype.push.apply(ComponentsArray, [averageOfMinR,averageOfMinG,averageOfMinB,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

    function getNeighborhoodArrayOfMask (maskArray,x,y) {
        //loop inside all mask
        var neighRed = [];
        var neighGreen = [];
        var neighBlue = [];
        for(var i = 0; i < maskArray.length; i++) {
            var thisRow = bidimensionalImage.data[y+maskArray[i][0]];
            if (thisRow) {
                var thisPixel = thisRow[x+maskArray[i][1]];
                if (thisPixel) {
                    neighRed.push(thisPixel.r);
                    neighGreen.push(thisPixel.g);
                    neighBlue.push(thisPixel.b);
                }
            }
            else
                continue;
        
        }

        return {nr: neighRed, ng: neighGreen, nb: neighBlue};
    }

    function getMinRGBofArrayOfMaks (x, y) {
        var averageOfMinR;
        var averageOfMinG;
        var averageOfMinB;
        var minVariance = Infinity;

        for (var i =0; i<masks.length; i++){
            var neighborhood = getNeighborhoodArrayOfMask(masks[i], x, y);
            if (minVariance > arr.variance(neighborhood.nr)) {
                minVariance = arr.variance(neighborhood.nr);
                averageOfMinR = arr.mean(neighborhood.nr);
                averageOfMinG = arr.mean(neighborhood.ng);
                averageOfMinB = arr.mean(neighborhood.nb);
            }
        }

        return {averageR: averageOfMinR, averageG: averageOfMinG, averageB: averageOfMinB}
    }

}  

function convolver (mask, t) {
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js

    //var m1 = [[-1,-1,-1],[-1,0,-1],[-1,1,-1],[0,-1,-1],[0,0,9],[0,1,-1],[1,-1,-1],[1,0,-1],[1,1,-1]];
    //var m2 = [[-1,-1,1],[-1,0,-2],[-1,1,1],[0,-1,-2],[0,0,5],[0,1,-2],[1,-1,1],[1,0,-2],[1,1,1]];
    //var m3 = [[-1,-1,0],[-1,0,-1],[-1,1,0],[0,-1,-1],[0,0,5],[0,1,-1],[1,-1,0],[1,0,-1],[1,1,0]];

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            var pixelNeighborhoodArray = [];
            var neighRed = [];
            var neighGreen = [];
            var neighBlue = [];

            var filtered = convolutionMask(x, y, mask);
            var averageOfMinR = filtered.sumOfR;
            var averageOfMinG = filtered.sumOfG;
            var averageOfMinB = filtered.sumOfB;

            if (t) {
                (averageOfMinR > t) ? averageOfMinR = averageOfMinR : averageOfMinR = 0;
                (averageOfMinG > t) ? averageOfMinG = averageOfMinG : averageOfMinG = 0;
                (averageOfMinB > t) ? averageOfMinB = averageOfMinB : averageOfMinB = 0;
            }
            Array.prototype.push.apply(ComponentsArray, [averageOfMinR,averageOfMinG,averageOfMinB,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);

    
}

function convolutionMask (x, y, mask) {
        var neighRed = [];
        var neighGreen = [];
        var neighBlue = [];

        //Search neighboors and add to array to sum
        for(var i = 0; i < mask.length; i++) {
            var thisRow = bidimensionalImage.data[y+mask[i][0]];
            if (thisRow) {
                var thisPixel = thisRow[x+mask[i][1]];
                var multiplication = mask[i][2];
                if (thisPixel) {
                    neighRed.push(thisPixel.r * multiplication);
                    neighGreen.push(thisPixel.g * multiplication);
                    neighBlue.push(thisPixel.b * multiplication);
                }
            }
            else
                continue;
        
        }

        //Calculating sum
        sumOfRNeighs = parseInt(arr.sum(neighRed));
        sumOfGNeighs = parseInt(arr.sum(neighGreen));
        sumOfBNeighs = parseInt(arr.sum(neighBlue));

        //Return sum of mask
        return {sumOfR: sumOfRNeighs, sumOfG: sumOfGNeighs, sumOfB: sumOfBNeighs}
    }

function halftone2x2 (mask) {
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y = y + 2) { // Each line
        for (var x = 0; x < imageData.width; x = x + 2) { // Each Column (pixel)
            var blockArray = [];
            if (bidimensionalImage.data[y]) {
                if (bidimensionalImage.data[y][x]) 
                    blockArray.push(bidimensionalImage.data[y][x].r); 
                if (bidimensionalImage.data[y][x+1]) 
                    blockArray.push(bidimensionalImage.data[y][x+1].r); 
            }
            if (bidimensionalImage.data[y+1]) {
                if (bidimensionalImage.data[y+1][x]) 
                    blockArray.push(bidimensionalImage.data[y+1][x].r); 
                if (bidimensionalImage.data[y+1][x+1]) 
                    blockArray.push(bidimensionalImage.data[y+1][x+1].r); 
            }
            var average = arr.mean(blockArray);
            if (average >= 0 && average <51) {
                setColor(0,x,y);
                setColor(0,x+1,y);
                setColor(0,x,y+1);
                setColor(0,x+1,y+1);
            }
            if (average >= 51 && average <102) {
                setColor(0,x,y);
                setColor(0,x+1,y);
                setColor(255,x,y+1);
                setColor(0,x+1,y+1);
            }
            if (average >= 102 && average <163) {
                setColor(0,x,y);
                setColor(255,x+1,y);
                setColor(255,x,y+1);
                setColor(0,x+1,y+1);
            }
            if (average >= 163 && average <204) {
                setColor(0,x,y);
                setColor(255,x+1,y);
                setColor(255,x,y+1);
                setColor(255,x+1,y+1);
            }
            if (average >= 204 && average <=255) {
                setColor(255,x,y);
                setColor(255,x+1,y);
                setColor(255,x,y+1);
                setColor(255,x+1,y+1);
            }

        }
    }

    function setColor(c,x,y) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r = c;
        bidimensionalCopy.data[y][x].g = c;
        bidimensionalCopy.data[y][x].b = c;
        bidimensionalCopy.data[y][x].a = 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function highBoost() {
    swal({
            title: 'What is your amplification?',
            input: 'text',
            inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Generate Image',
        showLoaderOnConfirm: true,
        preConfirm: (amplification) => {
            console.log(amplification);
            convolver([[-1,-1,-1],[-1,0,-1],[-1,1,-1],[0,-1,-1],[0,0,(9*amplification - 1)],[0,1,-1],[1,-1,-1],[1,0,-1],[1,1,-1]]);
        },
    });
    
}

function dotsDetection() {
    swal({
            title: 'What is your a?',
            input: 'text',
            inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Generate Image',
        showLoaderOnConfirm: true,
        preConfirm: (t) => {
            console.log(t);
            convolver([[-1,-1,-1],[-1,0,-1],[-1,1,-1],[0,-1,-1],[0,0,8],[0,1,-1],[1,-1,-1],[1,0,-1],[1,1,-1]], t);
        },
    });
}

function halftone3x2 (mask) {
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y = y + 2) { // Each line
        for (var x = 0; x < imageData.width; x = x + 3) { // Each Column (pixel)
            var blockArray = [];
            if (bidimensionalImage.data[y]) {
                if (bidimensionalImage.data[y][x]) 
                    blockArray.push(bidimensionalImage.data[y][x].r); 
                if (bidimensionalImage.data[y][x+1]) 
                    blockArray.push(bidimensionalImage.data[y][x+1].r); 
                if (bidimensionalImage.data[y][x+2]) 
                    blockArray.push(bidimensionalImage.data[y][x+2].r); 
            }
            if (bidimensionalImage.data[y+1]) {
                if (bidimensionalImage.data[y+1][x]) 
                    blockArray.push(bidimensionalImage.data[y+1][x].r); 
                if (bidimensionalImage.data[y+1][x+1]) 
                    blockArray.push(bidimensionalImage.data[y+1][x+1].r); 
                if (bidimensionalImage.data[y+1][x+2]) 
                    blockArray.push(bidimensionalImage.data[y+1][x+2].r); 
            }
            var average = arr.mean(blockArray);
            if (average >= 0 && average <36) {
                setColor(0,x,y);
                setColor(0,x+1,y);
                setColor(0,x,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y);
                setColor(0,x+2,y+1);
            }
            if (average >= 36 && average <72) {
                setColor(0,x,y);
                setColor(0,x+1,y);
                setColor(255,x,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y);
                setColor(0,x+2,y+1);
            }
            if (average >= 72 && average <108) {
                setColor(0,x,y);
                setColor(0,x+1,y);
                setColor(255,x,y+1);
                setColor(0,x+1,y+1);
                setColor(255,x+2,y);
                setColor(0,x+2,y+1);
            }
            if (average >= 108 && average <144) {
                setColor(255,x,y);
                setColor(0,x+1,y);
                setColor(255,x,y+1);
                setColor(0,x+1,y+1);
                setColor(255,x+2,y);
                setColor(0,x+2,y+1);
            }
            if (average >= 144 && average <181) {
                setColor(255,x,y);
                setColor(0,x+1,y);
                setColor(255,x,y+1);
                setColor(255,x+1,y+1);
                setColor(255,x+2,y);
                setColor(0,x+2,y+1);
            }
            if (average >= 181 && average <217) {
                setColor(255,x,y);
                setColor(0,x+1,y);
                setColor(255,x,y+1);
                setColor(255,x+1,y+1);
                setColor(255,x+2,y);
                setColor(255,x+2,y+1);
            }
            if (average >= 217 && average <= 255) {
                setColor(255,x,y);
                setColor(255,x+1,y);
                setColor(255,x,y+1);
                setColor(255,x+1,y+1);
                setColor(255,x+2,y);
                setColor(255,x+2,y+1);
            }

        }
    }

    function setColor(c,x,y) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r = c;
        bidimensionalCopy.data[y][x].g = c;
        bidimensionalCopy.data[y][x].b = c;
        bidimensionalCopy.data[y][x].a = 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function halftone3x3 (mask) {
    var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y = y + 3) { // Each line
        for (var x = 0; x < imageData.width; x = x + 3) { // Each Column (pixel)
            var blockArray = [];
            if (bidimensionalImage.data[y]) {
                if (bidimensionalImage.data[y][x]) 
                    blockArray.push(bidimensionalImage.data[y][x].r); 
                if (bidimensionalImage.data[y][x+1]) 
                    blockArray.push(bidimensionalImage.data[y][x+1].r); 
                if (bidimensionalImage.data[y][x+2]) 
                    blockArray.push(bidimensionalImage.data[y][x+2].r); 
                if (bidimensionalImage.data[y][x+3]) 
                    blockArray.push(bidimensionalImage.data[y][x+3].r); 
            }
            if (bidimensionalImage.data[y+1]) {
                if (bidimensionalImage.data[y+1][x]) 
                    blockArray.push(bidimensionalImage.data[y+1][x].r); 
                if (bidimensionalImage.data[y+1][x+1]) 
                    blockArray.push(bidimensionalImage.data[y+1][x+1].r); 
                if (bidimensionalImage.data[y+1][x+2]) 
                    blockArray.push(bidimensionalImage.data[y+1][x+2].r);
                if (bidimensionalImage.data[y+1][x+3]) 
                    blockArray.push(bidimensionalImage.data[y+1][x+3].r); 
            }
            if (bidimensionalImage.data[y+2]) {
                if (bidimensionalImage.data[y+2][x]) 
                    blockArray.push(bidimensionalImage.data[y+2][x].r); 
                if (bidimensionalImage.data[y+2][x+1]) 
                    blockArray.push(bidimensionalImage.data[y+2][x+1].r); 
                if (bidimensionalImage.data[y+2][x+2]) 
                    blockArray.push(bidimensionalImage.data[y+2][x+2].r);
                if (bidimensionalImage.data[y+2][x+3]) 
                    blockArray.push(bidimensionalImage.data[y+2][x+3].r); 
            }
            var average = arr.mean(blockArray);
            if (average >= 0 && average <25) {
                setColor(0,x+0,y+0);
                setColor(0,x+1,y+0);
                setColor(0,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y+1);
                setColor(0,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(0,x+2,y+2);
            }
            if (average >= 25 && average <51) {
                setColor(0,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(0,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y+1);
                setColor(0,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(0,x+2,y+2);
            }
            if (average >= 51 && average <76) {
                setColor(0,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(0,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y+1);
                setColor(0,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 76 && average <102) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(0,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y+1);
                setColor(0,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 102 && average <127) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(0,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y+1);
                setColor(255,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 127 && average <153) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(255,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(0,x+2,y+1);
                setColor(255,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 153 && average <178) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(255,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(255,x+2,y+1);
                setColor(255,x+0,y+2);
                setColor(0,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 178 && average <204) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(255,x+2,y+0);
                setColor(0,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(255,x+2,y+1);
                setColor(255,x+0,y+2);
                setColor(255,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 204 && average <229) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(255,x+2,y+0);
                setColor(255,x+0,y+1);
                setColor(0,x+1,y+1);
                setColor(255,x+2,y+1);
                setColor(255,x+0,y+2);
                setColor(255,x+1,y+2);
                setColor(255,x+2,y+2);
            }
            if (average >= 229 && average <255) {
                setColor(255,x+0,y+0);
                setColor(255,x+1,y+0);
                setColor(255,x+2,y+0);
                setColor(255,x+0,y+1);
                setColor(255,x+1,y+1);
                setColor(255,x+2,y+1);
                setColor(255,x+0,y+2);
                setColor(255,x+1,y+2);
                setColor(255,x+2,y+2);
            }

        }
    }

    function setColor(c,x,y) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r = c;
        bidimensionalCopy.data[y][x].g = c;
        bidimensionalCopy.data[y][x].b = c;
        bidimensionalCopy.data[y][x].a = 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function floydSteinberg (imageData) {

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
            var old = bidimensionalCopy.data[y][x].r;
            var znew = (old < 128 ? 0 : 255);
            var error = old - znew;
            bidimensionalCopy.data[y][x].r = znew;
            bidimensionalCopy.data[y][x].g = znew;
            bidimensionalCopy.data[y][x].b = znew;
            bidimensionalCopy.data[y][x].a = 255;

            floydRound(x+1, y  , error * 7/16);
            floydRound(x-1, y+1, error * 3/16);
            floydRound(x  , y+1, error * 5/16);
            floydRound(x+1, y+1, error * 1/16);
        }
    }

    function floydRound(x,y,error) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r += error;
        bidimensionalCopy.data[y][x].g += error;
        bidimensionalCopy.data[y][x].b += error;
        bidimensionalCopy.data[y][x].a += 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function rogers (imageData) {

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
            var old = bidimensionalCopy.data[y][x].r;
            var znew = (old < 128 ? 0 : 255);
            var error = old - znew;
            bidimensionalCopy.data[y][x].r = znew;
            bidimensionalCopy.data[y][x].g = znew;
            bidimensionalCopy.data[y][x].b = znew;
            bidimensionalCopy.data[y][x].a = 255;

            floydRound(x+1, y  , error * 3/8);
            floydRound(x+1, y+1, error * 2/8);
            floydRound(x  , y+1, error * 3/8);
        }
    }

    function floydRound(x,y,error) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r += error;
        bidimensionalCopy.data[y][x].g += error;
        bidimensionalCopy.data[y][x].b += error;
        bidimensionalCopy.data[y][x].a += 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function jarvisJudiceNinke (imageData) {

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
            var old = bidimensionalCopy.data[y][x].r;
            var znew = (old < 128 ? 0 : 255);
            var error = old - znew;

            bidimensionalCopy.data[y][x].r = znew;
            bidimensionalCopy.data[y][x].g = znew;
            bidimensionalCopy.data[y][x].b = znew;
            bidimensionalCopy.data[y][x].a = 255;

            jarvisRound(x+1, y  , error * 7/48);
            jarvisRound(x+2, y  , error * 5/48);
            jarvisRound(x-2, y+1, error * 3/48);
            jarvisRound(x-1, y+1, error * 5/48);
            jarvisRound(x  , y+1, error * 7/48);
            jarvisRound(x+1, y+1, error * 5/48);
            jarvisRound(x-2, y+1, error * 3/48);
            jarvisRound(x-2, y+2, error * 1/48);
            jarvisRound(x-1, y+2, error * 3/48);
            jarvisRound(x  , y+2, error * 5/48);
            jarvisRound(x+1, y+2, error * 3/48);
            jarvisRound(x-2, y+2, error * 1/48);
        }
    }

    function jarvisRound(x,y,error) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r += error;
        bidimensionalCopy.data[y][x].g += error;
        bidimensionalCopy.data[y][x].b += error;
        bidimensionalCopy.data[y][x].a += 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function stucki (imageData) {

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
            var old = bidimensionalCopy.data[y][x].r;
            var znew = (old < 128 ? 0 : 255);
            var error = old - znew;
            bidimensionalCopy.data[y][x].r = znew;
            bidimensionalCopy.data[y][x].g = znew;
            bidimensionalCopy.data[y][x].b = znew;
            bidimensionalCopy.data[y][x].a = 255;

            stuckiRound(x+1, y  , error * 8/42);
            stuckiRound(x+2, y  , error * 4/42);
            stuckiRound(x-2, y+1, error * 2/42);
            stuckiRound(x-1, y+1, error * 4/42);
            stuckiRound(x  , y+1, error * 8/42);
            stuckiRound(x+1, y+1, error * 4/42);
            stuckiRound(x-2, y+1, error * 2/42);
            stuckiRound(x-2, y+2, error * 1/42);
            stuckiRound(x-1, y+2, error * 2/42);
            stuckiRound(x  , y+2, error * 4/42);
            stuckiRound(x+1, y+2, error * 2/42);
            stuckiRound(x-2, y+2, error * 1/42);
        }
    }

    function stuckiRound(x,y,error) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r += error;
        bidimensionalCopy.data[y][x].g += error;
        bidimensionalCopy.data[y][x].b += error;
        bidimensionalCopy.data[y][x].a += 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function stevensonArce (imageData) {

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
            var old = bidimensionalCopy.data[y][x].r;
            var znew = (old < 128 ? 0 : 255);
            var error = old - znew;
            bidimensionalCopy.data[y][x].r = znew;
            bidimensionalCopy.data[y][x].g = znew;
            bidimensionalCopy.data[y][x].b = znew;
            bidimensionalCopy.data[y][x].a = 255;

            stevensonRound(x+1, y  , error * 32/200);
            stevensonRound(x-3, y+1, error * 12/200);
            stevensonRound(x-1, y+1, error * 26/200);
            stevensonRound(x+1, y+1, error * 30/200);
            stevensonRound(x+3, y+1, error * 16/200);
            stevensonRound(x-2, y+2, error * 12/200);
            stevensonRound(x  , y+2, error * 26/200);
            stevensonRound(x+2, y+2, error * 12/200);
            stevensonRound(x-3, y+3, error * 5/200);
            stevensonRound(x-1, y+3, error * 12/200);
            stevensonRound(x+1, y+3, error * 12/200);
            stevensonRound(x+3, y+3, error * 5/200);
        }
    }

    function stevensonRound(x,y,error) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        bidimensionalCopy.data[y][x].r += error;
        bidimensionalCopy.data[y][x].g += error;
        bidimensionalCopy.data[y][x].b += error;
        bidimensionalCopy.data[y][x].a += 255;
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}
/*
function averagePixel(array) {
    var sum = 0;
    for( var i = 0; i < array.length; i++ ){
        sum += parseInt( array[i], 10 ); //don't forget to add the base
    }

    var avg = sum/array.length;

    return(avg);
}

function medianPixel(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return parseInt(values[half]);
    else
        return parseInt((values[half-1] + values[half]) / 2.0);
}

function modePixel(arr) {
    var numMapping = {};
    var greatestFreq = 0;
    var mode;
    arr.forEach(function findMode(number) {
        numMapping[number] = (numMapping[number] || 0) + 1;

        if (greatestFreq < numMapping[number]) {
            greatestFreq = numMapping[number];
            mode = number;
        }
    });
    return +mode;
}
*/
var arr = { 
    max: function(array) {
        return Math.max.apply(null, array);
    },
    
    min: function(array) {
        return Math.min.apply(null, array);
    },

    maxMinMean: function (array) {
        var max = Math.max.apply(null, array);
        var min = Math.min.apply(null, array);
        return (max + min)/2;
    },

    meanPluskStandartDeviation(array, k) {
        if (!k) k = 1;
        var mean = arr.mean(array);
        var stdev = arr.standardDeviation(array);
        return mean + k * stdev;
    },
    
    range: function(array) {
        return arr.max(array) - arr.min(array);
    },
    
    midrange: function(array) {
        return arr.range(array) / 2;
    },

    sum: function(array) {
        var num = 0;
        for (var i = 0, l = array.length; i < l; i++) num += array[i];
        return num;
    },
    
    mean: function(array) {
        return parseInt(arr.sum(array) / array.length);
    },
    
    median: function(array) {
        array.sort(function(a, b) {
            return a - b;
        });
        var mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    },
    
    modes: function(array) {
        if (!array.length) return [];
        var modeMap = {},
            maxCount = 0,
            modes = [];

        array.forEach(function(val) {
            if (!modeMap[val]) modeMap[val] = 1;
            else modeMap[val]++;

            if (modeMap[val] > maxCount) {
                modes = [val];
                maxCount = modeMap[val];
            }
            else if (modeMap[val] === maxCount) {
                modes.push(val);
                maxCount = modeMap[val];
            }
        });
        return modes;
    },
    
    variance: function(array) {
        var mean = arr.mean(array);
        return arr.mean(array.map(function(num) {
            return Math.pow(num - mean, 2);
        }));
    },
    
    standardDeviation: function(array) {
        return Math.sqrt(arr.variance(array));
    },
    
    meanAbsoluteDeviation: function(array) {
        var mean = arr.mean(array);
        return arr.mean(array.map(function(num) {
            return Math.abs(num - mean);
        }));
    },
    
    zScores: function(array) {
        var mean = arr.mean(array);
        var standardDeviation = arr.standardDeviation(array);
        return array.map(function(num) {
            return (num - mean) / standardDeviation;
        });
    }
};

arr.average = arr.mean;