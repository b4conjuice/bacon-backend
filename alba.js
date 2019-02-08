const express = require('express');
const request = require('request');

const Alba = require('./models/alba');

const alba = express.Router();

alba.use((req, res, next) => {
  next();
});

alba
  .route('/')
  // get all
  .get((req, res) => {
    Alba.find((err, territories) => {
      if (err) res.send(err);
      const json = territories.reduce((allTerritories, territory) => {
        const { id: territoryId, name, status, details, link } = territory;
        const nameSplit = name.split(' ');
        const letterWriting = name.includes('LW');
        const number = letterWriting ? nameSplit.slice(1).join(' ') : nameSplit[nameSplit.length - 1];
        const cityName = nameSplit.length === 1 ? nameSplit : nameSplit.slice(0, nameSplit.length - 1);
        const id = letterWriting ? 'lw' : cityName.length > 0 ? cityName.join('-').toLowerCase() : number.toLowerCase();
        if (id in allTerritories) {
          allTerritories[id].territories.push({
            id: territoryId,
            number,
            status,
            details,
            link,
          });
        } else {
          allTerritories[id] = {
            id,
            name: name.includes('LW') ? 'LW' : cityName.join(' '),
            territories: [
              {
                id: territoryId,
                number,
                status,
                details,
                link,
              },
            ],
          };
        }
        return allTerritories;
      }, {});
      Object.keys(json).forEach(city => {
        json[city].territories.sort((b, a) => {
          if (b.number > a.number) return 1;
          if (b.number < a.number) return -1;
          return 0;
        });
      });
      res.json(json);
    });
  });

alba.route('/territories').get((req, res) => {
  request.get('https://alba-backend.now.sh/territories', (error, response, body) => {
    const { territories: data } = JSON.parse(body);
    const territories = data.map(territory => ({
      ...territory,
    }));

    res.json({
      message: 'alba territories',
      territories,
    });
  });
});

alba.route('/update').get((req, res) => {
  request.get('https://alba-backend.now.sh/territories', (error, response, body) => {
    Alba.collection.drop();
    const { territories } = JSON.parse(body);
    territories.forEach(territory => {
      const albaTerritory = new Alba();
      albaTerritory.id = territory.id;
      albaTerritory.name = territory.name;
      albaTerritory.addresses = territory.addresses;
      albaTerritory.status = territory.status;
      albaTerritory.details = territory.details;
      albaTerritory.link = territory.link;
      albaTerritory.save((err, savedAlbaTerritory) => {
        if (err) res.send(err);
      });
    });

    res.json({
      message: 'update',
    });
  });
});

alba
  .route('/:id/:number')
  // get single
  .get((req, res) => {})

  // update
  .put((req, res) => {});

module.exports = alba;
