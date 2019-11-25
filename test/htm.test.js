import t from 'tape'
import htm from '../src/index.js'

const h = (tag, props, ...children) => ({ tag, props, children });
const html = htm.bind(h);

t('empty', (t) => {
  t.deepEqual(html``, undefined);
  t.end()
});

t('single named elements', (t) => {
  t.deepEqual(html`<div />`, { tag: 'div', props: null, children: [] });
  t.deepEqual(html`<div/>`, { tag: 'div', props: null, children: [] });
  t.deepEqual(html`<span />`, { tag: 'span', props: null, children: [] });
  t.end()
});

t('multiple root elements', (t) => {
  t.deepEqual(html`<a /><b></b><c><//>`, [
    { tag: 'a', props: null, children: [] },
    { tag: 'b', props: null, children: [] },
    { tag: 'c', props: null, children: [] }
  ]);
  t.end()
});

t('single dynamic tag name', (t) => {
  t.deepEqual(html`<${'foo'} />`, { tag: 'foo', props: null, children: [] });
  function Foo() { }
  t.deepEqual(html`<${Foo} />`, { tag: Foo, props: null, children: [] });
  t.end()
});

t('single boolean prop', (t) => {
  t.deepEqual(html`<a disabled />`, { tag: 'a', props: { disabled: true }, children: [] });
  t.end()
});

t('two boolean props', (t) => {
  t.deepEqual(html`<a invisible disabled />`, { tag: 'a', props: { invisible: true, disabled: true }, children: [] });
  t.end()
});

t('single prop with empty value', (t) => {
  t.deepEqual(html`<a href="" />`, { tag: 'a', props: { href: '' }, children: [] });
  t.end()
});

t('two props with empty values', (t) => {
  t.deepEqual(html`<a href="" foo="" />`, { tag: 'a', props: { href: '', foo: '' }, children: [] });
  t.end()
});

t('single prop with empty name', (t) => {
  t.deepEqual(html`<a ""="foo" />`, { tag: 'a', props: { '': 'foo' }, children: [] });
  t.end()
});

t('single prop with static value', (t) => {
  t.deepEqual(html`<a href="/hello" />`, { tag: 'a', props: { href: '/hello' }, children: [] });
  t.end()
});

t('single prop with static value followed by a single boolean prop', (t) => {
  t.deepEqual(html`<a href="/hello" b />`, { tag: 'a', props: { href: '/hello', b: true }, children: [] });
  t.end()
});

t('two props with static values', (t) => {
  t.deepEqual(html`<a href="/hello" target="_blank" />`, { tag: 'a', props: { href: '/hello', target: '_blank' }, children: [] });
  t.end()
});

t('single prop with dynamic value', (t) => {
  t.deepEqual(html`<a href=${'foo'} />`, { tag: 'a', props: { href: 'foo' }, children: [] });
  t.end()
});

t.skip('slash in the middle of tag name or property name self-closes the element', (t) => {
  // t.deepEqual(html`<ab/ba prop=value>`, { tag: 'ab', props: null, children: [] });
  // t.deepEqual(html`<abba pr/op=value>`, { tag: 'abba', props: { pr: true }, children: [] });
  t.deepEqual(html`<ab/ba prop=value>`, { tag: 'ab/ba', props: { prop: 'value' }, children: [] });
  t.deepEqual(html`<abba pr/op=value>`, { tag: 'abba', props: { 'pr/op': 'value' }, children: [] });
  t.end()
});

t('slash in a property value does not self-closes the element, unless followed by >', (t) => {
  t.deepEqual(html`<abba prop=val/ue><//>`, { tag: 'abba', props: { prop: 'val/ue' }, children: [] });
  t.deepEqual(html`<abba prop=value/>`, { tag: 'abba', props: { prop: 'value' }, children: [] });
  t.deepEqual(html`<abba prop=value/ ><//>`, { tag: 'abba', props: { prop: 'value/' }, children: [] });
  t.end()
});

t('two props with dynamic values', (t) => {
  function onClick(e) { }
  t.deepEqual(html`<a href=${'foo'} onClick=${onClick} />`, { tag: 'a', props: { href: 'foo', onClick }, children: [] });
  t.end()
});

