// Dependencies & Express Data Parsing
const fs = require('fs');
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

let db = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Generate Unique ID
const generateUniqueId = require('generate-unique-id');

//Create New Note
// function createNewNote(body, notesArray) {
//     const note = body;
//     notesArray.push(note);
//     fs.writeFileSync(
//       path.join(__dirname, './db/db.json'),
//       JSON.stringify({ notes: notesArray }, null, 2)
//     );
//     return note;
//   };  

//Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
  db = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  res.json(db);
});

app.post('/api/notes', (req, res) => {
  // req.body.id = generateUniqueId();
  const note = {
    title: req.body.title,
    text: req.body.text,
    id: generateUniqueId()
  }
  db.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(db, null, 2)
  );
  db = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  res.json(db);
});

//Bonus - DELETE 
//NOTE: Found this code almost exactly as needed here: https://www.tabnine.com/code/javascript/functions/express/Express/delete
// I'm probably going to use this a lot in the future because wow what a resource!!
app.delete('/api/notes/:id', (req, res) => {
  // const { id } = req.params;

  // db.filter(note => note.id == id);
  const notesToKeep = []
  for (var i = 0; i < db.length; i++){
    if (db[i].id != req.params.id){
      notesToKeep.push(db[i]);
    }
  }
  db = notesToKeep;
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(db, null, 2)
  );
  db = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  res.json(db);
  
  // db.splice(delNote, 1);
  // return res.send();
});

//Listener
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});