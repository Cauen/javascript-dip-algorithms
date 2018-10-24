function pseudoColoring(imageData) {
	if(!imageData)
    	var imageData = imagesData[primaryImage];
    if(!imageData)
    	uploadFirstNotification();
	var rComponentArray = [];
	var gComponentArray = [];
	var bComponentArray = [];
	var indexOfArray = 0;
	if(!imageData) return false;
	for (var y = 0; y < imageData.height; y++) {
	    for (var x = 0; x < imageData.width; x++) {
			var r = imageData.data[indexOfArray++];
			var g = imageData.data[indexOfArray++];
			var b = imageData.data[indexOfArray++];
			var a = imageData.data[indexOfArray++];
     	if (r >= 0 && r <= 42) {
     		redHue = 255;
     		greenHue = r*4.25;
     		blueHue = 0;
     	}
     	if (r >= 43 && r <= 85) {
     		redHue = 255 - (r-43)*4.25;
     		greenHue = 255;
     		blueHue = 0;
     	}
     	if (r >= 86 && r <= 128) {
     		redHue = 0;
     		greenHue = 255;
     		blueHue = (r-86)*4.25;
     	}
     	if (r >= 129 && r <= 171) {
     		redHue = 0;
     		greenHue =  255 - (r-129)*4.25;
     		blueHue = 255;
     	}
     	if (r >= 172 && r <= 214) {
     		redHue = (r-172)*4.25;
     		greenHue = 0;
     		blueHue = 255;
     	}
     	if (r >= 215 && r <= 255) {
     		redHue = 255;
     		greenHue = 0;
     		blueHue = 255 - (r-215)*4.25;
     	}

			rComponentArray.push(redHue);
			rComponentArray.push(greenHue);
			rComponentArray.push(blueHue);
			rComponentArray.push(a);
	    }
  	}
  	var rData = {height: imageData.height, width: imageData.width, data: rComponentArray};
  	addImage(rData);
}

function pseudoColoring2(imageData) {
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var rComponentArray = [];
    var gComponentArray = [];
    var bComponentArray = [];
    var indexOfArray = 0;
    if(!imageData) return false;
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];
        if (r >= 0 && r <= 42) {
            redHue = r*6.071;
            greenHue = r*6.071;
            blueHue = 0;
        }
        if (r >= 43 && r <= 85) {
            redHue = 255 - (r-43)*6.071;
            greenHue = 255 - (r-43)*6.071;
            blueHue = 0;
        }
        if (r >= 86 && r <= 128) {
            redHue = 0;
            greenHue = (r-86)*6.071;
            blueHue = (r-86)*6.071;
        }
        if (r >= 129 && r <= 171) {
            redHue = 0;
            greenHue =  255 - (r-129)*6.071;
            blueHue = 255 - (r-129)*6.071;
        }
        if (r >= 172 && r <= 214) {
            redHue = (r-172)*6.071;
            greenHue = 0;
            blueHue = (r-172)*6.071;
        }
        if (r >= 215 && r <= 255) {
            redHue = 255 - (r-215)*6.071;
            greenHue = 0;
            blueHue = 255 - (r-215)*6.071;
        }

        rComponentArray.push(redHue);
        rComponentArray.push(greenHue);
        rComponentArray.push(blueHue);
        rComponentArray.push(a);
        }
    }
    var rData = {height: imageData.height, width: imageData.width, data: rComponentArray};
    addImage(rData);
}

