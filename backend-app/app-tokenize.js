import ArticleTokenizer from './article-tokenizer';
import KorrParser from './korr-parser';
import PravdaParser from './pravda-parser';
import {MonthNames as KorrMonthNames} from './korr-parser';
import {MonthNames as PravdaMonthNames} from './pravda-parser';

import * as models from './models';

models.connect();

var at = new ArticleTokenizer();
models.Article.find({
  created: {
    $gt: new Date(2016, 0)
  }
}).exec((err, items) => {
   at.tokenizeInWordsAndSave(items, (err, result) => {
       console.log('END!: ', err, result);
       models.closeConnection();
   });
});

