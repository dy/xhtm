const find = (str, char, from = 0, to) => {
	let idx = from ? str.slice(from, to).indexOf(char) : str.indexOf(char, to)
	return idx < 0 ? idx : idx + from
}

export function build (str) {
	let arr = [], stack = []

	while(str) {
		let quoteIdx = [0, 1], quote, openTagIdx = [], closeTagIdx = []
		openTagIdx[0] = find(str, '<')
		if (openTagIdx[0] < 0) {
			arr.push(str)
			return null
		}

		if (openTagIdx[0]) arr.push(str.slice(0, openTagIdx[0]))

		// closing prev tag
		if (str[openTagIdx[0] + 1] === '/') {
			return openTagIdx[0]
		}

		openTagIdx[1] = find(str, '>', openTagIdx[0])

		// parse quotes, push end tag outside of quotes
		let end1 = 10
		while (true) {
			if (!end1--) throw 'Inner overflow'
			let dQuoteIdx = find(str, '"', quoteIdx[1], openTagIdx[1])
			let sQuoteIdx = find(str, "'", quoteIdx[1], openTagIdx[1])

			// no anymore quotes before the closing tag
			quoteIdx[0] = dQuoteIdx < 0 ? sQuoteIdx : (sQuoteIdx < 0 ? dQuoteIdx : Math.min(sQuoteIdx, dQuoteIdx))

			if (quoteIdx[0] < 0) break

			quote = str[quoteIdx[0]]
			quoteIdx[1] = find(str, quote, quoteIdx[0] + 1)

			if (quoteIdx[1] > openTagIdx[1]) {
				// push closing tag forward
				openTagIdx[1] = find(str, '>', openTagIdx[1])
			}
		}

		let openTagStr = str.slice(openTagIdx[0] + 1, openTagIdx[1])
		let idx, props = []

		// self-closing tag
		if (str[openTagIdx[1] - 1] === '/') {
			arr.push(['someTag', props])
			return parseNodes(str.slice(openTagIdx[1] + 1), arr)
		}

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

		stack.push(arr)
		arr = []

		closeTagIdx[0] = parseNodes(str.slice(openTagIdx[1] + 1), children) + openTagIdx[1] + 1
		closeTagIdx[1] = find(str, '>', closeTagIdx[0])

		arr.push(['', props, ...children])

		str = str.slice(closeTagIdx[1] + 1)
		if (!str) return -1
	}

	return arr
}
