export default function ({ raw: statics }, ...fields) {
	const h = this
	const nameTpl = this.nameTpl || String.raw

	let chunk = statics[0], curr = chunk[0], i = 0

	const next = (c, a=[], b=[]) => {
		if (chunk == null) return next

		let idx = !c ? 1 : chunk.search(c)

		if (idx >= 0) {
			a.push(chunk.slice(0, idx))
			chunk = chunk.slice(idx)
			curr = chunk[0]
			return next
		}

		if (i === fields.length) return
		a.push(chunk)
		b.push(fields[i++])
		chunk = statics[i]
		return next(c, a, b)
	}

	const text = (nodes) => {
		if (!next('<', nodes, nodes)) return nodes

		next() // <
		if (curr === '/') return nodes

		// tag
		const tagName = name(false)
		const tagProps = props()
		const children = []

		// non self-closing tag
		if (curr !== '/') {
			next() // >
			text(children)
		}
		next('>')()
		nodes.push(h(tagName, tagProps, ...children))

		return text(nodes)
	}

	const name = (quotes) => {
		let quote = curr, statics = [], fields = []
		if (quotes && (quote === '"' || quote === "'")) {
			next()(quote, statics, fields)()
		}
		else {
			next(/[\s=/>]/, statics, fields)
		}

		fields.unshift(statics.raw = statics)
		return nameTpl(...fields)
	}

	const props = (currProps) => {
		next(/\S/)

		if (curr === '>' || chunk.slice(0,2) === '/>') {
			return currProps
		}

		if (!currProps) currProps = {}

		// ...${}
		if (chunk.slice(0, 3) === '...') {
			next()()()
			Object.assign(currProps, curr)
			return props(currProps)
		}
		let propName = name()
		currProps[propName] = curr === '=' ? (next(), name()) : true

		return props(currProps)
	}

	return text([])
}
