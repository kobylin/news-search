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
default

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

  var match = {};

  if (_from) {
    match.created = {
      $gt: new Date(parseInt(_from))
    };
  }

  if (sourceName) {
    match.sourceName = source
    Name;
  }

  if (q) {
    match.$or = [{
      title: new RegExp(q, 'i')
    }, {
      text: new RegExp(q, 'i')
    }];
  }

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

  // console.log('-------------query----------------', q);
  // console.log(JSON.stringify(query, null, 2));

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
              if(err) {
                console.log('Cache error', err);
              }
              console.log('cache saved');
            });

            res.json(resultChunk);
          });
      }
    });


}