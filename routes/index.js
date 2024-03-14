const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

const app = express();

// displays notes already in db
app.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => {
        // console.log(req.headers)
        res.json(JSON.parse(data))
    }
    );
});

// updates and displays notes in db
app.post('/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uuidv4(),

        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

// deletes and updates notes in db
app.delete('/notes/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    console.log(noteId)
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((notes) => notes.id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Note ${noteId} has been deleted 🗑️`);
      });
  });





module.exports = app;