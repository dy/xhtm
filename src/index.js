// algo
// 1. flatten input fields into a single string via pricate unicodes
// 2. normalize input string - shrink multilines/spaces
// 3. decompose string to [tag, props, [tag, props, ...children], 'a', 'b', ...children]
// 4. save that string to cache
// 5. evaluate string: replace all private unicodes with corresponding fields values

import { build, evaluate } from './build.js'
import { UNICODE_OFFSET } from './constants.js'

const CACHE = new Map

export default function (statics) {
  let tpl = CACHE.get(statics)

  if (!tpl) {
    // 1. flatten
    let str = statics[0]
    for (let i = 1; i < arguments.length; i++) {
      str += String.fromCodePoint(UNICODE_OFFSET + i) + statics[i]
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
  const res = evaluate(this, tpl, arguments);
  return res.length > 1 ? res : res[0];
};
