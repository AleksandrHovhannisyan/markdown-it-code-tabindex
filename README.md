# markdown-it-code-tabindex

Add `tabindex="0"` to your fenced code blocks in [`markdown-it`](https://github.com/markdown-it/markdown-it) for keyboard accessibility.

## Installation

```
npm i markdown-it-code-tabindex
```

## Usage

Refer to the [`markdown-it` docs on loading plugins](https://github.com/markdown-it/markdown-it#plugins-load).

### Options

| Name    | Description                                                                                                                                  | Type           | Default |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------- |
| `target` | The HTML tag on which to set `tabindex="0"` for fenced code blocks. Either one is fine, so long as you pick the right one based on your CSS. | `'pre'\|'code'` | `'pre'` |

### Examples

#### Basic usage

```js
const markdownIt = require('markdown-it');
const markdownItTabIndex = require('markdown-it-code-tabindex');

const md = markdownIt().use(markdownItTabIndex, {
  target: 'code', // or 'pre'
});
```

#### Usage with other plugins

```js
const markdownIt = require('markdown-it');
const markdownItAttributes = require('markdown-it-attrs');
const markdownItPrism = require('markdown-it-prism');
const markdownItCodeTabIndex = require('markdown-it-code-tabindex');

const md = 
  markdownIt()
  .use(markdownItPrism)
  .use(markdownItAttributes)
  // Order does not matter; this could go before other plugins
  .use(markdownItCodeTabIndex, { target: 'code' });
```

## Motivation

There are two ways to handle long lines of text in fenced code blocks (and in general):

1. Allow whitespace to wrap to the next line whenever the current line would overflow.
2. Prevent whitespace from wrapping and set `overflow-x: auto` on your code block.

Which one you choose comes down to personal preference, but scrollable code blocks tend to be more common. However, there is one drawback to this approach: Scroll regions are not accessible to keyboard users unless they are focusable. And the only way to make them focusable is to set `tabindex="0"` on those scroll containers. However, there isn't a straightforward way to do this in Markdown.

This plugin automatically adds `tabindex="0"` to all of your fenced code blocks in [`markdown-it`](https://github.com/markdown-it/markdown-it). It does not modify inline code, nor does it remove or modify any other HTML attributes.

## Compatibility with Other `markdown-it` Plugins

This plugin is compatible with the following `markdown-it` plugins:

- [`markdown-it-attrs`](https://github.com/arve0/markdown-it-attrs)
- [`markdown-it-prism`](https://github.com/jGleitz/markdown-it-prism)

The order in which you load these plugins does not matter.

