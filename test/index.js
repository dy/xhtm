import './htm.js'
import './perf.js'
import './html.js'

import t from 'tst'
import htm from '../index.js'
// import htm from 'htm'

export const h = (tag, props, ...children) => {
	if (Array.isArray(tag)) tag = tag.join('')
	for (let p in props) Array.isArray(props[p]) && (props[p] = props[p].join(''))
	return { tag, props, children }
}
export const html = htm.bind(h)

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


t.skip('indentation & spaces', t => {
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
