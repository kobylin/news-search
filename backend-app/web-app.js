import express from 'express'
import * as models from './models'


const app = express();

models.connect();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/articles',  (req, res) => {
    const offset = req.query.offset || 0;
    const size = req.query.size || 10;
    const orderBy = req.query.orderBy;
    const orderDir = req.query.orderDir;

    models.Article.find({

    }).skip(offset).limit(size).exec((err, result)=>{
        //if(err) {
        //    return res.error(err);
        //}
        res.json({
            err: err, result: result
        });
    });
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
