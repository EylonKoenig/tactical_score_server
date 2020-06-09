const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    score: {
        type: String,
        required: true
    },
    firstMap: {
        type: String,
        required: true,
    },
    secondMap: {
        type: String,
        required: true,
    },
    playersWon: {
        type: Array,
        required: true
    },
    playersLost: {
        type: Array,
        required: true
    },
    pictures: {
        type: Array,
        required: false
    },
    gameScore: {
        type: Object,
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    }
});


module.exports = Game = mongoose.model('game', GameSchema);