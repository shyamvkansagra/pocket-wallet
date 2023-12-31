const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const app = express();
require('./database');
require("dotenv").config();

const corsOptions = {
    origin: "https://pocket-wallet-ylp6.onrender.com" // frontend URI (ReactJS)
}

app.use(bodyParser.json());
app.use(cors(corsOptions));

// API
const wallet = require('./api/wallet');
const transaction = require('./api/transaction');

app.use('/', wallet);
app.use('/', transaction);

app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'))
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});