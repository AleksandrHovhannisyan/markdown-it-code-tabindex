const markdownIt = require('markdown-it');
const markdownItAttributes = require('markdown-it-attrs');
const markdownItPrism = require('markdown-it-prism');
const markdownItCodeTabIndex = require('.');

describe('markdown-it-code-tabindex', () => {
  describe('options and basic plugin behavior', () => {
    it('adds tabindex="0" to fenced <pre> by default', () => {
      const md = markdownIt().use(markdownItCodeTabIndex);
      const src = '```js\n```';
      const expected = `<pre tabindex="0"><code class="language-js"></code></pre>`;
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    it('adds tabindex="0" to fenced <pre> when target === "pre"', () => {
      const md = markdownIt().use(markdownItCodeTabIndex, { target: 'pre' });
      const src = '```js\n```';
      const expected = `<pre tabindex="0"><code class="language-js"></code></pre>`;
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    it('adds tabindex="0" to fenced <code> when target === "code"', () => {
      const md = markdownIt().use(markdownItCodeTabIndex, { target: 'code' });
      const src = '```js\n```';
      const expected = `<pre><code tabindex="0" class="language-js"></code></pre>`;
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    it('throws an error if an invalid tag name is supplied', () => {
      const src = '```js\n```';
      expect(() => markdownIt().use(markdownItCodeTabIndex, { target: 'unrecognized' }).render(src)).toThrow();
    });
  });
  describe('cases to ignore', () => {
    it('ignores inline code', () => {
      const md = markdownIt().use(markdownItCodeTabIndex);
      const src = 'I `love` Markdown.';
      const expected = `<p>I <code>love</code> Markdown.</p>`;
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    it('ignores fenced code block children that happen to be <pre> and <code>', () => {
      const md = markdownIt().use(markdownItCodeTabIndex, { target: 'pre' });
      const src = '```html\n<pre><code></code></pre>\n```';
      const expected = `<pre tabindex="0"><code class="language-html">&lt;pre&gt;&lt;code&gt;&lt;/code&gt;&lt;/pre&gt;</code></pre>`;
      expect(md.render(src).replace(/\n/g, '')).toStrictEqual(expected);
    });
  });
  describe('plugin compatibility', () => {
    test(`1. markdown-it-attrs, 2. markdown-it-prism, 3. self`, () => {
      const src = '```js {data-attr1="value1" data-attr2="value2"}\n```';
      const expected = `<pre class="language-js"><code data-attr1="value1" data-attr2="value2" tabindex="0" class="language-js"></code></pre>`;

      const md = markdownIt()
        .use(markdownItAttributes)
        .use(markdownItPrism)
        .use(markdownItCodeTabIndex, { target: 'code' });
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    test(`1. markdown-it-attrs, 2. self, 3. markdown-it-prism,`, () => {
      const src = '```js {data-attr1="value1" data-attr2="value2"}\n```';
      const expected = `<pre class="language-js"><code data-attr1="value1" data-attr2="value2" tabindex="0" class="language-js"></code></pre>`;

      const md = markdownIt()
        .use(markdownItAttributes)
        .use(markdownItCodeTabIndex, { target: 'code' })
        .use(markdownItPrism);
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    test(`1. markdown-it-prism, 2. markdown-it-attrs, 3. self,`, () => {
      const src = '```js {data-attr1="value1" data-attr2="value2"}\n```';
      const expected = `<pre class="language-js"><code data-attr1="value1" data-attr2="value2" tabindex="0" class="language-js"></code></pre>`;

      const md = markdownIt()
        .use(markdownItPrism)
        .use(markdownItAttributes)
        .use(markdownItCodeTabIndex, { target: 'code' });
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    test(`1. markdown-it-prism, 2. self, 3. markdown-it-attrs,`, () => {
      const src = '```js {data-attr1="value1" data-attr2="value2"}\n```';
      const expected = `<pre class="language-js"><code data-attr1="value1" data-attr2="value2" tabindex="0" class="language-js"></code></pre>`;

      const md = markdownIt()
        .use(markdownItPrism)
        .use(markdownItCodeTabIndex, { target: 'code' })
        .use(markdownItAttributes);
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    test(`1. self, 2. markdown-it-attrs, 3. markdown-it-prism,`, () => {
      const src = '```js {data-attr1="value1" data-attr2="value2"}\n```';
      const expected = `<pre class="language-js"><code data-attr1="value1" data-attr2="value2" tabindex="0" class="language-js"></code></pre>`;

      const md = markdownIt()
        .use(markdownItCodeTabIndex, { target: 'code' })
        .use(markdownItAttributes)
        .use(markdownItPrism);
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
    test(`1. self, 2. markdown-it-prism, 3. markdown-it-attrs`, () => {
      const src = '```js {data-attr1="value1" data-attr2="value2"}\n```';
      const expected = `<pre class="language-js"><code data-attr1="value1" data-attr2="value2" tabindex="0" class="language-js"></code></pre>`;

      const md = markdownIt()
        .use(markdownItCodeTabIndex, { target: 'code' })
        .use(markdownItPrism)
        .use(markdownItAttributes);
      expect(md.render(src).trim()).toStrictEqual(expected);
    });
  });
});
