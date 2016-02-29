import request from 'request';
import * as cheerio from 'cheerio';
import * as async from 'async';
import * as _ from 'underscore';
import mongoose from 'mongoose';
import {Article} from './models';
import * as models from './models';
import {parseKorrDateTime} from './nlp';
import {justText} from './parser-helpers';

const MonthNames = ["january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

class KorrParser {

    constructor() {
        this.emptyPagesAttempt = 3;
        this.goNextPageTimeout = 500;
    }

    fetchAndSaveMonths(year, months, fetchAndSaveCb) {
        async.eachSeries(months, (month, monthCb) => {
            this.getArticlesForMonth(year, month, (articles) => {
                async.each(articles, function (art, artCb) {
                    var article = new Article(art);
                    article.save(artCb);
                }, function (err) {
                    console.log(year, ',', month, ' - ', articles.length, ' articles saved');
                    monthCb(err);
                });
            });

        }, (err) => {
            if (err) {
                console.log('ERROR', err);
            }

            console.log('All months finished', months.join(', '));
            fetchAndSaveCb();
        });
    }

    getArticlesForMonth(year, month, callback) {
        var self = this;
        var pageN = 1;
        var emptyPages = 0;
        var monthArticles = [];

        function doRequest() {
            var url = 'http://korrespondent.net/all/' + year + '/' + month + '/' + 'p' + pageN;
            console.log(url);

            request(url, function (err, resp, body) {
                var $dom = cheerio.load(body, {
                    decodeEntities: false
                });

                var articles = $dom('.article');
                console.log(articles.length);

                if (articles.length === 0) {
                    emptyPages++;
                    if (emptyPages >= self.emptyPagesAttempt) {
                        callback(monthArticles);
                    } else {
                        pageN++;
                        doRequest();
                    }
                } else {
                    emptyPages = 0;
                    articles.each(function (i, art) {
                        monthArticles.push(KorrParser.getDataFromArticle($dom, art));
                    });

                    setTimeout(function () {
                        pageN++;
                        doRequest();
                    }, self.goNextPageTimeout);
                }
            });
        }

        doRequest();
    }

    static getDataFromArticle($dom, art) {
        var createdRaw = justText($dom(art).find('.article__date')).trim();

        return {
            title: $dom(art).find('.article__title a').text().trim(),
            text: justText($dom(art).find('.article__text')).trim(),
            createdRaw: createdRaw,
            created: parseKorrDateTime(createdRaw),
            link: $dom(art).find('.article__title a').attr('href')
        };
    }

    countArticlesForMonth(year, month, cb) {
        Article.count({
            created: {
                $gt: new Date(year, month, 0),
                $lt: new Date(year, month + 1, 0)
            }
        }).exec((err, count) => cb(count));
    }

    removeArticlesForMonth(year, month, cb) {
        Article.remove({
            created: {
                $gt: new Date(year, month, 0),
                $lt: new Date(year, month + 1, 0)
            }
        }).exec((err) => cb());
    }
}
export default KorrParser;