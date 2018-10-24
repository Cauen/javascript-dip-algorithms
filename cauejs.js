// PDI (Digital Image Processing) Project Emanuel Cauê 2018.1 UFERSA

var logging = true;		
var imagesData = [];
var canvasArray = [];
var urlImgArray = [];
var primaryImage, secundaryImage, primaryImageURL, secundaryImageURL;
$(".changesNotifications").hide();

function loadSavedImages() {
	
	
	primaryImage = localStorage.getItem('primaryImage');
	secundaryImage = localStorage.getItem('secundaryImage');

	primaryImageURL = localStorage.getItem('primaryImageURL');
	secundaryImageURL = localStorage.getItem('secundaryImageURL');

	if (!secundaryImageURL) return false;

	var secundaryImageElement = new Image();
	secundaryImageElement.src = secundaryImageURL;

	secundaryImageElement.onload = function() {
        var imageDataSec = {img: secundaryImageElement, height: this.height, width: this.width};
        addImage(imageDataSec, 'Saved', undefined, 1);
    }

    if (!primaryImageURL) return false;

    var primaryImageElement = new Image();
	primaryImageElement.src = primaryImageURL;

	primaryImageElement.onload = function() {
        var imageDataPri = {img: primaryImageElement, height: this.height, width: this.width};
        addImage(imageDataPri, 'Saved', 1);
    }
	
}

if (options.local_storage) 
	loadSavedImages();


function openImage(ev) {
	console.log('OPEN IMAGE CALLED');
    var files = ev.target.files; // FileList object

    //read all files selected
    for (var i = 0, f; f = files[i]; i++) {
        // If png, gif or jpg
        if (f.type.match('image.*')) {
            console.log(ev);
            console.log(f);

            var type = f.type;
            type = type.substring(6, 10);
    		type.replace(/\w/, c => c.toUpperCase())

            var img = new Image(),
            url = window.URL || window.webkitURL,
            src = url.createObjectURL(f);

            img.src = src;
            if (logging) console.log('Type of file: ' + f.name);
            img.onload = function() {
                var imageData = {img: img, height: this.height, width: this.width};
                addImage(imageData, type, 1);
                
                setTimeout(function(){ $('#uploadimage').val(''); }, 2000); // Unselect File to enable re-upload
            }
        } else { //if pgm
            var reader = new FileReader();
            if (logging) console.log('Openning PGM: ' + f.name);
            var dimensoes, arrayOfLines;
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    console.log("Reader called!");
                    var contentofimage = e.target.result;
                    var resBase64 = contentofimage.substring(contentofimage.indexOf(",") + 1);
                    var decoded = atob(resBase64);
                    arrayOfLines = decoded.split('\n');
                    // Support to commented pgm
                    arrayOfLines = arrayOfLines.filter( function(item) {
						return (item[0] != '#');
					});
                    dimensoes = arrayOfLines[1].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                    //console.log(arrayOfLines);

                    //getting array of rgba
                    //reading lines
                    var dataSomada = [];
                    for (var i = 3; i < dimensoes[0] + 2; i++) {

                        var line = arrayOfLines[i];
                        if (!line) continue;
                        //console.log(line);

                        var arrayThisLine = line.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                        for (var j = 0; j < arrayThisLine.length; j++) {
                        	var thisPixel = parseInt(arrayThisLine[j]);
                            dataSomada.push(thisPixel);
                            dataSomada.push(thisPixel);
                            dataSomada.push(thisPixel);
                            dataSomada.push(255);
                        }
                    }
                    //console.log('Data somada: ');
                    
                    var imageData = {data: dataSomada, height: dimensoes[0], width: dimensoes[1]};
                    addImage(imageData, 'pgm', 1);

                    setTimeout(function(){ $('#uploadimage').val(''); }, 2000); // Unselect File to enable re-upload
                };
            

            })(f);

            

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);

            //Scroll bottom 

        }
    }
}
document.getElementById("uploadimage").addEventListener("change", openImage, false);
let body = document.body;
let fileInput = document.getElementById("uploadimage");

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    body.classList.add('dragging');
});

document.addEventListener('dragleave', () => {
    body.classList.remove('dragging');
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    body.classList.remove('dragging');

    fileInput.files = e.dataTransfer.files;
});

function clearDesktop() {
	$( "#originalImages canvas" ).remove();
	imagesData = [];
	canvasArray = [];
	primaryImage = secundaryImage = undefined;

	$("#imagesTable tr").remove();
}

