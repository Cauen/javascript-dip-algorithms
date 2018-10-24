function generateRGBComponents(imageData) {
	if(!imageData)
    	var imageData = imagesData[primaryImage];
    if(!imageData)
    	uploadFirstNotification();
	var redComponentArray = [];
	var greenComponentArray = [];
	var blueComponentArray = [];
	var indexOfArray = 0;
	if(!imageData) return false;
	for (var y = 0; y < imageData.height; y++) {
	    for (var x = 0; x < imageData.width; x++) {
			var r = imageData.data[indexOfArray++];
			var g = imageData.data[indexOfArray++];
			var b = imageData.data[indexOfArray++];
			var a = imageData.data[indexOfArray++];
			redComponentArray.push(r);
			redComponentArray.push(0);
			redComponentArray.push(0);
			redComponentArray.push(a);
			greenComponentArray.push(0);
			greenComponentArray.push(g);
			greenComponentArray.push(0);
			greenComponentArray.push(a);
			blueComponentArray.push(0);
			blueComponentArray.push(0);
			blueComponentArray.push(b);
			blueComponentArray.push(a);
	    }
  	}
  	var redComponentData = {height: imageData.height, width: imageData.width, data: redComponentArray};
  	var greenComponentData = {height: imageData.height, width: imageData.width, data: greenComponentArray};
  	var blueComponentData = {height: imageData.height, width: imageData.width, data: blueComponentArray};
  	addImage(redComponentData);
  	addImage(greenComponentData);
  	addImage(blueComponentData);
}

function generateCMYComponents(imageData) {
	if(!imageData)
    	var imageData = imagesData[primaryImage];
    if(!imageData)
    	uploadFirstNotification();
	var cComponentArray = [];
	var mComponentArray = [];
	var yComponentArray = [];
	var indexOfArray = 0;
	if(!imageData) return false;
	for (var y = 0; y < imageData.height; y++) {
	    for (var x = 0; x < imageData.width; x++) {
			var r = imageData.data[indexOfArray++];
			var g = imageData.data[indexOfArray++];
			var b = imageData.data[indexOfArray++];
			var a = imageData.data[indexOfArray++];
            var c = 255-r;
            var m = 255-g;
            var y = 255-b;
			cComponentArray.push(0);
			cComponentArray.push(c);
			cComponentArray.push(c);
			cComponentArray.push(a);
			mComponentArray.push(m);
			mComponentArray.push(0);
			mComponentArray.push(m);
			mComponentArray.push(a);
			yComponentArray.push(y);
			yComponentArray.push(y);
			yComponentArray.push(0);
			yComponentArray.push(a);
	    }
  	}
  	var cComponentData = {height: imageData.height, width: imageData.width, data: cComponentArray};
  	var mComponentData = {height: imageData.height, width: imageData.width, data: mComponentArray};
  	var yComponentData = {height: imageData.height, width: imageData.width, data: yComponentArray};
  	addImage(cComponentData);
  	addImage(mComponentData);
  	addImage(yComponentData);
}

function generateCMYKComponents(imageData) {
  if(!imageData)
      var imageData = imagesData[primaryImage];
    if(!imageData)
      uploadFirstNotification();
  var cComponentArray = [];
  var mComponentArray = [];
  var yComponentArray = [];
  var kComponentArray = [];
  var indexOfArray = 0;
  if(!imageData) return false;
  for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
      var r = imageData.data[indexOfArray++]/255;
      var g = imageData.data[indexOfArray++]/255;
      var b = imageData.data[indexOfArray++]/255;
      indexOfArray++; // a

      var k = 1 - Math.max(r,g,b);
      var c = ((1 - r - k) / (1 - k)*255);
      var m = ((1 - g - k) / (1 - k)*255);
      var y = ((1 - b - k) / (1 - k)*255);
      k *= 255;

      cComponentArray.push(0);
      cComponentArray.push(c);
      cComponentArray.push(c);
      cComponentArray.push(255);
      mComponentArray.push(m);
      mComponentArray.push(0);
      mComponentArray.push(m);
      mComponentArray.push(255);
      yComponentArray.push(y);
      yComponentArray.push(y);
      yComponentArray.push(0);
      yComponentArray.push(255);
      kComponentArray.push(k);kComponentArray.push(k);kComponentArray.push(k);kComponentArray.push(255);
      }
    }
    var cComponentData = {height: imageData.height, width: imageData.width, data: cComponentArray};
    var mComponentData = {height: imageData.height, width: imageData.width, data: mComponentArray};
    var yComponentData = {height: imageData.height, width: imageData.width, data: yComponentArray};
    var kComponentData = {height: imageData.height, width: imageData.width, data: kComponentArray};
    addImage(cComponentData);
    addImage(mComponentData);
    addImage(yComponentData);
    addImage(kComponentData);
}


