import express from 'express';
import * as models from './models';
import async from 'async';

models.connect();

const app = express();
app.use(express.static('frontend-app-build'));
app.use(express.static('node_modules'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('/articles',  (req, res) => {
    const q = req.query.q || 0;
    const offset = parseInt(req.query.offset) || 0;
    const size = parseInt(req.query.size) || 10;
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir;

    console.log(new RegExp(q, 'i'), q);


    async.parallel({
        count: (cb) => {
            models.Article.count({
                $or: [
                    {title: new RegExp(q, 'i')},
                    {text: new RegExp(q, 'i')},
                ]
            }).exec(cb);
        },
        items: (cb) => {
            models.Article.find({
                $or: [
                    {title: new RegExp(q, 'i')},
                    {text: new RegExp(q, 'i')},
                ]
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


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