function addImage(imageData, typeOfImage, setPrimaryFlag, setSecundaryFlag) {
	var canv = document.createElement('canvas');
    canv.id = 'canvas-numero-' + canvasArray.length;
    canv.setAttribute("image-number", canvasArray.length);
    canv.className = 'imageOnCanvas';
    document.getElementById('originalImages').appendChild(canv); // adds the canvas to the body element    
    var ctx = document.getElementById(canv.id).getContext('2d');
    canv.width  = imageData.width;
    canv.height =  imageData.height;
    
    if (imageData.data) {//If its a ImageData, like PGM or Other
        //var t0 = performance.now();
        var imageDataz = ctx.getImageData(0, 0, imageData.width, imageData.height);
        
		
		//imageDataz.data = imageData.data;
		var campled  = new Uint8ClampedArray(imageData.data);
		//console.log(campled);
		try {
			imageDataz.data.set(campled);
		} catch { // if too large
			for (var z = 0; z < imageData.data.length; ++z) {
				imageDataz.data[z] = imageData.data[z];
			}
		}
  

        //imageDataz.data.set(buf8);
    	//putImageData(ctx, imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        //console.log(imageData);
        //console.log(imageDataz);
        ctx.putImageData(imageDataz, 0, 0);


        //var t1 = performance.now();
        //console.log("Image Drawn in  " + (t1 - t0) + " milliseconds.");
    } else { //If its a Image Loaded Directly
    	ctx.drawImage(imageData.img, 0, 0);
    	imageData = ctx.getImageData(0, 0, imageData.width, imageData.height);
    }

	canvasArray.push(canv);
	imagesData.push(imageData);
	var urlOfImage = canv.toDataURL();
	urlImgArray.push(urlOfImage);

	

    if (!typeOfImage) typeOfImage = 'Generated';
    var d = new Date();
    //var timeOfAddiction = d.getDate() + "/" + parseInt(parseInt(d.getMonth()) + parseInt(1)) + " " + d.getHours() + ":" + d.getMinutes();
	var currentHours = d.getHours();
	currentHours = ("0" + currentHours).slice(-2);
	var currentMinutes = d.getMinutes();
	currentMinutes = ("0" + currentMinutes).slice(-2);

    var imageInfo = imageData.width + "x" + imageData.height + " " + currentHours + ":" + currentMinutes;
    $( "#imagesTable" ).prepend('<tr image-number="'+parseInt(canvasArray.length-1)+'" class="imageLoaded"><td><div class="primary contact contact-rounded contact-bordered contact-lg status-online"><img src="'+urlOfImage+'" class="mCS_img_loaded"><div class="contact-container"><div class="typeOfImage">#'+parseInt(canvasArray.length)+" "+typeOfImage+'</div><span>'+imageInfo+'</span></div></div></td><td><button style="margin-right:  3px;" class="mark-primary btn btn-default btn-icon"><span class="fa fa-star"></span></button><button class="mark-secundary btn btn-default btn-icon" style="margin-right:  3px;"><span class="fa fa-star-half-empty" style="color:  #ff9a00;"></span></button><button class="delete-image btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>' );

	if (canvasArray.length == 1) {
		setPrimary(0); setSecundary(0);
	} else 	if (canvasArray.length == 2 && setPrimaryFlag) {
		setPrimary(1); setSecundary(0);
	} else {
		if (options.accumulate) {
			setPrimary(canvasArray.length - 1); //
		}
		
		if (options.auto_secundary) {
			setSecundary(canvasArray.length-2);
		}
	}

	if (setPrimaryFlag) {
		setPrimary(canvasArray.length - 1);
	}

	if (setSecundaryFlag) {
		setPrimary(canvasArray.length - 2);
	}

    if(options.roll_down)
    	window.scrollTo(0,document.querySelector(".container").scrollHeight); //Scroll bottom


    /*if (options.local_storage)
    	saveData(canvasArray.length-1);*/

    $(".changesNotifications").text(parseInt($("#menuOptions").text()) + 1);
    $("#lastUpdate").text(new Date().toLocaleString());
    $(".changesNotifications").show();
}

