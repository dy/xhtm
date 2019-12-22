
<h1 align="center">
  XHTM (eXtensible Hyperscript Tagged Markup)
</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/xhtm"><img src="https://img.shields.io/npm/v/xhtm.svg?style=flat" alt="npm"></a>
  <a href="https://travis-ci.org/dy/xhtm"><img src="https://travis-ci.org/dy/xhtm.svg?branch=master" alt="npm"></a>
  <img src="https://img.shields.io/badge/stability-experimental-yellow"/>
</p>

`xhtm` is alternative implementation of `htm`, allowing extensions, like HTML/XML syntax, custom attribute/tag name interpolation, different spaces handling etc., while striving to keep performance and compactness.
Because _htm_ is intended to be strictly [JSX-compatible](https://github.com/developit/htm/issues/91#issuecomment-498741042).

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
* Faster.

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

<!-- For bare-minimum `htm`-compatible version, `xhtm` provides `xhtm/htm` entry. -->

For `htm` manual, refer to [htm docs](https://ghub.io/htm).

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

<p align="right">HK</p>
