const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

const app = express();

app.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => {
        // console.log(req.headers)
        res.json(JSON.parse(data))
    }
    );
});


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


module.exports = app;