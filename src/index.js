import { build, evaluate } from './build.js';

const getCache = (statics) => {
  let tpl = CACHE.get(statics);
  if (!tpl) {
    CACHE.set(statics, tpl = build(statics));
  }
  return tpl;
}

const CACHE = new Map

export default function (statics) {
  const res = evaluate(this, getCache(statics), arguments, []);
  return res.length > 1 ? res : res[0];
};
