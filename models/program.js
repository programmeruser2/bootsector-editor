const { promises: fs } = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config');
function promiseExec(command, options = {}) {
	return new Promise((resolve, reject) => {
		exec(command, options, (err, stdout, stderr) => {
			if (err) reject(err);
			if (stderr) reject(new Error(stderr));
			resolve(stdout);
		});
	});
}
class Program {
	constructor(code) {
		this.id = uuidv4();
		this.code = code;
	}
	async compile() {
		const { id, code } = this;
		await fs.writeFile(`/tmp/${id}.asm`, code);
		await promiseExec(`nasm -f bin -o /tmp/${id}.img /tmp/${id}.asm`);
		const compiled = new Uint8Array(await fs.readFile(`/tmp/${id}.img`));
		await fs.unlink(`/tmp/${id}.asm`);
		await fs.unlink(`/tmp/${id}.img`);
		this.compiled = compiled;
		return compiled;
	}
	async save() {
    console.log(this.id,this.code)
		await db.set(this.id, this.code);
	}
}
Program.get = async function (id) {
	const code = await db.get(id);
  console.log('code=',code);
	if (!code) return null;
	const program = new Program(code);
	return program;
}
module.exports = Program;