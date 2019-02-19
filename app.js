'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const playstore = require('./playstore');

app
  .use(cors())
  .use(morgan('common'));


app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  const filterGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  let results = playstore;

  if(sort) {
    if(!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('You can only sort by rating or app.');
    }

    if(sort === 'rating') {
      results = playstore.sort((a, b) => {
        return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0;
      });
    } else if(sort === 'app') {
      results = playstore.sort((a, b) => {
        let x = a['App'].toLowerCase();
        let y = b['App'].toLowerCase();

        return x > y ? 1 : x < y ? -1 : 0;
      });
    }
  }

  if(genres) {
    if(!filterGenres.includes(genres)) {
      return res
        .status(400)
        .send('Wrong genre');
    }

    results = results.filter(a => {
      return a['Genres'].includes(genres);
    });
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log('server is running...');
});