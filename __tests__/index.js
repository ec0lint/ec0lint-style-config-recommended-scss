'use strict';

const config = require('../');
const fs = require('fs');
const ec0lint = require('ec0lint-style');

const validScss = fs.readFileSync('./__tests__/valid.scss', 'utf-8');
const invalidScss = fs.readFileSync('./__tests__/invalid.scss', 'utf-8');

describe('flags no warnings with valid scss', () => {
	let result;

	beforeEach(() => {
		result = ec0lint.lint({
			code: validScss,
			config,
		});
	});

	it('did not error', () => {
		return result.then((data) => expect(data.errored).toBeFalsy());
	});

	it('flags no warnings', () => {
		return result.then((data) => expect(data.results[0].warnings).toHaveLength(0));
	});
});

describe('flags warnings with invalid scss', () => {
	let result;

	beforeEach(() => {
		result = ec0lint.lint({
			code: invalidScss,
			config,
		});
	});

	it('did error', () => {
		return result.then((data) => expect(data.errored).toBeTruthy());
	});

	it('flags three warnings', () => {
		return result.then((data) => expect(data.results[0].warnings).toHaveLength(3));
	});

	it('correct warning text no-ttf-font-files', () => {
		return result.then((data) =>
			expect(data.results[0].warnings[0].text).toBe(
				'Format of the custom font can be changed to WOFF or WOFF2. ' +
					'Your file can be converted online at https://cloudconvert.com/\n' +
					'Estimated CO2 reduction that you can achieve by converting your file is: 0.05g (no-ttf-font-files)',
			),
		);
	});

	it('correct warning text require-font-display', () => {
		return result.then((data) =>
			expect(data.results[0].warnings[1].text).toBe(
				'No font-display property specified inside @font-face rule. (require-font-display)',
			),
		);
	});

	it('correct rule flagged no-ttf-font-files', () => {
		return result.then((data) =>
			expect(data.results[0].warnings[0].rule).toBe('no-ttf-font-files'),
		);
	});

	it('correct rule flagged require-font-display', () => {
		return result.then((data) =>
			expect(data.results[0].warnings[1].rule).toBe('require-font-display'),
		);
	});

	it('correct severity flagged', () => {
		return result.then((data) => expect(data.results[0].warnings[0].severity).toBe('error'));
	});

	it('correct line number', () => {
		return result.then((data) => expect(data.results[0].warnings[0].line).toBe(1));
	});

	it('correct column number', () => {
		return result.then((data) => expect(data.results[0].warnings[0].column).toBe(43));
	});
});
