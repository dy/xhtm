export default function (statics) {
	const h = this
	const nameTpl = this.nameTpl || ((s, ...f) => {
		if (!s[0] && f.length === 1 && !s[1]) return f[0]
		return String.raw(s, ...f)
	})

	let chunk = statics[0], curr = chunk[0], i = 0

	let next = (c, a, b) => {
		let idx = !c ? 1 : chunk.search(c)

		if (idx >= 0) {
			if (a) a.push(idx ? chunk.slice(0, idx) : '')
			if (idx) chunk = chunk.slice(idx)
			curr = chunk[0]
			return next
		}

		if (a) a.push(chunk)
		chunk = statics[++i]

		// end
		if (chunk == null) return next = () => next

		if (b) b.push(arguments[i])
		return next(c, a, b)
	}

	const text = (nodes) => {
		next('<', nodes, nodes)()
		if (chunk == null || curr === '/') return nodes.filter(v => v || v === 0)

		if (chunk.slice(0, 3) === '!--') {
			next()()()('-->')()()()
			return text(nodes)
		}

		// tag
		let tagName = name(false)
		let tagProps = props()
		let children = []

		// non self-closing tag
		if (curr === '>') {
			next()
			children = text(children)
		}
		nodes.push(h(tagName, tagProps, ...children))

		next('>')()

		return text(nodes)
	}

	const name = (quotes=true) => {
		let quote = curr, statics = [], fields = []
		if (quotes && (quote === '"' || quote === "'")) {
			next()(quote, statics, fields)()
		}
		else {
			next(/\s|=|>|\/>/, statics, fields)
		}

		fields.unshift(statics.raw = statics)
		return nameTpl(...fields)
	}

	const props = (currProps=null) => {
		while (curr === ' ' || curr === '\n' || curr === '\r') next()
		if (chunk.slice(0, 2) === '/>' || curr === '>') {
			return currProps
		}

		if (!currProps) currProps = {}

		// ...${}
		if (chunk.slice(0, 3) === '...') {
			let field = []
			next(/\s|>|\//, [], field)
			Object.assign(currProps, field[0])
			return props(currProps)
		}
		let propName = name()
		currProps[propName] = curr === '=' ? (next(), name()) : true

		return props(currProps)
	}

	let nodes = text([])
	return nodes.length > 1 ? nodes : nodes[0]
}
