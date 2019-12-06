function linearTransform (imageData, newMin, newMax) {
	if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    if (!newMin)
    	newMin = 50;
    if (!newMax)
    	newMax = 100;

    newMax = parseInt(newMax);
    newMin = parseInt(newMin);

    var indexOfArray = 0;
    var isBlackAndWhite = isBlackAndWhiteImage(imageData);
    var maxR = -Infinity; var maxG = -Infinity; var maxB = -Infinity; var minR = Infinity ; var minG = Infinity ; var minB = Infinity ; //To Normalize
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            maxR = Math.max(isNaN(r) ? -Infinity : r, maxR);
            minR = Math.min(isNaN(r) ? Infinity : r, minR);
            
			
            if(!isBlackAndWhite) {
            	maxG = Math.max(isNaN(g) ? -Infinity : g, maxG);
				minG = Math.min(isNaN(g) ? Infinity : g, minG);
				maxB = Math.max(isNaN(b) ? -Infinity : b, maxB);
				minB = Math.min(isNaN(b) ? Infinity : b, minB);
            }

        }
    }

	var redComponentArray = [];
	var greenComponentArray = [];
	var blueComponentArray = [];
    var indexOfArray = 0;
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            var newR = parseInt((newMax - newMin)/(maxR - minR)*(r - minR) + newMin);
			Array.prototype.push.apply(redComponentArray, [newR,newR,newR,255])
  			

            if(!isBlackAndWhite) {
				var newG = parseInt((newMax - newMin)/(maxG - minG)*(g - minG) + newMin);
				var newB = parseInt((newMax - newMin)/(maxB - minB)*(b - minB) + newMin);
				Array.prototype.push.apply(greenComponentArray, [newG,newG,newG,255]);
				Array.prototype.push.apply(blueComponentArray, [newB,newB,newB,255]);
				
            }
           
        }
    }
    var redComponentData = {height: imageData.height, width: imageData.width, data: redComponentArray};
    console.log(redComponentData);
    addImage(redComponentData);

    if(!isBlackAndWhite) {
  		var greenComponentData = {height: imageData.height, width: imageData.width, data: greenComponentArray};
  		var blueComponentData = {height: imageData.height, width: imageData.width, data: blueComponentArray};
	    addImage(greenComponentData);
		addImage(blueComponentData);
	}
}

function callLinearTransform () {
	var imageData = imagesData[primaryImage];
	if (!imageData) { uploadFirstNotification(); return false; }

	swal({
        title: 'Type Max and Min',
        type: 'question',
        html:
        '<label>New Min</label><input id="newMin" class="swal2-input"><label>New Max</label><input id="newMax" class="swal2-input"><br><span>Leave empty to default 50 and 100</span>',
        focusConfirm: false,
        preConfirm: () => {
            return [
            	console.log(document.getElementById('newMin').value),
            	console.log(document.getElementById('newMax').value),
                linearTransform(imageData, document.getElementById('newMin').value, document.getElementById('newMax').value)
            ]
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

function invertColors (imageData) { //Postfix = 255 a -
	if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var indexOfArray = 0;
    var ComponentsArray = [];
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            var a = imageData.data[indexOfArray++];

            var newR = 255 - r;
            var newG = 255 - g;
            var newB = 255 - b;
            Array.prototype.push.apply(ComponentsArray, [newR,newG,newB,255]);

        }
    }

    var ComponentsData = {height: imageData.height, width: imageData.width, data: ComponentsArray};
	addImage(ComponentsData);
}

function notLinear (imageData, operation) {
	if(!imageData)
        var imageData = imagesData[primaryImage];
    if(!imageData)
        uploadFirstNotification();
    if(!imageData) return false;

    var indexOfArray = 0;
    var isBlackAndWhite = isBlackAndWhiteImage(imageData);
    var maxR = -Infinity; var maxG = -Infinity; var maxB = -Infinity; var minR = Infinity ; var minG = Infinity ; var minB = Infinity ; //To Normalize
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var r = imageData.data[indexOfArray++];
            var g = imageData.data[indexOfArray++];
            var b = imageData.data[indexOfArray++];
            indexOfArray++; //a

            maxR = Math.max(isNaN(r) ? -Infinity : r, maxR);
            minR = Math.min(isNaN(r) ? Infinity : r, minR);
            
			
            if(!isBlackAndWhite) {
            	maxG = Math.max(isNaN(g) ? -Infinity : g, maxG);
				minG = Math.min(isNaN(g) ? Infinity : g, minG);
				maxB = Math.max(isNaN(b) ? -Infinity : b, maxB);
				minB = Math.min(isNaN(b) ? Infinity : b, minB);
            }

        }
    }

    console.log('Operation: ' + operation);
    switch (operation) {
    	case 'log': 
	    	var a = 255/(Math.log(1+maxR));
		    var formula = 'a 1 + ln '+a+' *';
		    operationsAritAndLogic('postFixFormula',formula,imageData,imageData);
		    break;
		case 'exp':
			//var a = 1;
            var a = 255/((Math.E + 1) ** (maxR + minR));
            console.log('MinRRRRR' + maxR);
            console.log("A: " + a);
			var formula = 'e 1 + a ^ '+a+' *';
            console.log(formula);
		    operationsAritAndLogic('postFixFormula',formula,imageData,imageData);
		    break;
		case 'sqrt':
			var a = 255/(Math.sqrt(1+maxR));
			var formula = 'a sqrt '+a+' *';
		    operationsAritAndLogic('postFixFormula',formula,imageData,imageData);
            break;
        case 'squa':
            var a = 255/maxR ** 2;
            var formula = 'a 2 ^ '+a+' *';
            operationsAritAndLogic('postFixFormula',formula,imageData,imageData);
    }
    
}

