const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );
const slugify = require( 'slugify' );

class Poll {

    initSchema() {
        const schema = new Schema( {
            'creatorId': {
                'type': String,
                'required': true,
            },
            "totalVotes":Number,
            'startData': Date,
            'endData': Date,
            'questionText': {
                'type': Array,
                'required': true,
            },
            'options': {
                'type': [options],
                'required': true,
            }
        }, { 'timestamps': true } );

        schema.pre( 'save', function( next ) {
            const post = this;

            if ( !post.isModified( 'title' ) ) {
                return next();
            }
            post.slug = slugify( post.title, '_' );
            console.log( 'set slug', post.slug );
            return next();
        } );
        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'poll', schema,'polls' );
        } catch ( e ) {

        }

    }

    getInstance() {
        this.initSchema();
        return mongoose.model( 'poll' );
    }
}

const options = mongoose.Schema({
    id: {
        type: String,
    },
    text:{
        type: Array,

    },
    count:{
        type: Number,

    },    
});

module.exports = { Poll };
