// htm-compatible parser
const ELEM = 1, ATTR = 2, TEXT = 3, COMM = 8, FRAG = 11, COMP = 6, END = 0

const empty = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ')

// https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
// closed by the corresponding tag, self or end of parent content
// const close = {
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
//   'th': 'td tr tbody tfoot',
//   'tr': 'tbody tfoot',
//   'td': 'th tr'
// }

export default function (statics) {
  const evaluate = items => items.map(item => {
    if (!Array.isArray(item)) return deref(item)

    let [root, tag, proplist, ...children] = item
    tag = deref(tag)

    let props = null
    if (proplist) {
      props = {}
      for (let i = 0,k,v; i < proplist.length; i+=2) {
        k = proplist[i], v = proplist[i+1]
        if (k === null) Object.assign(props, arguments[v])
        else props[deref(k)] = Array.isArray(v) ?  v.length === 1 ? deref(v[0]) : v.map(deref).join('') : deref(v)
      }
    }
    return this(tag, props, ...evaluate(children))
  }),
  deref = a => typeof a === 'number' ? arguments[a] : a,
  result = evaluate(build(statics))

  return result.length < 2 ? result[0] : result
}

const build = statics => {
  // program schema: [parent, tag, [k, v, k, v, ...], text?, [parent, tag, ...]?, ... ]
  let mode = TEXT, buf = '', quote = '', value, props, char, el, current = []

  const commit = i => {
    // >a${1}b${2}c< ;         TEXT, str | field
    if (mode === TEXT) {
      if (buf) current.push(buf)
      if (i) current.push(i)
    }
    // <el, <${el} ;        ELEM, str | field
    else if (mode === ELEM) {
      // FIXME: <a${'b'}c
      if (el) ;// current[1] += i || buf.toLocaleLowerCase()
      else current.push(current = [current, el = i || buf.toLowerCase(), null])
    }
    else if (mode === ATTR) {
      if (!current[2] && (buf || i)) props = current[2] = []
      // a=${b}, a=a${b}, a=a${b}c
      if (value) {
        if (value === true && (buf || i)) props.pop(), props.push(value = [])
        if (buf) value.push(buf)
        if (i) value.push(i)
      }
      else if (char === '=') props.push(buf || i, value = [])
      // <x ...${{}};    null, field
      else if (buf === '...') props.push(null, i)
      // <x ${'a'}, <x a, <x a= ;    field, null
      else if (buf || i) props.push(i || buf, value = true)
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
        mode=TEXT, el=null
      }

      // </...ignore until >, <! ... >, <? ... >
			else if (!mode || mode === COMM) {}

      else if (char === '=') commit()

      // </a, <a b/>
      else if (char === '/' && (mode === ELEM || statics[i][j+1] === '>')) buf && commit(), mode = END

      // cleans up last attr value
			else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') (commit(), mode = ATTR, value=null)

			else buf += char

      // detect comment
			if (mode === ELEM && (buf === '!' || buf === '?')) mode = COMM
		}
	}

  commit()

  return current
}
