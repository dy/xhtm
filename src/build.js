// - direct arrays storing in cache
import { FIELD_PLACEHOLDER } from './constants'

export function build (str) {
	let curr = [], stack = [curr]

	while(str) {
		let openTagIdx0, openTagIdx1
		openTagIdx0 = str.indexOf('<')
		if (openTagIdx0 < 0) {
			curr.push(str)
			break
		}

		if (openTagIdx0) curr.push(str.slice(0, openTagIdx0))

		str = str.slice(openTagIdx0 + 1)
		// ---✄--- openTagIdx === -1

		openTagIdx1 = str.indexOf('>')

		// closing prev tag
		if (str[0] === '/') {
			let parent = stack.pop()
			parent.push(curr)
			curr = parent
			str = str.slice(openTagIdx1 + 1)
			continue
		}


		// parse quotes, push end tag outside of quotes
		let quote, quoteIdx0, quoteIdx1 = -1, max = 10, quotes = [], tagStr
		while (max--) {
			tagStr = str.slice(0, openTagIdx1)
			let dQuoteIdx = tagStr.indexOf('"', quoteIdx1 + 1)
			let sQuoteIdx = tagStr.indexOf("'", quoteIdx1 + 1)
			quoteIdx0 = dQuoteIdx < 0 ? sQuoteIdx : dQuoteIdx

			// no anymore quotes before the closing tag
			if (quoteIdx0 < 0) break

			quote = str[quoteIdx0]
			quoteIdx1 = str.indexOf(quote, quoteIdx0 + 1)

			if (quoteIdx1 > openTagIdx1) {
				// push closing tag forward
				openTagIdx1 = str.indexOf('>', openTagIdx1 + 1)
			}

			// remove quoted value to avoid params parsing clash
			let len = quoteIdx1 - quoteIdx0 - 1
			quotes.push(str.slice(quoteIdx0 + 1, quoteIdx1))
			str = str.slice(0, quoteIdx0) + '""' + str.slice(quoteIdx1 + 1)
			quoteIdx1 -= len
			openTagIdx1 -= len
		}

		// tagname/args
		// FIXME: this can be slow
		if (tagStr.slice(-1) === '/') tagStr = tagStr.slice(0, -1)
		let params = tagStr.split(' ').filter(Boolean).map(part => {
			if (part.slice(-2) === '""') part = part.slice(0, -2) + quotes.shift()
			return part.split('=')
		})

		const node = [params[0] ? params[0][0] : '', params.slice(1)]

		// self-closing tag
		if (str[openTagIdx1 - 1] === '/') {
			curr.push(node)
		}
		// new tag
		else {
			stack.push(curr)
			curr = node
		}
		str = str.slice(openTagIdx1 + 1)
	}

	return curr
}
