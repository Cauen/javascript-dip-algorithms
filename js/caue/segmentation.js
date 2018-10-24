function askValue(functionToRun, extra) {
    swal({
            title: 'Type the value',
            input: 'text',
            inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Generate Image',
        showLoaderOnConfirm: true,
        preConfirm: (inputVal) => {
            console.log(inputVal);
            functionToRun(undefined, inputVal, extra);
        },
    });
}

function askNiblack() {
    /*swal({
            title: 'Type the value',
            input: 'text',
            inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Generate Image',
        showLoaderOnConfirm: true,
        preConfirm: (inputVal) => {
            console.log(inputVal);
            functionToRun(undefined, inputVal, arr.meanPluskStandartDeviation, kOfNiblack);
        },
    });*/

    swal({
        title: 'Niblack',
        html:
            '<label>Window Size</label><input id="swal-input1" class="swal2-input">' +
            '<label>K</label><input id="swal-input2" class="swal2-input">',
        focusConfirm: false,
        preConfirm: function () {
            localThreshold(undefined, $('#swal-input1').val(), arr.meanPluskStandartDeviation, $('#swal-input2').val());
            console.log("Niblack K :" + $('#swal-input2').val());
            /*return new Promise(function (resolve) {
                resolve([
                    $('#swal-input1').val(),
                    $('#swal-input2').val()
                ])
            })*/
        }
    }).then(function (result) {
        //swal(JSON.stringify(result))
    }).catch(swal.noop);
}


function crRoberts (imageData, threshold) {

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
            operation(x, y);
        }
    }

    function operation(x,y,error) {
        if (!bidimensionalImage.data[y])
            return false;
        if (!bidimensionalImage.data[y][x]) 
            return false;
        if (!bidimensionalImage.data[y][x+1]) 
            return false;
        if (!bidimensionalImage.data[y+1]) 
            return false;
        if (!bidimensionalImage.data[y+1][x]) 
            return false;
        if (!bidimensionalImage.data[y+1][x+1]) 
            return false;
        var tmp = Math.sqrt((bidimensionalImage.data[y][x].r - bidimensionalImage.data[y+1][x+1].r)**2 + (bidimensionalImage.data[y+1][x].r - bidimensionalImage.data[y][x+1].r)**2);

        if (threshold > 255) {
            bidimensionalCopy.data[y][x].r = tmp;
            bidimensionalCopy.data[y][x].g = tmp;
            bidimensionalCopy.data[y][x].b = tmp;
            bidimensionalCopy.data[y][x].a = 255;
        } else {
            var newValue = (tmp > threshold) ? 255 : 0;

            bidimensionalCopy.data[y][x].r = newValue;
            bidimensionalCopy.data[y][x].g = newValue;
            bidimensionalCopy.data[y][x].b = newValue;
            bidimensionalCopy.data[y][x].a = 255;
        }
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function roberts (imageData, threshold) {

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
            operation(x, y);
        }
    }

    function operation(x,y,error) {
        if (!bidimensionalImage.data[y])
            return false;
        if (!bidimensionalImage.data[y][x]) 
            return false;
        if (!bidimensionalImage.data[y][x+1]) 
            return false;
        if (!bidimensionalImage.data[y+1]) 
            return false;
        if (!bidimensionalImage.data[y+1][x]) 
            return false;
        if (!bidimensionalImage.data[y+1][x+1]) 
            return false;
        var tmp = Math.sqrt((bidimensionalImage.data[y][x].r - bidimensionalImage.data[y+1][x].r)**2 + (bidimensionalImage.data[y][x].r - bidimensionalImage.data[y][x+1].r)**2);

        if (threshold > 255) {
            bidimensionalCopy.data[y][x].r = tmp;
            bidimensionalCopy.data[y][x].g = tmp;
            bidimensionalCopy.data[y][x].b = tmp;
            bidimensionalCopy.data[y][x].a = 255;
        } else {
            var newValue = (tmp > threshold) ? 255 : 0;

            bidimensionalCopy.data[y][x].r = newValue;
            bidimensionalCopy.data[y][x].g = newValue;
            bidimensionalCopy.data[y][x].b = newValue;
            bidimensionalCopy.data[y][x].a = 255;
        }
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function prewitgx (imageData, threshold) {

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
            operation(x+1, y-1, -1);
        }
    }

    function operation(x,y,error) {
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x]) 
            return false;
        var tmp = (bidimensionalImage.data[y-1][x+1].r + bidimensionalImage.data[y][x+1].r) + (bidimensionalImage.data[y+1][x+1].r) - (bidimensionalImage.data[y-1][x-1].r + bidimensionalImage.data[y][x-1].r + bidimensionalImage.data[y+1][x-1].r);

        if (threshold > 255) {
            bidimensionalCopy.data[y][x].r = tmp;
            bidimensionalCopy.data[y][x].g = tmp;
            bidimensionalCopy.data[y][x].b = tmp;
            bidimensionalCopy.data[y][x].a = 255;
        } else {
            var newValue = (tmp > threshold) ? 255 : 0;

            bidimensionalCopy.data[y][x].r = newValue;
            bidimensionalCopy.data[y][x].g = newValue;
            bidimensionalCopy.data[y][x].b = newValue;
            bidimensionalCopy.data[y][x].a = 255;
        }
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

