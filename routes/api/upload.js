const express = require('express');
const router = express.Router();
let multer  = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg')
    }
});

const Game = require('../../models/Game');
let upload = multer({ storage: storage });

router.post('/', upload.array('photos', 6),async function (req, res, next) {
    const files = req.files;
    const images = [];
    req.files.forEach(img => images.push(img.filename));
    const game = await Game.findById(req.body.gameId);
    game.pictures = images;
    await game.save();

    res.send("success")
});


module.exports = router;