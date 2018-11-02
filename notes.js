import express from 'express';
import Note from './models/note';

const notes = express.Router();

notes.use((req, res, next) => {
  next();
});

notes
  .route('/')
  // create note
  .post((req, res) => {
    const note = new Note();
    note.title = req.body.title;
    note.body = req.body.body;
    note.save((err, savedNote) => {
      if (err) res.send(err);
      res.json({
        message: 'note created',
        savedNote,
      });
    });
  })
  // get all notes
  .get((req, res) => {
    Note.find((err, allNotes) => {
      if (err) res.send(err);
      res.json(allNotes);
    });
  });

notes
  .route('/:noteid')
  // get single note
  .get((req, res) => {
    Note.findById(req.params.noteid, (err, note) => {
      if (err) res.send(err);
      res.json(note);
    });
  })

  // update note with new info
  .put((req, res) => {
    Note.findById(req.params.noteid, (err, note) => {
      if (err) res.send(err);

      note.title = req.body.title;
      note.body = req.body.body;

      note.save(err => {
        if (err) res.send(err);

        res.json({
          message: 'note updated',
        });
      });
    });
  })

  // delete note
  .delete((req, res) => {
    Note.remove(
      {
        _id: req.params.noteid,
      },
      err => {
        if (err) res.send(err);

        res.json({
          message: 'successfully deleted',
        });
      }
    );
  });

export default notes;
