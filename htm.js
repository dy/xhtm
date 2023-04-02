const FIELD = '\ue000', QUOTES = '\ue001'

export default function htm (statics) {
  let h = this, prev = 0, current = [null], field = 0, args, name, value, quotes = [], quote = 0, last, level = 0, pre = false

  const evaluate = (str, parts = [], raw) => {
    let i = 0
    str = (!raw && str === QUOTES ?
      quotes[quote++].slice(1,-1) :
      str.replace(/\ue001/g, m => quotes[quote++]))

    if (!str) return str
    str.replace(/\ue000/g, (match, idx) => {
      if (idx) parts.push(str.slice(i, idx))
      i = idx + 1
      return parts.push(arguments[++field])
    })
    if (i < str.length) parts.push(str.slice(i))
    return parts.length > 1 ? parts : parts[0]
  }

  // close level
  const up = () => {
    // console.log('-level', current);
    [current, last, ...args] = current
    current.push(h(last, ...args))
    if (pre === level--) pre = false // reset <pre>
  }

  let str = statics
    .join(FIELD)
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<!\[CDATA\[[^]*\]\]>/g, '')
    .replace(/('|")[^\1]*?\1/g, match => (quotes.push(match), QUOTES))

    // ...>text<... sequence
  str.replace(/(?:^|>)((?:[^<]|<[^\w\ue000\/?!>])*)(?:$|<)/g, (match, text, idx, str) => {
    let tag, close

    if (idx) {
      str.slice(prev, idx)
        // <abc/> → <abc />
        .replace(/(\S)\/$/, '$1 /')
        .split(/\s+/)
        .map((part, i) => {
          // </tag>, </> .../>
          if (part[0] === '/') {
            part = part.slice(1)
            // ignore duplicate empty closers </input>
            if (EMPTY[part]) return
            // ignore pairing self-closing tags
            close = tag || part || 1
            // skip </input>
          }
          // <tag
          else if (!i) {
            tag = evaluate(part)
            // <p>abc<p>def, <tr><td>x<tr>
            if (typeof tag === 'string') { tag = tag.toLowerCase(); while (CLOSE[current[1]+tag]) up() }
            current = [current, tag, null]
            level++
            if (!pre && PRE[tag]) pre = level
            // console.log('+level', tag)
            if (EMPTY[tag]) close = tag
          }
          // attr=...
          else if (part) {
            let props = current[2] || (current[2] = {})
            if (part.slice(0, 3) === '...') {
              Object.assign(props, arguments[++field])
            }
            else {
              [name, value] = part.split('=');
              Array.isArray(value = props[evaluate(name)] = value ? evaluate(value) : true) &&
              // if prop value is array - make sure it serializes as string without csv
              (value.toString = value.join.bind(value, ''))
            }
          }
        })
    }

    if (close) {
      if (!current[0]) err(`Wrong close tag \`${close}\``)
      up()
      // if last child is optionally closable - close it too
      while (last !== close && CLOSE[last]) up()
    }
    prev = idx + match.length

    // fix text indentation
    if (!pre) text = text.replace(/\s*\n\s*/g,'').replace(/\s+/g, ' ')

    if (text) evaluate((last = 0, text), current, true)
  })

  if (current[0] && CLOSE[current[1]]) up()

  if (level) err(`Unclosed \`${current[1]}\`.`)

  return current.length < 3 ? current[1] : (current.shift(), current)
}

const err = (msg) => { throw SyntaxError(msg) }

// self-closing elements
const EMPTY = htm.empty = {}

// optional closing elements
const CLOSE = htm.close = {}

// preformatted text elements
const PRE = htm.pre = {}
