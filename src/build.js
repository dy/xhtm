export default function ({ raw: statics }) {
	const h = this
	const nameTpl = this.name || String.raw

	let i = -1, j = 0, chunk = statics[0], curr = chunk[0]
	// i, j and curr point to the same char/field position
	// chunk points to static part or field

	return text([[]])

	function next(c, strings=[], fields=[]) {
		if (c && (c.test ? !c.test(curr) : curr !== c)) {
			strings.push(chunk.slice(0, j))
			chunk = chunk.slice(j)
			j = 0
			return next
		}

		if (j < 0) {
			i++
			if (i) fields.push(arguments[curr])
			chunk = statics[i]
			if (chunk == null) return next
		}

		curr = chunk[++j]

		if (curr == null) {
			j = -1
			strings.push(chunk)
			curr = chunk = i
		}

		return next(c, strings, fields)
	}

	function text (nodes) {
		next('<', nodes, nodes)

		if (curr == null) return nodes

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

	function name (quotes) {
		let quote, statics = [], fields = []
		if (quotes && (curr === '"' || curr === "'")) {
			quote = curr
			next()(quote, statics, fields)()
		}
		else {
			next(/[\s=/>]/, statics, fields)
		}

		fields.unshift(statics.raw = statics)
		return nameTpl(...fields)
	}

	function props (currProps) {
		next(/[^\s/>]/)

		if (curr == null || curr === '>' || (curr === '/' && chunk[1] === '>')) return currProps

		if (!currProps) currProps = {}

		// ...${}
		if (curr === '.') {
			if (chunk.slice(0, 3) === '...') {
				next()()()
				Object.assign(currProps, curr)
				return props(currProps)
			}
		}
		let propName = name()
		currProps[propName] = curr === '=' ? (next(), name()) : true

		return props(currProps)
	}
}
