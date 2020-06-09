const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const Game = require('../../models/Game');
const Player = require('../../models/Players');

router.post('/',  async function (req, res, next) {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {score, firstMap, secondMap, playersWon, playersLost } = req.body;
        try {
            const newGame = new Game({
                score: score,
                firstMap: firstMap,
                secondMap: secondMap,
                playersWon: playersWon,
                playersLost: playersLost
            });
            for (let player of playersWon){
                    const playerData =await Player.findOne({"name":player.label});
                    playerData.wonGames++;
                    await playerData.save();
            }
            for (let player of playersLost){
                const playerData =await Player.findOne({"name":player.label});
                playerData.lostGames++;
                await playerData.save();
                }

            const game = await newGame.save();
            res.json(game);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error')
        }
});

router.get('/images', async(req, res) => {
    try {
        const gameId = req.query.gameid;
        const game = await Game.findById(gameId);
        const images = game.pictures;
        res.status(200).send(images);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/all', async(req, res) => {
    try {
        const games =await Game.find({});
            res.status(200).send(games);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/playerscore',  async function (req, res, next) {
    const {playersData} = req.body;
    let playerScore = new Map(JSON.parse(playersData));
    let gameScoreData = [];
    try {
        const gameData = await Game.findOne({"_id":req.query.gameid});
        for (let [player, score] of playerScore){
            const playerName = player.slice(6);
            const playerData =await Player.findOne({"name":playerName});
            let totalKill = playerData.kill + score.kill;
            let totalDeath = playerData.death + score.death;
            playerData.kill = totalKill;
            playerData.death = totalDeath;
            await playerData.save();

            gameScoreData.push({playerName:playerName, kill:score.kill, death: score.death})
        }
        gameData.gameScore = gameScoreData;
        await gameData.save();
        res.status(200).send('Success')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});


module.exports = router;