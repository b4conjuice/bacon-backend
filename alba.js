const express = require('express');
const moment = require('moment');

const Territory = require('./models/territory');

const alba = express.Router();

alba.use((req, res, next) => {
  next();
});

alba
  .route('/')
  // create
  .post((req, res) => {
    const territory = new Territory();
    territory.id = req.body.id;
    territory.city = req.body.city;
    territory.number = req.body.number;
    const date = moment();
    territory.assignments.unshift({
      dateUgly: date,
      date: date.format('ddd MMM DD, YYYY'),
      ...req.body.assignments,
    });
    territory.save((err, savedTerritory) => {
      if (err) res.send(err);
      res.json({
        message: 'territory created',
        savedTerritory,
      });
    });
  })
  // get all
  .get((req, res) => {
    Territory.find((err, territories) => {
      if (err) res.send(err);
      res.json(territories);
    });
  });

alba
  .route('/:id/:number')
  // get single
  .get((req, res) => {
    Territory.findOne(
      {
        id: req.params.id,
        number: req.params.number,
      },
      (err, territory) => {
        if (err) res.send(err);
        const { assignments } = territory;
        if (req.query.q === 'latest') {
          const latest = assignments[0];
          res.json({ assignments: [latest] });
        } else res.json({ assignments });
      }
    );
  })

  // update note with new info
  .put((req, res) => {
    Territory.findOne(
      {
        id: req.params.id,
        number: req.params.number,
      },
      (err, territory) => {
        if (err) res.send(err);

        const date = moment();
        territory.assignments.unshift({
          dateUgly: date,
          date: date.format('ddd MMM DD, YYYY'),
          ...req.body.assignments,
        });

        territory.save((err, updatedTerritory) => {
          if (err) res.send(err);

          const { assignments } = updatedTerritory;
          res.json({
            assignments,
            message: 'territory updated',
          });
        });
      }
    );
  })

  // delete
  .delete((req, res) => {
    Territory.remove(
      {
        _id: req.params.id,
      },
      err => {
        if (err) res.send(err);

        res.json({
          message: 'successfully deleted',
        });
      }
    );
  });

module.exports = alba;
