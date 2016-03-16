import request from 'request';
import * as cheerio from 'cheerio';
import * as async from 'async';
import * as _ from 'underscore';
import mongoose from 'mongoose';
import {
  Article
}
from './models';
import * as models from './models';
import {
  parseKorrDateTime
}
from './nlp';
import {
  justText
}
from './parser-helpers';
import iconv from 'iconv';

export const MonthNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class PravdaParser {

  constructor(options = {}) {
    this.emptyPagesAttempt = options.emptyPagesAttempt || 3;
    this.goNextPageTimeout = options.goNextPageTimeout || 500;
    this._conv = new iconv.Iconv('windows-1251', 'utf8');
  }

  fetchAndSaveMonths(year, months, fetchAndSaveCb) {
    async.eachSeries(months, (month, monthCb) => {
      this.getArticlesForMonth(year, month, (articles) => {
        // console.log('articles', articles)
        async.each(articles, function(art, artCb) {
          var article = new Article(art);
          article.save(artCb);
        }, function(err) {
          console.log(year, ',', month, ' - ', articles.length, ' articles saved');
          monthCb(err);
        });
      });

    }, (err) => {
      if (err) {
        console.log('ERROR: ', err);
      }

      console.log('All months finished', months.join(', '));
      fetchAndSaveCb(err);
    });
  }

  getArticlesForMonth(year, month, callback) {
    var self = this;
    var startDate = new Date(year, month - 1);
    var startMonth = startDate.getMonth();
    var currentDate = startDate;
    var monthArticles = [];
    var pageN = 0;

    function doRequest() {
      if (currentDate.getMonth() !== startMonth) {
        callback(monthArticles);
        return;
      }
      var date = ('0' + currentDate.getDate()).slice(-2) +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) +
        currentDate.getFullYear();

      var url = `http://www.pravda.com.ua/rus/archives/date_${date}/`;
      console.log(url);

      request({
        url: url,
        encoding: null,
        headers: {
          Cookie: 'b=b; b=b; _ym_uid=1457515766598595745; _ym_isad=1; b=b; PRAVDA_COOKIE=75e84cc72acec051fcaac8720dd3b3af; _ga=GA1.3.1874425770.1457515765; _gat=1',
        }
      }, (err, resp, body) => {
        body = new Buffer(body, 'binary');
        body = self._conv.convert(body).toString();

        var $dom = cheerio.load(body, {
          decodeEntities: false
        });

        var articles = $dom('.news_all .article');
        console.log(articles.length);

        articles.each(function(i, art) {
          monthArticles.push(PravdaParser.getDataFromArticle($dom, art, currentDate));
        });

        setTimeout(function() {
          currentDate.setDate(currentDate.getDate() + 1);
          doRequest();
        }, self.goNextPageTimeout);
      });
    }

    doRequest();
  }

  static getDataFromArticle($dom, art, date) {
    var createdRaw = justText($dom(art).find('.article__time')).trim();

    return {
      title: $dom(art).find('.article__title a').text().trim(),
      text: justText($dom(art).find('.article__subtitle')).trim(),
      createdRaw: createdRaw,
      created: PravdaParser.parseDateTime(date, createdRaw),
      link: $dom(art).find('.article__title a').attr('href'),
      sourceName: 'pravda'
    };
  }

  static parseDateTime(knownDate, timeStr) {
    var date = new Date(+knownDate);
    var timeP = timeStr.split(':');
    date.setHours(parseInt(timeP[0]));
    date.setMinutes(parseInt(timeP[1]));
    return date;
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
export
default PravdaParser;