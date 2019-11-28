import { PLACEHOLDER } from './constants'

const nameTpl = String.raw

export default function (statics, ...fields) {
	let h = this, nameTpl = this.nameTpl, valueTpl = this.valueTpl, textTpl = this.textTpl || (([str]) => str)

	let str = statics.join(PLACEHOLDER)

	let i = 0, current = [0], char, field = 0

	const next = c => {
		let idx = str.indexOf(c, i)
		char = str[idx]
		return str.slice(i, i = (char ? idx : str.length))
	}

	const evaluate = (str, tpl = String.raw) => {
		if (str.indexOf(PLACEHOLDER)<0) return str
		let statics = str.split(PLACEHOLDER)
		return tpl({raw: statics}, ...fields.slice(field, field += statics.length - 1))
	}

	while (1) {
		let text = next('<')
		text.split(PLACEHOLDER).map(part => {
			let str = textTpl(part)
		})

		// hard-break
		if (i === str.length) return current.length === 2 ? current[1] : current.slice(1)

		char = str[++i]

		if (char === '/') {
			// close tag
			let [parent, ...params] = current
			current = parent
			current.push(h(...params))
			next('>')
			i++
		}
		else if (str.substr(i, 3) === '!--') {
			// comment
			i+=3
			next('-->')
			i+=3
		}
		else {
			// open tag
			// mode === 0  - tag
			// mode === 1  - prop
			// mode === 2  - value
			let tag = '', props = null, space = ' \t\r\n', end = '/>', quote = `'"`, mode = 0, prop = '', value = ''
			let isEnd
			while (!isEnd) {
				if (space.indexOf(char) >= 0 || (isEnd = end.indexOf(char) >= 0)) {
					mode = 1
					if (prop) {
						if (prop === '...') {
							i++
							Object.assign(props, fields[++field])
						}
						else {
							props[evaluate(prop, nameTpl)] = evaluate(value, valueTpl) || true
						}
						prop = value = ''
					}
				}
				else {
					// tag
					if (!mode) {
						tag += char
					}
					// prop
					else if (mode < 2) {
						if (!props) props = {}
						if (char === '=') {
							mode = 2
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
				char = str[++i]
			}

			// self-closing tag
			if (!isEnd) {
			// if (str[i-1] === '/') {
				current.push(h(tag, props))
				i++
			}
			// new tag
			else {
				current = [current, tag, props]
			}
		}
	}
}
