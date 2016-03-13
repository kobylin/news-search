import {Article, Word} from './models';
import * as models from './models';
import mongoose from 'mongoose';
import _ from 'underscore';
import * as async from 'async';
import {tokenize} from './nlp';

class ArticleTokenizer {

    constructor() {
        this.debug = true;
    }

    tokenizeInWordsAndSave(articles, finalCallback) {
        let self = this;
        let counterArticles = 0;

        async.eachSeries(articles, function (art, articlesCb) {
            const tokens = _.uniq(tokenize(art.text));
            async.each(tokens, (tok, saveCb) => {
                new Word({
                    word: tok,
                    created: art.created,
                    articleId: art._id,
                    sourceName: art.sourceName
                }).save(saveCb);
            }, (err) => {
                counterArticles++;
                self.debug && console.log(`Tokenized ${counterArticles} of ${articles.length}`);
                articlesCb(err);
            });
        }, finalCallback);
    }

    removeWords(articles, finalCallback) {
        var articlesIds = [];
        _.each(articles, (art) => {
            articlesIds.push(art._id);
        });

        Word.remove({
            articleId: {
                $in: articlesIds
            }
        }, (err, result) => {
            finalCallback(err, result);
        });
    }

    countWords(articles, finalCallback) {
        var articlesIds = [];
        _.each(articles, (art) => {
            articlesIds.push(art._id);
        });

        Word.count({
            articleId: {
                $in: articlesIds
            }
        }, (err, result) => {
            finalCallback(err, result);
        });
    }
}

export default ArticleTokenizer;