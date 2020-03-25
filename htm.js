const FIELD = '\ue000', QUOTES = '\ue001'

export default function htm (statics) {
  let h = this, prev = 0, current = [], field = 0, args, name, value, quotes = [], quote = 0, last
  current.root = true

  const evaluate = (str, parts = [], raw) => {
    let i = 0
    str = !raw && str === QUOTES ?
      quotes[quote++].slice(1,-1) :
      str.replace(/\ue001/g, m => quotes[quote++])

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
    [current, last, ...args] = current
    current.push(h(last, ...args))
  }

  statics
    .join(FIELD)
    .replace(/('|")[^\1]*?\1/g, match => (quotes.push(match), QUOTES))
    .replace(/\s+/g, ' ')
    .replace(/<!--.*-->/g, '')
    .replace(/<!\[CDATA\[.*\]\]>/g, '')
    // .replace(/^\s*\n\s*|\s*\n\s*$/g,'')

    // ...>text<... sequence
    .replace(/(?:^|>)\s*([^<]*)\s*(?:$|<)/g, (match, text, idx, str) => {
      let close, tag
      if (idx) {
        str.slice(prev, idx)
          // <abc/> → <abc />
          .replace(/(\S)\/$/, '$1 /')
          .split(' ').map((part, i) => {
            if (part[0] === '/') {
              close = part.slice(1) || 1
            }
            else if (!i) {
              tag = evaluate(part)
              // <p>abc<p>def, <tr><td>x<tr>
              while (htm.close[current[1]+tag]) up()
              current = [current, tag, null]
              if (htm.empty[tag]) close = 2
            }
            else if (part) {
              let props = current[2] || (current[2] = {})
              if (part.slice(0, 3) === '...') {
                Object.assign(props, arguments[++field])
              }
              else {
                [name, value] = part.split('=')
                props[evaluate(name)] = value ? evaluate(value) : true
              }
            }
          })
      }
      if (close) {
        up()
        // if last child is closable - close it too
        while (last !== close && htm.close[last]) up()
      }
      prev = idx + match.length
      if (text) evaluate((last = 0, text), current, true)
    })

  if (!current.root) up()

  return current.length > 1 ? current : current[0]
}

// self-closing elements
htm.empty = {}

// optional closing elements
htm.close = {}
