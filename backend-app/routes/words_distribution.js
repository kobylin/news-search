import async from 'async';
import path from 'path';
import _ from 'underscore';
import * as models from '../models';
import fs from 'fs';

console.log()

const ruStopWords = fs.readFileSync(__dirname + '/../data/russian').toString().split('\n');
const uaStopWords = fs.readFileSync(__dirname + '/../data/ukranian').toString().split('\n');
const allStopWords = ruStopWords.concat(uaStopWords);

export

function words_distribution(req, res) {
  const _from = req.query.from;
  const to = req.query.to;
  const sourceName = req.query.sourceName;
  const groupBySource = req.query.groupBySource === '1';
  const q = req.query.q;
  const nostopwords = req.query.nostopwords === '1';

  var group = {
    _id: {
      word: '$word'
    },
    count: {
      $sum: 1
    }
  };

  if (groupBySource) {
    group._id.sourceName = '$sourceName';
  }

  var query = [{
    $group: group
  }, {
    $sort: {
      count: -1
    }
  }, {
    $project: {
      count: 1,
      word: '$_id.word',
      _id: 0
    }
  }];

  var match = {
    word: {
      $not: /\d+/
    }
  };

  if (_from) {
    match.created = {
      $gt: new Date(parseInt(_from))
    };
  }

  if (sourceName) {
    match.sourceName = sourceName;
  }

  // if (q) {
  //   match.word = q;
  // }

  if (!_.isEmpty(match)) {
    query.unshift({
      $match: match
    });
  }

  if (nostopwords) {
    query.unshift({
      $match: {
        word: {
          $nin: allStopWords
        }
      }
    });
  }

  console.log('-------------query----------------', q);
  console.log(JSON.stringify(query, null, 2));

  models.Word.aggregate(query)
    .exec((err, result) => {
      if (err) {
        return res.send(err);
      }

      const resultChunk = result.slice(0, 200);

      res.json(resultChunk);
    });

  return;

  const cacheKey = JSON.stringify(query);

  models.Cache
    .findOne({
      key: cacheKey
    })
    .exec((err, result) => {
      if (err) {
        return res.send(err);
      }
      if (result) {
        console.log('Get value from cache');
        res.json(JSON.parse(result.value));
      } else {
        models.Word.aggregate(query)
          .exec((err, result) => {
            if (err) {
              return res.send(err);
            }

            const resultChunk = result.slice(0, 200);

            new models.Cache({
              key: cacheKey,
              value: JSON.stringify(resultChunk)
            }).save((err) => {
              if (err) {
                console.log('Cache error', err);
              }
              console.log('Cache saved');
            });

            res.json(resultChunk);
          });
      }
    });
}

export

function words_distribution_articles(req, res) {
  const q = req.query.q;
  if (!q) {
    return res.send([]);
  }

  const offset = parseInt(req.query.offset) || 0;
  const size = parseInt(req.query.size) || 20;
  const orderBy = req.query.orderBy || 'created';
  const orderDir = req.query.orderDir;

  let sortQuery = {};
  sortQuery[orderBy] = 1;

  async.parallel({
    count: (cb) => {
      models.Word.count({
        word: q
      }).exec(cb);
    },
    items: (cb) => {
      models.Word.find({
        word: q
      }).sort(sortQuery).skip(offset).limit(size).exec(cb);
    }
  }, (err, result) => {

    models.Article.find({
      _id: {
        $in: result.items.map(it => it.articleId)
      }
    }).exec((err, articles) => {
      // return res.json(articles.concat(result.items));
      if(err) {
        return res.send(err);
      }
      // var newItems = [];
      // _.each(result.items, (it) => {
      //   var newIt = {
      //     word: it.word
      //   }; //_.extend({}, it);
      //   newIt.article = _.find(articles, (art) => {
      //     return art._id.toString() == it.articleId;
      //   });
      //   newItems.push(newIt);
      // });

      res.json({
        meta: {
          q: q,
          offset: offset,
          size: size,
          orderBy: orderBy,
          orderDir: orderDir,
          count: result.count
        },
        items: articles
      });
    });

  });
}