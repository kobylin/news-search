/**
 * Created by andrew on 29.02.16.
 */

import ArticleTokenizer from './article-tokenizer';
import KorrParser from './korr-parser';
import PravdaParser from './pravda-parser';
import {MonthNames as KorrMonthNames} from './korr-parser';
import {MonthNames as PravdaMonthNames} from './pravda-parser';

import * as models from './models';

// console.log(PravdaMonthNames);

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

var korr = new KorrParser();
korr.fetchAndSaveMonths(2016, KorrMonthNames, () => {
    models.closeConnection();
});


// var parser = new PravdaParser({
// 	goNextPageTimeout: 500
// });

// parser.fetchAndSaveMonths(2016, PravdaMonthNames, function(articles) {
// 	console.log(articles);
// });
