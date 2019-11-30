const PLACEHOLDER = '\u0000'

export default function (statics, ...fields) {
	// statics = statics.map(s => s.replace(/\s+/, ' '))
	let str = statics.join(PLACEHOLDER).replace(/\s+/, ' ')

	let h = this,
			nameTpl = this.nameTpl || ((s, ...f) => {
				if (!s[0] && f.length === 1 && !s[1]) return f[0]
				return String.raw(s, ...f)
			}),
			valueTpl = this.valueTpl || nameTpl,
			field = 0, i = 0, current = []

		let end = 100

	const next = (c=1, s, f) => {
		let idx
		if (c.trim) {
			idx = str.indexOf(c, i)
		}
		else if (c.exec) {
			idx = str.slice(i).search(c)
			if (~idx) idx += i
		}
		else {
			idx = c
		}

		if (s && i != idx) {
			str.slice(i, idx).split(PLACEHOLDER).map(part => {
				s.push(part)
				f.push(fields[field++])
			})
			field--
			f.pop()
		}

		// skip searched term
		i = idx + (c.length || 1)
	}

	// [...]<
	const text = () => {
		next('<', current, current)

		if (!end--) throw ('ERROR')

		// <!--
		if (str) {
			if (str.substr(i, 3) === '!--') {
				next('-->')
				text()
			}
			else if (str[i] === '/') {
				next('>')
			}
			else {
				tag()
			}
		}
	}

	// <
	const tag = () => {
		// [tag, props, ...children]
		let parent = current
		current = [name(nameTpl), null]

		while (str && str[i - 1] !== '>') {
			if (!end--) throw ('ERROR')
			if (!current[1]) current[1] = {}

			let prop = name(nameTpl)

			// ...${}
			if (prop === '...') {
				Object.assign(props, fields[field++])
			}
			else {
				current[1][prop] = (!str[i] || str[i-1] !== '=') || name(valueTpl)
			}
		}

		// collect children if non self-closing
		// >[...]<
		if (str[i] && str[i-2] !== '/') text()

		parent.push(h(...current))
		current = parent
	}

	const name = tpl => {
		let s = [], f = []
		if (str[i] === '"' || str[i] === "'") {
			next(str[i++], s, f)
			i++ // space after quote
		}
		else {
			next(/ |=|>|\/>/, s, f)
		}

		// compensate space before end
		if (str[i] === '/') i++
		if (str[i] === '>') i++

		return tpl(s.raw = s, ...f)
	}

	while (str[i]) {
		text()
	}

	return current.length < 2 ? current[0] : current
}
