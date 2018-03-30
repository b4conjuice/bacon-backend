import express from 'express';
import request from 'request';
import SmashCalTournament from './models/smash-cal-tournament';
import SmashGGTournament from './models/tournament';

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

export default tournaments;
