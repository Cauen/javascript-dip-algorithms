function operationsAritAndLogic(operation, formula, image1Data, image2Data) {



    var image1Data = image1Data ? image1Data : imagesData[primaryImage];
    var image2Data = image2Data ? image2Data : imagesData[secundaryImage];
    if (!image1Data || !image2Data) { uploadFirstNotification(); return false; }

    noty({
        text: 'Operation carried out, please keep in mind the alternation between truncate and normalize to see different results.',
        type: 'warning',
        layout: 'topRight',
        timeout: 4500
    });

    var image1Rows = []; var image2Rows = [];
    var v = 0;
    
    //Criando array de image Rows(height elementos), com cada uma com (width elementos) com cada elemento com 4 partes 
    for (var i1 = 0; i1 < image1Data.height; i1++) { // Loop em todas as colunas
        var linhaAtual = [];
        
        for (var j1 = 0; j1 < image1Data.width; j1++) { //loop nas image
         
            linhaAtual.push( [image1Data.data[v], image1Data.data[v+1],image1Data.data[v+2],image1Data.data[v+3]] );
            v = v + 4;
            
        }
        image1Rows.push(linhaAtual);
    }
    
    var v = 0;
    for (var i2 = 0; i2 < image2Data.height; i2++) { // Loop em todas as colunas
        var linhaAtual = [];
        
        for (var j2 = 0; j2 < image2Data.width; j2++) { //loop nas image
        
            linhaAtual.push( [image2Data.data[v], image2Data.data[v+1],image2Data.data[v+2],image2Data.data[v+3]] );
            v = v + 4;
            
        }
        image2Rows.push(linhaAtual);
    }
    
    //console.log(image1Rows);
    //console.log(image2Rows);
    /*
    
    var maxWidthImage = (widthMax == image1Data.width) ? 1 : 2;
    
    var widthMin = Math.min(image1Data.width, image2Data.width);
    var heightMin = Math.min(image1Data.height, image2Data.height); */


    widthGapImage1 = 0, widthMin = 0, widthGapImage2 = 0, heightGapImage1 = 0,  heightMin = 0, heightGapImage2 = 0;
    var widthMax = Math.max(image1Data.width, image2Data.width);
    var heightMax = Math.max(image1Data.height, image2Data.height);

    if(options.origin_operations) {
        if (image1Data.width > image2Data.width) {
            widthMax = image1Data.width;
            widthGapImage1 = 0;
            widthMin = image2Data.width;
            widthGapImage2 = parseInt((image1Data.width - image2Data.width)/2);
        } else {
            widthMax = image2Data.width;
            widthGapImage2 = 0;
            widthMin = image1Data.width;
            widthGapImage1 = parseInt((image2Data.width - image1Data.width)/2);
        }

        if (image1Data.height > image2Data.height) {
            heightMax = image1Data.height;
            heightGapImage1 = 0;
            heightMin = image2Data.height;
            heightGapImage2 = parseInt((image1Data.height - image2Data.height)/2);
        } else {
            heightMax = image2Data.height;
            heightGapImage2 = 0;
            heightMin = image1Data.height;
            heightGapImage1 = parseInt((image2Data.height - image1Data.height)/2);
        }
    }
    
    var maxR = -Infinity; var maxG = -Infinity; var maxB = -Infinity; var minR = Infinity ; var minG = Infinity ; var minB = Infinity ; //To Normalize

    var arrayPixels = [];
    for (var i3 = 0; i3 < heightMax; i3++) {
        for (var j3 = 0; j3 < widthMax; j3++) {

            var r1, r2, g1, g2, b1, b2, a1, a2;
            if (image1Rows[i3-heightGapImage1] !== undefined) {
                if (image1Rows[i3-heightGapImage1][j3-widthGapImage1] !== undefined) {
                    r1 = parseInt(image1Rows[i3-heightGapImage1][j3-widthGapImage1][0] || 0);
                    g1 = parseInt(image1Rows[i3-heightGapImage1][j3-widthGapImage1][1] || 0);
                    b1 = parseInt(image1Rows[i3-heightGapImage1][j3-widthGapImage1][2] || 0);
                    a1 = parseInt(image1Rows[i3-heightGapImage1][j3-widthGapImage1][3] || 0);
                } else {
                    r1 = 0; g1 = 0; b1 = 0; a1 = 255;
                }
            } else {
                r1 = 0; g1 = 0; b1 = 0; a1 = 255;
            }

            if (image2Rows[i3-heightGapImage2] !== undefined && j3 !== undefined) {
                if (image2Rows[i3-heightGapImage2][j3-widthGapImage2] !== undefined) {
                     r2 = parseInt(image2Rows[i3-heightGapImage2][j3-widthGapImage2][0] || 0);
                     g2 = parseInt(image2Rows[i3-heightGapImage2][j3-widthGapImage2][1] || 0);
                     b2 = parseInt(image2Rows[i3-heightGapImage2][j3-widthGapImage2][2] || 0);
                     a2 = parseInt(image2Rows[i3-heightGapImage2][j3-widthGapImage2][3] || 0);
                } else {
                    r2 = 0; g2 = 0; b2 = 0; a2 = 255;
                }
            } else {
                r2 = 0; g2 = 0; b2 = 0; a2 = 255;
            }
                
            var operators = {
                '+': function(a, b) { return a + b },
                '-': function(a, b) { return a - b },
                '*': function(a, b) { return a * b },
                '/': function(a, b) { return a / b },
                '&': function(a, b) { return a & b },
                '|': function(a, b) { return a | b },
                '^': function(a, b) { return a ^ b },
                '**': function(a, b) { return (a/40) ** (b/40) },
                '%': function(a, b) { return a % b },
                'postFixFormula': function(a, b, c) {
                    return evalStr(c, 1, a, b )
                }
            };


            var r = (operators[operation](r1,r2, formula)).toFixed(50);
            if (!options.normalize) r = Math.min(Math.max(r,0),255); //Truncate
            maxR = Math.max(isNaN(r) ? -Infinity : r, maxR);
            minR = Math.min(isNaN(r) ? Infinity : r, minR);
            var g = (operators[operation](g1,g2, formula)).toFixed(50);
            if (!options.normalize) g = Math.min(Math.max(g,0),255); //Truncate
            maxG = Math.max(isNaN(g) ? -Infinity : g, maxG);
            minG = Math.min(isNaN(g) ? Infinity : g, minG);
            var b = (operators[operation](b1,b2, formula)).toFixed(50);
            if (!options.normalize) b = Math.min(Math.max(b,0),255); //Truncate
            maxB = Math.max(isNaN(b) ? -Infinity : b, maxB);
            minB= Math.min(isNaN(b) ? Infinity : b, minB);
            //var a = Math.min(Math.max(parseInt(operators[operation](a1,a2)),255),255);
            var a = 255;

            arrayPixels.push(parseInt(r));arrayPixels.push(parseInt(g));arrayPixels.push(parseInt(b));arrayPixels.push(parseInt(a));
        }

    }

    console.log('MaxR: ' + maxR);
    console.log('minR: ' + minR);

    var normalizedArray = [];
    var imageData;
    if (options.normalize) {
        var v = 0;
        for (var i4 = 0; i4 < heightMax; i4++) { // Loop em todas as colunas
            for (var j4 = 0; j4 < widthMax; j4++) { //loop nas image
                var normalizedR = parseInt((255/(maxR-minR)) * (arrayPixels[v] - minR));
                var normalizedG = parseInt((255/(maxG-minG)) * (arrayPixels[v+1] - minG));
                var normalizedB = parseInt((255/(maxB-minB)) * (arrayPixels[v+2] - minB));
                var normalizedA = 255;
                normalizedArray.push(normalizedR);
                normalizedArray.push(normalizedG);
                normalizedArray.push(normalizedB);
                normalizedArray.push(normalizedA);
                v = v + 4;
            }
            
        }
        imageData = {data: normalizedArray, height: heightMax, width: widthMax};
        console.log(normalizedArray);
    } else {
        imageData = {data: arrayPixels, height: heightMax, width: widthMax};
    }

    
    //console.log(imageData);
    addImage(imageData);
}

