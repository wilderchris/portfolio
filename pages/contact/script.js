window.slider = function( container ) {

	// Dispatched when the current layer changes
	var changed = new slider.Signal();

	// All layers in this instance of slider
	var layers = Array.prototype.slice.call( container.querySelectorAll( '.layer' ) );

	// Flag if the browser is capable of handling our fancy transition
	var capable =	'WebkitPerspective' in document.body.style ||
					'MozPerspective' in document.body.style ||
					'msPerspective' in document.body.style ||
					'OPerspective' in document.body.style ||
					'perspective' in document.body.style;

	if( capable ) {
		container.classList.add( 'capable' );
	}

	// Create dimmer elements to fade out preceding slides
	layers.forEach( function( el, i ) {
		if( !el.querySelector( '.dimmer' ) ) el.innerHTML += '<div class="dimmer"></div>';
	} );

	/**
	 * Transitions to and shows the target layer.
	 *
	 * @param target index of layer or layer DOM element
	 */
	function show( target, direction ) {

		// Make sure our listing of available layers is up to date
		layers = Array.prototype.slice.call( container.querySelectorAll( '.layer' ) );

		// Flag to CSS that we're ready to animate transitions
		container.classList.add( 'animate' );

		// Flag which direction
		direction = direction || ( target > getIndex() ? 'right' : 'left' );

		// Accept multiple types of targets
		if( typeof target === 'string' ) target = parseInt( target );
		if( typeof target !== 'number' ) target = getIndex( target );

		// Enforce index bounds
		target = Math.max( Math.min( target, layers.length ), 0 );

		// Only navigate if were able to locate the target
		if( layers[ target ] && !layers[ target ].classList.contains( 'show' ) ) {

			layers.forEach( function( el, i ) {
				el.classList.remove( 'left', 'right' );
				el.classList.add( direction );
				if( el.classList.contains( 'show' ) ) {
					el.classList.remove( 'show' );
					el.classList.add( 'hide' );
				}
				else {
					el.classList.remove( 'hide' );
				}
			} );

			layers[ target ].classList.add( 'show' );

			changed.dispatch( layers[target], target );

		}

	}

	/**
	 * Shows the previous layer.
	 */
	function prev() {

		var index = getIndex() - 1;
		show( index >= 0 ? index : layers.length + index, 'left' );

	}

	/**
	 * Shows the next layer.
	 */
	function next() {

		show( ( getIndex() + 1 ) % layers.length, 'right' );

	}

	/**
	 * Retrieves the index of the current slide.
	 *
	 * @param of [optional] layer DOM element which index is
	 * to be returned
	 */
	function getIndex( of ) {

		var index = 0;

		layers.forEach( function( layer, i ) {
			if( ( of && of == layer ) || ( !of && layer.classList.contains( 'show' ) ) ) {
				index = i;
				return;
			}
		} );

		return index;

	}

	/**
	 * Retrieves the total number of layers.
	 */
	function getTotal() {

		return layers.length;

	}

	// API
	return {

		show: show,
		prev: prev,
		next: next,

		getIndex: getIndex,
		getTotal: getTotal,

		changed: changed

	};

};

/**
 * Minimal utility for dispatching signals (events).
 */
slider.Signal = function() {
	this.listeners = [];
}

slider.Signal.prototype.add = function( callback ) {
	this.listeners.push( callback );
}

slider.Signal.prototype.remove = function( callback ) {
	var i = this.listeners.indexOf( callback );

	if( i >= 0 ) this.listeners.splice( i, 1 );
}

slider.Signal.prototype.dispatch = function() {
	var args = Array.prototype.slice.call( arguments );
	this.listeners.forEach( function( f, i ) {
		f.apply( null, args );
	} );
}

  

  
  

// Create a new instance of slider
var k = slider( document.querySelector( '.slider' ) );


// Demo page JS

var bulletsContainer = document.body.querySelector( '.bullets' );

// Create one bullet per layer
for( var i = 0, len = k.getTotal(); i < len; i++ ) {
	var bullet = document.createElement( 'li' );
	bullet.className = i === 0 ? 'active' : '';
	bullet.setAttribute( 'index', i );
	bullet.onclick = function( event ) { k.show( event.target.getAttribute( 'index' ) ) };
	bullet.ontouchstart = function( event ) { k.show( event.target.getAttribute( 'index' ) ) };
	bulletsContainer.appendChild( bullet );
}

// Update the bullets when the layer changes
k.changed.add( function( layer, index ) {
	var bullets = document.body.querySelectorAll( '.bullets li' );
	for( var i = 0, len = bullets.length; i < len; i++ ) {
		bullets[i].className = i === index ? 'active' : '';
	}
} );

document.addEventListener( 'keyup', function( event ) {
	if( event.keyCode === 37 ) k.prev();
	if( event.keyCode === 39 ) k.next();
}, false );



function redirect(url){
    setTimeout(4000);
    let aTag = $('<a href="#"></a>');
    aTag.attr('href','https://'+ url);
    aTag[0].click();
}