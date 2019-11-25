import t from 'tape'

t('htm', async t => {
  const htm = (await import('htm')).default

  const h = (tag, props, ...children) => ({ tag, props, children });
  const html = htm.bind(h);

  creation(html, t)
  usage(html, t)

  t.end()
})

t('xhtm', async t => {
  const htm = (await import('../src/index')).default

  const h = (tag, props, ...children) => ({ tag, props, children });
  const html = htm.bind(h);

  creation(html, t)
  usage(html, t)

  t.end()
})

t('domtagger', async t => {
  const domtagger = (await import('domtagger')).default

  const options = {
    type: 'html',
    attribute(node, name) {
      return value => {
        node[name] = value;
      }
    },
    any(node) {
      if (node.nodeType === 8)
        node = node.parentNode;
      return html => {
        node.innerHTML = html;
      };
    },
    text(node) {
      return textContent => {
        node.textContent = textContent;
      };
    }
  };
  const html = domtagger(options)

  creation(html, t)
  usage(html, t)

  t.end()
})

t('hyperx', async t => {
  const hyperx = (await import('hyperx'))
  const h = (tag, props, ...children) => ({ tag, props, children });
  const html = hyperx(h)

  creation(html, t)
  usage(html, t)

  t.end()
})

t.skip('lit-html', async t => {
  const { html } = (await import('lit-html'))
  creation(html, t)
  usage(html, t)

  t.end()
})

t('common-tags', async t => {
  const { html } = (await import('common-tags'))
  creation(html, t)
  usage(html, t)

  t.end()
})

t('innerHTML', async t => {
  let div = document.createElement('div')
  const html = (...args) => {
    let real = String.raw(...args)
    div.innerHTML = real
    return div.innerHTML
  }

  creation(html, t)
  usage(html, t)

  t.end()
})

t('String.raw', async t => {
  const html = String.raw

  creation(html, t)
  usage(html, t)

  t.end()
})


function creation (html, t) {
  const results = [];
  const Foo = ({ name }) => html`<div class="foo">${name}</div>`;
  let count = 0;
  function go(count) {
    const statics = [
      '\n<div id=app' + (++count) + ' data-loading="true">\n\t<h1>Hello World</h1>\n\t<ul class="items" id=', '>\n\t',
      '\n\t</ul>\n\t\n\t<', ' name="foo" />\n\t<', ' name="other">content<//>\n\n</div>'
    ];
    statics.raw = statics
    return html(
      statics,
      `id${count}`,
      html`<li data-id="${'i' + count}">${'some text #' + count}</li>`,
      Foo, Foo
    );
  }
  let now = performance.now();
  const start = now;
  while ((now = performance.now()) < start + 1000) {
    count++;
    if (results.push(String(go(count))) === 10) results.length = 0;
  }
  const elapsed = now - start;
  const hz = count / elapsed * 1000;
  // eslint-disable-next-line no-console
  console.log(`Creation: ${(hz | 0).toLocaleString()}/s, average: ${elapsed / count * 1000 | 0}µs`);
  // t.ok(elapsed > 999);
  // t.ok(hz > 1000);
}

function usage (html, t) {
  const results = [];
  const Foo = ({ name }) => html`<div class="foo">${name}</div>`;
  let count = 0;
  function go(count) {
    return html`
			<div id="app" data-loading="true">
				<h1>Hello World</h1>
				<ul class="items" id=${`id${count}`}>
					${html`<li data-id="${'i' + count}">${'some text #' + count}</li>`}
				</ul>
				<${Foo} name="foo" />
				<${Foo} name="other">content<//>
			</div>
		`;
  }
  let now = performance.now();
  const start = now;
  while ((now = performance.now()) < start + 1000) {
    count++;
    if (results.push(String(go(count))) === 10) results.length = 0;
  }
  const elapsed = now - start;
  const hz = count / elapsed * 1000;
  // eslint-disable-next-line no-console
  console.log(`Usage: ${(hz | 0).toLocaleString()}/s, average: ${elapsed / count * 1000 | 0}µs`);
  // t.ok(elapsed > 999);
  // t.ok(hz > 100000);
}
