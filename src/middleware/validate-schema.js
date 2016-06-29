// Autohost middleware to validate request bodies against a json schema
module.exports = function( schemas ) {
	return function( schema, preserveOriginalData ) {
		return function( env, next ) {
			var result = schemas.validate( env.data || {}, schema, { breakOnError: true } );

			if ( result.valid ) {
				if ( !preserveOriginalData ) {
					env.data = result.cleanInstance;
				}
				return next();
			}

			return {
				status: 422,
				data: { message: "Invalid request: " + result.errors[ 0 ].toString() }
			};
		};
	};
};
