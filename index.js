import htm from './htm'

'area base br col command embed hr img input keygen link meta menuitem param source track wbr ! ?'.split(' ').map(v => htm.void[v] = true)

htm.optional = {}
// const optionalEnd = {
//   'li': 'li',
//   'dt': ['dt'],
//   'dd',
//   'p',
//   ''
// }

export default htm
