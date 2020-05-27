// htm-compatible parser
const ELEM = 1, ATTR = 2, TEXT = 3, COMM = 8, FRAG = 11, COMP = 6, END = 0

const empty = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ')

export default function (statics) {
  const evaluate = ([root, tag, proplist, ...children]) => {
    tag = deref(tag)

    let props = null
    if (proplist) {
      props = {}
      for (let i = 0,k,v; i < proplist.length; i+=2) {
        k = proplist[i], v = proplist[i+1]
        if (k === null) Object.assign(props, arguments[v])
        else props[deref(k)] = Array.isArray(v) ? v.length === 1 ? deref(v[0]) : v.map(deref).join('') : deref(v)
      }
    }

    return this(tag, props, ...children.map(child => Array.isArray(child) ? evaluate(child) : deref(child)))
  },
  deref = a => typeof a === 'number' ? arguments[a] : a
  let result = build(statics)

  result = result.map(child => Array.isArray(child) ? evaluate(child) : deref(child))

  return !result.length ? undefined : result.length === 1 ? result[0] : result
}

const build = statics => {
  // program schema: [parent, tag, [k, v, k, v, ...], text?, [parent, tag, ...]?, ... ]
  let mode = TEXT, buf = '', quote = '', value, props, char, el, current = [], last

  const commit = i => {
    // >a${1}b${2}c< ;         TEXT, str | field
    if (mode === TEXT) {
      if (buf) current.push(buf)
      if (i) current.push(i)
    }
    // <el, <${el} ;        ELEM, str | field
    else if (mode === ELEM) {
      current.push(current = [current, el = i || buf, null]), mode = ATTR
    }
    else if (mode === ATTR && (buf || i)) {
      // a=${b}, a=a${b}, a=a${b}c
      if (value) {
        if (buf) value.push(buf)
        if (i) value.push(i)
      }
      else {
        if (!current[2]) props = current[2] = []

        // <x ...${{}};    null, field
        if (buf === '...') props.push(null, i)
        // <x ${'a'}, <x a, <x a= ;    field, null
        else props.push(i || buf, value = char === '=' ? [] : true)
      }
    }
    buf = ''
  }

  // walker / mode manager
	for (let i=0; i<statics.length; i++) {
    if (i) commit(i)

		for (let j=0; j<statics[i].length; j++) {
			char = statics[i][j]

			if (mode === TEXT) if (char === '<') commit(), mode = ELEM; else buf += char

      // Ignore everything until the last three characters are '-', '-' and '>'
			// else if (mode === COMM) if (buf === '--' && char === '>') mode = TEXT, buf = ''; else buf = char + buf[0]

      else if (quote) if (char === quote) quote = '', commit(); else buf += char
			else if (char === '"' || char === "'") quote = char
			else if (char === '>') {
        // <a b>
        if (mode) commit()

        // </xxx>, <a b/>, <input>
        if (!mode || empty.includes(el)) current = current[0]

        // <!-->, <? ... >
        mode=TEXT
      }

      // </...ignore until >
			else if (!mode) {}

      else if (char === '=') commit()

      // </a, <a b/>
      else if (char === '/' && (mode === ELEM || statics[i][j+1] === '>')) buf && commit(), mode = END

      // cleans up last attr value
			else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') (commit(), value=null)

			else buf += char

      // detect comment
			if (mode === ELEM && (buf === '!' || buf === '?')) mode = COMM
		}
	}

  commit()

  return current
}


// // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
// // closed by the corresponding tag or end of parent content
// let close = {
//   'li': '',
//   'dt': 'dd',
//   'dd': 'dt',
//   'p': 'address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table',
//   'rt': 'rp',
//   'rp': 'rt',
//   'optgroup': '',
//   'option': 'optgroup',
//   'caption': 'tbody thead tfoot tr colgroup',
//   'colgroup': 'thead tbody tfoot tr caption',
//   'thead': 'tbody tfoot caption',
//   'tbody': 'tfoot caption',
//   'tfoot': 'caption',
//   'tr': 'tbody tfoot',
//   'td': 'th tr',
//   'th': 'td tr tbody',
// }
// for (let tag in close) {
//   [...close[tag].split(' '), tag].map(closer => {
//     htm.close[tag] =
//     htm.close[tag.toUpperCase()] =
//     htm.close[tag + closer] =
//     htm.close[tag.toUpperCase() + closer] =
//     htm.close[tag + closer.toUpperCase()] =
//     htm.close[tag.toUpperCase() + closer.toUpperCase()] =
//     true
//   })
// }