function generateHSLComponentsv2 (imageData) {
  if(!imageData)
      var imageData = imagesData[primaryImage];
    if(!imageData)
      uploadFirstNotification();
  var hComponentArray = [];
  var sComponentArray = [];
  var lComponentArray = [];
  var indexOfArray = 0;
  if(!imageData) return false;
  for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
      var r = imageData.data[indexOfArray++];
      var g = imageData.data[indexOfArray++];
      var b = imageData.data[indexOfArray++];
      var a = imageData.data[indexOfArray++];

      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);

      var h, s, l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h *= 60;
      }

      hComponent = parseInt(h);
      if (hComponent > 360) hComponent = 360;
      if (hComponent < 0) hComponent = 0;
      sComponent = parseInt(s * 255);
      lComponent = parseInt(l * 255);

      if (hComponent >= 0 && hComponent <= 60) {
        redHue = 255;
        greenHue = hComponent*4.25;
        blueHue = 0;
      }
      if (hComponent >= 61 && hComponent <= 120) {
        redHue = 255 - (hComponent-60)*4.25;
        greenHue = 255;
        blueHue = 0;
      }
      if (hComponent >= 121 && hComponent <= 180) {
        redHue = 0;
        greenHue = 255;
        blueHue = (hComponent-120)*4.25;
      }
      if (hComponent >= 181 && hComponent <= 240) {
        redHue = 0;
        greenHue =  255 - (hComponent-180)*4.25;
        blueHue = 255;
      }
      if (hComponent >= 241 && hComponent <= 300) {
        redHue = (hComponent-240)*4.25;
        greenHue = 0;
        blueHue = 255;
      }
      if (hComponent >= 301 && hComponent <= 360) {
        redHue = 255;
        greenHue = 0;
        blueHue = 255 - (hComponent-300)*4.25;
      }

      redHue = Math.min(Math.max(parseInt(redHue), 0), 255);
      greenHue = Math.min(Math.max(parseInt(greenHue), 0), 255);
      blueHue = Math.min(Math.max(parseInt(blueHue), 0), 255);

      hComponentArray.push(redHue);
      hComponentArray.push(greenHue);
      hComponentArray.push(blueHue);
      hComponentArray.push(a);
      sComponentArray.push(sComponent);
      sComponentArray.push(sComponent);
      sComponentArray.push(sComponent);
      sComponentArray.push(a);
      lComponentArray.push(lComponent);
      lComponentArray.push(lComponent);
      lComponentArray.push(lComponent);
      lComponentArray.push(a);
      }
    }
    var hComponentData = {height: imageData.height, width: imageData.width, data: hComponentArray};
    var sComponentData = {height: imageData.height, width: imageData.width, data: sComponentArray};
    var lComponentData = {height: imageData.height, width: imageData.width, data: lComponentArray};
    addImage(hComponentData);
    addImage(sComponentData);
    addImage(lComponentData);
}

