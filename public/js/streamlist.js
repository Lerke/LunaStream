jQuery(window).ready(function () {
	jQuery.noConflict();
	jQuery("#lunaText").fitText(0.235, { maxFontSize: '170px' });

	for (var stream in StreamHost.streams) {
		jQuery("#streamcontainer").append("<div class=\"streamblock\"><div id=\"stream-"+stream+"\" class=\"streamblockcontent\"<div class=\"streamtitle\"><div class=\"titlediv\">" + StreamHost.streams[stream].name + "</div><div class=\"streaminfo\"></div></div></div>");
		jQuery("#stream-"+stream).css('background-image', 'url(' + prefix + servername + servercache + StreamHost.streams[stream].name + '.png' + ')');
		//><img id=\"img\" src=" + prefix + servername + servercache + StreamHost.streams[stream].name + ".png" + "></img>
<<<<<<< HEAD
			jQuery(".titlediv").blurjs({
=======
			jQuery(".streamtitle").blurjs({
>>>>>>> 49a581b7e1d0d87889ca1d99a8bdaa394f543429
			source: '#stream-' + stream,
		overlay: 'rgba(255,255,255,0.4)',
	radius: 10
	});
	}

		
});