const express = require('express');
const reporting = require('./reporting');
const mongoose = require('mongoose');

const app = express();

app.get('/reporting', reporting);

// Create a MongoDB connection pool and start the application
// after the database connection is ready

//mongoose.connect(`mongodb://${process.env.MLAB_USERNAME}:${process.env.MLAB_PASSWORD}@ds215502.mlab.com:15502/avero`);

// this is bad
mongoose.connect(`mongodb://malcolm:Vargo65@ds215502.mlab.com:15502/avero`);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// once the mongoose connection is open, start it up!
db.once('open', function() {
  app.listen(3000, () => {
    console.log(`Node.js app is listening at http://localhost:3000`);
  });
});

