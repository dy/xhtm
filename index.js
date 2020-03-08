import htm from './htm'

'area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml'.split(' ').map(v => htm.void[v] = htm.void[v.toUpperCase()] = true)

htm.optional = {}
// const optionalEnd = {
//   'li': 'li',
//   'dt': ['dt'],
//   'dd',
//   'p',
//   ''
// }

export default htm
