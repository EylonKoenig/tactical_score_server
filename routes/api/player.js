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
        players = ("json",JSON.stringify(players, null, '\t'));
        players = JSON.parse(players);
        players.forEach((player) => {
            player["kdRatio"] =  findKDRate(player);
            player["winLoseRatio"] =  player.wonGames + player.lostGames ?
                Math.floor(player.wonGames / (player.wonGames + player.lostGames)*100)+"%" :  "0%";
        });
        players = players.sort((a,b) => (findBestWinRate(a) < findBestWinRate(b)) ? 1 : ((findBestWinRate(b) < findBestWinRate(a)) ? -1 : 0));
        res.json(players);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }

});

router.get('/best', async(req, res) => {
    try {
        let data = {};
        const mostGameWon =await User.find().sort({wonGames:-1}).limit(1);
        const MostKills = await User.find().sort({kill:-1}).limit(1);
        let players = await User.find({});
        const bestKD = players.reduce(function(prev, current) {
            return (findKDRate(prev) > findKDRate(current)) ? prev : current
        });
        const mostGamePlayer = players.reduce(function(prev, current) {
            return (mostGame(prev) > mostGame(current)) ? prev : current
        });
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

const findKDRate = function(player){
    if (!player.kill) return 0;
    else if(!player.death) return player.kill;
    else return (player.kill / player.death).toFixed(3);

};

const findBestWinRate = function(player){
    if (!player.wonGames)return 0;
        else if(!player.lostGames) return 100;
    return player.wonGames / (player.wonGames + player.lostGames)*100;
};

const mostGame = function(player){
    return player.lostGames+player.wonGames
};

module.exports = router;