function addImageOLD_11_08_putImageData(imageData, typeOfImage, setPrimaryFlag, setSecundaryFlag) {
    var canv = document.createElement('canvas');
    canv.id = 'canvas-numero-' + canvasArray.length;
    canv.setAttribute("image-number", canvasArray.length);
    canv.className = 'imageOnCanvas';
    document.getElementById('originalImages').appendChild(canv); // adds the canvas to the body element    
    var ctx = document.getElementById(canv.id).getContext('2d');
    canv.width  = imageData.width;
    canv.height =  imageData.height;
    
    if (imageData.data) {//If its a ImageData, like PGM or Other
        var t0 = performance.now();
        putImageData(ctx, imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        var t1 = performance.now();
        console.log("Image Drawn in  " + (t1 - t0) + " milliseconds.");
    } else { //If its a Image Loaded Directly
        ctx.drawImage(imageData.img, 0, 0);
        imageData = ctx.getImageData(0, 0, imageData.width, imageData.height);
    }

    canvasArray.push(canv);
    imagesData.push(imageData);
    var urlOfImage = canv.toDataURL();
    urlImgArray.push(urlOfImage);

    

    if (!typeOfImage) typeOfImage = 'Generated';
    var d = new Date();
    //var timeOfAddiction = d.getDate() + "/" + parseInt(parseInt(d.getMonth()) + parseInt(1)) + " " + d.getHours() + ":" + d.getMinutes();
    var currentHours = d.getHours();
    currentHours = ("0" + currentHours).slice(-2);
    var currentMinutes = d.getMinutes();
    currentMinutes = ("0" + currentMinutes).slice(-2);

    var imageInfo = imageData.width + "x" + imageData.height + " " + currentHours + ":" + currentMinutes;
    $( "#imagesTable" ).prepend('<tr image-number="'+parseInt(canvasArray.length-1)+'" class="imageLoaded"><td><div class="primary contact contact-rounded contact-bordered contact-lg status-online"><img src="'+urlOfImage+'" class="mCS_img_loaded"><div class="contact-container"><div class="typeOfImage">#'+parseInt(canvasArray.length)+" "+typeOfImage+'</div><span>'+imageInfo+'</span></div></div></td><td><button style="margin-right:  3px;" class="mark-primary btn btn-default btn-icon"><span class="fa fa-star"></span></button><button class="mark-secundary btn btn-default btn-icon" style="margin-right:  3px;"><span class="fa fa-star-half-empty" style="color:  #ff9a00;"></span></button><button class="delete-image btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>' );

    if (canvasArray.length == 1) {
        setPrimary(0); setSecundary(0);
    } else  if (canvasArray.length == 2 && setPrimaryFlag) {
        setPrimary(1); setSecundary(0);
    } else {
        if (options.accumulate) {
            setPrimary(canvasArray.length - 1); //
        }
        
        if (options.auto_secundary) {
            setSecundary(canvasArray.length-2);
        }
    }

    if (setPrimaryFlag) {
        setPrimary(canvasArray.length - 1);
    }

    if (setSecundaryFlag) {
        setPrimary(canvasArray.length - 2);
    }

    if(options.roll_down)
        window.scrollTo(0,document.querySelector(".container").scrollHeight); //Scroll bottom


    /*if (options.local_storage)
        saveData(canvasArray.length-1);*/

    $(".changesNotifications").text(parseInt($("#menuOptions").text()) + 1);
    $("#lastUpdate").text(new Date().toLocaleString());
    $(".changesNotifications").show();
}

/*function saveData(id) {
	var sizeOfImage = lengthInUtf8Bytes(JSON.stringify(urlImgArray[id]));
	console.log('Size of url image: ' + sizeOfImage/1000000 + " mb" );
	//localStorage.setItem('imagesUrls', JSON.stringify(urlImgArray));
	
	
}*/

$("#imagesTable").on('click', '.mark-primary', function() {
	var imageNumber = $(this).closest('tr.imageLoaded').attr('image-number');
	setPrimary(imageNumber, true);
});

$("#imagesTable").on('click', '.mark-secundary', function() {
	var imageNumber = $(this).closest('tr.imageLoaded').attr('image-number');
	setSecundary(imageNumber, true);
});

//LISTENERS OF CLICKING IN CANVAS

var DELAY = 300,
    clicks = 0,
    timer = null;

$("#originalImages").on("click", 'canvas.chartOnCanvas', function(e){
    if(cntrlIsPressed) {
        $(this).remove();
        return false;
    }
});

$("#originalImages").on("click", 'canvas.imageOnCanvas', function(e){
		if(!options.enable_shortcuts) return false;
        if ($("body").hasClass("region-growth")) {
                regionGrowth(imagesData[mouseOverImage], mouseOverX, mouseOverY, distanceRegionGrowth);
                return false;
        }
		var that = this;
		if(cntrlIsPressed) {
			$(this).remove();
			return false;
		}
        clicks++;  //count clicks
        if(clicks === 1) {
            timer = setTimeout(function() {
                var imageNumber = $(that).attr('image-number');
				setPrimary(imageNumber, true);
                clicks = 0;  //after action performed, reset counter
            }, DELAY);
        } else {
            clearTimeout(timer);  //prevent single-click action
            var imageNumber = $(this).attr('image-number');
			setSecundary(imageNumber, true);
            clicks = 0;  //after action performed, reset counter
        }

    })
    .on("dblclick", function(e){
        e.preventDefault();  //cancel system double-click event
    });
/*
$('#originalImages').on( "click", 'canvas', function() {
	
} );

$('html').on("dblclick", "canvas", function() {
    
});
*/



$('.app-navigation-logo-button').on('click', function() {
    $(".changesNotifications").text(0);
    $(".changesNotifications").hide();
});

var cntrlIsPressed = false;

function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}


