import async from 'async';
import path from 'path';
import _ from 'underscore';
import * as models from '../models';

export
default

function articles(req, res) {
  const q = req.query.q || '';
  const offset = parseInt(req.query.offset) || 0;
  const size = parseInt(req.query.size) || 20;
  const orderBy = req.query.orderBy || 'created';
  const orderDir = req.query.orderDir;
  const wholeWord = req.query.wholeWord === '1';
  const _from = Date.parse(req.query.from);
  const to = Date.parse(req.query.to);

  let sortQuery = {};
  sortQuery[orderBy] = 1;

  let qRegExp;
  if (wholeWord) {
    qRegExp = new RegExp(`([^wа-яА-Яїіє]+|^)(${q})([^wа-яА-Яїіє]+|$)`, 'i');
  } else {
    qRegExp = new RegExp(q, 'i');
  }

  let findQuery = {
    $or: [{
      title: qRegExp
    }, {
      text: qRegExp
    }, ]
  };

  if (_from || to) {
    findQuery.created = {};
  }

  if (_from) {
    let fromDate = new Date(_from);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    findQuery.created.$gte = fromDate;
  }
  if (to) {
    let toDate = new Date(to);
    toDate.setHours(0);
    toDate.setMinutes(0);
    toDate.setDate(toDate.getDate() + 1);
    findQuery.created.$lt = toDate;
  }

  console.log('/articles fq', findQuery)

  async.parallel({
    count: (cb) => {
      models.Article
        .count(findQuery)
        .exec(cb);
    },
    items: (cb) => {
      models.Article
        .find(findQuery)
        .sort(sortQuery)
        .skip(offset).limit(size)
        .exec(cb);
    }
  }, (err, result) => {
    res.json({
      meta: {
        q: q,
        offset: offset,
        size: size,
        orderBy: orderBy,
        orderDir: orderDir,
        count: result.count
      },
      items: result.items
    });
  });
};