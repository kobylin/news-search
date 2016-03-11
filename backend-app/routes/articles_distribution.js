import async from 'async';
import path from 'path';
import _ from 'underscore';
import * as models from '../models';

export default function articles_distribution (req, res) {
  const _from = req.query.from;
  const to = req.query.to;
  const sourceName = req.query.sourceName;
  const groupBySource = req.query.groupBySource === '1';
  const q = req.query.q;

  var group = {
    _id: {
      // day: {
      //     $dayOfMonth: '$created'
      // },
      month: {
        $month: '$created'
      },
      year: {
        $year: '$created'
      },
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
      '_id.year': 1,
      '_id.month': 1,
      '_id.day': 1
    }
  }, {
    $project: {
      _id: 0,
      'sourceName': '$_id.sourceName',
      date: {
        year: '$_id.year',
        month: '$_id.month',
        day: '$_id.day',
      },
      count: 1,
    }
  }];

  var match = {};

  if (_from) {
    match.created = {
      $gt: new Date(parseInt(_from))
    };
  }

  if (sourceName) {
    match.sourceName = sourceName;
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


  console.log('-----------------------------', q);
  console.log(JSON.stringify(query, null, 2));

  models.Article.aggregate(query)
    .exec((err, result) => {
      if (err) {
        return res.send(err);
      }
      res.json(result);
    });
}