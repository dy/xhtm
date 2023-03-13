import htm from './htm.js'

'area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml'.split(' ').map(v => htm.empty[v] = true)

// https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
// closed by the corresponding tag or end of parent content
let close = {
  'li': '',
  'dt': 'dd',
  'dd': 'dt',
  'p': 'address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table',
  'rt': 'rp',
  'rp': 'rt',
  'optgroup': '',
  'option': 'optgroup',
  'caption': 'tbody thead tfoot tr colgroup',
  'colgroup': 'thead tbody tfoot tr caption',
  'thead': 'tbody tfoot caption',
  'tbody': 'tfoot caption',
  'tfoot': 'caption',
  'tr': 'tbody tfoot',
  'td': 'th tr',
  'th': 'td tr tbody',
}
for (let tag in close) {
  for (let closer of [...close[tag].split(' '), tag])
    htm.close[tag] = htm.close[tag + closer] = true
}

'pre textarea'.split(' ').map(v => htm.pre[v] = true)

export default htm
