import build from './build.js';

export default build

// import { MINI } from './constants.js';

// const evaluate = (h, tpl, fields) => {

// }

// const getCacheMap = (statics) => {
//   let tpl = CACHE.get(statics);
//   if (!tpl) {
//     CACHE.set(statics, tpl = build(statics));
//   }
//   return tpl;
// };

// const getCacheKeyed = (statics) => {
//   let key = '';
//   for (let i = 0; i < statics.length; i++) {
//     key += statics[i].length + '-' + statics[i];
//   }
//   return CACHE[key] || (CACHE[key] = build(statics));
// };

// const USE_MAP = !MINI && typeof Map === 'function';
// const CACHE = USE_MAP ? new Map() : {};
// const getCache = USE_MAP ? getCacheMap : getCacheKeyed;

// const cached = function (statics) {
//   const res = evaluate(this, getCache(statics), arguments, []);
//   return res.length > 1 ? res : res[0];
// };

// export default MINI ? build : cached;
