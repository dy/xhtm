export default function (statics, ...fields) {
	statics = statics.map(s => s.replace(/\s+/, ' '))

	let h = this,
			nameTpl = this.nameTpl || ((s, ...f) => {
				if (!s[0] && f.length === 1 && !s[1]) return f[0]
				return String.raw(s, ...f)
			}),
			valueTpl = this.valueTpl || nameTpl,
			field = 0, i = 0, str = statics[0], current = []

		let end = 100

	const next = (c=1, s, f) => {
		let idx

		while (str && (idx = c.trim ? str.indexOf(c, i) : c.exec ? (~(idx = str.slice(i).search(c)) ? idx + i : idx) : c) < 0) {
			if (!end--) throw ('ERROR')
			if (s) {
				s.push(str.slice(i))
				f.push(fields[field])
			}
			str = statics[++field] || ''
		}

		if (s) {
			s.push(str.slice(i, idx))
		}
		// skip searched term
		i = idx + (c.length || 1)
	}

	// [...]<
	const text = () => {
		next('<', current, current)

		if (!end--) throw ('ERROR')

		// <!--
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
				Object.assign(props, fields[i++])
			}
			else {
				current[1][prop] = str[i-1] !== '=' || name(valueTpl)
			}
		}

		// collect children if non self-closing
		// >[...]<
		if (str && str[i-2] !== '/') text()

		parent.push(h(...current))
		current = parent
	}

	const name = tpl => {
		let s = [], f = []
		if (str[i] === '"' || str[i] === "'") {
			next(str[i++], s, f)
		}
		else {
			// check initial field
			if (!str[i]) {
				s.push('')
				f.push(fields[field++])
				str = statics[field]
				i = 0
			}

			next(/ |=|>|\/>/, s, f)
		}

		// compensate space before end
		if (str[i] === '/') i++
		if (str[i] === '>') i++

		return tpl(s.raw = s, ...f)
	}

	while (str && str[i]) text()

	return current.length < 2 ? current[0] : current
}
