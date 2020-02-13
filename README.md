# XHTM − eXtensible Hyperscript Tagged Markup

<p>
<a href="https://travis-ci.org/dy/xhtm"><img src="https://travis-ci.org/dy/xhtm.svg?branch=master" alt="travis"></a>
<a href="https://bundlephobia.com/result?p=xhtm"><img alt="size" src="https://img.shields.io/bundlephobia/minzip/xhtm?label=size"></a>
<a href="https://npmjs.org/package/xhtm"><img alt="version" src="https://img.shields.io/npm/v/xhtm"></a>
<img src="https://img.shields.io/badge/stability-stable-green" alt="stability"/>
</p>

`xhtm` is alternative implementation of `htm` without `htm`-specific limitations.

Low-level machinery is rejected in favor of readable high-level js.
The code is 5 times shorter (just 60 LOC), minified it is ~20% smaller, but parsing is ~2.5 times slower. It better handles edge cases / errors and provides extensibility.

Originally that was just state of art implementation (best from 10 variants in R&D branches), but turned out it has ideal qualities for [spect/html](https://ghub.io/spect) - minimally possible size, no need for cache, single-time run, more complete syntax support, extensibility.

<!--
## Improvements over HTM

* HTML syntax support.
* Optionally closed tags support [#91](https://github.com/developit/htm/issues/91).
* HTML directives support [#91](https://github.com/developit/htm/issues/91).
* Dynamic attribute names [#124](https://github.com/developit/htm/issues/124).
* Calculated tag names [#109](https://github.com/developit/htm/issues/109).
* Ignoring null-like arguments (customizable) [#129](https://github.com/developit/htm/issues/129).
* Spaces are compatible with HTML (customizable) [#128](https://github.com/developit/htm/issues/128).
* Escaping quotes [#96](https://github.com/developit/htm/issues/96).
* Customizable template parts.
* Simple validation.
* Smaller size.
* ~~Faster.~~

## Differences from HTM

* No integrations exported.
* No babel compilers available (temporarily).
* Simplified tests runner.
* Simplified significant part of source code.
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

<p align="right">HK</p>
