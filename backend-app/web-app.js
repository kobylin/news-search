import express from 'express'
import * as models from './models'


models.connect();

const app = express();
app.use(express.static('frontend-app-build'));
app.use(express.static('node_modules'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('/articles',  (req, res) => {
    const q = req.query.q || 0;
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
            meta: {
                q: q,
                offset: offset,
                size: size,
                orderBy: orderBy,
                orderDir: orderDir
            }, 
            items: result
        });
    });
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
