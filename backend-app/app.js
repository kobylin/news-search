/**
 * Created by andrew on 29.02.16.
 */

import ArticleTokenizer from './article-tokenizer';
import KorrParser from './korr-parser';
import PravdaParser from './pravda-parser';
import {MonthNames} from './korr-parser';
import * as models from './models';

console.log(MonthNames)

models.connect();

//var at = new ArticleTokenizer();
//
//
//Article.find().exec((err, items) => {
//
//    at.tokenizeInWordsAndSave(items, (err, result) => {
//        console.log('END!: ', err, result);
//        models.closeConnection();
//    });
//});

// var korr = new KorrParser();
// korr.fetchAndSaveMonths(2015, MonthNames, () => {
//     models.closeConnection();
// });

//korr.removeArticlesForMonth(2010, 1, (count) => {
//    console.log(count);
//    models.closeConnection();
//});
//

var parser = new PravdaParser({
	goNextPageTimeout: 3000
});
parser.fetchAndSaveMonths(2015, [2,3,4,5,6,7,8,9,10,11,12], function(articles) {
	console.log(articles);
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}