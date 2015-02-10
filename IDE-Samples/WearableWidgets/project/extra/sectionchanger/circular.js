(function() {

var page = document.getElementById( "circularSectionchangerPage" ),
	changer = document.getElementById( "circularSectionchanger" ),
	sectionChanger, idx=1;

page.addEventListener( "pagebeforeshow", function() {
	// make SectionChanger object
	sectionChanger = new tau.widget.SectionChanger(changer, {
		circular: true,
		orientation: "horizontal"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});
})();
