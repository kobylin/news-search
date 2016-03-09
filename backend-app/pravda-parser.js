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

var request1 = request.defaults({jar: true});
var j = request.jar();
var cookie = request.cookie('PRAVDA_COOKIE=75e84cc72acec051fcaac8720dd3b3af');
// j.setCookie(cookie, 'www.pravda.com.ua');

class PravdaParser {

  constructor(options = {}) {
    this.emptyPagesAttempt = options.emptyPagesAttempt || 3;
    this.goNextPageTimeout = options.goNextPageTimeout || 500;
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
      fetchAndSaveCb();
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

      var url = `http://www.pravda.com.ua/archives/date_${date}/`;
      console.log(url);


      request1({
        url: url,
        jar: j,
        // 'PRAVDA_COOKIE': '75e84cc72acec051fcaac8720dd3b3af',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36',
          Cookie: 'b=b; b=b; _ym_uid=1457515766598595745; _ym_isad=1; b=b; _ga=GA1.3.1874425770.1457515765',
          'Content-Type': 'text/plain; charset=utf-8',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, sdch',
          'Accept-Language': 'en-US,en;q=0.8,ru;q=0.6',

        }
      }, function(err, resp, body) {
        console.log(body)
        var $dom = cheerio.load(body, {
          decodeEntities: false
        });

        var articles = $dom('.news_all .article');
        console.log(articles.length);

        articles.each(function(i, art) {
          monthArticles.push(PravdaParser.getDataFromArticle($dom, art));
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
      link: $dom(art).find('.article__title a').attr('href')
    };
  }

  static parseDateTime(knownDate, timeStr) {
    var date = new Date(+knownDate);
    timeP = timeStr.split(':');
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