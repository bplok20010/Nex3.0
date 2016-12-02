(function( $, undefined ) {

$.effects.effect.fade = function( o, done ) {

	// Create element
	var el = $( this ),
		props = [ "opacity" ],
		mode = $.effects.setMode( el, o.mode || "show" ),
		show = mode === "show",
		animation = {};

	// Adjust
	$.effects.save( el, props );
	el.show();
	
	el.css( 'opacity',show ? 0 : 1 );

	// Animation
	animation[ 'opacity' ] = !show ? 0 : 1;

	// Animate
	el.animate( animation, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {
			if ( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			done();
		}
	});
};

})(jQuery);