function kirsh (imageData) {
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

            Array.prototype.push.apply(ComponentsArray, [maskResult[indexOfBigger].sumOfR,maskResult[indexOfBigger].sumOfG,maskResult[indexOfBigger].sumOfB,255]);
        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);
}

function robison (imageData) {
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
            maskResult[0] = convolutionMask(x,y,[[-1,-1,1],[1,-1,-1],[-1,0,2],[-1,1,-2],[0,1,1],[1,1,-1]]);
            maskResult[1] = convolutionMask(x,y,[[0,-1,-1],[1,-1,-2],[-1,0,1],[1,0,-1],[-1,1,2],[0,1,1]]);
            maskResult[2] = convolutionMask(x,y,[[-1,-1,-1],[0,-1,-2],[1,-1,-1],[-1,1,1],[0,1,2],[1,1,1]]);
            maskResult[4] = convolutionMask(x,y,[[-1,-1,-2],[0,-1,-1],[-1,0,-1],[1,0,1],[0,1,1],[1,1,2]]);
            maskResult[3] = convolutionMask(x,y,[[-1,-1,-1],[1,-1,1],[-1,0,-2],[1,0,2],[-1,1,-1],[1,1,1]]);
            maskResult[5] = convolutionMask(x,y,[[0,-1,1],[1,-1,2],[-1,0,-1],[1,0,1],[-1,1,-2],[0,1,-1]]);
            maskResult[6] = convolutionMask(x,y,[[-1,-1,1],[0,-1,2],[1,-1,1],[-1,1,-1],[0,1,-2],[1,1,-1]]);
            maskResult[7] = convolutionMask(x,y,[[-1,-1,2],[0,-1,1],[-1,0,1],[1,0,-1],[0,1,-1],[1,1,-2]]);
            var sumComponentsArray = maskResult.map((e) => (e.sumOfR + e.sumOfG + e.sumOfB));
            var max = Math.max.apply(null,sumComponentsArray);
            var indexOfBigger = sumComponentsArray.indexOf(max);

            Array.prototype.push.apply(ComponentsArray, [maskResult[indexOfBigger].sumOfR,maskResult[indexOfBigger].sumOfG,maskResult[indexOfBigger].sumOfB,255]);
        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);
}

