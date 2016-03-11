import express from 'express';
import cookieParser from 'cookie-parser';
import * as models from './models';
import async from 'async';
import path from 'path';
import _ from 'underscore';

import articlesRoute from './routes/articles';
import articlesDistributionRoute from './routes/articles_distribution';

console.log(articlesRoute);

models.connect();

const app = express();
app.use(express.static('frontend-app-build'));
app.use(express.static('node_modules'));
app.use(cookieParser())

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.get('/articles', articlesRoute);

app.get('/articles_distribution', articlesDistributionRoute);

app.get('/coock', (req, res) => {
  res.send(req.cookies);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});