function pseudoColoring3(imageData, randomFlag, subWithOriginal) {
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var rComponentArray = [];
    var gComponentArray = [];
    var bComponentArray = [];
    var indexOfArray = 0;
    if(!imageData) return false;

    var whatGet = [];
    var firstMult, secondMult;
    if (randomFlag) {
        var arrayComponents = [0,1,2];
        var randomComponentIndex = Math.floor(Math.random()*arrayComponents.length)
        whatGet.push(arrayComponents[randomComponentIndex]);
        arrayComponents.splice(randomComponentIndex, 1);

        randomComponentIndex = Math.floor(Math.random()*arrayComponents.length)
        whatGet.push(arrayComponents[randomComponentIndex]);
        arrayComponents.splice(randomComponentIndex, 1);

        whatGet.push(arrayComponents[0]);
        firstMult = (Math.floor(Math.random() * 50) + 0)/100;
        secondMult = 0.50 - firstMult;
    } else {
        whatGet.push(0);
        whatGet.push(1);
        whatGet.push(2);
        firstMult = 0.25;
        secondMult = 0.25;
    }

    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];
            var arrayColors = [r,g,b];

            if(subWithOriginal) {
                redHue =    arrayColors[whatGet[0]]*2.5 - arrayColors[whatGet[2]] * firstMult - arrayColors[whatGet[1]] * secondMult;
                greenHue =  arrayColors[whatGet[1]]*2.5 - arrayColors[whatGet[0]] * firstMult - arrayColors[whatGet[2]] * secondMult;
                blueHue =   arrayColors[whatGet[2]]*2.5 - arrayColors[whatGet[0]] * firstMult - arrayColors[whatGet[1]] * secondMult;
            } else {
                redHue =    Math.min(Math.max(parseInt(arrayColors[whatGet[0]]*1.5 - arrayColors[whatGet[2]] * firstMult - arrayColors[whatGet[1]] * secondMult), 0), 255);
                greenHue =  Math.min(Math.max(parseInt(arrayColors[whatGet[1]]*1.5 - arrayColors[whatGet[0]] * firstMult - arrayColors[whatGet[2]] * secondMult), 0), 255);
                blueHue =   Math.min(Math.max(parseInt(arrayColors[whatGet[2]]*1.5 - arrayColors[whatGet[0]] * firstMult - arrayColors[whatGet[1]] * secondMult), 0), 255);
            
            }
            

            rComponentArray.push(parseInt(redHue));
            rComponentArray.push(parseInt(greenHue));
            rComponentArray.push(parseInt(blueHue));
            rComponentArray.push(parseInt(a));
        }
    }
    var rData = {height: imageData.height, width: imageData.width, data: rComponentArray};

    if(!subWithOriginal) {
        addImage(rData);
    } else {
        operationsAritAndLogic('-', undefined, imageData, rData);
        //operationsAritAndLogic('-', undefined, rData, imageData);
    }
}

function pseudoColoringMinAndMaxBased(imageData) { // For using in moon example
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var rComponentArray = [];
    var gComponentArray = [];
    var bComponentArray = [];
    var indexOfArray = 0;
    if(!imageData) return false;


    //Setting max and mins
    var maxR = -Infinity; var maxG = -Infinity; var maxB = -Infinity; var minR = Infinity ; var minG = Infinity ; var minB = Infinity ; //To Normalize
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            maxR = Math.max(isNaN(r) ? -Infinity : r, maxR);
            maxG = Math.max(isNaN(g) ? -Infinity : g, maxG);
            maxB = Math.max(isNaN(b) ? -Infinity : b, maxB);

            minR = Math.min(isNaN(r) ? -Infinity : r, minR);
            minG = Math.min(isNaN(g) ? -Infinity : g, minG);
            minB = Math.min(isNaN(b) ? -Infinity : b, minB);
        }
    }

    var step = (maxR - minR)/6;
    var maxOfComponents = 255;
    var factor = maxOfComponents/step;
    console.log('Step: ' +step);
    var indexOfArray = 0;

    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];
            var redHue, blueHue, greenHue;
            if(y == 0) console.log(r);

            if (r >= (0+minR) && r <= step+minR) {
                redHue = maxOfComponents;
                greenHue = (r-minR)*factor;
                blueHue = 0;
            }
            if (r >= (step+1+minR) && r <= (step*2+minR)) {
                redHue = maxOfComponents - (r-(step+1+minR))*factor;
                greenHue = maxOfComponents;
                blueHue = 0;
            }
            if (r >= ((step*2)+1+minR) && r <= (step*3+minR)) {
                redHue = 0;
                greenHue = maxOfComponents;
                blueHue = (r-((step*2)+1+minR))*factor;
            }
            if (r >= ((step*3)+1+minR) && r <= (step*4+minR)) {
                redHue = 0;
                greenHue =  maxOfComponents - (r-((step*3)+1+minR))*factor;
                blueHue = maxOfComponents;
            }
            if (r >= ((step*4)+1+minR) && r <= (step*5+minR)) {
                redHue = (r-((step*4)+1+minR))*factor;
                greenHue = 0;
                blueHue = maxOfComponents;
            }
            if (r >= ((step*5)+1+minR) && r <= (step*6+minR)) {
                redHue = maxOfComponents;
                greenHue = 0;
                blueHue = maxOfComponents - (r-((step*5)+1+minR))*factor;
            }

            rComponentArray.push(parseInt(redHue));
            rComponentArray.push(parseInt(greenHue));
            rComponentArray.push(parseInt(blueHue));
            rComponentArray.push(255);
        }
    }

    var rData = {height: imageData.height, width: imageData.width, data: rComponentArray};
    console.log(rData);
    addImage(rData);
}

