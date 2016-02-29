import mongoose from 'mongoose';

var Word = mongoose.model('word', {
	word: String,
	created: Date,
	articleId: mongoose.Schema.Types.ObjectId
});

var Article = mongoose.model('article', {
	title: String,
	text: String,
	createdRaw: String,
	created: Date,
	link: String
});

export var Article = Article;
export var Word = Word;
export function connect() {
    mongoose.connect('mongodb://localhost/news-search');
    console.log('Connected to db');
}

export function closeConnection() {
    mongoose.connection.close();
    console.log('Connection closed');
}