$('#originalImages').on( "contextmenu", 'canvas', function() {
	if (cntrlIsPressed && options.enable_shortcuts) {
		var imageNumber = $(this).attr('image-number');
		var d = new Date();
		var currentHours = d.getHours();
		currentHours = ("0" + currentHours).slice(-2);
		var currentMinutes = d.getMinutes();
		currentMinutes = ("0" + currentMinutes).slice(-2);
		forceDownload(urlImgArray[imageNumber], 'PDI Image ' + imageNumber+currentHours+currentMinutes);

		return false;
	}

} );


function setPrimary(imageNumber, notify) {
	console.log("PRIMARY: " + imageNumber);
	$('#imagesTable tr').removeClass('primary-tr'); //Removing Primary
	$('#imagesTable tr.imageLoaded[image-number="'+imageNumber+'"]').addClass('primary-tr');

	$('canvas').removeClass('primary-canvas'); //Removing Primary
	if (options.highlight_images)
		$('canvas[image-number="'+imageNumber+'"]').addClass('primary-canvas');

	primaryImage = imageNumber;
	localStorage.setItem('primaryImage', primaryImage);
	localStorage.setItem('primaryImageURL', urlImgArray[primaryImage]);
	if (notify)
		setImageAsNotification('primary');
}
function setSecundary(imageNumber, notify) {
	$('#imagesTable tr').removeClass('secundary-tr'); //Removing Primary
	$('#imagesTable tr.imageLoaded[image-number="'+imageNumber+'"]').addClass('secundary-tr');

	$('canvas').removeClass('secundary-canvas'); //Removing Primary
	if (options.highlight_images)
		$('canvas[image-number="'+imageNumber+'"]').addClass('secundary-canvas');

	secundaryImage = imageNumber;
	localStorage.setItem('secundaryImage', secundaryImage);
	localStorage.setItem('secundaryImageURL', urlImgArray[secundaryImage]);
	if (notify)
		setImageAsNotification('secundary');
}

$('body').on('click', '.delete-image', function() {
	$(this).closest('tr.imageLoaded').remove();
});

document.onpaste = function(event){
	if(!options.enable_shortcuts) return false;
	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  //console.log(JSON.stringify(items)); // will give you the mime types
  for (index in items) {
  	var item = items[index];
  	if (item.kind === 'file') {
  		var blob = item.getAsFile();
  		var reader = new FileReader();
  		reader.onload = function(event){

        	var copiedImage = new Image();
			copiedImage.src = event.target.result;

			copiedImage.onload = function() {
		        var imageDataPasted = {img: copiedImage, height: this.height, width: this.width};
		        addImage(imageDataPasted, 'Pasted', 1);
		    }
        }; // data url!
        reader.readAsDataURL(blob);
    }
}
}



 
function putImageData(ctx, imageData, dx, dy,
    dirtyX, dirtyY, dirtyWidth, dirtyHeight) {



  var data = imageData.data;
  var height = imageData.height;
  var width = imageData.width;
  dirtyX = dirtyX || 0;
  dirtyY = dirtyY || 0;
  
  dirtyWidth = dirtyWidth !== undefined? dirtyWidth: width;
  dirtyHeight = dirtyHeight !== undefined? dirtyHeight: height;
  var limitBottom = Math.min(dirtyHeight, height);
  var limitRight = Math.min(dirtyWidth, width);
  for (var y = dirtyY; y < limitBottom; y++) {
    for (var x = dirtyX; x < limitRight; x++) {
      var pos = y * width + x;
      ctx.fillStyle = 'rgba(' + data[pos*4+0]
                        + ',' + data[pos*4+1]
                        + ',' + data[pos*4+2]
                        + ',' + (data[pos*4+3]/255) + ')';
      ctx.fillRect(x + dx, y + dy, 1, 1);
    }
  }


  
}
