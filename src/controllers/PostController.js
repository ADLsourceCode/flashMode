const { Controller } = require( '../../system/controllers/Controller' );
const { PostService } = require( './../services/PostService' );
const { Poll } = require( './../models/Polls' );
const autoBind = require( 'auto-bind' ),
    postService = new PostService(
        new Poll().getInstance()
    );

class PostController extends Controller {

    constructor( service ) {
        super( service );
        autoBind( this );
    }

}

module.exports = new PostController( postService );
