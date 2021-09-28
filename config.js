const S1 = require('s1db');
module.exports = {
	dbToken: process.env.S1_TOKEN,
	default: `start:
	mov ah, 0x0e ; tty mode
	mov al, 'X'
	int 0x10
	jmp $ ; loop forever at current location`
};
module.exports.db = new S1(process.env.S1_TOKEN);
