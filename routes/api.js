const router = require('express').Router();
const Program = require('../models/program');
router.post('/compile', async (req,res) => {
	if (!req.body.code) return res.error(400, 'Missing code parameter');
	const program = new Program(req.body.code);
	const compiled = await program.compile();
	res.set('Content-Type', 'application/octet-stream');
	res.send(Buffer.from(compiled));
});
router.post('/save', async (req, res) => {
	if (!req.body.code) return res.error(400, 'Missing code parameter');
	const program = new Program(req.body.code);
	program.save();
	res.json({id: program.id});
});
module.exports = router;