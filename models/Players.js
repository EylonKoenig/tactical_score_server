const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    wonGames: {
        type:Number,
        default:0
    },
    lostGames: {
        type:Number,
        default:0
    },
    kill: {
        type:Number,
        default:0
    },
    death: {
        type:Number,
        default:0
    },
    date: {
        type: Date,
        default: Date.now()
    },

},{
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }}
);


module.exports = Player = mongoose.model('player', PlayerSchema);