import './htm.js'
import './perf.js'
import './html.js'

import t from 'tst'
import xhtm from '../index.js'
import htm from 'htm'

export const h = (tag, props, ...children) => {
	if (Array.isArray(tag)) tag = tag.join('')
	for (let p in props) Array.isArray(props[p]) && (props[p] = props[p] + '')
	return { tag, props, children }
}
// export const html = htm.bind(h)
export const html = xhtm.bind(h)

t('base case', t => {
	t.deepEqual(html` foo <a b >c${'d'}<e f=g/>h </a>`, [
		' foo ', { tag: 'a', props: { b: true }, children: ['c', 'd', { tag: 'e', props: { f: 'g' }, children: [] }, 'h '] }
	])
	t.end()
})

t('plain text', t => {
	t.deepEqual(html`a`, `a`)
	t.deepEqual(html`a${'b'}c`, ['a', 'b', 'c'])
	t.deepEqual(html`a${1}b${2}c`, ['a', 1, 'b', 2, 'c'])
	t.deepEqual(html`foo${''}bar${''}`, ['foo', '', 'bar', ''])
	t.deepEqual(html`${'foo'}${'bar'}`, ['foo', '', 'bar'])
	t.deepEqual(html`${''}${''}`, ['', '', ''])
	t.end()
})

t('tag cases', t => {
	// special case: both self-closing empty tag and ending tag
	// t.deepEqual(html`</>`, { tag: '', props: null, children: []})

	t.deepEqual(html`< />`, { tag: '', props: null, children: [] })
	t.deepEqual(html`<></>`, { tag: '', props: null, children: [] })
	t.deepEqual(html`<a></>`, { tag: 'a', props: null, children: [] })
	t.deepEqual(html`<a></a>`, { tag: 'a', props: null, children: [] })
	t.deepEqual(html`<abc/>`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<abc />`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<abc  />`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<abc></>`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<abc></abc>`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<${'abc'} />`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<a${'bc'} />`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<${'ab'}c />`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<${'a'}${'b'}${'c'} />`, { tag: 'abc', props: null, children: [] })
	t.deepEqual(html`<abc d/>`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc d />`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc d  />`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc ${'d'}/>`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc ${'d'} />`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc  ${'d'}  />`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc   ${'d'}   />`, { tag: 'abc', props: { d: true }, children: [] })
	t.deepEqual(html`<abc d=e/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=e />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=e  />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=e ></>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=${'e'}/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=${'e'} />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=${'e'}  />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d="e"/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d="e" />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d="e f"/>`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.deepEqual(html`<abc d="e f" />`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.end()
})

t('quoted cases', t => {
	t.deepEqual(html`<abc d="e f" g=' h ' i=" > j /> k " />`, { tag: 'abc', props: { d: 'e f', g: ' h ', i: ' > j /> k ' }, children: [] })
	t.deepEqual(html`<abc>"def"</>`, { tag: 'abc', props: null, children: ["\"def\""] })
	t.end()
})

t.skip('malformed html', t => {
	t.throws(() => html`<a b c`)
	t.throws(() => html`<a><`)
	t.end()
})

t('ignore null values', t => {
	t.deepEqual(
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


t('indentation & spaces', t => {
	t.deepEqual(html`
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

t('indentation 2', t => {
  t.is(html`
    <h1>Hello World!</h1>
    <p>Some paragraph</p>
    <p>Another paragraph</p>
  `, [
    { tag: 'h1', props: null, children: ['Hello World!']},
    { tag: 'p', props: null, children: ['Some paragraph']},
    { tag: 'p', props: null, children: ['Another paragraph']}
  ])
})

t('indentation 3', t => {
	t.is(html`<tr> <td>Headlights  </td></tr>`, h('tr', null, ' ', h('td', null, 'Headlights ')))
})


t('#9: Additional comma', t => {
	t.equal(html`<li src='https://my.site/section/${2}'></li>`.props.src, "https://my.site/section/2")
})

t.skip('#8: Zero value', t => {
	//NOTE: we don't do it for htm complacency. Hiding zero values is vhtml's issue.
	t.equal(html`<p>Count:${0}</p>`, `<p>Count:0</p>`)
	t.equal(html`<p>Count:${null}</p>`, `<p>Count:</p>`)
})

t('#10: value.join is not a function', t => {
	let applicationIndex = 1

	let el = html`
	<form method='POST' action='/settings/setup/applications/edit/${applicationIndex}'>
		<button id='add' name='add' type='submit'>Update</button>
	</form>
	`
})

t('#11: proper spacing', t => {
	// t.deepEqual(
	// 	html`<p><strong>Hello,</strong> <em>world!</em></p>`,
	// 	h('p', null, h('strong', null, 'Hello,'), ' ', h('em', null, 'world!'))
	// )
	t.deepEqual(
		html`<p><strong>Hello,</strong> <em>world!</em></p>`,
		h('p', null, h('strong', null, 'Hello,'), ' ', h('em', null, 'world!'))
	)
})

t('#13: newline tags', t => {
	t.deepEqual(html`<span
		id='status'>xx</span>`, h('span', {id: 'status'}, 'xx'))
})

t('#14: closing input', t => {
	t.deepEqual(html`<input></input>`, h('input', null))
})

t('#15: initial comment', t => {
	const markup = html`
		<!-- A comment -->
		<h1>This is not rendered</h1>
		<p>Neither is this.</p>
		<!-- Another comment -->
		<h2>However, this is rendered correctly.</h2>
	`
	t.deepEqual(markup, [h('h1', null, 'This is not rendered'), h('p', null, 'Neither is this.'), h('h2', null, 'However, this is rendered correctly.')])
})

t('#16: optional closing tags', t => {
	const markup = html`<div>
	<div>
		<img id='kitten-sleeping' src='/😸/images/kitten-sleeping.svg' alt='' />
	</div></div>`
	t.throws(() => {
		const markup1 = html`<div>
		<div>
			<img id='kitten-sleeping' src='/😸/images/kitten-sleeping.svg' alt='' />
			<main id='content'></main>
		</div>`
	})
	t.throws(() => {
		const markup2 = html`<div>
		<div>
		<img id='kitten-sleeping' src='/😸/images/kitten-sleeping.svg' alt='' >
		<main id='content'></main>
		</div>`
		console.log(markup2)
	})
	//TODO
	// t.throws(() => {
	// 	const markup3 = html`<div></dvi>`
	// 	console.log(markup3)
	// })
})

t('#17: sequence of empties', t => {
	let markup = html`
	<form>
		<input name='name' type='text' required value=''/>
		<input name='address' type='text' required value=''/>
	</form>`
})