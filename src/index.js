// algo
// 1. flatten input fields into a single string via pricate unicodes
// 2. normalize input string - shrink multilines/spaces
// 3. decompose string to [tag, props, [tag, props, ...children], 'a', 'b', ...children]
// 4. save that string to cache
// 5. evaluate string: replace all private unicodes with corresponding fields values

import { build } from './build.js'
import { UNICODE_OFFSET } from './constants.js'

const code = String.fromCodePoint
const CACHE = new Map

export default function (statics) {
  let tpl = CACHE.get(statics)

  if (!tpl) {
    // 1. flatten
    let str = statics[0]
    for (let i = 1; i < arguments.length; i++) {
      str += code(UNICODE_OFFSET + i) + statics[i]
    }

    // 2. normalize
    // this algo is only ~20% slower than analogous slice/indexof implementation, but more robust
    str = str.replace(/\s+/g, ' ')

    // 3. build
    tpl = build(str)

    // 4. cache
    CACHE.set(statics, tpl)
  }

  // 5. evaluate
  const res = evaluate(this, tpl, arguments, []);
  return res.length > 1 ? res : res[0];
};


// 5. evaluate
function evaluate(h, arr, fields, result) {
  if (!arr.length) return result

  let fieldIdx = 1, fieldChar = code(UNICODE_OFFSET + fieldIdx)

  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'string') {
      evalStr(arr[i], result)
    }
    else {
      let [tag, props, ...children] = arr[i]
      let callProps = {}
      for (let i = 0; i < props.length; i+= 2) {
        let propName = evalStr(props[i], []).join('')
        callProps[propName] = props[i + 1] ? evalStr(props[i + 1], []).join('') : null
      }
      result.push(h(tag, callProps, ...evaluate(h, children, fields, [])))
    }
  }

  function evalStr(str, out) {
    let idx
    while ((idx = str.indexOf(fieldChar)) >= 0) {
      out.push(str.slice(0, idx), fields[fieldIdx])
      str = str.slice(idx + 1)
      fieldIdx++
      fieldChar = code(UNICODE_OFFSET + fieldIdx)
    }
    out.push(str)
    return out
  }

  return result
}
