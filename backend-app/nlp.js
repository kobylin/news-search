const ruMonthNames = ['января', 'февраля', 'марта', 'апреля', 'мая',
	'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export function tokenize(text) {
	var clean = text.replace(/[^a-zа-яё0-9]/gi, ' ').replace(/[\s\n]+/g, ' ').trim();
	return clean.split(' ').map(function(s) {
		return s.toLowerCase();
	});
}

export function parseKorrDateTime(rawDateTime) {
	var cleaned = rawDateTime.trim().replace('&nbsp;', ' ').replace(/^-\s/, '');
	var dateRx = /^(\d\d?\s.+\s\d\d\d\d)/.exec(cleaned);
	var timeRx = /(\d\d:\d\d)/.exec(cleaned);

	var date;
	if (!dateRx) {
		var d = new Date();
		var day;
		dateRx = /Вчера/.exec(cleaned);
		if (dateRx) {
			day = d.getDate() - 1;
		} else {
			day = d.getDate();
		}

		date = [day, d.getMonth(), d.getFullYear()];
	} else {
		var dateSpl = dateRx[1].split(' ');
		date = [parseInt(dateSpl[0]), ruMonthNames.indexOf(dateSpl[1]), parseInt(dateSpl[2])];
	}

	var time;
	if (!timeRx) {
		time = [null, null];
	} else {
		var timeSpl = timeRx[1].split(':');
		time = [parseInt(timeSpl[0]), parseInt(timeSpl[1])]
	}

	return new Date(
		date[2],
		date[1],
		date[0],
		time[0],
		time[1]
	);
}