'use strict';
const autoBind = require( 'auto-bind' );

class Controller {

    /**
     * Base Controller Layer
     * @param service
     */
    constructor( service ) {
        this.service = service;
        autoBind( this );
    }

    async getAll( req, res, next ) {
        try {
            const response = await this.service.getAll( req.query );

            return res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }



    async update( req, res, next ) {
        const { id } = req.params;

        try {
            const response = await this.service.update( id, req.body );

            return res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }



}

module.exports = { Controller };
