const MINI = true

const createNode = (parent) => Object.assign(['', null ], { parent })

export default function (...args) {
	const h = this
	let subargs = [{ raw: [] }]

	let curr = MINI ? createNode(null) : []

	let i = -1, j = -1, str, char = '', buf = '', end, field

	const next = (proceed, collect=true) => {
		if (end) throw 'Invalid HTML'

		if (char && proceed) {
			if (proceed.test) {
				if (!proceed.test(char)) return
			}
			else if (!proceed(char)) return
		}

		if (j < 0) {
			j = 0
			i++
			// static part
			if (collect) {
				if (i >= 0) {
					// new args must start and end with empty string
					if (!subargs[0].raw.length) {
						subargs[0].raw.push('')
					}
					subargs.push(field)
				}
				field = null
			}
			str = args[0].raw[i]
			char = str[j]
		}
		else if (j === str.length) {
			j = -1
			// field
			if (collect) {
				subargs[0].raw.push(buf)
				buf = ''
			}
			char = ''
			field = MINI ? args[i+1] : i+1
		}
		// mid of static part
		else {
			j++
			if (collect) {
				buf += char
			}
			if (j >= str.length && i >= args.length - 1) return end = true
			char = str[j]
		}

		if (proceed) return next(proceed, collect)
	}

	const skip = (condition) => next(condition, false)

	const commit = (tpl) => {
		subargs[0].raw.push(buf)
		buf = ''
		let result = MINI ? tpl(...subargs) : [subargs, tpl]
		subargs = [{ raw: [] }]
		return result
	}

	const text = () => {
		if (end) {
			curr.push(...commit(textTpl))
			return curr
		}
		if (char === '<') {
			if (subargs.length > 1) curr.push(...commit(textTpl))
			skip()

			if (char === '/') {
				closeTag()
			}
			else {
				curr = createNode(curr)
				openTag()
			}
			return
		}

		next()
		text()
	}

	const closeTag = () => {
		// end tag
		skip(/[^>]/)
		skip()
		if (MINI) {
			curr.parent.push(h(...curr))
		}
		curr = curr.parent
		text()
	}

	const openTag = () => {
		next(/[^\s/>]/)
		curr[0] = commit(tagTpl)
		props()
	}

	const props = () => {
		skip(/\s/)

		if (char === '>') {
			skip()
			text()
			return
		}
		else if (char === '/') {
			closeTag()
			return
		}

		if (!curr[1]) curr[1] = {}
		let currProps = curr[1]

		// new attribute
		let prop = parseName(/[^\s=/]/, nameTpl)
		currProps[prop] = true

		// a bit htm-specific rules
		if (char === '/') {
			closeTag()
			return
		}
		// parse value
		else if (char === '=') {
			skip()
			// htm-specific rule
			let value = parseName(c => /[^\s>]/.test(c) && !(str[j+1] === '>' && c === '/'), valueTpl)
			currProps[prop] = value
		}

		props()
	}

	const parseName = (re, tpl) => {
		let quote, value
		if (char === '"' || char === "'") {
			quote = char
			skip()
			next(c => c !== quote)
			skip()
		}
		else {
			next(re)
		}
		value = commit(tpl)
		return value
	}

	next()
	text()

	let result = curr.slice(2)
	return result.length > 1 ? result : result[0]
}


const valueTpl = (statics, ...fields) => {
	if (fields.length === 1 && !statics.raw[0] && !statics.raw[1]) return fields[0]
	return String.raw(statics, ...fields)
}
const tagTpl = valueTpl
const nameTpl = valueTpl

const textTpl = (statics, ...fields) => {
	let arr = []
	statics.raw.map((value, i) => {
		if (value === 0 || value) arr.push(value)
		if (fields[i] === 0 || fields[i]) arr.push(fields[i])
	})
	return arr
}
