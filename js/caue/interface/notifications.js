function uploadFirstNotification() {
	noty({
		text: '<strong>Warning</strong>Upload image first',
		type: 'error',
		layout: 'topRight',
		timeout: 700,
	    callback: {
	        onShow: function() {},
	        afterShow: function() {},
	        onClose: function() {
	        	$.noty.closeAll();
				setTimeout(function(){
				    jQuery('[data-toggle=dropdown]').click();
				}, 500);
			},
	        afterClose: function() {},
	        onCloseClick: function() {},
	      },
	});
		
}

function setImageAsNotification(position) {
	if (position == 'primary') type = 'information';
	else type = 'warning';
	noty({
		text: '<strong>Success</strong>Image set as ' + position,
		type: type,
		layout: 'topRight',
		timeout: 1700,
	});
		
}