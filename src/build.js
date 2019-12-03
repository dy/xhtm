const FIELD = '\ue000'
const TEXT = '\ue001'
const QUOTES = `\ue002`

export default function (statics, ...fields) {
	let h = this,
		nameTpl = this.nameTpl || ((s, ...f) => {
			if (!s[0] && f.length === 1 && !s[1]) return f[0]
			return String.raw(s, ...f)
		}),
		valueTpl = this.valueTpl || nameTpl

	// replace fields
	let str = statics.join(FIELD)

	// remove spaces
	str = str.replace(/\s+/g, ' ')

	// replace texts
	let texts = []
	str = str.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx) => {
		texts.push(text)
		return TEXT
	})

	// replace quotes
	let quotes = []
	str = str.replace(/'([^']*)'|"([^"]*)"/g, (match, singleValue, doubleValue, idx) => {
		return (quotes.push(singleValue || doubleValue), QUOTES)
	})

	// normalize tag ends
	str = str.replace(/\b\/(?=\ue001|$)/g, ' /')

	let current = [], char, buf = '', i = -1, iText = 0, iField = 0, iQuote = 0

	const evaluate = (str, s=[], f=[]) => {
		// unwrap quotes
		str = str.replace(/\ue002/g, (match, idx) => quotes[iQuote++])

		// unwrap fields
		let i = -1
		str.replace(/\ue000/g, (match, idx) => {
			s.push(str.slice(i + 1, i = idx))
			f.push(fields[iField++])
		})
		s.push(str.slice(i + 1))

		s.raw = s
		return [s, ...f]
	}
	while (char = str[++i]) {
		if (char === TEXT) {
			let close = buf[0] === '/'

			if (!close) {
				let [tag, ...attrs] = buf.split(' ')
				current = [current, nameTpl(...evaluate(tag)), null]

				close = !!attrs.pop()

				if (attrs.length) {
					let props = current[2] = {}
					attrs.map(attr => {
						if (attr.slice(0, 3) === '...') {
							Object.assign(props, fields[iField++])
						}
						else {
							let [name, value] = attr.split('=')
							props[nameTpl(...evaluate(name))] = value ? valueTpl(...evaluate(value)) : true
						}
					})
				}
			}

			if (close) {
				let node = h(...current.slice(1))
				current = current[0]
				current.push(node)
			}

			buf = ''

			evaluate(texts[iText++], current, current)
			if (current.slice(-1)[0] === '') current.pop()
		}
		else {
			buf += char
		}
	}

	delete current.raw
	return current.length > 1 ? current : current[0]
}

