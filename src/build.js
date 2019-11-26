import { UNICODE_OFFSET } from './constants'

export function build (str) {
	const find = (char, from = 0, to) => {
		let idx = from ? str.slice(from, to).indexOf(char) : str.indexOf(char, to)
		return idx < 0 ? idx : idx + from
	}

	const arr = []
	let quoteIdx = [0, 1], quote, tagIdx = []
	while (str.length) {
		tagIdx[0] = find('<')
		if (tagIdx[0] < 0) {
			arr.push(str)
			break
		}
		if (tagIdx[0]) arr.push(str.slice(0, tagIdx[0]))

		tagIdx[1] = find('>', tagIdx[0])

		// parse quotes, push end tag outside of quotes
		while (true) {
			let dQuoteIdx = find('"', quoteIdx[1], tagIdx[1])
			let sQuoteIdx = find("'", quoteIdx[1], tagIdx[1])
			// no anymore quotes before the closing tag
			quoteIdx[0] = dQuoteIdx < 0 ? sQuoteIdx : (sQuoteIdx < 0 ? dQuoteIdx : Math.min(sQuoteIdx, dQuoteIdx))
			if (quoteIdx[0] < 0) break

			quote = str[quoteIdx[0]]
			quoteIdx[1] = find(quote, quoteIdx[0])

			if (quoteIdx[1] > tagIdx[1]) {
				// push closing tag forward
				tagIdx[1] = find('>', tagIdx[1])
			}
		}

		// find internal clusters
		let tagStr = str.slice(tagIdx[0] + 1, tagIdx[1])
		let idx, props = [], tagName
		// TODO: parse quotes/props properly here
		// while ((idx = tagStr.indexOf(' ')) >= 0) {
		// 	let name = tagStr.slice(0, idx)
		// 	tagStr = tagStr.slice(idx + 1)
		// 	if (!tagName) {
		// 		tagName = name
		// 	}
		// 	else {
		// 		props.push(name)
		// 	}
		// }

		// find closing tag - now ignoring quotes, since that's text
		let nextTagIdx = find('<', tagIdx[1])

		let children = str.slice(tagIdx[1], nextTagIdx)

		str = str.slice(tagStr.length)
	}

	return arr
}