var chartsCount = 0;

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
};

var bar_chart;
function histogram_compare (image1Data, image2Data, labelBlue, labelOrange) {
    var canv = document.createElement('canvas');
    canv.id = "chart-id-"+chartsCount++;

    canv.className = 'chartOnCanvas';
    canv.setAttribute("chartNumber", canv.id);
    document.getElementById('originalImages').appendChild(canv); // adds the canvas to the body element    
    var ctx = document.getElementById(canv.id).getContext('2d');
    canv.width  = 600;
    canv.height =  350;
    var url = canv.toDataURL();


     // Return with commas in between
    var numberWithCommas = function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    var image1Data = image1Data ? image1Data : imagesData[primaryImage];
    var secondImageIsSecundary;
    if (!image2Data) {
        image2Data = imagesData[secundaryImage];
        secondImageIsSecundary = true;
    }
    var indexOfArray = 0;
    var dataPack1 = Array(256).fill(0);
    //console.log(dataPack1);
    if(!image1Data) return false;
    for (var y = 0; y < image1Data.height; y++) {
        for (var x = 0; x < image1Data.width; x++) {
            var r = image1Data.data[indexOfArray++];
            var g = image1Data.data[indexOfArray++];
            var b = image1Data.data[indexOfArray++];
            var a = image1Data.data[indexOfArray++];
            dataPack1[r] += 1;
        }
    }
        
    //console.log(dataPack1);
    indexOfArray = 0;
    var dataPack2 = Array(256).fill(0);
    for (var y = 0; y < image2Data.height; y++) {
        for (var x = 0; x < image2Data.width; x++) {
            var r = image2Data.data[indexOfArray++];
            var g = image2Data.data[indexOfArray++];
            var b = image2Data.data[indexOfArray++];
            var a = image2Data.data[indexOfArray++];
            dataPack2[r] += 1;
        }
    }
    //var dataPack1 = [21000, 22000, 26000, 35000, 55000, 55000, 56000, 59000, 60000, 61000, 60100, 62000];
    //var dataPack2 = [1000, 1200, 1300, 1400, 1060, 2030, 2070, 4000, 4100, 4020, 4030, 4050];

    var dates = Array.from({length: 256}, (x, i) => i);

    // Chart.defaults.global.elements.rectangle.backgroundColor = '#FF0000';

    var secondColor;
    if (!secondImageIsSecundary) {
        secondColor = 'rgba(240, 78, 81, 0.7)';
    } else {
        secondColor = 'rgba(255, 154, 0, 0.7)';
    }
    var bar_ctx = document.getElementById(canv.id);
    bar_chart = new Chart(bar_ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
            {
                label: labelBlue,
                data: dataPack1,
                            backgroundColor: "rgba(55, 160, 225, 0.7)",
                            hoverBackgroundColor: "rgba(55, 160, 225, 0.7)",
                            hoverBorderWidth: 2,
                            hoverBorderColor: 'lightgrey'
            },
            {
                label: labelOrange,
                data: dataPack2,
                            backgroundColor: secondColor,
                            hoverBackgroundColor: secondColor,
                            hoverBorderWidth: 2,
                            hoverBorderColor: 'lightgrey'
            },
            ]
        },
        options: {
                animation: {
                duration: 10,
            },
            tooltips: {
                        mode: 'label',
                        position: 'average',
                        intersect: false,
              callbacks: {
              label: function(tooltipItem, data) { 
                return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
              }
              }
             },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true,
                        fontColor : "rgba(112,98,88,1)",
                        autoSkip: true,
                        autoSkipPadding: 8
                    }
                }]
            }, // scales
            legend: {display: true},
            animation : {
                onComplete : function(){    
                    //done();
                    //if(options.roll_down)
                    //    window.scrollTo(0,document.querySelector(".container").scrollHeight); //Scroll bottom
                }
            },
            responsive: options.full_width_charts,
            maintainAspectRatio: true,
        } // options
       }
    );

	if(options.roll_down)
                        window.scrollTo(0,document.querySelector(".container").scrollHeight); //Scroll bottom
}

