const express = require('express');
const request = require('request');
const moment = require('moment');
const cheerio = require('cheerio');
const SmashCalTournament = require('./models/smash-cal-tournament');
const SmashGGTournament = require('./models/tournament');

const tournaments = express.Router();

tournaments.route('/').get((req, res) => {
  SmashGGTournament.find((err, smashggTournaments) => {
    if (err) res.send(err);
    res.json(smashggTournaments.sort((a, b) => a.date - b.date));
  });
});

tournaments.route('/list').get((req, res) => {
  SmashCalTournament.find((err, smashCalTournaments) => {
    if (err) res.send(err);
    res.json(smashCalTournaments.sort((a, b) => a.startDate - b.startDate));
  });
});

tournaments
  .route('/list/melee')

  .get((req, res) => {
    SmashCalTournament.find((err, smashCalTournaments) => {
      if (err) res.send(err);
      res.json(smashCalTournaments.filter(tournament => tournament.melee).sort((a, b) => a.startDate - b.startDate));
    });
  });

tournaments
  .route('/list/simple')

  .get((req, res) => {
    SmashCalTournament.find((err, smashCalTournaments) => {
      if (err) res.send(err);
      res.json(
        smashCalTournaments
          .filter(tournament => tournament.melee)
          .filter(tournament => moment().diff(tournament.startDate, 'days') < 0)
          .sort((a, b) => a.startDate - b.startDate)
          .map(({ name, startDateFormatted }) => ({ name, date: startDateFormatted }))
      );
    });
  });

tournaments
  .route('/list/update')

  .get((req, res) => {
    const SMASH_CAL_URL =
      'https://docs.google.com/spreadsheets/d/1WXWd5yTWVTKQ6S6OXrfYb1WL1DelFSPiiIS_6rWGlGI/htmlview?ts=5a9f221a&sle=true#gid=0';

    const options = {
      url: SMASH_CAL_URL,
      method: 'GET',
    };

    request(options, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html);
        const selector = '#sheets-viewport > div:nth-child(1) table';
        const selection = $(selector);
        if (selection !== '') {
          $('table tr', selection).each(() => {
            const name = $('td:nth-child(2)', this).text();
            const startDateFormatted = $('td:nth-child(3)', this).text();
            const endDateFormatted = $('td:nth-child(4)', this).text();
            const weekNumber = $('td:nth-child(5)', this).text();
            const region = $('td:nth-child(6)', this).text();
            const subregion = $('td:nth-child(7)', this).text();
            const city = $('td:nth-child(8)', this).text();
            const organizer = $('td:nth-child(9)', this).text();
            let slug = $('td:nth-child(10) a', this).text();
            const smashgg = slug;
            if (slug.includes('https://smash.gg/')) {
              slug = slug.replace('https://smash.gg/', '');
              if (slug.includes('tournament/')) slug = slug.replace('tournament/', '');
              if (slug.includes('/details')) slug = slug.replace('/details', '');
              if (slug.includes('/')) slug = slug.replace('/', '');
            } else slug = null;
            const meleeText = $('td:nth-child(11)', this).text();
            const melee = meleeText.includes('x');
            const wiiuText = $('td:nth-child(12)', this).text();
            const wiiu = wiiuText.includes('x');
            const query = {
              name,
            };
            const update = {
              name,
              startDate: moment(startDateFormatted),
              startDateFormatted,
              endDate: moment(endDateFormatted),
              endDateFormatted,
              weekNumber,
              region,
              subregion,
              city,
              organizer,
              smashgg,
              slug,
              melee,
              meleeText,
              wiiu,
              wiiuText,
            };
            SmashCalTournament.findOneAndUpdate(query, update, {
              new: true,
              upsert: true,
              setDefaultsOnInsert: true,
            });
          });

          SmashCalTournament.find((err, smashCalTournaments) => {
            if (err) res.send(err);
            res.json(smashCalTournaments.sort((a, b) => a.startDate - b.startDate));
          });
        } else {
          res.contentType('json');
          res.send({
            success: false,
            html,
          });
        }
      } else console.log('error');
    });
  });

tournaments.route('/slug/:slug').get((req, res) => {
  SmashGGTournament.findOne({ slug: req.params.slug }, (err, tournament) => {
    if (err) res.send(err);
    res.json(tournament);
  });
});

tournaments.route('/smashgg/:slug').get((req, res) => {
  const tournament = req.params.slug;
  const url = `https://api.smash.gg/tournament/${tournament}?expand[]=participants&mutations[]=playerData`;

  const options = {
    url,
    method: 'GET',
  };

  request(options, (err, response, body) => {
    if (err) res.send(err);
    const json = JSON.parse(body);
    res.json({
      ...json,
    });
  });
});

module.exports = tournaments;
