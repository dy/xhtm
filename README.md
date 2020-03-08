# XHTM − eXtended HTM Tagged Markup

<p>
<a href="https://travis-ci.org/dy/xhtm"><img src="https://travis-ci.org/dy/xhtm.svg?branch=master" alt="travis"></a>
<a href="https://bundlephobia.com/result?p=xhtm"><img alt="size" src="https://img.shields.io/bundlephobia/minzip/xhtm?label=size"></a>
<a href="https://npmjs.org/package/xhtm"><img alt="version" src="https://img.shields.io/npm/v/xhtm"></a>
<img src="https://img.shields.io/badge/stability-unstable-yellow" alt="stability"/>
</p>

_XHTM_ is alternative implementation of [HTM](https://ghub.io/htm) without HTM-specific limitations.
Low-level machinery is rejected in favor of readable high-level js and better HTML support.

Originally that was just state of art HTML parser implementation ( ~60LOC, best from 10 variants in R&D branches), but turned out it has ideal qualities for [spect/html](https://ghub.io/spect) - tiny size, no cache, single-time run, better syntax support, extensibility.

## Differences from HTM

* Self-closing tags support `` htm`<input><br>` `` → `[h('input'), h('br')]` (customizable via `htm.void`).
* HTML directives `<!doctype>`, `<?xml?>` etc. support [#91](https://github.com/developit/htm/issues/91).
* Interpolated props are exposed as arrays `` html`<a class="a ${b} c"/>` `` → `h('a', { class: ['a ', b, ' c'] })`.
* Calculated tag names [#109](https://github.com/developit/htm/issues/109).
* Ignoring null-like arguments (customizable) [#129](https://github.com/developit/htm/issues/129).
* No integrations exported, no babel compilers.

<!--
* Dynamic attribute names [#124](https://github.com/developit/htm/issues/124).
* Optionally closed tags support [#91](https://github.com/developit/htm/issues/91).
* Spaces are compatible with HTML (customizable) [#128](https://github.com/developit/htm/issues/128).
* Escaping quotes [#96](https://github.com/developit/htm/issues/96).
-->

## Installation & Usage


[![NPM](https://nodei.co/npm/xhtm.png?mini=true)](https://nodei.co/npm/xhtm/)

`xhtm` is by default compatible with `htm` and can be used as drop-in replacement.

```js
import htm from 'xhtm'
import { render, h } from 'preact'

html = htm.bind(h)

render(html`
  <h1>Hello World!</h1>
  <p>Some paragraph<br/></p>
  <p>Another paragraph</p>
`, document.getElementById('app'))
```

For `htm` manual, refer to [htm docs](https://ghub.io/htm).


<!--
## Comparison

|                             | htm       | xhtm            | domtagger | hyperx   | common-tags |
|---|:---:|:---:|:---:|:---:|:---:|
| Size                        | 672b      | 512b            |  1186b    | 1949b    | 1242b       |
| Performance: creation       | 88,111/s  | 30,000/s        |  7,604/s  | 58,961/s | 172,692/s   |
| Performance: usage          | 617,870/s | 30,000/s        |  16,577/s | 60,888/s | 22,344/s    |
| HTML Support                | -         | ~               |           |          |             |
| JSX Support                 | +         | +               |           |          |             |
| Output Format               | h         | h               |           |          |             |
| Static Compiler             | +         | -               |           |          |             |
-->

<p align="center">🕉️</p>
