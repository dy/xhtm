
<h1 align="center">
  XHTM (eXtended Hyperscript Tagged Markup)
</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/xhtm"><img src="https://img.shields.io/npm/v/htm.svg?style=flat" alt="npm"></a>
  <a href="https://travis-ci.org/dy/xhtm"><img src="https://travis-ci.org/dy/xhtm.svg?branch=master" alt="npm"></a>
  <img src="https://img.shields.io/badge/stability-experimental-yellow"/>
</p>
<p align="center">
  <img src="https://i.imgur.com/0ph8dbS.png" width="572" alt="hyperscript tagged markup demo">
</p>

`xhtm` provides alternative functional implementation of `htm`, with HTML syntax support and additional features.
Because _htm_ is intended to be [JSX-compatible](https://github.com/developit/htm/issues/91#issuecomment-498741042), not HTML-compatible.

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

<!-- * Parent reference for non-JSX template engines.-->

## Differences from HTM

* No integrations exported.
* No babel compilers available (temporarily).
* Simplified tests runner.
* Simplified significant part of source code.


## Installation & Usage

`xhtm` is compatible with `htm` and can be used as drop-in replacement.

[![NPM](https://nodei.co/npm/xhtm.png?mini=true)](https://nodei.co/npm/xhtm/)

```js
import htm from 'xhtm'
import { render, h } from 'preact'

const html = htm.bind(h)

render(html`
  <h1>Hello World!</h1>
`, document.getElementById('app'))
```

For the rest, refer to [htm docs](https://ghub.io/htm).

## Comparison

|                   | xhtm | htm | domtagger | nanohtml | hyperx | lit-html | common-tags |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Size              |      |     |           |          |        |          |             |
| Performance       |      |     |           |          |        |          |             |
| HTML Support      |      |     |           |          |        |          |             |
| JSX Support       |      |     |           |          |        |          |             |
| Output Format     |      |     |           |          |        |          |             |
| Static Compiler   |      |     |           |          |        |          |             |

<p align="right">HK</p>
