'use strict';
const mongoose = require( 'mongoose' );
const autoBind = require( 'auto-bind' );
const { HttpResponse } = require( '../helpers/HttpResponse' );

class Service {
    /**
     * Base Service Layer
     * @param model
     */
    constructor( model ) {
        this.model = model;
        autoBind( this );
    }

    async getAll( query ) {
        let { skip, limit, sortBy } = query;

        skip = skip ? Number( skip ) : 0;
        limit = limit ? Number( limit ) : 17;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        delete query.skip;
        delete query.limit;
        delete query.sortBy;

        if ( query._id ) {
            try {
                query._id = new mongoose.mongo.ObjectId( query._id );
            } catch ( error ) {
                throw new Error( 'Not able to generate mongoose id with content' );
            }
        }

        try {
            // const items = await this.model
            //         .find( query )
            //         .sort( sortBy )
            //         .skip( skip )
            //         .limit( limit ),


            const items = await  this.model
            .aggregate([
                    // { $match: {
                    //         _id : { $in : recommendation},
                        
                    //     } },
                    {
                    $lookup: {
                        from: "users", // collection name in db
                        localField: "creatorId",
                        foreignField: "_id",
                        as: "users"
                    }},
                    {
                        $project: {
                            "id": "$id",
                           "creatorName": "$users.name",
                            "questionText": "$questionText",
                            "options": "$options",
                            "totalVotes": "$totalVotes",
                        }
                    },
                
                    { "$limit": limit },
                    { "$skip": skip }
                ]).exec()


                const total = await this.model.countDocuments( query );

            return new HttpResponse( items, { 'totalCount': total } );
        } catch ( errors ) {
            throw errors;
        }
    }


    async update( id, data ) {
        try {
            
            const options = await this.model.findOneAndUpdate({"options.id":  data.id}, {$inc: {"options.$.count":  1}},{ 'new': true ,'upsert': true ,} );
            const item = await this.model.findByIdAndUpdate( id, { $inc: { totalVotes: 1 } }, { 'new': true ,'upsert': true ,} );



            return new HttpResponse( item );
        } catch ( errors ) {
            throw errors;
        }
    }

}

module.exports = { Service };
