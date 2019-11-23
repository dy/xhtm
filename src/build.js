export default function ({ raw: str }, ...fields) {
	const h = this
	const nameTpl = this.name || String.raw

	// flatten input
	let stack = [], j = 0, i = 0, curr
	for (j; j < str.length; j++) {
		stack.push(...str[j].split(''), j)
	}
	stack.pop()

	return text([])


	function next(c) {
		if (c) while (i < stack.length && (c.test ? !c.test(curr) : curr !== c)) {
			curr = stack[++i]
		}
		else curr = stack[++i]

		// if (curr == null) throw Error('Invalid HTML')

		return next
	}

	function text (nodes) {
		next('<')

		if (i >= stack.length) return nodes

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
		let from = i
		let quote
		if (quotes && (curr === '"' || curr === "'")) {
			quote = curr
			next()(quote)()
		}
		else {
			next(/[\s=/>]/)
		}

		let nameStatics = [], nameFields = []
		stack.slice(from, i).map(char => {
			char.trim ? nameStatics.push(char) : nameFields.push(fields[char])
		})
		nameStatics.raw = nameStatics
		return nameTpl(nameStatics, ...nameFields)
	}

	function props (currProps) {
		next(/[^\s/>]/)

		if (curr == null || curr === '>' || (curr === '/' && stack[i+1] === '>')) return currProps

		if (!currProps) currProps = {}

		// ...${}
		if (curr === '.') {
			let from = i
			next()()()()
			if (stack.slice(from, i - 1) === '...') {
				Object.assign(currProps, curr)
				return props(currProps)
			}
		}
		let propName = name()
		currProps[propName] = true
		if (curr === '=') {
			next()
			currProps[propName] = name()
		}

		return props(currProps)
	}
}
