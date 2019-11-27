import { PLACEHOLDER } from './constants'

export default function (statics, ...fields) {
	let h = this
	let str = statics.join(PLACEHOLDER)

	let i = 0, current = [0], char, field = 0

	const next = c => {
		// fast replacement for str.search
		let idx = -1
		for (let j = c.length; j--;) {
			let possibleIdx = str.indexOf(c[j], i)
			if (possibleIdx >= 0) if (idx < 0 || possibleIdx < idx) idx = possibleIdx
		}
		return (char = str[idx]) && str.slice(i, i = idx)
	}

	while (1) {
		let text = next('<')

		// hard-break
		if (!text) return current.length === 2 ? current[1] : current.slice(1)

		current.push(...text.split(PLACEHOLDER))
		char = str[++i]

		if (char === '/') {
			// close tag
			let params = current.slice(1)
			current = current[0]
			current.push(h(...params))
			next('>')
		}
		else if (str.substr(i, 3) === '!--') {
			// comment
			i+=3
			next(['-->'])
			i+=3
		}
		else {
			// open tag
			// mode === 0 - tag, mode === 1 - prop, mode === 2 - value
			let tag = '', props, space = ' \t\r\n', end = '/>', quote = `'"`, mode = 0, prop = '', value = ''

			// while (char !== '>' && char !== '/') {
			while (end.indexOf(char) < 0) {
				// if (char !== ' ' && char !== '\t' && char !== '\r' && char !== '\n') {
				if (space.indexOf(char) < 0) {
					// tag
					if (!mode) {
						tag += char
					}
					// prop
					else if (mode < 2) {
						if (char === '=') {
							mode=2
						} else {
							prop += char
						}
					}
					// value
					else {
						if (quote.indexOf(char) < 0) {
							value += char
						}
						else {
							i++
							value += next(char)
						}
					}
				}
				// space sep
				else {
					mode = 1
					if (!props) props = {}
					if (prop) {
						props[prop] = value || true
						prop = value = ''
					}
				}
				char = str[++i]
			}

			// self-closing tag
			if (char === '/') {
				current.push(h(tag, props))
				i+=2
			}
			// new tag
			else {
				i++
				current = [current, tag, props]
			}
		}
	}
}
