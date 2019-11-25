// html-syntax enabled parser
const selfClosing = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  '!',
  '?'
]
const optionalEnd = {
  'li': 'li',
  'dt': ['dt'],
  'dd',
  'p',
  ''
}
