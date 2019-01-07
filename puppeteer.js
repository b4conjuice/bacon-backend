const express = require('express');

const { assign, unassign, reassign } = require('./lib/alba');

const puppeteer = express.Router();

puppeteer.use((req, res, next) => {
  next();
});

puppeteer.route('/').get((req, res) => {
  res.json({
    success: true,
    message: `welcome to puppeteer`,
  });
});

puppeteer.route('/assign').post((req, res) => {
  const { territory, user } = req.body;
  assign({
    territory,
    user,
  }).then(response => {
    res.json({
      type: 'assign',
      response,
    });
  });
});

puppeteer.route('/unassign').post((req, res) => {
  const { territory } = req.body;
  unassign({
    territory,
  }).then(response => {
    res.json({
      type: 'unassign',
      response,
    });
  });
});

puppeteer.route('/reassign').post((req, res) => {
  const { territory, user } = req.body;
  reassign({
    territory,
    user,
  }).then(response => {
    res.json({
      type: 'reassign',
      response,
    });
  });
});

module.exports = puppeteer;
