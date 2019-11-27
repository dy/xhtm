const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;

const TAG_SET = 1;
const CHILD_APPEND = 0;
const CHILD_RECURSE = 2;
const PROPS_ASSIGN = 3;
const PROP_SET = MODE_PROP_SET;
const PROP_APPEND = MODE_PROP_APPEND;

export const evaluate = (h, built, fields, args) => {
	for (let i = 1; i < built.length; i++) {
		const field = built[i];
		const value = typeof field === 'number' ? fields[field] : field;
		const type = built[++i];

		if (type === TAG_SET) {
			args[0] = value;
		}
		else if (type === PROPS_ASSIGN) {
			args[1] = Object.assign(args[1] || {}, value);
		}
		else if (type === PROP_SET) {
			(args[1] = args[1] || {})[built[++i]] = value;
		}
		else if (type === PROP_APPEND) {
			args[1][built[++i]] += (value + '');
		}
		else if (type === CHILD_RECURSE) {
			args.push(h.apply(null, evaluate(h, value, fields, ['', null])));
		}
		else if (type === CHILD_APPEND) {
			args.push(value);
		}
	}

	return args;
};

export const build = function (statics) {
	let mode = MODE_TEXT;
	let buffer = '';
	let quote = '';
	let current = [0];
	let char, propName;

	const commit = field => {
		if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))) {
			current.push(field || buffer, CHILD_APPEND);
		}
		else if (mode === MODE_TAGNAME && (field || buffer)) {
			current.push(field || buffer, TAG_SET);
			mode = MODE_WHITESPACE;
		}
		else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
			current.push(field, PROPS_ASSIGN);
		}
		else if (mode === MODE_WHITESPACE && buffer && !field) {
			current.push(true, PROP_SET, buffer);
		}
		else if (mode >= MODE_PROP_SET) {
			if (buffer || (!field && mode === MODE_PROP_SET)) {
				current.push(buffer, mode, propName);
				mode = MODE_PROP_APPEND;
			}
			if (field) {
				current.push(field, mode, propName);
				mode = MODE_PROP_APPEND;
			}
		}

		buffer = '';
	};

	for (let i = 0; i < statics.length; i++) {
		if (i) {
			if (mode === MODE_TEXT) {
				commit();
			}
			commit(i);
		}

		for (let j = 0; j < statics[i].length; j++) {
			char = statics[i][j];

			if (mode === MODE_TEXT) {
				// boost A
				// let idx = statics[i].indexOf('<', j)
				// if (idx < 0) idx = statics[i].length
				// buffer = statics[i].slice(j, idx)
				// j = idx
				// if (idx < statics[i].length) {
				// 	commit()
				// 	current = [current]
				// 	mode = MODE_TAGNAME
				// }

				// boost B
				let idx = statics[i].indexOf('<', j)
				if (idx < 0) {
					buffer = statics[i].slice(j)
					j = statics[i].length
				}
				else {
					buffer = statics[i].slice(j, idx)
					j = idx
					commit()
					current = [current]
					mode = MODE_TAGNAME
				}

				// if (char === '<') {
				// 	// commit buffer
				// 	// console.log(123, buffer, j, idx, mode)
				// 	commit();
				// 	current = [current];
				// 	mode = MODE_TAGNAME;
				// }
				// else {
				// 	buffer += char;
				// }
			}
			else if (mode === MODE_COMMENT) {
				// Ignore everything until the last three characters are '-', '-' and '>'
				if (buffer === '--' && char === '>') {
					mode = MODE_TEXT;
					buffer = '';
				}
				else {
					buffer = char + buffer[0];
				}
			}
			else if (quote) {
				if (char === quote) {
					quote = '';
				}
				else {
					buffer += char;
				}
			}
			else if (char === '"' || char === "'") {
				quote = char;
			}
			else if (char === '>') {
				commit();
				mode = MODE_TEXT;
			}
			else if (mode === MODE_SLASH) {
				// Ignore everything until the tag ends
			}
			else if (char === '=') {
				mode = MODE_PROP_SET;
				propName = buffer;
				buffer = '';
			}
			else if (char === '/' && (mode < MODE_PROP_SET || statics[i][j + 1] === '>')) {
				commit();
				if (mode === MODE_TAGNAME) {
					current = current[0];
				}
				mode = current;
				(current = current[0]).push(mode, CHILD_RECURSE);
				mode = MODE_SLASH;
			}
			else if (/\s/.test(char)) {
				// <a disabled>
				commit();
				mode = MODE_WHITESPACE;
			}
			else {
				buffer += char;
			}

			if (mode === MODE_TAGNAME && buffer === '!--') {
				mode = MODE_COMMENT;
				current = current[0];
			}
		}
	}
	commit();

	return current;
};
