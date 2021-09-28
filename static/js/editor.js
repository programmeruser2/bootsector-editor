(function () {
	//const $ = selector => document.querySelector(selector);
	//EventTarget.prototype.on = EventTarget.prototype.addEventListener;

	//setup editor
	const editor = ace.edit('editor');
	const session = editor.getSession();

	const emulatorContainer = $('#emulator-container');
	$('#run-container').draggable();
	let compiled, image;
	async function build(code) {
		const compiled = await fetch('/api/compile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code })
		}).then(res => res.arrayBuffer()).then(buffer => new Uint8Array(buffer));
		return compiled;
	}
	function run(compiled) {
		const blob = new Blob([compiled], {type: 'application/octet-stream'});
		const url = URL.createObjectURL(blob);
    if (window.emulator) window.emulator.stop();
    delete window.emulator;
		window.emulator = new V86Starter({
			wasm_path: '/static/vendor/v86/build/v86.wasm',
			memory_size: 32 * 1024 * 1024,
			vga_memory_size: 2 * 1024 * 1024,
			screen_container: emulatorContainer[0],
			bios: {
				url: '/static/vendor/v86/bios/seabios.bin'
			},
			vga_bios: {
				url: '/static/vendor/v86/bios/vgabios.bin'
			},
			fda: {
				url
			},
			boot_order: 231,
			autostart: true
		});
	}
	const actions = {
		build: async () => {
			const buffer = await build(editor.getValue());
			image = buffer;
			//pad with zeroes to 163840 bytes
			//see https://blog.benjdoherty.com/2017/08/07/Writing-a-minimal-boot-sector-for-the-v86-emulator/
			compiled = new Uint8Array(163840);
			for (let i = 0; i < buffer.length; ++i) compiled[i] = buffer[i];
			for (let i = buffer.length; i < compiled.length; ++i) compiled[i] = 0;
		},
		run: () => run(compiled)
	}
	$('#build').on('click', async event => {
		await actions.build();
	});
	$('#build-run').on('click', async event => {
		await actions.build();
		actions.run();
	});
	$('#run').on('click', event => {
		if (!compiled) return swal('Please compile your code before running it.');
		actions.run();
	});
	$('#stop').on('click', event => {
		if (emulator) emulator.stop();
	});
	$('#save').on('click', async event => {
		const id = await fetch('/api/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: editor.getValue() })
		}).then(res => res.json()).then(({id}) => id);
		location.href = '/bootsector/' + id;
	});
	/*$('#code').on('keydown', event => {
		if (event.key === 'Tab') {
			event.preventDefault();
			const { value, selectionStart: start, selectionEnd: end} = $('#code');
			$('#code').value = value.slice(0, start) + '\t' + value.slice(end);
			$('#code').selectionStart = $('#code').selectionEnd = start + 1;
		}
	});*/
})();