t('prop with multiple static and dynamic values get concatenated as strings', (t) => {
  t.deepEqual(html`<a href="before${'foo'}after" />`, { tag: 'a', props: { href: 'beforefooafter' }, children: [] });
  t.deepEqual(html`<a href=${1}${1} />`, { tag: 'a', props: { href: '11' }, children: [] });
  t.deepEqual(html`<a href=${1}between${1} />`, { tag: 'a', props: { href: '1between1' }, children: [] });
  t.deepEqual(html`<a href=/before/${'foo'}/after />`, { tag: 'a', props: { href: '/before/foo/after' }, children: [] });
  t.deepEqual(html`<a href=/before/${'foo'}/>`, { tag: 'a', props: { href: '/before/foo' }, children: [] });
  t.end()
});

t('spread props', (t) => {
  t.deepEqual(html`<a ...${{ foo: 'bar' }} />`, { tag: 'a', props: { foo: 'bar' }, children: [] });
  t.deepEqual(html`<a b ...${{ foo: 'bar' }} />`, { tag: 'a', props: { b: true, foo: 'bar' }, children: [] });
  t.deepEqual(html`<a b c ...${{ foo: 'bar' }} />`, { tag: 'a', props: { b: true, c: true, foo: 'bar' }, children: [] });
  t.deepEqual(html`<a ...${{ foo: 'bar' }} b />`, { tag: 'a', props: { b: true, foo: 'bar' }, children: [] });
  t.deepEqual(html`<a b="1" ...${{ foo: 'bar' }} />`, { tag: 'a', props: { b: '1', foo: 'bar' }, children: [] });
  t.deepEqual(html`<a x="1"><b y="2" ...${{ c: 'bar' }}/></a>`, h('a', { x: '1' }, h('b', { y: '2', c: 'bar' })));
  t.deepEqual(html`<a b=${2} ...${{ c: 3 }}>d: ${4}</a>`, h('a', { b: 2, c: 3 }, 'd: ', 4));
  t.deepEqual(html`<a ...${{ c: 'bar' }}><b ...${{ d: 'baz' }}/></a>`, h('a', { c: 'bar' }, h('b', { d: 'baz' })));
  t.end()
});

t('multiple spread props in one element', (t) => {
  t.deepEqual(html`<a ...${{ foo: 'bar' }} ...${{ quux: 'baz' }} />`, { tag: 'a', props: { foo: 'bar', quux: 'baz' }, children: [] });
  t.end()
});

t('mixed spread + static props', (t) => {
  t.deepEqual(html`<a b ...${{ foo: 'bar' }} />`, { tag: 'a', props: { b: true, foo: 'bar' }, children: [] });
  t.deepEqual(html`<a b c ...${{ foo: 'bar' }} />`, { tag: 'a', props: { b: true, c: true, foo: 'bar' }, children: [] });
  t.deepEqual(html`<a ...${{ foo: 'bar' }} b />`, { tag: 'a', props: { b: true, foo: 'bar' }, children: [] });
  t.deepEqual(html`<a ...${{ foo: 'bar' }} b c />`, { tag: 'a', props: { b: true, c: true, foo: 'bar' }, children: [] });
  t.end()
});

t('closing tag', (t) => {
  t.deepEqual(html`<a></a>`, { tag: 'a', props: null, children: [] });
  t.deepEqual(html`<a b></a>`, { tag: 'a', props: { b: true }, children: [] });
  t.end()
});

t('auto-closing tag', (t) => {
  t.deepEqual(html`<a><//>`, { tag: 'a', props: null, children: [] });
  t.end()
});

t('non-element roots', (t) => {
  t.deepEqual(html`foo`, 'foo');
  t.deepEqual(html`${1}`, 1);
  t.deepEqual(html`foo${1}`, ['foo', 1]);
  t.deepEqual(html`${1}foo`, [1, 'foo']);
  t.deepEqual(html`foo${1}bar`, ['foo', 1, 'bar']);
  t.end()
});

t('text child', (t) => {
  t.deepEqual(html`<a>foo</a>`, { tag: 'a', props: null, children: ['foo'] });
  t.deepEqual(html`<a>foo bar</a>`, { tag: 'a', props: null, children: ['foo bar'] });
  t.deepEqual(html`<a>foo "<b /></a>`, { tag: 'a', props: null, children: ['foo "', { tag: 'b', props: null, children: [] }] });
  t.end()
});

