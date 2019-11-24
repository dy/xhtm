export default function ({ raw: str }) {
	const h = this
	const nameTpl = this.name || String.raw

	let stack = [], i = 0, j = 0, curr = str[0]

	// flatten input
	while (j < str.length) stack.push(...str[j].split(''), ++j)
	stack.pop()

	return text([])

	function next(c=stack[i+1]) {
		while (curr != null && (c.test ? (!c.test(curr)) : (curr !== c))) {
			curr = stack[++i]
		}
		return next
	}

	function text (nodes) {
		let from = i
		next('<')
		nodes.push(...stack.slice(from, i).map(item => item.trim ? item : arguments[item]))

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

		let args = [[]]
		stack.slice(from, i).map(item => {
			item.trim ? args[0].push(item) : args.push(arguments[item])
		})
		args[0].raw = args[0]
		return nameTpl(...args)
	}

	function props (currProps) {
		next(/[^\s/>]/)

		if (curr == null || curr === '>' || stack.slice(i, i + 2) === '/>') return currProps

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
		currProps[propName] = curr === '=' ? (next(), name()) : true

		return props(currProps)
	}
}
