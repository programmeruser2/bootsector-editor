const path = require('path');
const router = require('express').Router();
const Program = require('../models/program');
const { default: defaultCode } = require('../config');
router.get('/', (req, res) => {
	res.render('editor', { code: defaultCode });
});
router.get('/bootsector/:id', async (req, res) => {
	const program = await Program.get(req.params.id);
	console.log(program.id,program.code);
	if (!program) return res.error(404, 'No such program');
	res.render('editor', { code: program.code });
});
module.exports = router;