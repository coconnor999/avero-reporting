const express = require('express');
const reporting = require('./reporting');

const app = express();

app.get('/reporting', reporting);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
