jQuery(window).ready(function () {
	jQuery.noConflict();
	jQuery("#lunaText").fitText(0.235, { maxFontSize: '170px' });
	//toggle fullscreen
	//jQuery("#currentstream").css('width', '100%');
	FullScreen();
});

function FullScreen() { 
	
	var leftAdjust = parseInt(jQuery("#sidebar").css("width").split("px")[0]);
	var totalWidth = parseInt(jQuery("#pageContainer").css("width").split("px")[0]) - leftAdjust;
	 jQuery("#currentstream").css('width', totalWidth);
	jQuery("#currentstream").css('margin', 0);
	jQuery("#video").css('width', totalWidth);
	jQuery("video").css('height', '100%');
}

jQuery(window).resize(function() {
FullScreen();
})