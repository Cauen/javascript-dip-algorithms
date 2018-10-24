var mouseOverImage;
var mouseOverX;
var mouseOverY;

$(document).on('mousemove', 'canvas', function(e) {
	if (options.get_pixel_data) {
		var pos = findPos(this);
	    var x = e.pageX - pos.x;
	    mouseOverX = x;
	    
	    var y = e.pageY - pos.y;
	    mouseOverY = y;

	    var coord = "x=" + x + ", y=" + y;
	    var c = this.getContext('2d');
	    var p = c.getImageData(x, y, 1, 1).data; 
	    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	    var imageid = $(this).attr("image-number");
	    mouseOverImage = imageid;

	    if (!imageid) imageid = "Chart";
	    $('#status').html("#" + imageid +": "+ coord + " " + hex + " rgb(" + p[0] + "," + p[1] + "," + p[2] + ")");
	}
    
});

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}