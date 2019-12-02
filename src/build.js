export default function (statics, ...fields) {
	let h = this,
		nameTpl = this.nameTpl || ((s, ...f) => {
			if (!s[0] && f.length === 1 && !s[1]) return f[0]
			return String.raw(s, ...f)
		}),
		valueTpl = this.valueTpl || nameTpl

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
			else {
				level = [level, '', null]
				mode = node
				prop = buf = ''
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
				Object.assign(level[2], fields[curr])
			}
			else if (curr < fields.length) {
				if (args[0].length < args.length) {
					args[0].push(buf)
					buf = ''
				}
				args.push(fields[curr])
			}
		}
		else {
			if (curr === quote) {
				curr = ' '
				quote = ''
			}
			if (!quote && (curr === ' ' || curr === '\t' || curr === '\r' || curr === '\n' || curr === '=' || curr === '/' || curr === '>')) {
				if (buf || args[0].length) {
					args[0].push(buf)
					buf = ''

					args[0].raw = args[0]
					let stringified = nameTpl(...args)
					args = [[]]
					if (!level[1]) {
						level[1] = stringified
					} else {
						if (!level[2]) {
							level[2] = {}
						}
						if (curr === '=') {
							prop = stringified
							if (~`'"`.indexOf(str[j+1])) {
								j++
								quote = str[j]
							}
						}
						else {
							if (prop) {
								level[2][prop] = stringified
								prop = ''
							}
							else {
								level[2][stringified] = true
							}
						}
					}
				}

				if (curr === '/') {
					let node = h(...level.slice(1))
					level = level[0]
					level.push(node)
					j++
				}
				else if (curr === '>') {
					prop = ''
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
