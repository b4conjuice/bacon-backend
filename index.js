const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './variables.env' });
const bodyParser = require('body-parser');
const tournaments = require('./tournaments');
const notes = require('./notes');
const alba = require('./alba');
const puppeteer = require('./puppeteer');

const app = express();
const port = process.env.PORT || 5000;
const mongoDB = process.env.DB_URL;
const db = mongoose.connection;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.text({
    limit: '50mb',
  })
);
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.route('/').get((req, res) => {
  res.json({
    success: true,
    message: `welcome to bacon's backend`,
    test: process.env.BACON,
  });
});

app.use('/tournaments', tournaments);
app.use('/notes', notes);
app.use('/alba', alba);
app.use('/puppeteer', puppeteer);

app.listen(port, () => console.log(`bacon on port http://localhost:${port}`));
