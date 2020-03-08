import t from 'tst'
import htm from '../index.js'

const h = (tag, props, ...children) => {
	return { tag, props, children }
}
const html = htm.bind(h)

t('html: self-closing tags', t => {
  t.is(html`<input>`, { tag: 'input', props: null, children: [] })
  t.is(html`<input><p><br></p>`, [{ tag: 'input', props: null, children: [] }, { tag: 'p', props: null, children: [{ tag: 'br', props: null, children: [] }]}])
})

t('html: optional tags')

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
