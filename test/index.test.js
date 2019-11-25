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

t.skip('plain text', t => {
	t.deepEqual(html`a`, `a`)
	t.deepEqual(html`a${'b'}c`, ['a', 'b', 'c'])
	t.deepEqual(html`a${1}b${2}c`, ['a', 1, 'b', 2, 'c'])
	t.deepEqual(html`foo${''}bar${''}`, ['foo', 'bar'])
	t.deepEqual(html`${'foo'}${'bar'}`, ['foo', 'bar'])
	t.deepEqual(html`${''}${''}`, undefined)
	t.end()
})

t('simple tags', t => {
	t.deepEqual(html`<>abc</>`, { tag: '', props: null, children: ['abc'] })
	t.deepEqual(html`< >abc</>`, { tag: '', props: null, children: ['abc']})
	t.deepEqual(html`<x>abc</>`, { tag: 'x', props: null, children: ['abc']})
	t.deepEqual(html`<x >abc</>`, { tag: 'x', props: null, children: ['abc']})
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

t.skip('malformed html', t => {
	t.throws(() => html`<a b c`)
	t.throws(() => html`<a><`)
	t.end()
})

t.skip('dynamic attributes', t => {
	t.deepEqual(html`< a${'b'}c=1${2}3 />`, {tag: '', props: {'abc': '123'}, children: []})
	// t.deepEqual(html`${'foo'}=${'bar'}`, ['foo', 'bar'])
	// t.deepEqual(html`${1}=${2}`, [1, 2])
	// t.deepEqual(html`${''}${1}${''}=${''}${2}${''}`, ['1', '2'])
	// t.deepEqual(html`${{}}=${{}}`, [{}, {}])
	// t.deepEqual(html`${{}}`, [{}])
	t.end()
})

t.skip('directives', t => {
	// t.deepEqual(html`<?xml version="1.0" encoding="UTF-8" ?>`, undefined)
	// t.deepEqual(html`<!doctype html>`, undefined)
	// t.deepEqual(html`<![CDATA[ ...  ]]>`, undefined)
	// t.deepEqual(html`<!-- comment -->`, undefined)
	// t.deepEqual(html`<!--[if expression]> HTML <![endif]-->`, undefined)
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

