// - direct arrays storing in cache
// - indexof 2 vs regex

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

		// closing prev tag
		if (str[openTagIdx0 + 1] === '/') {
			let parent = stack.pop()
			parent.push(curr)
			curr = parent
			str = str.slice(str.indexOf('>', openTagIdx0 + 1) + 1)
			continue
		}

		openTagIdx1 = str.indexOf('>', openTagIdx0)

		// parse quotes, push end tag outside of quotes
		let quote, quoteIdx0, quoteIdx1
		let max = 10
		while (max--) {
			let origStr = str
			str = origStr.slice(0, openTagIdx1)
			let dQuoteIdx = str.indexOf('"', (quoteIdx1 || openTagIdx0) + 1)
			let sQuoteIdx = str.indexOf("'", (quoteIdx1 || openTagIdx0) + 1)
			quoteIdx0 = dQuoteIdx < 0 ? sQuoteIdx : dQuoteIdx
			str = origStr

			// no anymore quotes before the closing tag
			if (quoteIdx0 < 0) break

			quote = str[quoteIdx0]
			quoteIdx1 = str.indexOf(quote, quoteIdx0 + 1)

			if (quoteIdx1 > openTagIdx1) {
				// push closing tag forward
				openTagIdx1 = str.indexOf('>', openTagIdx1 + 1)
			}
		}

		let openTagStr = str.slice(openTagIdx0 + 1, openTagIdx1)
		let idx, props = []

		// TODO: parse quotes/props properly here
		// while ((idx = openTagStr.indexOf(' ')) >= 0) {
		// 	let name = openTagStr.slice(0, idx)
		// 	openTagStr = openTagStr.slice(idx + 1)
		// 	if (!tagName) {
		// 		tagName = name
		// 	}
		// 	else {
		// 		props.push(name)
		// 	}
		// }

		// self-closing tag
		if (str[openTagIdx1 - 1] === '/') {
			curr.push(['someTag', props])
		}
		else {
			stack.push(curr)
			curr = ['someTag', props]
		}
		str = str.slice(openTagIdx1 + 1)
	}

	return curr
}
