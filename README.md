
<h1 align="center">
  XHTM (eXtensible Hyperscript Tagged Markup)
</h1>

<!--
<p align="center">
  <a href="https://www.npmjs.org/package/xhtm"><img src="https://img.shields.io/npm/v/htm.svg?style=flat" alt="npm"></a>
  <a href="https://travis-ci.org/dy/xhtm"><img src="https://travis-ci.org/dy/xhtm.svg?branch=master" alt="npm"></a>
  <img src="https://img.shields.io/badge/stability-experimental-yellow"/>
</p>
<p align="center">
  <img src="https://i.imgur.com/0ph8dbS.png" width="572" alt="hyperscript tagged markup demo">
</p>

`xhtm` provides alternative implementation of `htm`, allowing extensions, like HTML/XML syntax, custom attribute/tag name interpolation, different spaces handling etc., while keeping htm performance and compactness.
Because _htm_ is intended to be strictly [JSX-compatible](https://github.com/developit/htm/issues/91#issuecomment-498741042).

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


## Installation & Usage


[![NPM](https://nodei.co/npm/xhtm.png?mini=true)](https://nodei.co/npm/xhtm/)

`xhtm` is by default compatible with `htm`, but supports HTML syntax, can be used as drop-in replacement.

```js
import htm from 'xhtm'
import { render, h } from 'preact'

const html = htm.bind(h)

render(html`
  <!doctype html>
  <h1>Hello World!</h1>
  <p>Some paragraph<br>
  <p>Another paragraph
`, document.getElementById('app'))
```

For bare-minimum `htm`-compatible version, `xhtm` provides `xhtm/htm` entry.

For `htm` manual, refer to [htm docs](https://ghub.io/htm).

## Comparison

|                             | htm       | xhtm/functional | xhtm/indexof  | domtagger | hyperx   | common-tags |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Size                        | 672b      | 651b            | 736b          |  1186b    | 1949b    | 1242b       |
| Performance: creation       | 88,111/s  | 30,000/s        | 32,000/s ^60k |  7,604/s  | 58,961/s | 172,692/s   |
| Performance: usage          | 617,870/s | 30,000/s        | 180k/s        |  16,577/s | 60,888/s | 22,344/s    |
| HTML Support                | -         |                 |               |           |          |             |
| JSX Support                 | +         |                 |               |           |          |             |
| Output Format               | h         |                 |               |           |          |             |
| Static Compiler             | +         |                 |               |           |          |             |

<p align="right">HK</p>

-->
