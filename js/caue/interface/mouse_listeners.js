window.addEventListener('wheel', function(e) {
	if($('#modal-full').is(":visible")) {
		if (e.deltaY < 0) {
		    //console.log('scrolling up');
		    //document.getElementById('status').innerHTML = 'scrolling up';
		    var currentScale = jQuery("#scalex input[type=text]").val();
		    jQuery("#scalex input[type=text]").val(parseFloat(currentScale)*1.05);
		    jQuery("#scalex [type=text]").trigger('input');

		    currentScale = jQuery("#scaley input[type=text]").val();
		    jQuery("#scaley input[type=text]").val(parseFloat(currentScale)*1.05);
		    jQuery("#scaley [type=text]").trigger('input');
		}
		if (e.deltaY > 0) {
		    //console.log('scrolling down');
		    //document.getElementById('status').innerHTML = 'scrolling down';
		    var currentScale = jQuery("#scalex input[type=text]").val();
		    jQuery("#scalex input[type=text]").val(parseFloat(currentScale)*0.95);
		    jQuery("#scalex [type=text]").trigger('input');

		    currentScale = jQuery("#scaley input[type=text]").val();
		    jQuery("#scaley input[type=text]").val(parseFloat(currentScale)*0.95);
		    jQuery("#scaley [type=text]").trigger('input');
		}
	}
	
});

$('#canvas-transformations').mousemove(function(event) {

    var xMoved = parseFloat(event.clientX) - parseFloat(cursorX);
    var yMoved = parseFloat(event.clientY) - parseFloat(cursorY);

	console.log({'Xmoved': xMoved, 'Ymoved':yMoved})
    if(down)
    	if($('#modal-full').is(":visible")) {
		    
		    var newX = parseFloat(parseFloat(xMoved));
		    jQuery("#x input[type=text]").val(parseFloat(newX));
		    jQuery("#x [type=text]").trigger('input');

		    
		    jQuery("#y input[type=text]").val(yMoved);
		    jQuery("#y [type=text]").trigger('input');
	    }
});

var down = false;
var cursorX, cursorY;
$('#canvas-transformations').mousedown(function(e) {
	down = true;

	var currentTranslateX = jQuery("#x input[type=text]").val();
	var currentTranslateY = jQuery("#y input[type=text]").val();

	cursorX = e.pageX - parseFloat(currentTranslateX);
	cursorY = e.pageY - parseFloat(currentTranslateY);  
	console.log({'CursorX': cursorX, 'CursorY':cursorY})
}).mouseup(function() {
	down = false;  
});