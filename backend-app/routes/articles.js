import async from 'async';
import path from 'path';
import _ from 'underscore';
import * as models from '../models';

export default function articles (req, res) {
  const q = req.query.q || 0;
  const offset = parseInt(req.query.offset) || 0;
  const size = parseInt(req.query.size) || 10;
  const orderBy = req.query.orderBy || 'created';
  const orderDir = req.query.orderDir;

  var sortQuery = {};
  sortQuery[orderBy] = 1;

  async.parallel({
    count: (cb) => {
      models.Article.count({
        $or: [{
          title: new RegExp(q, 'i')
        }, {
          text: new RegExp(q, 'i')
        }, ]
      }).exec(cb);
    },
    items: (cb) => {
      models.Article.find({
        $or: [{
          title: new RegExp(q, 'i')
        }, {
          text: new RegExp(q, 'i')
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