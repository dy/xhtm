// htm-compatible parser
// skips HTM static caching, returns levels
const TEXT = 3, ELEM = 1, ATTR = 2, COMM = 8, FRAG = 11, COMP = 6

export default function (statics) {
  const evaluate = ([root, tag, proplist, ...children]) => {
    if (typeof tag === 'number') tag = arguments[tag]

    let props = null
    if (proplist) {
      props = {}
      for (let i = 0,k,v; i < proplist.length; i+=2) {
        k = proplist[i], v = proplist[i+1]
        if (typeof k === 'number') k = arguments[k]
        else if (k === null) Object.assign(props, arguments[v])
        else props[k] = !v.length ? '' :
          v.length > 1 ? v.map(i => typeof i === 'number' ? arguments[i] : i).join('') :
          typeof v[0] === 'number' ? arguments[v[0]] : v[0]
      }
    }

    return this(tag, props, ...children.map(child => Array.isArray(child) ? evaluate(child) : typeof child === 'number' ? arguments[child] : child))
  }

  let result = build(statics).map(item => Array.isArray(item) ? evaluate(item) : item)

  return !result.length ? undefined : result.length === 1 ? result[0] : result
}

const build = statics => {
  // program schema: [parent, tag, [k, v, k, v, ...], text?, [parent, tag, ...]?, ... ]
  let mode = TEXT, buf = '', quote = '', value, props, char, el, current = []

  const commit = i => {
    // >a${1}b${2}c< ;         TEXT, str | field
    if (mode === TEXT) { if (buf) current.push(buf); if (i) current.push(i) }
    // <el, <${el} ;        ELEM, str | field
    else if (mode === ELEM) current.push(current = [current, el = i || buf, null]), mode = ATTR
    else if (mode === ATTR) {
      // a=${b}, a=a${b}, a=a${b}c
      if (value) {
        if (buf) value.push(buf)
        if (i) value.push(i)
      }
      else if (buf || i) {
        if (!current[2]) props = current[2] = []

        // <x ...${{}};    null, field
        if (buf === '...') props.push(null, i)
        // <x ${'a'}, <x a, <x a= ;    field, null
        else props.push(i || buf, value = [])
      }
    }
    buf = ''
  }

  // walker / mode manager
	for (let i=0; i<statics.length; ) {
		for (let j=0; j<statics[i].length; j++) {
			char = statics[i][j]

			if (mode === TEXT) if (char === '<') commit(), mode = ELEM; else buf += char

      // Ignore everything until the last three characters are '-', '-' and '>'
			else if (mode === COMM) if (buf === '--' && char === '>') mode = TEXT, buf = ''; else buf = char + buf[0]

      else if (quote) if (char === quote) quote = '', commit(); else buf += char
			else if (char === '"' || char === "'") quote = char
			else if (char === '>') commit(), value=null, mode=TEXT

      // </...ignore until >
			else if (!mode) {}

      else if (char === '=' && !value) commit()

      // </a,   .../>
      else if (char === '/') {
        if (mode === ELEM && !buf) mode = 0, current=current[0]
        else if (statics[i][j+1] === '>') commit(), current=current[0]
        // a=va/lue
        else buf += char
      }
			else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') (commit(), value=null)
			else buf += char

      // detect comment
			if (mode === ELEM && buf === '!--') mode = COMM
		}

    // commit field
    if (++i < statics.length) commit(i)
	}

  commit()

  return current
}