function pseudoColoringMinAndMaxBased2(imageData) { // Using Another Coloring Setup
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var rComponentArray = [];
    var gComponentArray = [];
    var bComponentArray = [];
    var indexOfArray = 0;
    if(!imageData) return false;


    //Setting max and mins
    var maxR = -Infinity; var maxG = -Infinity; var maxB = -Infinity; var minR = Infinity ; var minG = Infinity ; var minB = Infinity ; //To Normalize
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            maxR = Math.max(isNaN(r) ? -Infinity : r, maxR);
            maxG = Math.max(isNaN(g) ? -Infinity : g, maxG);
            maxB = Math.max(isNaN(b) ? -Infinity : b, maxB);

            minR = Math.min(isNaN(r) ? +Infinity : r, minR);
            minG = Math.min(isNaN(g) ? +Infinity : g, minG);
            minB = Math.min(isNaN(b) ? +Infinity : b, minB);
        }
    }

    var step = (maxR - minR)/6;
    var maxOfComponents = 255;
    var factor = maxOfComponents/step;
    console.log({minR, maxR});
    console.log('Step: ' +step);
    var indexOfArray = 0;

    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];
            var redHue, blueHue, greenHue;
            if(y == 0) console.log(r);

            if (r >= (0+minR) && r <= step+minR) {
                redHue =    0;                                                  // 0
                blueHue =   (r-minR)*factor;                                    // ++
                greenHue =     0;                                                  // 0
            }
            if (r >= (step+1+minR) && r <= (step*2+minR)) {
                redHue =    0 + (r-(step+0+minR))*factor;                       // ++
                blueHue =   maxOfComponents;                                    // --
                greenHue =     0;                                                  // 0
            }
            if (r >= ((step*2)+1+minR) && r <= (step*3+minR)) {
                redHue =    maxOfComponents;                                    // 255                       
                blueHue =   maxOfComponents - (r-((step*2)+0+minR))*factor;     // --
                greenHue =     (r-((step*2)+0+minR))*factor;                       // ++
            }
            if (r >= ((step*3)+1+minR) && r <= (step*4+minR)) {
                redHue =    maxOfComponents - (r-((step*3)+0+minR))*factor;     // --
                blueHue =   0;                                                  // 0     
                greenHue =     maxOfComponents;                                    // 255
            }
            if (r >= ((step*4)+1+minR) && r <= (step*5+minR)) {
                redHue =    0;                                                  // 0
                blueHue =   0 + (r-((step*4)+0+minR))*factor;                   // +
                greenHue =     maxOfComponents;                                    // 255
            }
            if (r >= ((step*5)+1+minR) && r <= (step*6+minR)) {                 
                redHue =    0 + (r-((step*5)+0+minR))*factor;                   // ++
                blueHue =   maxOfComponents;                                    // 255
                greenHue =     maxOfComponents;                                    // 255
            }

            rComponentArray.push(parseInt(redHue));
            rComponentArray.push(parseInt(greenHue));
            rComponentArray.push(parseInt(blueHue));
            rComponentArray.push(255);

            if (redHue == greenHue && greenHue == blueHue && blueHue == 255) {
                //console.log("TEM BRANCO SIM");
            }
        }
    }

    var rData = {height: imageData.height, width: imageData.width, data: rComponentArray};
    console.log(rData);
    addImage(rData);
}

function pseudoColoringIgnoring(imageData, ignoreAndDo) {
    if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    var rComponentArray = [];
    var gComponentArray = [];
    var bComponentArray = [];
    var indexOfArray = 0;
    if(!imageData) return false;

    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            if (b > 128) { b = 0};

            rComponentArray.push(r);
            rComponentArray.push(g);
            rComponentArray.push(b);
            rComponentArray.push(255);


        }
    }
    var rData = {height: imageData.height, width: imageData.width, data: rComponentArray};
    
    if(!ignoreAndDo) {
        addImage(rData);
    } else if (ignoreAndDo == '+') {
        operationsAritAndLogic('+', undefined, imageData, rData);
    } else if (ignoreAndDo == '-') {
        operationsAritAndLogic('-', undefined, imageData, rData);
    }
}