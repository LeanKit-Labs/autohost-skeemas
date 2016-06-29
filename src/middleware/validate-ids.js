// Autohost middleware to validate integer params on the url
module.exports = function() {
	var ids = Array.prototype.slice.call( arguments );
	return function( env, next ) {
		var valid = ids.every( function( id ) {
			return /^[1-9]\d*$/.test( env.params[id] );
		} );

		if ( valid ) {
			return next();
		}

		return {
			status: 404,
			data: { message: "Not found." }
		};
	};
};
