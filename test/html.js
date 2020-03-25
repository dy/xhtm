import t from 'tst'
import { h, html } from './index.js'

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
