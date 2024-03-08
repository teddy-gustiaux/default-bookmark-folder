'use strict';

class Logger {
	static DEBUG = 'log';
	static INFO = 'info';
	static ERROR = 'error';
	static WARNING = 'warn';

	static #add(type, level, payload, dump = null) {
		if (!GLOBAL.isDevelopment && [Logger.DEBUG, Logger.INFO].includes(type)) return;

		let message = `[${level}]`;
		const now = new Date().toTimeString().slice(0, 8);
		message = `${now} ${message}`;

		if (typeof payload === 'string') {
			message = `${message} %s`;
		} else {
			message = `${message} Variable dump:\n%O`;
		}
		console[type](message, payload);
		if (dump !== null) {
			const outputFormat = typeof dump === 'string' ? '%s' : '%O';
			console[type](outputFormat, dump);
		}
	}

	static debug(payload, dump = null) {
		Logger.#add(Logger.DEBUG, 'DEBUG', payload, dump);
	}

	static info(payload, dump = null) {
		Logger.#add(Logger.INFO, 'INFO', payload, dump);
	}

	static warn(payload, dump = null) {
		Logger.#add(Logger.WARNING, 'WARNING', payload, dump);
	}

	static error(payload, dump = null) {
		Logger.#add(Logger.ERROR, 'ERROR', payload, dump);
	}

	static clear() {
		if (GLOBAL.isDevelopment) console.clear();
	}
}