function freiChen (imageData) {
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 

    var sq = 1.4142135623730951;
    var ms = -1.4142135623730951;
    var st = 2.8284271247461900976033774484194;
    var multCase = 1/9;
    var mult = [1/st,1/st,1/st,1/st,1/2,1/2,1/6,1/6,1/3];

    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            maskResult = [];
            maskResult[0] = convolutionMask(x,y,[[-1,-1,1],[0,-1,sq],[1,-1,1],[-1,1,-1],[0,1,ms],[1,1,-1]]);
            maskResult[1] = convolutionMask(x,y,[[-1,-1,1],[1,-1,-1],[-1,0,sq],[1,0,ms],[-1,1,1],[1,1,-1]]);
            maskResult[2] = convolutionMask(x,y,[[0,-1,-1],[1,-1,sq],[-1,0,1],[1,0,-1],[-1,1,ms],[0,1,1]]);
            maskResult[3] = convolutionMask(x,y,[[-1,-1,sq],[0,-1,-1],[-1,0,-1],[1,0,1],[0,1,1],[1,1,ms]]);
            maskResult[4] = convolutionMask(x,y,[[0,-1,1],[-1,0,-1],[1,0,-1],[0,1,1]]);
            maskResult[5] = convolutionMask(x,y,[[-1,-1,-1],[1,-1,1],[-1,1,1],[1,1,-1]]);
            maskResult[6] = convolutionMask(x,y,[[-1,-1,1],[0,-1,-2],[1,-1,1],[-1,0,-2],[0,0,4],[1,0,-2],[-1,1,1],[0,1,-2],[1,1,1]]);
            maskResult[7] = convolutionMask(x,y,[[-1,-1,-2],[0,-1,1],[1,-1,-2],[-1,0,1],[0,0,4],[1,0,1],[-1,1,-2],[0,1,1],[1,1,-2]]);
            maskResult[8] = convolutionMask(x,y,[[-1,-1,1],[0,-1,1],[1,-1,1],[-1,0,1],[0,0,1],[1,0,1],[-1,1,1],[0,1,1],[1,1,1]]);

            var sum = 0;
            for (var i = 0; i < mult.length; i++) {
                var value = maskResult[i].sumOfR * mult[i];
                sum += value;
            }
            sum = parseInt(sum);
            Array.prototype.push.apply(ComponentsArray, [sum,sum,sum,255]);
        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
    addImage(ComponentsData);
}


