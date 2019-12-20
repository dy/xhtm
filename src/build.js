const FIELD = '\ue000'

export default function (statics) {
	let h = this,
		nameTpl = this.nameTpl || ((s, ...f) => {
			if (!s[0] && f.length === 1 && !s[1]) return f[0]
			return String.raw(s, ...f)
		}),
		valueTpl = this.valueTpl || nameTpl

	let prev = 0, current = [], field = 0, args, name, value

	statics
	.join(FIELD)
	.replace(/\s+/g, ' ')
	.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
		if (idx) {
			let close

			str.slice(prev, idx).split(' ').map((part, i) => {
				if (part[0] === '/') close = true
				else if (!i) {
					current = [current, part]
				}
				else {
					let props = current[2] || (current[2] = {})
					if (part.slice(0, 3) === '...') {
						Object.assign(props, arguments[++field])
					}
					else {
						[name, value] = part.split('=')
						props[name] = value ? value : true
					}
				}
			})

			if (close) {
				[current, ...args] = current
				current.push(h(...args))
			}
		}

		current.push(text)
		prev = idx + match.length
	})

	return current.length > 1 ? current : current[0]
}
