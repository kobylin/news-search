import async from 'async';
import path from 'path';
import _ from 'underscore';
import * as models from '../models';

export default function articles (req, res) {
  const q = req.query.q || 0;
  const offset = parseInt(req.query.offset) || 0;
  const size = parseInt(req.query.size) || 20;
  const orderBy = req.query.orderBy || 'created';
  const orderDir = req.query.orderDir;
  const wholeWord = req.query.wholeWord === '1';

  let sortQuery = {};
  sortQuery[orderBy] = 1;

  let qRegExp;
  if(wholeWord) {
    qRegExp = new RegExp(`([^wа-яА-Яїі]+|^)(${q})([^wа-яА-Яїі]+|$)`, 'i');
  } else {
    qRegExp = new RegExp(q, 'i');
  }

  console.log(qRegExp);

  async.parallel({
    count: (cb) => {
      models.Article.count({
        $or: [{
          title: qRegExp
        }, {
          text: qRegExp
        }, ]
      }).exec(cb);
    },
    items: (cb) => {
      models.Article.find({
        $or: [{
          title: qRegExp
        }, {
          text: qRegExp
        }, ]
      }).sort(sortQuery).skip(offset).limit(size).exec(cb);
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