function globalThreshold (imageData, value) {
    if(!imageData)
        imageData = imagesData[primaryImage];
    if(!imageData) {
        uploadFirstNotification();
        return false;
    }

    var ComponentsArray = [];
    var finalPixel;
    for (var y = 0; y < imageData.height; y++) { // Each line
        for (var x = 0; x < imageData.width; x++) { // Each Column (pixel)
            //var thisPixel = imageData.data[];
            var thisPixel = imageData.data[4 * (y*imageData.width + x)];// 4 x current position
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

function localThreshold (imageData, windowSize, operation, kOfNiblack) {
    if(!imageData)
        imageData = imagesData[primaryImage];
    if(!imageData) {
        uploadFirstNotification();
        return false;
    }

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 
    
    windowSize = parseInt(windowSize);
    if (windowSize <= 0) windowSize = 1;
    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y += windowSize) { // Each line
        for (var x = 0; x < imageData.width; x+= windowSize) { // Each Column (pixel)
            var localBlock = [];
            for (thatY = y; thatY < y + windowSize; thatY++) {
                if (!bidimensionalImage.data[thatY]) continue;
                for (thatX = x; thatX < x + windowSize; thatX++) {
                    if (!bidimensionalImage.data[thatY][thatX]) continue;
                    localBlock.push(bidimensionalImage.data[thatY][thatX].r);
                }
            }
            var resultOfOperation = parseInt(operation(localBlock, kOfNiblack));
            for (thatY = y; thatY < y + windowSize; thatY++) {
                if (!bidimensionalImage.data[thatY]) continue;
                for (thatX = x; thatX < x + windowSize; thatX++) {
                    if (!bidimensionalImage.data[thatY][thatX]) continue;
                    
                    if (bidimensionalImage.data[thatY][thatX].r > resultOfOperation) {
                        bidimensionalCopy.data[thatY][thatX].r = 255;
                        bidimensionalCopy.data[thatY][thatX].g = 255;
                        bidimensionalCopy.data[thatY][thatX].b = 255;
                        bidimensionalCopy.data[thatY][thatX].a = 255;
                    } else {
                        bidimensionalCopy.data[thatY][thatX].r = 0;
                        bidimensionalCopy.data[thatY][thatX].g = 0;
                        bidimensionalCopy.data[thatY][thatX].b = 0;
                        bidimensionalCopy.data[thatY][thatX].a = 255;
                    }
                }
            }

            
        }
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);
}

var distanceRegionGrowth;
function startRegionGrowth() { // Start p listener set in keybloard_listeners 
    if ($("body").hasClass("region-growth")) {
        $('body').removeClass('region-growth'); 
        noty({
            text: '<strong>Success</strong>Disabled region growth.',
            type: 'success',
            layout: 'topRight',
            timeout: 1700,
        });
    } else
    swal({
            title: 'Type distance',
            input: 'text',
            inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Generate Image',
        showLoaderOnConfirm: true,
        preConfirm: (inputVal) => {
            distanceRegionGrowth = inputVal;
            if (!$("body").hasClass("region-growth"))  {
                $('body').addClass('region-growth');
                noty({
                    text: '<strong>Success</strong>Click in image to region growth, click same menu option to disable.',
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1700,
                });
            }
            
        },
    });


    
}

function regionGrowth(imageData, x,y, spaceValue) {
    if(!imageData)
        imageData = imagesData[primaryImage];
    if(!imageData) {
        uploadFirstNotification();
        return false;
    }

    var bidimensionalImage = getBidimensonalData(imageData); // from utils.js
    var bidimensionalCopy = bidimensionalImage; 

    var pixelR = bidimensionalImage.data[y][x].r;
    if (!bidimensionalCopy.data[y][x].printed)
        printPixel(pixelR,spaceValue,x,y);

    /*for (var y = 0; y < imageData.height; ++y) { // Each line
        for (var x = 0; x < imageData.width; ++x) { // Each Column (pixel)
            
            
        }
    }*/

    function printPixel(seedValue, range, x,y, color) {
        if (!color)
            color = {r: Math.floor(Math.random() * 256) + 1, g: Math.floor(Math.random() * 256) + 1, b: Math.floor(Math.random() * 256) + 1};
        if (!bidimensionalCopy.data[y])
            return false;
        if (!bidimensionalCopy.data[y][x])
            return false;
        if (bidimensionalCopy.data[y][x].printed)
            return false;
        if (bidimensionalCopy.data[y][x].r > seedValue + range)
            return false;
        if (bidimensionalCopy.data[y][x].r < seedValue - range)
            return false;

        //console.log("Colorindo imagem");

        bidimensionalCopy.data[y][x].printed = true;
        bidimensionalCopy.data[y][x].r = color.r;
        bidimensionalCopy.data[y][x].g = color.g;
        bidimensionalCopy.data[y][x].b = color.b;
        bidimensionalCopy.data[y][x].a = 255;
        try {
            printPixel(seedValue, range, x-1, y-1, color);
            printPixel(seedValue, range, x, y-1, color);
            printPixel(seedValue, range, x+1, y-1, color);
            printPixel(seedValue, range, x-1, y, color);
            printPixel(seedValue, range, x+1, y, color);
            printPixel(seedValue, range, x-1, y+1, color);
            printPixel(seedValue, range, x, y+1, color);
            printPixel(seedValue, range, x+1, y+1, color);
        } catch (ex) {
            //console.log("caught " + ex);
        }
        
    }

    var ComponentsData = getImageDataFromBidimensionalArray(bidimensionalCopy);
    addImage(ComponentsData);

}