import t from 'tst'
import { html } from './index.js'


t('base case', t => {
	t.is(html` foo <a b >c${'d'}<e f=g/>h </a>`, [
		' foo ', { tag: 'a', props: { b: true }, children: ['c', 'd', { tag: 'e', props: { f: 'g' }, children: [] }, 'h '] }
	])
	t.end()
})

t('plain text', t => {
	t.is(html`a`, `a`)
	t.is(html`a${'b'}c`, ['a', 'b', 'c'])
	t.is(html`a${1}b${2}c`, ['a', 1, 'b', 2, 'c'])
	t.is(html`foo${''}bar${''}`, ['foo', '', 'bar', ''])
	t.is(html`${'foo'}${'bar'}`, ['foo', '', 'bar'])
	t.is(html`${''}${''}`, ['', '', ''])
	t.end()
})
t('tag cases', t => {
	// special case: both self-closing empty tag and ending tag
	// t.is(html`</>`, { tag: '', props: null, children: []})

	t.is(html`< />`, { tag: '', props: null, children: [] })
	t.is(html`<></>`, { tag: '', props: null, children: [] })
	t.is(html`<a></>`, { tag: 'a', props: null, children: [] })
	t.is(html`<a></a>`, { tag: 'a', props: null, children: [] })
	t.is(html`<abc/>`, { tag: 'abc', props: null, children: [] })
	t.is(html`<abc />`, { tag: 'abc', props: null, children: [] })
	t.is(html`<abc  />`, { tag: 'abc', props: null, children: [] })
	t.is(html`<abc></>`, { tag: 'abc', props: null, children: [] })
	t.is(html`<abc></abc>`, { tag: 'abc', props: null, children: [] })
	t.is(html`<${'abc'} />`, { tag: 'abc', props: null, children: [] })
	// // // t.is(html`<a${'bc'} />`, { tag: 'abc', props: null, children: [] })
	// // // t.is(html`<${'ab'}c />`, { tag: 'abc', props: null, children: [] })
	// // // t.is(html`<${'a'}${'b'}${'c'} />`, { tag: 'abc', props: null, children: [] })
	t.is(html`<abc d/>`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc d />`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc d  />`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc ${'d'}/>`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc ${'d'} />`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc  ${'d'}  />`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc   ${'d'}   />`, { tag: 'abc', props: { d: true }, children: [] })
	t.is(html`<abc d=e/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d=e />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d=e  />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d=e ></>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d=${'e'}/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d=${'e'} />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d=${'e'}  />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d="e"/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d="e" />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.is(html`<abc d="e f"/>`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.is(html`<abc d="e f" />`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.is(html`<abc d="${'e'} f" />`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.is(html`<abc d=${'e'}${'f'} />`, { tag: 'abc', props: { d: 'ef' }, children: [] })
	t.is(html`<abc d=e${'f'} />`, { tag: 'abc', props: { d: 'ef' }, children: [] })
	t.end()
})

t('quoted cases', t => {
	t.is(html`<abc d="e f" g=' h ' i=" > j /> k " />`, { tag: 'abc', props: { d: 'e f', g: ' h ', i: ' > j /> k ' }, children: [] })
	t.is(html`<abc>"def"</>`, { tag: 'abc', props: null, children: ["\"def\""] })
	t.end()
})

t.skip('malformed html', t => {
	t.throws(() => html`<a b c`)
	t.throws(() => html`<a><`)
	t.end()
})

t('ignore null values', t => {
	t.is(
		html`<div str="${false} ${null} ${undefined}" />`,
		{ tag: 'div', props: { str: "false  " }, children: [] }
	);

	t.end()
})

t('after tags', t => {
	t.is(html`<x/> 1`, [{tag:'x', props: null, children: []}, ' 1'])
	t.is(html`<x/>${1}`, [{tag:'x', props: null, children: []}, 1])
	t.is(html`1<x/>`, ['1', {tag:'x', props: null, children: []}])
	t.is(html`${1}<x/>`, [1, {tag:'x', props: null, children: []}])
	t.is(html`${1}<x/>${1}`, [1, {tag:'x', props: null, children: []}, 1])
})


t.skip('indentation & spaces', t => {
	t.is(html`
			<a>
				before
				${'foo'}
				<b />
				${'bar'}
				after
			</a>
		`, h('a', null, 'before', 'foo', h('b', null), 'bar', 'after'));
	t.end()
})



t('html: self-closing tags', t => {
  t.is(html`<input>`, { tag: 'input', props: null, children: [] })
  t.is(html`<input><p><br></p>`, [{ tag: 'input', props: null, children: [] }, { tag: 'p', props: null, children: [{ tag: 'br', props: null, children: [] }]}])
})


t('optional closing tags', t => {
	t.is(
		html`<table><tr><td>1<tr><td>2</table>`,
		{tag: 'table', props: null, children: [
			{tag: 'tr', props: null, children: [{ tag: 'td', props: null, children: ['1']}]},
			{tag: 'tr', props: null, children: [{ tag: 'td', props: null, children: ['2']}]}
		]},
		'double close')
	t.is(
		html`<p>a<p>b`,
		[{tag: 'p', props: null, children: ['a']}, {tag: 'p', props: null, children: ['b']}],
		'Closed by next same tag'
	)
	t.is(
		html`<title>Hello</title><p>Welcome to this example.`,
		[{tag:'title', props: null, children: ['Hello']}, {tag: 'p', props: null, children: ['Welcome to this example.']}],
		'Closed by end of content'
	)
})

t('optional closing tags 2', t => {
	t.is(html`
	<table>
	<caption>37547 TEE Electric Powered Rail Car Train Functions (Abbreviated)
	<colgroup><col><col><col>
	<thead>
		<tr> <th>Function                              <th>Control Unit     <th>Central Station
	<tbody>
		<tr> <td>Headlights                            <td>✔                <td>✔
		<tr> <td>Interior Lights                       <td>✔                <td>✔
		<tr> <td>Electric locomotive operating sounds  <td>✔                <td>✔
		<tr> <td>Engineer's cab lighting               <td>                 <td>✔
		<tr> <td>Station Announcements - Swiss         <td>                 <td>✔
	</table>
	`, { tag: 'table', props: null, children: [
		{ tag: 'caption', props: null, children: ['37547 TEE Electric Powered Rail Car Train Functions (Abbreviated) ']},
		{ tag: 'colgroup', props: null, children: [
			{ tag: 'col', props: null, children: []}, { tag: 'col', props: null, children: []}, { tag: 'col', props: null, children: []}
		]},
		{ tag: 'thead', props: null, children: [
			{ tag: 'tr', props: null, children: [
				{ tag: 'th', props: null, children: ['Function '] },
        { tag: 'th', props: null, children: ['Control Unit '] },
        { tag: 'th', props: null, children: ['Central Station '] }
			]}
		]},
		{ tag: 'tbody', props: null, children: [
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Headlights '] },
        { tag: 'td', props: null, children: ['✔ '] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Interior Lights '] },
        { tag: 'td', props: null, children: ['✔ '] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Electric locomotive operating sounds '] },
        { tag: 'td', props: null, children: ['✔ '] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Engineer\'s cab lighting '] },
        { tag: 'td', props: null, children: [] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Station Announcements - Swiss '] },
        { tag: 'td', props: null, children: [] }, { tag: 'td', props: null, children: ['✔ '] }
			]}
		]}
	]})
})

t('optional closing tags normal', t => {
	t.is(html`
	<table>
	<caption>37547 TEE Electric Powered Rail Car Train Functions (Abbreviated) </caption>
	<colgroup><col><col><col></colgroup>
	<thead>
		<tr> <th>Function                         </th><th>Control Unit </th><th>Central Station </th></tr>
  </thead>
	<tbody>
		<tr> <td>Headlights                            </td><td>✔                </td><td>✔    </td></tr>
		<tr> <td>Interior Lights                       </td><td>✔                </td><td>✔    </td></tr>
		<tr> <td>Electric locomotive operating sounds  </td><td>✔                </td><td>✔    </td></tr>
		<tr> <td>Engineer's cab lighting               </td><td>                 </td><td>✔    </td></tr>
		<tr> <td>Station Announcements - Swiss         </td><td>                 </td><td>✔    </td></tr>
  </tbody>
	</table>
	`, { tag: 'table', props: null, children: [
		{ tag: 'caption', props: null, children: ['37547 TEE Electric Powered Rail Car Train Functions (Abbreviated) ']},
		{ tag: 'colgroup', props: null, children: [
			{ tag: 'col', props: null, children: []}, { tag: 'col', props: null, children: []}, { tag: 'col', props: null, children: []}
		]},
		{ tag: 'thead', props: null, children: [
			{ tag: 'tr', props: null, children: [
				{ tag: 'th', props: null, children: ['Function '] },
        { tag: 'th', props: null, children: ['Control Unit '] },
        { tag: 'th', props: null, children: ['Central Station '] }
			]}
		]},
		{ tag: 'tbody', props: null, children: [
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Headlights '] },
        { tag: 'td', props: null, children: ['✔ '] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Interior Lights '] },
        { tag: 'td', props: null, children: ['✔ '] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Electric locomotive operating sounds '] },
        { tag: 'td', props: null, children: ['✔ '] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Engineer\'s cab lighting '] },
        { tag: 'td', props: null, children: [] }, { tag: 'td', props: null, children: ['✔ '] }
			]},
			{ tag: 'tr', props: null, children: [
				{ tag: 'td', props: null, children: ['Station Announcements - Swiss '] },
        { tag: 'td', props: null, children: [] }, { tag: 'td', props: null, children: ['✔ '] }
			]}
		]}
	]})
})

t('optional/self-closing readme', t => {
  t.is(html`
    <h1>Hello World!</h1>
    <p>Some paragraph<br>
    <p>Another paragraph
  `, [
    { tag: 'h1', props: null, children: ['Hello World!']},
    { tag: 'p', props: null, children: ['Some paragraph', { tag: 'br', props: null, children: []}]},
    { tag: 'p', props: null, children: ['Another paragraph ']}
  ])
})

t('html: tr case', t => {
	t.is(html`<tr colspan=2/>`, {tag: 'tr', props: {colspan: '2'}, children: []})
})

t('html: directives', t => {
  t.is(html`<?xml version="1.0" encoding="UTF-8" ?>`, {tag:'?xml', props:{version:'1.0', encoding:'UTF-8', '?': true}, children:[]})
  t.is(html`<!doctype html>`, {tag: '!doctype', props:{html: true}, children:[]})
  t.is(html`<!DOCTYPE html>`, {tag: '!DOCTYPE', props:{html: true}, children:[]})
  // t.is(html`<!ELEMENT html (head, body)>`, {tag:, props:{}, children:[]})
  t.is(html`<? header("Content-Type: text/html; charset= UTF-8"); ?>`, {tag: '?', props:{'header("Content-Type: text/html; charset= UTF-8");': true, '?': true}, children: []})
  t.is(html`<![CDATA[<sender>]]>`, undefined)
  t.is(html`<!-- comment -->`, undefined)
  t.is(html`<!--[if expression]> HTML <![endif]-->`, undefined)
})