t('dynamic child', (t) => {
  t.deepEqual(html`<a>${'foo'}</a>`, { tag: 'a', props: null, children: ['foo'] });
  t.end()
});

t('mixed text + dynamic children', (t) => {
  t.deepEqual(html`<a>${'foo'}bar</a>`, { tag: 'a', props: null, children: ['foo', 'bar'] });
  t.deepEqual(html`<a>before${'foo'}after</a>`, { tag: 'a', props: null, children: ['before', 'foo', 'after'] });
  // t.deepEqual(html`<a>foo${null}</a>`, { tag: 'a', props: null, children: ['foo', null] });
  // t.deepEqual(html`<a>foo${null}</a>`, { tag: 'a', props: null, children: ['foo'] });
  t.deepEqual(html`<a>foo${0}</a>`, { tag: 'a', props: null, children: ['foo', 0] });
  t.end()
});

t('element child', (t) => {
  t.deepEqual(html`<a><b /></a>`, h('a', null, h('b', null)));
  t.end()
});

t('multiple element children', (t) => {
  t.deepEqual(html`<a><b /><c /></a>`, h('a', null, h('b', null), h('c', null)));
  t.deepEqual(html`<a x><b y /><c z /></a>`, h('a', { x: true }, h('b', { y: true }), h('c', { z: true })));
  t.deepEqual(html`<a x=1><b y=2 /><c z=3 /></a>`, h('a', { x: '1' }, h('b', { y: '2' }), h('c', { z: '3' })));
  t.deepEqual(html`<a x=${1}><b y=${2} /><c z=${3} /></a>`, h('a', { x: 1 }, h('b', { y: 2 }), h('c', { z: 3 })));
  t.end()
});

t('mixed typed children', (t) => {
  t.deepEqual(html`<a>foo<b /></a>`, h('a', null, 'foo', h('b', null)));
  t.deepEqual(html`<a><b />bar</a>`, h('a', null, h('b', null), 'bar'));
  t.deepEqual(html`<a>before<b />after</a>`, h('a', null, 'before', h('b', null), 'after'));
  t.deepEqual(html`<a>before<b x=1 />after</a>`, h('a', null, 'before', h('b', { x: '1' }), 'after'));
  t.end()
});

t('hyphens (-) are allowed in attribute names', (t) => {
  t.deepEqual(html`<a b-c></a>`, h('a', { 'b-c': true }));
  t.end()
});

t('NUL characters are allowed in attribute values', (t) => {
  t.deepEqual(html`<a b="\0"></a>`, h('a', { b: '\0' }));
  t.deepEqual(html`<a b="\0" c=${'foo'}></a>`, h('a', { b: '\0', c: 'foo' }));
  t.end()
});

t('NUL characters are allowed in text', (t) => {
  t.deepEqual(html`<a>\0</a>`, h('a', null, '\0'));
  t.deepEqual(html`<a>\0${'foo'}</a>`, h('a', null, '\0', 'foo'));
  t.end()
});

t('cache key should be unique', (t) => {
  html`<a b="${'foo'}" />`;
  t.deepEqual(html`<a b="\0" />`, h('a', { b: '\0' }));
  t.notDeepEqual(html`<a>${''}9aaaaaaaaa${''}</a>`, html`<a>${''}0${''}aaaaaaaaa${''}</a>`);
  t.notDeepEqual(html`<a>${''}0${''}aaaaaaaa${''}</a>`, html`<a>${''}.8aaaaaaaa${''}</a>`);
  t.end()
});

t('do not mutate spread variables', (t) => {
  const obj = {};
  html`<a ...${obj} b="1" />`;
  t.deepEqual(obj, {});
  t.end()
});

t('ignore HTML comments', (t) => {
  t.deepEqual(html`<a><!-- Hello, world! --></a>`, h('a', null));
  t.deepEqual(html`<a><!-- Hello,\nworld! --></a>`, h('a', null));
  t.deepEqual(html`<a><!-- ${'Hello, world!'} --></a>`, h('a', null));
  t.deepEqual(html`<a><!--> Hello, world <!--></a>`, h('a', null));
  t.end()
});
