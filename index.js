const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tournaments = require('./tournaments');
const notes = require('./notes');

const app = express();
const port = process.env.PORT || 5000;
const mongoDB = 'mongodb://admin:admin@ds019856.mlab.com:19856/niello';
// const mongoDB = 'mongodb://admin:admin@ds213199.mlab.com:13199/dev';
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
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.route('/').get((req, res) => {
  res.json({
    success: true,
    message: `welcome to bacon's backend`,
  });
});

app.use('/tournaments', tournaments);
app.use('/notes', notes);

app.listen(port, () => console.log(`bacon on port http://localhost:${port}`));
