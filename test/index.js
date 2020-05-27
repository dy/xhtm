import htm from '../htm.js'
// import htm from 'htm/src/index.mjs'
import './htm.js'
import './html.js'
import './perf.js'



export const h = (tag, props, ...children) => {
	if (Array.isArray(tag)) tag = tag.join('')
	for (let p in props) Array.isArray(props[p]) && (props[p] = props[p].join(''))
	return { tag, props, children }
}
export const html = htm.bind(h)
