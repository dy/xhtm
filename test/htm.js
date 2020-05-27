import t from 'tst'
import { html, h } from './index.js'

t('empty', (t) => {
  t.is(html``, undefined);
  t.end()
});

t('single named elements', (t) => {
  t.is(html`<div />`, { tag: 'div', props: null, children: [] });
  t.is(html`<div/>`, { tag: 'div', props: null, children: [] });
  t.is(html`<span />`, { tag: 'span', props: null, children: [] });
  t.end()
});

t('multiple root elements', (t) => {
  t.is(html`<a /><b></b><c><//>`, [
    { tag: 'a', props: null, children: [] },
    { tag: 'b', props: null, children: [] },
    { tag: 'c', props: null, children: [] }
  ]);
  t.end()
});

t('single dynamic tag name', (t) => {
  t.is(html`<${'foo'} />`, { tag: 'foo', props: null, children: [] });
  function Foo() { }
  t.is(html`<${Foo} />`, { tag: Foo, props: null, children: [] });
  t.end()
});

t('single boolean prop', (t) => {
  t.any(html`<a disabled />`, [
    { tag: 'a', props: { disabled: true }, children: [] },
    { tag: 'a', props: { disabled: '' }, children: [] }
  ]);
  t.end()
});

t('two boolean props', (t) => {
  t.any(html`<a invisible disabled />`, [
    { tag: 'a', props: { invisible: true, disabled: true }, children: [] },
    { tag: 'a', props: { invisible: '', disabled: '' }, children: [] },
  ]);
  t.end()
});

t('single prop with empty value', (t) => {
  t.is(html`<a href="" />`, { tag: 'a', props: { href: '' }, children: [] });
  t.end()
});

t('two props with empty values', (t) => {
  t.is(html`<a href="" foo="" />`, { tag: 'a', props: { href: '', foo: '' }, children: [] });
  t.end()
});

t.skip('single prop with empty name', (t) => {
  t.is(html`<a ""="foo" />`, { tag: 'a', props: { '': 'foo' }, children: [] });
  t.end()
});

t('single prop with static value', (t) => {
  t.is(html`<a href="/hello" />`, { tag: 'a', props: { href: '/hello' }, children: [] });
  t.end()
});

t('single prop with static value followed by a single boolean prop', (t) => {
  t.any(html`<a href="/hello" b />`, [
    { tag: 'a', props: { href: '/hello', b: true }, children: [] },
    { tag: 'a', props: { href: '/hello', b: '' }, children: [] },
  ]);
  t.end()
});

t('two props with static values', (t) => {
  t.is(html`<a href="/hello" target="_blank" />`, { tag: 'a', props: { href: '/hello', target: '_blank' }, children: [] });
  t.end()
});

t('single prop with dynamic value', (t) => {
  t.is(html`<a href=${'foo'} />`, { tag: 'a', props: { href: 'foo' }, children: [] });
  t.end()
});

t.skip('slash in the middle of tag name or property name self-closes the element', (t) => {
  // t.is(html`<ab/ba prop=value>`, { tag: 'ab', props: null, children: [] });
  // t.is(html`<abba pr/op=value>`, { tag: 'abba', props: { pr: true }, children: [] });
  t.is(html`<ab/ba prop=value/>`, { tag: 'ab/ba', props: { prop: 'value' }, children: [] });
  t.is(html`<abba pr/op=value/>`, { tag: 'abba', props: { 'pr/op': 'value' }, children: [] });
  t.end()
});

t('slash in a property value does not self-closes the element, unless followed by >', (t) => {
  t.is(html`<abba prop=val/ue><//>`, { tag: 'abba', props: { prop: 'val/ue' }, children: [] });
  t.is(html`<abba prop=value/>`, { tag: 'abba', props: { prop: 'value' }, children: [] });
  t.is(html`<abba prop=value/ ><//>`, { tag: 'abba', props: { prop: 'value/' }, children: [] });
  t.end()
});

t('two props with dynamic values', (t) => {
  function onClick(e) { }
  t.is(html`<a href=${'foo'} onClick=${onClick} />`, { tag: 'a', props: { href: 'foo', onClick }, children: [] });
  t.end()
});

