const MINI = true

const createNode = (parent) => Object.assign(['', null ], { parent })

export default function (...args) {
	const h = this
	let subargs = [{ raw: [] }]

	let curr = MINI ? createNode(null) : []

	let i = 0, j = -1, str, char = '', buf = '', end, field

	const next = (proceed, collect=true) => {
		if (end) throw 'Invalid HTML'

		if (proceed) {
			if (proceed.test) {
				if (char && !proceed.test(char)) return
			}
			else if (!proceed(char)) return
		}

		// curr - field or init
		if (j < 0) {
			if (collect) {
				if (i > 0) {
					subargs[0].raw.push(buf)
					buf = ''
					subargs.push(field)
				}
				field = null
			}
			str = args[0].raw[i]
			j = 0
			char = str ? str[j] : ''
		}
		// curr - static part
		else if (j < str.length - 1) {
			if (collect) buf += char
			j++
			char = str[j]
		}
		// curr - last of static part
		else {
			if (collect) {
				buf += char
			}
			j = -1
			char = ''
			i++
			str = ''
			field = MINI ? args[i] : i
		}

			if (i >= args.length) return end = true

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
			curr.push(...commit(textTpl).filter(c => c !== ''))
			return curr
		}
		if (char === '<') {
			curr.push(...commit(textTpl).filter(c => c !== ''))
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
		skip(/\s/)
		props()
	}

	const props = () => {
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

		// catch spread
		if (char === '.') {
			next(c => {
				return c === '.' || c
			})
			if (buf === '...') {
				Object.assign(currProps, field)
				buf = ''
				skip()
				return props()
			}
		}

		// new attribute
		let prop = value(/[^\s=/>]/, nameTpl)
		if (prop) {
			currProps[prop] = true
		}
		// parse value
		if (char === '=') {
			skip()
			// htm-specific rule
			// FIXME: maybe that's more reasonable to allow props with / as well, that would shrink this part
			let val = value(c => (/[^\s>]/.test(c) && !(c === '/' && str[j+1] === '>')) || !c, valueTpl)
			currProps[prop] = val
		}

		skip(/\s/)
		props()
	}

	const value = (re, tpl) => {
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
	for (let i = 0; i < statics.raw.length; i++ ) {
		let value = statics.raw[i]
		// if (value === 0 || value)
		arr.push(value)
		// if (fields[i] === 0 || fields[i])
		if (i < fields.length) arr.push(fields[i])
	}
	return arr
}
