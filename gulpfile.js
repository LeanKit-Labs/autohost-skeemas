var gulp = require( "gulp" );

require( "biggulp/common-gulp" )( gulp, {
	allSpecPaths: [ "./src" ],
	behaviorSpecPaths: [ "./src" ],
	integrationSpecPaths: [ "./src" ],
	watchPaths: [ "./src/**/*", "./*.js" ]
} );