function equalize_image (image1Data) {
    var image1Data = image1Data ? image1Data : imagesData[primaryImage];
    if(!image1Data) return false;
    var indexOfArray = 0;
    var dataPack1 = Array(256).fill(0);
    for (var y = 0; y < image1Data.height; y++) {
        for (var x = 0; x < image1Data.width; x++) {
            var r = image1Data.data[indexOfArray++];
            var g = image1Data.data[indexOfArray++];
            var b = image1Data.data[indexOfArray++];
            var a = image1Data.data[indexOfArray++];
            dataPack1[r] += 1;
        }
    }
    var dataPack1Percentage = Array(256).fill(0);
    for (var i = 0; i <= 255; i++) {
        dataPack1Percentage[i] = dataPack1[i]/(image1Data.width * image1Data.height);
    }

    var cumulativeDataPack1Percentage = Array(256).fill(0);
    for (var i = 0; i<= 255; i++) {
        if (i>=1)
            cumulativeDataPack1Percentage[i] = dataPack1Percentage[i] + cumulativeDataPack1Percentage[i - 1];
        else 
            cumulativeDataPack1Percentage[0] = dataPack1Percentage[0];
    }

    var mapArray = Array(256).fill(0);
    for (var i = 0; i <= 255; i++) {
        mapArray[i] = Math.round(cumulativeDataPack1Percentage[i] * 255);
    }

    indexOfArray = 0;
    var newImageData = [];
    for (var y = 0; y < image1Data.height; y++) {
        for (var x = 0; x < image1Data.width; x++) {
            var r = image1Data.data[indexOfArray++];
            //var g = image1Data.data[indexOfArray++];
            //var b = image1Data.data[indexOfArray++];
            //var a = image1Data.data[indexOfArray++];
            //newImageData.push(mapArray[r]);newImageData.push(mapArray[r]);newImageData.push(mapArray[r]);newImageData.push(255);
            Array.prototype.push.apply(newImageData, [mapArray[r],mapArray[r],mapArray[r],255]);
            indexOfArray += 3;
        }
    }

    var equalizedImage = {height: image1Data.height, width: image1Data.width, data: newImageData};
    addImage(equalizedImage);
    histogram_compare(image1Data, equalizedImage, 'Original', 'Equalized');
    console.log(dataPack1Percentage);
    console.log(cumulativeDataPack1Percentage);
    console.log('Sum: ' + dataPack1Percentage.reduce(function(acc, val) { return acc + val; }, 0))
}

/*
function done(){
    var image = bar_chart.toBase64Image();
    console.log(image);

    var imgz = new Image;
    imgz.src = image;

    imgz.onload = function() { 
        var canv = document.createElement('canvas');
        canv.id = "chart-id-"+chartsCount++;
        canv.width  = imgz.width;
        canv.height =  imgz.height;

        canv.setAttribute("chartImg", canv.id);
        document.getElementById('originalImages').appendChild(canv); // adds the canvas to the body element    
        var ctxz = document.getElementById(canv.id).getContext('2d');
        ctxz.drawImage(imgz,0,0);
    }
}
*/
function callGammaCorrection() {
    var imageData = imagesData[primaryImage];
    if (!imageData) { uploadFirstNotification(); return false; }

    swal({
        title: 'Gamma Correction<br> 𝑠 = 𝑐 * ((pixel)^y)',
        type: 'question',
        html:
        '<label>c (Generally 1)</label><input id="cGamma" value="1" class="swal2-input"><label>y</label><input id="yGamma" class="swal2-input"><br>',
        focusConfirm: false,
        preConfirm: () => {
            var formula = 'a '+document.getElementById('yGamma').value+' ^ '+document.getElementById('cGamma').value+' *';
            console.log(formula);
            operationsAritAndLogic('postFixFormula', formula, imageData, imageData);
        },
        onOpen: () => {
            $('.swal2-popup').on('keydown', function(e) {
                if (e.keyCode == 13) {
                    $(".swal2-confirm").trigger('click');
                }
                
            });
            var y = jQuery("#yGamma").val();
            var c = jQuery("#cGamma").val();
            console.log(y);
            if (!$.isNumeric( y ) || !$.isNumeric( c )) {
                $(".swal2-confirm").prop('disabled', true);
            } else {
                $(".swal2-confirm").prop('disabled', false); //disable
            }
            $('.swal2-popup').on('input', 'input', function() {
                var y = jQuery("#yGamma").val();
                var c = jQuery("#cGamma").val();
                console.log(y);
                if (!$.isNumeric( y ) || !$.isNumeric( c )) {
                    $(".swal2-confirm").prop('disabled', true);
                } else {
                    $(".swal2-confirm").prop('disabled', false); //disable
                }
            });
        },
    });
}