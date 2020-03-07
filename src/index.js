const FIELD = '\ue000', QUOTES = '\ue001'

export default function htm (statics) {
  let h = this, prev = 0, current = [], field = 0, args, name, value, quotes = [], quote = 0

  const evaluate = (str, parts = [], raw, i = 0) => {
    str = str.replace(/\ue001/g, m => raw ? quotes[quote++] : quotes[quote++].slice(1, -1))
    if (!str) return str
    str.replace(/\ue000/g, (match, idx) => {
      if (idx) parts.push(str.slice(i, idx))
      i = idx + 1
      return parts.push(arguments[++field])
    })
    if (i < str.length) parts.push(str.slice(i))
    return parts.length > 1 ? parts.join('') : parts[0]
  }

  statics
    .join(FIELD)
    .replace(/('|")[^\1]*?\1/g, match => (quotes.push(match), QUOTES))
    .replace(/\s+/g, ' ')
    .replace(/<!--.*-->/g, '')

    // ...>text<... sequence
    .replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
      let close
      if (idx) {
        str.slice(prev, idx)
          // <abc/> → <abc />
          .replace(/(\S)\/$/, '$1 /')
          .split(' ').map((part, i) => {
            if (part[0] === '/') {
              close = true
            }
            else if (!i) {
              current = [current, evaluate(part), null]
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
        [current, ...args] = current
        current.push(h(...args))
      }
      prev = idx + match.length
      if (prev < str.length || !idx) evaluate(text, current, true)
    })

  return current.length > 1 ? current : current[0]
}
