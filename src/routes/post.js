'use strict';
const PostController = require( '../controllers/PostController' );
const express = require( 'express' ),
    router = express.Router();


router.get( '/', PostController.getAll );
router.put( '/:id', PostController.update );


module.exports = router;