function generateHSLComponents(imageData) {
  if(!imageData)
      var imageData = imagesData[primaryImage];
    if(!imageData)
      uploadFirstNotification();
  var hComponentArray = [];
  var sComponentArray = [];
  var lComponentArray = [];
  var indexOfArray = 0;
  if(!imageData) return false;
  for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
      var r = imageData.data[indexOfArray++];
      var g = imageData.data[indexOfArray++];
      var b = imageData.data[indexOfArray++];
      var a = imageData.data[indexOfArray++];
      
      var zeroToOne = [r/255, g/255, b/255];
      var max = Math.max.apply(null, zeroToOne);
      var min = Math.min.apply(null, zeroToOne);
      var lComponent = (max + min)/2*255; //Converting percent to 0-255
      var sComponent = (max - min)/(max+min)*255; //Converting percent to 0-255
      var hComponent;
      if(r/255 == max) hComponent = (g/255-b/255)/(max-min);
      if(g/255 == max) hComponent = 2 + (b/255-r/255)/(max-min);
      if(b/255 == max) hComponent = 4 + (r/255-g/255)/(max-min);
      hComponent *= 60; //Converting to Degrees
      var redHue, greenHue, blueHue; //Converting hue to RGB

      //Hue pseudocoloring by original hue to PNG
      //reference - https://www.color-blindness.com/color-name-hue/
      if(y == 0)
        console.log({hComponent, sComponent, lComponent});

      if (hComponent >= 0 && hComponent <= 60) {
        redHue = 255;
        greenHue = hComponent*4;
        blueHue = 0;
      }
      if (hComponent >= 61 && hComponent <= 120) {
        redHue = 255 - (hComponent-60)*4;
        greenHue = 255;
        blueHue = 0;
      }
      if (hComponent >= 121 && hComponent <= 180) {
        redHue = 0;
        greenHue = 255;
        blueHue = (hComponent-120)*4;
      }
      if (hComponent >= 181 && hComponent <= 240) {
        redHue = 0;
        greenHue =  255 - (hComponent-181)*4;
        blueHue = 255;
      }
      if (hComponent >= 241 && hComponent <= 300) {
        redHue = (hComponent-240)*4;
        greenHue = 0;
        blueHue = 255;
      }
      if (hComponent >= 301 && hComponent <= 360) {
        redHue = 255;
        greenHue = 0;
        blueHue = 255 - (hComponent-300)*4;
      }

      hComponentArray.push(redHue);
      hComponentArray.push(greenHue);
      hComponentArray.push(blueHue);
      hComponentArray.push(a);
      sComponentArray.push(sComponent);
      sComponentArray.push(sComponent);
      sComponentArray.push(sComponent);
      sComponentArray.push(a);
      lComponentArray.push(lComponent);
      lComponentArray.push(lComponent);
      lComponentArray.push(lComponent);
      lComponentArray.push(a);
      }
    }
    var hComponentData = {height: imageData.height, width: imageData.width, data: hComponentArray};
    var sComponentData = {height: imageData.height, width: imageData.width, data: sComponentArray};
    var lComponentData = {height: imageData.height, width: imageData.width, data: lComponentArray};
    addImage(hComponentData);
    addImage(sComponentData);
    addImage(lComponentData);
}

function generateHSVComponents(imageData) {
  if(!imageData)
      var imageData = imagesData[primaryImage];
    if(!imageData)
      uploadFirstNotification();
  var hComponentArray = [];
  var sComponentArray = [];
  var vComponentArray = [];
  var indexOfArray = 0;
  if(!imageData) return false;
  for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var r = imageData.data[indexOfArray++];
        var g = imageData.data[indexOfArray++];
        var b = imageData.data[indexOfArray++];
        var a = imageData.data[indexOfArray++];
        
        var zeroToOne = [r/255, g/255, b/255];
        var max = Math.max.apply(null, zeroToOne);
        var min = Math.min.apply(null, zeroToOne);
        var vComponent = (max)*255; //Converting percent to 0-255
        if (max == 0)
          var sComponent = 0;
        else 
          var sComponent = (max - min)/(max)*255; //Converting percent to 0-255
        var hComponent;
        if(r/255 == max) hComponent = (g/255-b/255)/(max-min);
        if(g/255 == max) hComponent = 2 + (b/255-r/255)/(max-min);
        if(b/255 == max) hComponent = 4 + (r/255-g/255)/(max-min);
        if(max == min) hComponent = 0;
        hComponent *= 60; //Converting to Degrees
        var redHue, greenHue, blueHue; //Converting hue to RGB

        //Hue pseudocoloring by original hue to PNG
        //reference - https://www.color-blindness.com/color-name-hue/
        if (hComponent >= 0 && hComponent <= 60) {
          redHue = 255;
          greenHue = hComponent*4;
          blueHue = 0;
        }
        if (hComponent >= 61 && hComponent <= 120) {
          redHue = 255 - (hComponent-60)*4;
          greenHue = 255;
          blueHue = 0;
        }
        if (hComponent >= 121 && hComponent <= 180) {
          redHue = 0;
          greenHue = 255;
          blueHue = (hComponent-120)*4;
        }
        if (hComponent >= 181 && hComponent <= 240) {
          redHue = 0;
          greenHue =  255 - (hComponent-181)*4;
          blueHue = 255;
        }
        if (hComponent >= 241 && hComponent <= 300) {
          redHue = (hComponent-240)*4;
          greenHue = 0;
          blueHue = 255;
        }
        if (hComponent >= 301 && hComponent <= 360) {
          redHue = 255;
          greenHue = 0;
          blueHue = 255 - (hComponent-300)*4;
        }

        hComponentArray.push(redHue);
        hComponentArray.push(greenHue);
        hComponentArray.push(blueHue);
        hComponentArray.push(a);
        sComponentArray.push(sComponent);
        sComponentArray.push(sComponent);
        sComponentArray.push(sComponent);
        sComponentArray.push(a);
        vComponentArray.push(vComponent);
        vComponentArray.push(vComponent);
        vComponentArray.push(vComponent);
        vComponentArray.push(a);
      }
    }
    var hComponentData = {height: imageData.height, width: imageData.width, data: hComponentArray};
    var sComponentData = {height: imageData.height, width: imageData.width, data: sComponentArray};
    var vComponentData = {height: imageData.height, width: imageData.width, data: vComponentArray};
    addImage(hComponentData);
    addImage(sComponentData);
    addImage(vComponentData);
}

