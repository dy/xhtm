import build from './build.js';

export default build

// import { build } from './build.js'
// import { FIELD_PLACEHOLDER } from './constants.js'

// const CACHE = new Map

// export default function (statics) {
//   let tpl = CACHE.get(statics)

//   if (!tpl) {
//     // 1. flatten
//     let str = statics.join(FIELD_PLACEHOLDER)

//     // 2. normalize
//     // this is only ~20% slower than analogous slice/indexof implementation
//     str = str.replace(/\s+/g, ' ')

//     // 3. build
//     tpl = build(str)

//     // 4. cache
//     CACHE.set(statics, tpl)
//   }

//   // 5. evaluate
//   const res = evaluate(this, tpl, arguments);
//   return res.length > 1 ? res : res[0];
// };


// // 5. evaluate
// function evaluate(h, tpl, fields, fieldIdx = 1) {
//   let out = []
//   if (!tpl.length) return out

//   for (let i = 1; i < tpl.length; i++) {
//     if (typeof tpl[i] === 'string') {
//       out.push(...evalStr(tpl[i]))
//     }
//     else {
//       let [tag, params, ...children] = tpl[i]
//       let tagName = evalStr(tag).join('')
//       let callProps = null
//       params.map(part => {
//         if (!callProps) callProps = {}
//         let propName = evalStr(part[0]).join('')
//         callProps[propName] = part[1] ? evalStr(part[1]).join('') : true
//       })

//       out.push(h(tagName, callProps, ...evaluate(h, children, fields)))
//     }
//   }

//   function evalStr(str) {
//     let out = []
//     str.split(FIELD_PLACEHOLDER).map((chunk, i, total) => {
//       out.push(chunk, total.length > 1 ? fields[fieldIdx++] : '')
//     })
//     out.pop()
//     return out
//   }

//   return out
// }
