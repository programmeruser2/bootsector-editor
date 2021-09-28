const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
app.use(express.json());
app.use(function (req, res, next) {
	res.error = function (status, message) {
		return res.status(status).render('error', { status, message });
	};
	next();
});
app.use(require('./routes'));
app.use(function (req, res, next) {
	res.error(404, 'Not Found');
});
app.listen(8080, () => {
	console.log('Listening on port 8080');
});