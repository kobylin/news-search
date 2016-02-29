/**
 * Created by andrew on 29.02.16.
 */

import ArticleTokenizer from './article-tokenizer';
import KorrParser from './korr-parser';
import * as models from './models';

var at = new ArticleTokenizer();

models.connect();

Article.find().exec((err, items) => {

    at.tokenizeInWordsAndSave(items, (err, result) => {
        console.log('END!: ', err, result);
        models.closeConnection();
    });
});



var korr = new KorrParser();
// korr.fetchAndSaveMonths(2010, ['february'], () => {
// 	mongoose.connection.close();
// })
//

models.connect();

korr.removeArticlesForMonth(2010, 1, (count) => {
    console.log(count);
    models.closeConnection();
});