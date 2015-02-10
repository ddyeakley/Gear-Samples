(function(){

	var page = document.getElementById( "swipelist" ),
		listElement = page.getElementsByClassName( "ui-swipelist-list" )[0],
		swipeList;

	page.addEventListener( "pageshow", function() {
		// make SwipeList object
		swipeList = new tau.widget.SwipeList( listElement, {
			swipeTarget: "li",
			swipeElement: ".ui-swipelist"
		});
	});

	page.addEventListener( "pagehide", function() {
		// release object
		swipeList.destroy();
	});

}());
