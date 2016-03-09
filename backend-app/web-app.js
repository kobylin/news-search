import express from 'express';
import * as models from './models';
import async from 'async';
import path from 'path';

models.connect();

const app = express();
app.use(express.static('frontend-app-build'));
app.use(express.static('node_modules'));

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.get('/articles', (req, res) => {
    const q = req.query.q || 0;
    const offset = parseInt(req.query.offset) || 0;
    const size = parseInt(req.query.size) || 10;
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir;

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
            }).skip(offset).limit(size).exec(cb);
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
});

app.get('/articles_distribution', (req, res) => {
    var _from = req.query.from;
    var to = req.query.to;
    
    var query = [{
        $group: {
            _id: {
                day: {
                    $dayOfMonth: '$created'
                },
                month: {
                    $month: '$created'
                },
                year: {
                    $year: '$created'
                }
            },
            count: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            '_id.year': 1,
            '_id.month': 1,
            '_id.day': 1
        }
    }, {
        $project: {
            _id: 0,
            date: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
            },
            count: 1
        }
    }];

    if(_from) {
        var match = {
            $match: {created: {$gt: new Date(parseInt(_from))}}
        };
        query.unshift(match);
    }
    models.Article.aggregate(query)
        .exec((err, result) => {
            if (err) {
                return res.send(err);
            }
            res.json(result);
        });
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});