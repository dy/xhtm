export default function (statics, ...fields) {
	let h = this,
		nameTpl = this.nameTpl || ((s, ...f) => {
			if (!s[0] && f.length === 1 && !s[1]) return f[0]
			return String.raw(s, ...f)
		}),
		valueTpl = this.valueTpl || nameTpl

	// statics = statics.map(part => part.replace(/\s+/, ' '))

	const text = () => {
		if (typeof curr === 'number') {
			if (buf) {
				level.push(buf)
				buf = ''
			}
			if (curr < fields.length) level.push(fields[curr])
		}
		else if (curr === '<') {
			if (buf) {
				level.push(buf)
				buf = ''
			}
			if (str[j + 1] === '/') {
				let node = h(...level.slice(1))
				level = level[0]
				level.push(node)
				j = str.indexOf('>', j)
			}
			else if (str.substr(j + 1, 3) === '!--') {
				j += 3
				while ((j = str.indexOf('-->', j)) < 0) {
					str = statics[++i]
				}
				j += 2
			}
			else {
				level = [level, '', null]
				mode = node
				prop = null
				buf = ''
				args = [[]]
			}
		}
		else {
			buf += curr
		}
	}

	const node = () => {
		if (typeof curr === 'number') {
			if (buf === '...') {
				level[2] = Object.assign((level[2] || {}), fields[curr])
				prop = null
				buf = ''
			}
			else if (curr < fields.length) {
				if (args[0].length < args.length) {
					args[0].push(buf)
				}
				args.push(fields[curr])
			}
			buf = ''
		}
		else {
			if (quote) {
				if (curr === quote) {
					args[0].push(buf)
					buf = ''
					quote = ''
				}
				else {
					buf += curr
				}
			}
			else if (!quote && (curr === '"' || curr === "'")) {
				quote = curr
			}
			else if (~` =>`.indexOf(curr) || str.substr(j, 2) === '/>') {
				if (buf || args[0].length) {
					args[0].push(buf)
					buf = ''
					args[0].raw = args[0]
					let stringified = nameTpl(...args)
					args = [[]]

					// tag
					if (!level[1]) {
						level[1] = stringified
					}
					else {
						if (!level[2]) level[2] = {}

						// prop
						if (curr === '=') {
							prop = stringified
						}
						else {
							if (prop == null) {
								level[2][stringified] = true
							}
							else {
								level[2][prop] = stringified
								prop = null
							}
						}
					}
				}
				// if (curr === ' ' && (str[j+1] === '>' || str.substr(j+1, 2) === '/>')) curr = str[++j]

				if (str.substr(j, 2) === '/>') {
					let node = h(...level.slice(1))
					level = level[0]
					level.push(node)
					j++
					mode = text
				}
				else if (curr === '>') {
					prop = null
					buf = ''
					mode = text
				}
			}
			else {
				buf += curr
			}
		}
	}

	let mode = text, level = [0], buf = '', curr = 0, str, i, j, args = [[]], prop, quote

	for (i = 0; i < statics.length; i++) {
		str = statics[i]
		for (j = 0; j < str.length; j++) {
			curr = str[j]
			mode()
		}
		curr = i
		mode()
	}

	return level.length < 3 ? level[1] : level.slice(1)
}