function generateYUVComponents(imageData) {
  if(!imageData)
      var imageData = imagesData[primaryImage];
  if(!imageData)
    uploadFirstNotification();
  var yComponentArray = [];
  var uComponentArray = [];
  var vComponentArray = [];
  var indexOfArray = 0;
  if(!imageData) return false;
  for (var y = 0; y < imageData.height; y++) {
    for (var x = 0; x < imageData.width; x++) {
      var r = imageData.data[indexOfArray++];
      var g = imageData.data[indexOfArray++];
      var b = imageData.data[indexOfArray++];
      var a = imageData.data[indexOfArray++];

      var y = 0.299 * r + 0.587 * g + 0.114 * b;
      var u = (-0.14713 * r) + (-0.28886 * g) + 0.436 * b
      var v = 0.615 * r + (-0.55861 * g) + (-0.05639 * b);


      yComponentArray.push(y);
      yComponentArray.push(y);
      yComponentArray.push(y);
      yComponentArray.push(a);
      uComponentArray.push(0);
      uComponentArray.push(u);
      uComponentArray.push(u);
      uComponentArray.push(a);
      vComponentArray.push(v);
      vComponentArray.push(v);
      vComponentArray.push(0);
      vComponentArray.push(a);
    }
  }
  var yComponentData = {height: imageData.height, width: imageData.width, data: yComponentArray};
  var uComponentData = {height: imageData.height, width: imageData.width, data: uComponentArray};
  var vComponentData = {height: imageData.height, width: imageData.width, data: vComponentArray};
  addImage(yComponentData);
  addImage(uComponentData);
  addImage(vComponentData);
}

function generateYCbCrComponents(imageData, twoColors) {
  if(!imageData)
      var imageData = imagesData[primaryImage];
  if(!imageData)
    uploadFirstNotification();
  var yComponentArray = [];
  var bComponentArray = [];
  var rComponentArray = [];
  var indexOfArray = 0;

  if(!imageData) return false;
  for (var y = 0; y < imageData.height; y++) {
    for (var x = 0; x < imageData.width; x++) {
      var r = imageData.data[indexOfArray++];
      var g = imageData.data[indexOfArray++];
      var b = imageData.data[indexOfArray++];
      var a = imageData.data[indexOfArray++];

      var y = Math.min(Math.max(parseInt(0.299 * r + 0.587 * g + 0.114 * b + 0), 0), 255);
      var Cb = Math.min(Math.max(parseInt((-0.169 * r) + (-0.331 * g) + 0.5 * b + 128), 0), 255);
      var Cr = Math.min(Math.max(parseInt(0.5 * r + (-0.419 * g) + (-0.081 * b) + 128), 0), 255);

      if(twoColors) {
        if (Cb > 128) {
          cbRed = 130;
          cbGreen = 116;
          //cbBlue = 140 + (Cb/4);
          cbBlue = (Cb);
        } else {
          cbRed = 130;
          cbGreen = 135;
          //cbBlue = 120 - (Cb/2);
          cbBlue = (Cb);
        }
        bComponentArray.push(cbRed);
        bComponentArray.push(cbGreen);
        bComponentArray.push(cbBlue);
        bComponentArray.push(a);
      } else {
        bComponentArray.push(parseInt(0.63*Cb));
        bComponentArray.push(parseInt(0.56*Cb));
        bComponentArray.push(Cb);
        bComponentArray.push(a);
      }

      yComponentArray.push(y);
      yComponentArray.push(y);
      yComponentArray.push(y);
      yComponentArray.push(a);
      
      rComponentArray.push(parseInt(0.63*Cr));
      rComponentArray.push(Cr);
      rComponentArray.push(parseInt(0.87*Cr));
      rComponentArray.push(a);
    }
  }
  var yComponentData = {height: imageData.height, width: imageData.width, data: yComponentArray};
  var bComponentData = {height: imageData.height, width: imageData.width, data: bComponentArray};
  var rComponentData = {height: imageData.height, width: imageData.width, data: rComponentArray};
  addImage(yComponentData);
  addImage(bComponentData);
  addImage(rComponentData);
}