t('prop with multiple static and dynamic values get concatenated as strings', (t) => {
  t.is(html`<a href="before${'foo'}after" />`, { tag: 'a', props: { href: 'beforefooafter' }, children: [] });
  t.is(html`<a href=${1}${1} />`, { tag: 'a', props: { href: '11' }, children: [] });
  t.is(html`<a href=${1}between${1} />`, { tag: 'a', props: { href: '1between1' }, children: [] });
  t.is(html`<a href=/before/${'foo'}/after />`, { tag: 'a', props: { href: '/before/foo/after' }, children: [] });
  t.is(html`<a href=/before/${'foo'}/>`, { tag: 'a', props: { href: '/before/foo' }, children: [] });
  t.end()
});

t('spread props', (t) => {
  t.is(html`<a  />`, { tag: 'a', props: null, children: [] });
  t.is(html`<a ...${{ foo: 'bar' }} />`, { tag: 'a', props: { foo: 'bar' }, children: [] });
  t.any(html`<a b ...${{ foo: 'bar' }} />`, [
    { tag: 'a', props: { b: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', foo: 'bar' }, children: [] }
  ]);
  t.any(html`<a b c ...${{ foo: 'bar' }} />`, [
    { tag: 'a', props: { b: true, c: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', c: '', foo: 'bar' }, children: [] }
  ]);
  t.any(html`<a ...${{ foo: 'bar' }} b />`, [
    { tag: 'a', props: { b: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', foo: 'bar' }, children: [] },
  ]);
  t.is(html`<a b="1" ...${{ foo: 'bar' }} />`, { tag: 'a', props: { b: '1', foo: 'bar' }, children: [] });
  t.is(html`<a x="1"><b y="2" ...${{ c: 'bar' }}/></a>`, h('a', { x: '1' }, h('b', { y: '2', c: 'bar' })));
  t.is(html`<a b=${2} ...${{ c: 3 }}>d: ${4}</a>`, h('a', { b: 2, c: 3 }, 'd: ', 4));
  t.is(html`<a ...${{ c: 'bar' }}><b ...${{ d: 'baz' }}/></a>`, h('a', { c: 'bar' }, h('b', { d: 'baz' })));
  t.end()
});

t('multiple spread props in one element', (t) => {
  t.is(html`<a ...${{ foo: 'bar' }} ...${{ quux: 'baz' }} />`, { tag: 'a', props: { foo: 'bar', quux: 'baz' }, children: [] });
  t.end()
});

t('mixed spread + static props', (t) => {
  t.any(html`<a b ...${{ foo: 'bar' }} />`, [
    { tag: 'a', props: { b: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', foo: 'bar' }, children: [] },
  ]);
  t.any(html`<a b c ...${{ foo: 'bar' }} />`, [
    { tag: 'a', props: { b: true, c: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', c: '', foo: 'bar' }, children: [] },
  ]);
  t.any(html`<a ...${{ foo: 'bar' }} b />`, [
    { tag: 'a', props: { b: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', foo: 'bar' }, children: [] },
  ]);
  t.any(html`<a ...${{ foo: 'bar' }} b c />`, [
    { tag: 'a', props: { b: true, c: true, foo: 'bar' }, children: [] },
    { tag: 'a', props: { b: '', c: '', foo: 'bar' }, children: [] },
  ]);
  t.end()
});

t('closing tag', (t) => {
  t.is(html`<a></a>`, { tag: 'a', props: null, children: [] });
  t.any(html`<a b></a>`, [
    { tag: 'a', props: { b: true }, children: [] },
    { tag: 'a', props: { b: '' }, children: [] },
  ]);
  t.end()
});

t('auto-closing tag', (t) => {
  t.is(html`<a><//>`, { tag: 'a', props: null, children: [] });
  t.end()
});

t('non-element roots', (t) => {
  t.is(html`foo`, 'foo');
  t.is(html`${1}`, 1);
  t.is(html`foo${1}`, ['foo', 1]);
  t.is(html`${1}foo`, [1, 'foo']);
  t.is(html`foo${1}bar`, ['foo', 1, 'bar']);
  t.end()
});

t('text child', (t) => {
  t.is(html`<a>foo</a>`, { tag: 'a', props: null, children: ['foo'] });
  t.is(html`<a>foo bar</a>`, { tag: 'a', props: null, children: ['foo bar'] });
  t.is(html`<a>foo "<b /></a>`, { tag: 'a', props: null, children: ['foo "', { tag: 'b', props: null, children: [] }] });
  t.end()
});

t('dynamic child', (t) => {
  t.is(html`<a>${'foo'}</a>`, { tag: 'a', props: null, children: ['foo'] });
  t.end()
});

t('mixed text + dynamic children', (t) => {
  t.is(html`<a>${'foo'}bar</a>`, { tag: 'a', props: null, children: ['foo', 'bar'] });
  t.is(html`<a>before${'foo'}after</a>`, { tag: 'a', props: null, children: ['before', 'foo', 'after'] });
  t.is(html`<a>foo${null}</a>`, { tag: 'a', props: null, children: ['foo', null] });
  t.is(html`<a>foo${0}</a>`, { tag: 'a', props: null, children: ['foo', 0] });
  t.end()
});

t('element child', (t) => {
  t.is(html`<a><b /></a>`, h('a', null, h('b', null)));
  t.end()
});

t('multiple element children', (t) => {
  t.is(html`<a><b /><c /></a>`, h('a', null, h('b', null), h('c', null)));
  t.any(html`<a x><b y /><c z /></a>`, [
    h('a', { x: true }, h('b', { y: true }), h('c', { z: true })),
    h('a', { x: '' }, h('b', { y: '' }), h('c', { z: '' })),
  ]);
  t.is(html`<a x=1><b y=2 /><c z=3 /></a>`, h('a', { x: '1' }, h('b', { y: '2' }), h('c', { z: '3' })));
  t.is(html`<a x=${1}><b y=${2} /><c z=${3} /></a>`, h('a', { x: 1 }, h('b', { y: 2 }), h('c', { z: 3 })));
  t.end()
});

t('mixed typed children', (t) => {
  t.is(html`<a>foo<b /></a>`, h('a', null, 'foo', h('b', null)));
  t.is(html`<a><b />bar</a>`, h('a', null, h('b', null), 'bar'));
  t.is(html`<a>before<b />after</a>`, h('a', null, 'before', h('b', null), 'after'));
  t.is(html`<a>before<b x=1 />after</a>`, h('a', null, 'before', h('b', { x: '1' }), 'after'));
  t.end()
});

t('hyphens (-) are allowed in attribute names', (t) => {
  t.any(html`<a b-c></a>`, [
    h('a', { 'b-c': true }),
    h('a', { 'b-c': '' })
  ]);
  t.end()
});

t('NUL characters are allowed in attribute values', (t) => {
  t.is(html`<a b="\0"></a>`, h('a', { b: '\0' }));
  t.is(html`<a b="\0" c=${'foo'}></a>`, h('a', { b: '\0', c: 'foo' }));
  t.end()
});

t('NUL characters are allowed in text', (t) => {
  t.is(html`<a>\0</a>`, h('a', null, '\0'));
  t.is(html`<a>\0${'foo'}</a>`, h('a', null, '\0', 'foo'));
  t.end()
});

t('cache key should be unique', (t) => {
  html`<a b="${'foo'}" />`;
  t.is(html`<a b="\0" />`, h('a', { b: '\0' }));
  t.not(html`<a>${''}9aaaaaaaaa${''}</a>`, html`<a>${''}0${''}aaaaaaaaa${''}</a>`);
  t.not(html`<a>${''}0${''}aaaaaaaa${''}</a>`, html`<a>${''}.8aaaaaaaa${''}</a>`);
  t.end()
});

t('do not mutate spread variables', (t) => {
  const obj = {};
  html`<a ...${obj} b="1" />`;
  t.is(obj, {});
  t.end()
});

t('ignore HTML comments', (t) => {
  t.is(html`<a><!-- Hello, world! --></a>`, h('a', null));
  t.is(html`<a><!-- Hello,\nworld! --></a>`, h('a', null));
  t.is(html`<a><!-- ${'Hello, world!'} --></a>`, h('a', null));
  // t.is(html`<a><!--> Hello, world <!--></a>`, h('a', null));
  t.end()
});
