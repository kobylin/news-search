import mongoose from 'mongoose';

function checkConnection (next) {
  if(!mongoose.connection.readyState) {
    next(new Error('mongo not connected'));
  } else {
    next();
  }
}

var WordShema = new mongoose.Schema({
  word: String,
  created: Date,
  articleId: mongoose.Schema.Types.ObjectId,
  sourceName: String
});
WordShema.pre('save', checkConnection);

export var Word = mongoose.model('word', WordShema);

var ArticleShema = new mongoose.Schema({
  title: String,
  text: String,
  createdRaw: String,
  created: Date,
  link: String,
  sourceName: String
});
ArticleShema.pre('save', checkConnection);

export var Article = mongoose.model('article', ArticleShema);

var CacheSchema = new mongoose.Schema({
  key: String,
  value: String,
});

export var Cache = mongoose.model('cache', CacheSchema);

export function connect() {
    mongoose.connect('mongodb://localhost/news-search');
    console.log('Connected to db');
}

export function closeConnection() {
    mongoose.connection.close();
    console.log('Connection closed');
}