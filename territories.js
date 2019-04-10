const express = require('express');
const moment = require('moment');

const Territory = require('./models/territory');

const territories = express.Router();

territories.use((req, res, next) => {
  next();
});

territories
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
    Territory.find((err, allTerritories) => {
      if (err) res.send(err);
      res.json(allTerritories);
    });
  });

territories
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
        if (territory) {
          const { assignments } = territory || [];
          if (req.query.q === 'latest') {
            const latest = assignments[0];
            res.json({ assignments: [latest] });
          } else res.json({ assignments });
        } else {
          res.json({ assignments: [] });
        }
      }
    );
  })

  // update
  .put((req, res) => {
    const date = moment();
    const query = {
      id: req.params.id,
      number: req.params.number,
    };
    const update = {
      $push: {
        assignments: {
          $each: [
            {
              dateUgly: date,
              date: date.format('ddd MMM DD, YYYY'),
              ...req.body.assignments,
            },
          ],
          $position: 0,
        },
      },
    };

    Territory.findOneAndUpdate(
      query,
      update,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
      (err, territory) => {
        if (err) res.send(err);

        const { assignments } = territory;
        res.json({
          assignments,
          message: 'territory updated',
        });
      }
    );
  });

// delete
// .delete((req, res) => {
//   Territory.remove(
//     {
//       _id: req.params.id,
//     },
//     err => {
//       if (err) res.send(err);

//       res.json({
//         message: 'successfully deleted',
//       });
//     }
//   );
// });

territories
  .route('/:id/:number/:assignmentid')
  .get((req, res) => {
    const query = {
      id: req.params.id,
      number: req.params.number,
      'assignments._id': req.params.assignmentid,
    };
    Territory.findOne(query, { 'assignments.$': 1 }, (err, territory) => {
      if (err) res.send(err);
      if (!territory) res.json({ message: 'assignment not found' });
      const { assignments } = territory;
      res.json({
        assignments,
        message: 'get assignment',
      });
    });
  })
  .delete((req, res) => {
    const query = {
      id: req.params.id,
      number: req.params.number,
    };
    const update = {
      $pull: {
        assignments: {
          _id: req.params.assignmentid,
        },
      },
    };
    Territory.findOneAndUpdate(
      query,
      update,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
      (err, territory) => {
        if (err) res.send(err);

        const { assignments } = territory;
        res.json({
          assignments,
          message: 'territory updated',
        });
      }
    );
  });

territories.route('/assignments').get((req, res) => {
  Territory.find((err, allTerritories) => {
    if (err) res.send(err);
    const assignments = allTerritories.reduce((allAssignments, territory) => {
      territory.assignments.forEach(assignment =>
        allAssignments.push({
          assignmentId: assignment._id,
          dateUgly: assignment.dateUgly,
          date: assignment.date,
          dateShort: moment(assignment.date).format('M/D/YY'),
          name: assignment.name,
          out: assignment.out,
          id: territory.id,
          number: territory.number,
        })
      );
      return allAssignments;
    }, []);
    assignments.sort((b, a) => {
      if (b.dateUgly > a.dateUgly) return -1;
      if (b.dateUgly < a.dateUgly) return 1;
      return 0;
    });
    res.json({
      assignments,
      message: 'assignments',
    });
  });
});

module.exports = territories;
