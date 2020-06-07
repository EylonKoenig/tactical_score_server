const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('morgan');


const app = express();


connectDB();
app.use(cors({ credentials: true, origin: ['http://localhost:3000','https://tacticalops.netlify.app']}));
app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


app.use('/api/player', require('./routes/api/player'));
app.use('/api/game', require('./routes/api/game'));
app.use('/api/upload', require('./routes/api/upload'));



app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server start on port ${PORT}`));