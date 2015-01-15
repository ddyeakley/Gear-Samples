(function() {

var page = document.getElementById( "barsectionchangerPage" ),
	changer = document.getElementById( "barsectionchanger" ),
	sectionChanger, idx=1;

page.addEventListener( "pagebeforeshow", function() {
	// make SectionChanger object
	sectionChanger = new tau.widget.SectionChanger(changer, {
		circular: false,
		orientation: "horizontal",
		scrollbar: "bar",
		useBouncingEffect: true
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});
})();
