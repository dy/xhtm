import './htm.test.js'
import './perf.test.js'
import t from 'tape'
import htm from '../src/index.js'

const html = htm.bind((tag, props, ...children) => {
	return { tag, props, children }
});

t('base case', t => {
	t.deepEqual(html`foo <a bar>baz${'qux'}</a>`, ['foo ', { tag: 'a', props: { bar: true }, children: ['baz', 'qux'] }])
	t.end()
})

t('plain text', t => {
	t.deepEqual(html`a`, `a`)
	t.deepEqual(html`a${'b'}c`, ['a', 'b', 'c'])
	t.deepEqual(html`a${1}b${2}c`, ['a', 1, 'b', 2, 'c'])
	t.deepEqual(html`foo${''}bar${''}`, ['foo', '', 'bar', ''])
	t.deepEqual(html`${'foo'}${'bar'}`, ['foo', 'bar'])
	t.deepEqual(html`${''}${''}`, ['', ''])
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
	t.deepEqual(html`<abc d=${'e'}/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=${'e'} />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d=${'e'}  />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d="e"/>`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d="e" />`, { tag: 'abc', props: { d: 'e' }, children: [] })
	t.deepEqual(html`<abc d="e f"/>`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.deepEqual(html`<abc d="e f" />`, { tag: 'abc', props: { d: 'e f' }, children: [] })
	t.deepEqual(html`<abc d="e f" g=' h ' i=" > j /> k " />`, { tag: 'abc', props: { d: 'e f', g: ' h ', i: ' > j /> k ' }, children: [] })
	t.end()
})

t('nested tags', t => {
	t.deepEqual(html`<><x>abc</x></>`, { tag: '', props: null, children: [{tag: 'x', props: null, children: ['abc']}]})
	t.end()
})

t('simple attributes', t => {
	t.deepEqual(html`<x a=1>abc</>`, { tag: 'x', props: { a: '1' }, children: ['abc'] })
	t.end()
})

t('malformed html', t => {
	t.throws(() => html`<a b c`)
	t.throws(() => html`<a><`)
	t.end()
})

t.skip('attribute tpl', t => {
	t.deepEqual(attribute`a${'b'}c=1${2}3`, ['abc', '123'])
	t.deepEqual(attribute`${'foo'}=${'bar'}`, ['foo', 'bar'])
	t.deepEqual(attribute`${1}=${2}`, [1, 2])
	t.deepEqual(attribute`${''}${1}${''}=${''}${2}${''}`, ['1', '2'])
	t.deepEqual(attribute`${{}}=${{}}`, [{}, {}])
	t.deepEqual(attribute`${{}}`, [{}])
	t.end()
})

t.skip('attributes tpl', t => {
	t.deepEqual(attributes`a${'b'}c=1${2}3`, ['abc', '123'])
	t.deepEqual(attributes`${'foo'}=${'bar'}`, ['foo', 'bar'])
	t.deepEqual(attributes`${1}=${2}`, [1, 2])
	t.deepEqual(attributes`${''}${1}${''}=${''}${2}${''}`, ['1', '2'])
	t.deepEqual(attributes`${{}}=${{}}`, [{}, {}])
	t.deepEqual(attributes`${{}}`, [{}])
	t.end()
})

t.skip('ignore false value', t => {
	t.deepEqual(
		html`<div str="${false} ${null} ${undefined}" />`,
		{ tag: 'div', props: { str: "  " }, children: [] }
	);

	t.end()
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

