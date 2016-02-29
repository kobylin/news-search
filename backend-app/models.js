import mongoose from 'mongoose';

export var Word = mongoose.model('word', {
	word: String,
	created: Date,
	articleId: mongoose.Schema.Types.ObjectId
});

export var Article = mongoose.model('article', {
	title: String,
	text: String,
	createdRaw: String,
	created: Date,
	link: String
});

export function connect() {
    mongoose.connect('mongodb://localhost/news-search');
    console.log('Connected to db');
}

export function closeConnection() {
    mongoose.connection.close();
    console.log('Connection closed');
}