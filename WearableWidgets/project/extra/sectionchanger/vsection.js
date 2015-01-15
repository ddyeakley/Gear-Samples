(function() {

var page = document.getElementById( "vsectionchangerPage" ),
	changer = document.getElementById( "vsectionchanger" ),
	sectionChanger, idx=1;

page.addEventListener( "pagebeforeshow", function() {
	// make SectionChanger object
	sectionChanger = new tau.widget.SectionChanger(changer, {
		circular: false,
		orientation: "vertical"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});
})();
