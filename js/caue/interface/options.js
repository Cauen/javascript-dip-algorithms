var options = {};
if (!localStorage.getItem('settingsPDI')) {
	options = objectifyForm(jQuery('#settings-form input').serializeArray()); 	//Get form
	localStorage.setItem('settingsPDI', JSON.stringify(options)); 				//Set options
}
else {
	options = JSON.parse(localStorage.getItem('settingsPDI'));						//Get options
	$('#settings-form input[type=checkbox]').prop('checked', false);				//Set all form checkboxes in off
	$.each( options, function( key, value ) {										//Set options in form (check the rights)
		console.log( key + ": " + value );
		if(value == "1") 
			$('#settings-form input[name='+key+']').prop('checked', true);

	});
}

console.log('Settings: ');
console.log(options);

jQuery('#settings-form').on('change','input',function(){
	options = objectifyForm(jQuery('#settings-form input').serializeArray());
	localStorage.setItem('settingsPDI', JSON.stringify(options));
	console.log('Configs Saved');
	console.log(options);

	if (!options.highlight_images) {
		$('canvas').removeClass('secundary-canvas');
		$('canvas').removeClass('primary-canvas');
	} else {
		$('canvas[image-number="'+secundaryImage+'"]').addClass('secundary-canvas');
		$('canvas[image-number="'+primaryImage+'"]').addClass('primary-canvas');
	}

	if(options.get_pixel_data)
		$('#status').show();
	else 
		$('#status').hide();
	
});

function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}