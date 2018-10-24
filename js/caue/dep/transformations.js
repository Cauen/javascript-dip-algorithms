function rotation(angle) {
    var imagem1Data = imagesData[imagesData.length - 1 ];
    if (!imagem1Data) return false;

    //Precisa criar função pra converter a lista em array bidimensional
    // e depois transformar de array bidimensional para lista

    /*
	var transformedImageData = imagem1Data;
 	var transformedPixels    = transformedImageData.data;

    for (var y = 0; y < imagem1Data.height; y++) {
	    for (var x = 0; x < imagem1Data.width; x++) {
			var position = (y * imagem1Data.width + x) * 4;
			transformedPixels[position + 0] = imagem1Data[position + 0];
			transformedPixels[position + 1] = imagem1Data[position + 1];
			transformedPixels[position + 2] = imagem1Data[position + 2];
			transformedPixels[position + 3] = imagem1Data[position + 3];
	    }
  	} */

  	console.log(imagesData);
  	console.log(imagem1Data);
  	var bid = getBidimensonalData(imagem1Data);
  	console.log(bid);
  	console.log(bid.data[0][0].r)
  	console.log(rotate(bid, 45));
}

function rotate(bidimensionalData, angle) {
	var newBidimensionalRotated = {};
	for(var y = 0; y < bidimensionalData.height; y++) {
		for(var x = 0; x < bidimensionalData.width; x++) {
			var newX = Math.floor(x* Math.cos(angle) - y * Math.sin(angle));
			var newY = Math.floor(x* Math.sin(angle) + y * Math.cos(angle));
			//console.log({oldX: x, oldY: y, newX:newX, newY:newY});
			var newwX = x + 20;
			var newwY = y + 20;
			//console.log('Bid recebido'); console.log (bidimensionalData.data);
			newBidimensionalRotated[newwY] = {};
			newBidimensionalRotated[newwY][newwX] = bidimensionalData.data[y][x];
		}
	}
	return newBidimensionalRotated;
}
