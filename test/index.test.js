import './htm.test.js'
import t from 'tape'
import htm from '../src/index.js'

const html = htm.bind((tag, props, ...children) => {
	return { tag, props, children }
});

t('plain text', t => {
	t.deepEqual(html``, { tag: '', props: {}, children: [''] })
	// t.deepEqual(html`a`, { tag: '', props: {}, children: ['a'] })
	// t.deepEqual(html`abc`, { tag: '', props: {}, children: ['abc'] })
	// t.deepEqual(html`a${'b'}c`, { tag: '', props: {}, children: ['abc'] })
	// t.deepEqual(html`a${'b'}c${'d'}e`, { tag: '', props: {}, children: ['abcde'] })
	// t.deepEqual(html`foo${'bar'}baz${'qux'}`, { tag: '', props: {}, children: ['foobarbazqux'] })
	// t.deepEqual(html`foo${''}bar${''}`, { tag: '', props: {}, children: ['foobar'] })
	// t.deepEqual(html`${'foo'}${'bar'}`, { tag: '', props: {}, children: ['foobar'] })
	t.end()
})

t('simple tags', t => {
	t.deepEqual(html`<>abc</>`, { tag: '', props: {}, children: ['abc'] })
	t.deepEqual(html`< >abc</>`, { tag: '', props: {}, children: ['abc']})
	t.deepEqual(html`<x>abc</>`, { tag: 'x', props: {}, children: ['abc']})
	t.deepEqual(html`<x >abc</>`, { tag: 'x', props: {}, children: ['abc']})
	t.end()
})

t('nested tags', t => {
	t.deepEqual(html`<><x>abc</x></>`, { tag: '', props: {}, children: [{tag: 'x', props: {}, children: ['abc']}]})
})

t('simple attributes', t => {
	t.deepEqual(html`<x a=1>abc</>`, { tag: 'x', props: {a: 1}, children: ['abc']})
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


