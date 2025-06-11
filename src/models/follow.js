const { mongoose } = require('../db/mongodb')
const { Schema } = require('mongoose')

const followSchema = new mongoose.Schema(
    
    {
        followerId: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: [true, 'followerId es requerido']
        },
        followedId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'followedId es requerido']
        }
    },{
        collection: 'followers'
    }
)

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;



