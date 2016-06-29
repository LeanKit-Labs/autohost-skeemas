var sinon = require( "sinon" );
var chai = require( "chai" );
chai.should();
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );

var skeemas = require( "skeemas" )();
var validateSchema = require( "./validate-schema" )( skeemas );

describe( "Middleware - validateSchema", function() {
	var schema = {
		type: "object",
		properties: {
			answer: {
				type: "integer"
			}
		}
	};

	var middleware = validateSchema( schema );
	var middlewareWithPreserve = validateSchema( schema, true );

	it( "should not blow up when there is no data on the context", function() {
		var env = {};
		var next = sinon.stub().returns( "good" );
		var result = middleware( env, next );

		next.should.have.been.calledOnce;
	} );

	it( "should validate a body", function() {
		var next = sinon.stub().returns( "good" );
		var env = {
			data: { answer: 42 }
		};

		var result = middleware( env, next );

		next.should.have.been.calledOnce;
		result.should.equal( "good" );
		env.should.eql( {
			data: { answer: 42 }
		} );
	} );

	it( "should remove unknown properties from a body", function() {
		var next = sinon.stub().returns( "good" );
		var env = {
			data: { answer: 42, foo: "bar" }
		};

		var result = middleware( env, next );

		next.should.have.been.calledOnce;
		result.should.equal( "good" );
		env.should.eql( {
			data: { answer: 42 }
		} );
	} );

	it( "should not remove unknown properties from a body when using the preserve original option", function() {
		var next = sinon.stub().returns( "good" );
		var env = {
			data: { answer: 42, foo: "bar" }
		};

		var result = middlewareWithPreserve( env, next );

		next.should.have.been.calledOnce;
		result.should.equal( "good" );
		env.should.eql( {
			data: { answer: 42, foo: "bar" }
		} );
	} );

	it( "should invalidate a body", function() {
		var next = sinon.stub();
		var env = {
			data: { answer: 41.99999 }
		};

		var result = middleware( env, next );

		next.should.not.have.been.called;
		result.should.have.property( "status" ).that.equals( 422 );
	} );
} );
