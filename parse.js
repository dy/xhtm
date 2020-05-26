// htm-compatible parser
// skips HTM static caching, returns levels
export const TEXT = 3, ELEM = 1, ATTR = 2, COMM = 8, FRAG = 11, COMP = 6

export default function (statics) {
  // program schema: [parent, tag, [k, v, k, v, ...], text?, [parent, tag, ...]?, ... ]
  let mode = TEXT, buf = '', quote = '', props, value, char, el, current = []

  const commit = i => {
    // >a${1}b${2}c< ;         TEXT, str | field
    if (mode === TEXT) buf || i && current.push(i || buf)
    // <el, <${el} ;        ELEM, str | field
    else if (mode === ELEM) current.push(current = [current, el = i || buf]), mode = ATTR
    // a=${b}, a=a${b}, a=a${b}c
    else if (value) {
      if (buf) value.push(buf)
      if (i) value.push(i)
    }
    else if (buf || i && mode === ATTR) {
      if (!props) current.push(props = [])

      // <x ...${{}};    null, field
      if (buf === '...') props.push(null, i)
      // <x ${'a'}, <x a, <x a= ;    field, null
      else props.push(i || buf, value = [])
    }
    buf = ''
  }

  // walker / mode manager
	for (let i=0; i<statics.length; ) {
		for (let j=0; j < statics[i].length; j++) {
			char = statics[i][j];

			if (mode === TEXT) { if (char === '<') commit(), mode = ELEM }

      // Ignore everything until the last three characters are '-', '-' and '>'
			else if (mode === COMM) if (buf === '--' && char === '>') mode = TEXT, buf = ''; else buf = char + buf[0]

      else if (quote) if (char === quote) quote = '', commit(); else buf += char
			else if (char === '"' || char === "'") quote = char
			else if (char === '>') commit(), value=null, mode = TEXT

      // </...ignore until >
			else if (!mode) {}

      else if (char === '=' && !value) commit()

      // </a,   .../>
      else if (char === '/') {
        if (mode === ELEM && !buf) mode = 0, current=current[0]
        else if (statics[i][j+1] === '>') commit(), current=current[0]
      }
			else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') (commit(), value=null)
			else buf += char

      // detect comment
			if (mode === ELEM && buf === '!--') mode = COMM
		}

    // commit field
    if (++i < statics.length) commit(i)
	}

  return current
}
