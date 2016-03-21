import async from 'async';
import path from 'path';
import _ from 'underscore';
import * as models from '../models';

export
default

function articles_distribution(req, res) {
  const sourceName = req.query.sourceName;
  const groupBySource = req.query.groupBySource === '1';
  const q = req.query.q;
  const _from = Date.parse(req.query.from);
  const to = Date.parse(req.query.to);

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

  if (_from || to) {
    match.created = {};
  }
  if (_from) {
    let fromDate = new Date(_from);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    match.created.$gt = fromDate;
  }
  if (to) {
    let toDate = new Date(to);
    toDate.setHours(0);
    toDate.setMinutes(0);
    toDate.setDate(toDate.getDate() + 1);
    match.created.$lt = toDate;
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