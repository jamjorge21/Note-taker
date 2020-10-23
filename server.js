const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(db);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  if (db.length === 0) {
    newNote.id = 1;
  } else {
    const newNoteId = db[db.length - 1].id + 1;
    newNote.id = newNoteId;
  }
  db.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(db));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const newNotes = db.filter((note) => {
    return note.id !== id;
  });
  fs.writeFileSync('./db/db.json', JSON.stringify(newNotes));
  db = newNotes;
  res.json(newNotes);
});

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});