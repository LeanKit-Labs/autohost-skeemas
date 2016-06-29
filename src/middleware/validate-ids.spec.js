var sinon = require( "sinon" );
var chai = require( "chai" );
chai.should();
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );

var validateIds = require( "./validate-ids" );

var FOUR_OH_FOUR = {
	status: 404,
	data: { message: "Not found." }
};

describe( "Middleware - validateIds", function() {
	describe( "for a single id", function() {
		var middleware = validateIds( "id" );

		it( "should validate correctly", function() {
			var next = sinon.stub().returns( "good" );

			var result = middleware( {
				params: {
					id: "1234567890123456789"
				}
			}, next );

			next.should.have.been.calledOnce;
			result.should.equal( "good" );
		} );

		it( "should reject a non-numeric value", function() {
			var next = sinon.stub();

			var result = middleware( {
				params: {
					id: "me"
				}
			}, next );

			next.should.not.have.been.called;
			result.should.eql( FOUR_OH_FOUR );
		} );

		it( "should reject a zero value", function() {
			var next = sinon.stub();

			var result = middleware( {
				params: {
					id: "0"
				}
			}, next );

			next.should.not.have.been.called;
			result.should.eql( FOUR_OH_FOUR );
		} );

		it( "should reject an undefined value", function() {
			var next = sinon.stub();

			var result = middleware( {
				params: {}
			}, next );

			next.should.not.have.been.called;
			result.should.eql( FOUR_OH_FOUR );
		} );
	} );

	describe( "for multiple ids", function() {
		var middleware = validateIds( "foo", "bar" );

		it( "should validate correctly", function() {
			var next = sinon.stub().returns( "good" );

			var result = middleware( {
				params: {
					foo: "1234567890123456789",
					bar: "9876543210987654321"
				}
			}, next );

			next.should.have.been.calledOnce;
			result.should.equal( "good" );
		} );

		it( "should reject if one value is non-numeric", function() {
			var next = sinon.stub();

			var result = middleware( {
				params: {
					foo: "1234567890123456789",
					bar: "baz"
				}
			}, next );

			next.should.not.have.been.called;
			result.should.eql( FOUR_OH_FOUR );
		} );

		it( "should reject if one value is zero", function() {
			var next = sinon.stub();

			var result = middleware( {
				params: {
					foo: "1234567890123456789",
					bar: "0"
				}
			}, next );

			next.should.not.have.been.called;
			result.should.eql( FOUR_OH_FOUR );
		} );

		it( "should reject if one value is undefined", function() {
			var next = sinon.stub();

			var result = middleware( {
				params: {
					foo: "1234567890123456789"
				}
			}, next );

			next.should.not.have.been.called;
			result.should.eql( FOUR_OH_FOUR );
		} );
	} );
} );
