import t from 'tst'
import htm from '../index.js'

const h = (tag, props, ...children) => {
	return { tag, props, children }
}
const html = htm.bind(h)

t('h: html self-closing tags', t => {
  t.is(html`<input>`, { tag: 'input', props: null, children: [] })
  t.is(html`<input><p><br></p>`, [{ tag: 'input', props: null, children: [] }, { tag: 'p', props: null, children: [{ tag: 'br', props: null, children: [] }]}])
})