function sameDizeOperationsAritLogic(operationType) {
    
    
    var image1Data = imagesData[primaryImage];
    var image2Data = imagesData[secundaryImage];
    if (!image1Data || !image2Data) { uploadFirstNotification(); return false; }

	var finalData = [];
    var component = 1; //To know if its alpha

    for (var i = 0; i < image1Data.data.length; i++) {
        switch (operationType) {
            case 'somar':       var pixelComponent = image1Data.data[i] + image2Data.data[i]; break;
            case 'subtrair':    var pixelComponent = image1Data.data[i] - image2Data.data[i]; break;
            case 'multiplicar': var pixelComponent = image1Data.data[i] * image2Data.data[i]; break;
            case 'dividir':     var pixelComponent = image1Data.data[i] / image2Data.data[i]; break;
            case 'and':         var pixelComponent = image1Data.data[i] & image2Data.data[i]; break;
            case 'or':          var pixelComponent = image1Data.data[i] | image2Data.data[i]; break;
            case 'xor':         var pixelComponent = image1Data.data[i] ^ image2Data.data[i]; break;
        }

        if (pixelComponent > 255) pixelComponent = 255;
        if (pixelComponent < 0) pixelComponent = 0;
        pixelComponent = parseInt(pixelComponent);
        
        if (component == 4) pixelComponent = 255; // Disable operations with 'alpha'
        if (component < 4) component++; else component = 1;
        
        finalData.push(pixelComponent);
    }
    var imageData = {data: finalData, height: image1Data.height, width: image1Data.width};
    
    addImage(imageData);
    
}