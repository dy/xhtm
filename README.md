# XHTM − eXtended HTM Tagged Markup

<p>
<a href="https://github.com/dy/xhtm/actions/workflows/tests.js.yml"><img src="https://github.com/dy/xhtm/actions/workflows/tests.js.yml/badge.svg"/></a>
<a href="https://bundlejs.com/?q=xhtm"><img alt="size" src="https://deno.bundlejs.com/badge?q=xhtm"></a>
<a href="https://npmjs.org/package/xhtm"><img alt="version" src="https://img.shields.io/npm/v/xhtm"></a>
<img src="https://img.shields.io/badge/stability-unstable-yellow" alt="stability"/>
</p>

_XHTM_ is alternative implementation of [HTM](https://ghub.io/htm) without HTM-specific limitations.
Low-level machinery is rejected in favor of readability and better HTML support.

## Differences from HTM

* Self-closing tags support `` htm`<input><br>` `` → `[h('input'), h('br')]`.
* HTML directives `<!doctype>`, `<?xml?>` etc. support [#91](https://github.com/developit/htm/issues/91).
* Optionally closed tags support `<p>foo<p>bar` → `<p>foo</p><p>bar</p>` [#91](https://github.com/developit/htm/issues/91).
* Multi-part props join to string, falsy fields turn empty `` html`<a class="a ${0} ${false}"/>` `` → `h('a', { class: 'a 0 ' })`; single-field values stay raw `` html`<a items=${[1]}/>` `` → `h('a', { items: [1] })`.
* Calculated tag names [#109](https://github.com/developit/htm/issues/109) support.
* Ignoring null-like arguments (customizable) [#129](https://github.com/developit/htm/issues/129).
* Spaces formatting closer to HTML; elements with preserved formatting ([#23](https://github.com/dy/xhtm/issues/23)).
* No integrations exported, no babel compilers.

<!--
* Dynamic attribute names [#124](https://github.com/developit/htm/issues/124).
* Spaces are compatible with HTML (customizable) [#128](https://github.com/developit/htm/issues/128).
* Escaping quotes [#96](https://github.com/developit/htm/issues/96).
-->

## Installation & Usage

```sh
npm i xhtm
```

`xhtm` is by default fully compatible with `htm` and can be used as drop-in replacement.

```js
import htm from 'xhtm'
import { render, h } from 'preact'

html = htm.bind(h)

render(html`
  <h1>Hello World!</h1>
  <p>Some paragraph<br>
  <p>Another paragraph
`, document.getElementById('app'))
```

For `htm` manual, refer to [htm docs](https://ghub.io/htm).

## Justification

XHTM caches parsed templates: repeated renders are faster than HTM, first-time parse is slower.
HTM is smaller; XHTM supports real HTML (self-closing, optional-close tags, directives).<br/>
Originally that was just minimal HTML parser implementation (~60LOC), best from 10 variants in R&D branches.<br/>

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
