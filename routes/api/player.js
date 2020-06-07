const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/Players');

router.post('/', [
    check('name', 'Name is require').not().isEmpty(),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;

    try {
        let user = await User.findOne({ name });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Player already exists' }] });
        }


        user = new User({
            name,
        });

        await user.save();
        res.status(200).send('Success');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

router.get('/all', async(req, res) => {
    try {
        let players = await User.find({},{"_id":0});
        players = ("wewe",JSON.stringify(players, null, '\t'));
        players = JSON.parse(players);
        players.forEach((player) => {
            player["kdRatio"] =  player.death ? player.kill / player.death+"%" : "0%";
            player["winLoseRatio"] =  player.wonGames + player.lostGames ?
                Math.floor(player.wonGames / (player.wonGames + player.lostGames)*100)+"%" :  "0%";
        });
        res.json(players);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }

});

router.get('/best', async(req, res) => {
    try {
        let data = {};
        const mostGameWon =await User.find().sort({age:-1}).limit(1)
        const MostKills = await User.find().sort({kill:-1}).limit(1)
        let players = await User.find({});
        const bestKD = players.reduce(function(prev, current) {
            return (findBestWinRte(prev) > findBestWinRte(current)) ? prev : current
        });
        const mostGamePlayer = players.reduce(function(prev, current) {
            return (mostGame(prev) > mostGame(current)) ? prev : current
        });
        console.log(bestKD);
        data["most-games-won"] = mostGameWon[0];
        data["most-kils"] =MostKills[0] ;
        data["best-kd"] = bestKD;
        data["most-game-play"] = mostGamePlayer;
        res.json(data);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }

});

const findBestWinRte = function(obj){
    return obj.death ?  obj.kill/obj.death : 0;
};

const mostGame = function(obj){
    return obj.lostGames+obj.wonGames
};

module.exports = router;