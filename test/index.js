import parse from '../parse.js'
// import htm from '../htm.js'
// import htm from 'htm/src/index.mjs'

import './htm.js'
import './html.js'
// import './perf.js'



export const h = (tag, props, ...children) => {
	if (Array.isArray(tag)) tag = tag.join('')
	for (let p in props) Array.isArray(props[p]) && (props[p] = props[p].join(''))
	return { tag, props, children }
}
export const html = (...args) => {
  let root = parse(...args)
	console.log('result program', root)

  const handle = (root, tag, proplist, ...children) => {
		if (typeof tag === 'number') tag = args[tag]

    let props = null
    if (proplist) {
      props = {}
      for (let i = 0,k,v; i < proplist.length; i+=2) {
        k = proplist[i], v = proplist[i+1]
				if (typeof k === 'number') k = args[k]
        if (k === null) Object.assign(props, args[v])
        else props[k] = !v.length ? true :
					v.length > 1 ? v.map(i => typeof i === 'number' ? args[i] : i).join('') :
					typeof v[0] === 'number' ? args[v[0]] : v[0]
      }
    }

    return h(tag, props, ...children.map(child => Array.isArray(child) ? handle(...child) : child))
  }

  return root.length === 1 ? handle(...root[0]) : root.map(item => Array.isArray(item) ? handle(...item) : item)
}
