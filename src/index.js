/**
 * @typedef MarkdownItCodeTabIndexOptions
 * @property {'pre'|'code'} [target] The tag on which to set the `tabindex` attribute. Default: `'pre'`.
 */

/** Default renderer for tokens that don't match fenced code blocks.
 * Docs: https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md#reusing-existing-rules
 * @type {import('markdown-it/lib/renderer.mjs').RenderRule}
 */
const defaultRenderToken = (tokens, index, options, env, self) =>
  self.renderToken(tokens, index, options);

/** Returns a markdown-it Renderer that adds tabindex="0" to fenced code blocks.
 * @param {RenderRule} existingRenderer An existing renderer function for fenced code blocks.
 * @param {MarkdownItCodeTabIndexOptions} pluginOptions Options for this plugin (defaults merged with user-supplied options).
 */
const makeTabIndexRenderer = (existingRenderer, pluginOptions) => {
  /** @type {import('markdown-it/lib/renderer.mjs').RenderRule} */
  return (tokens, index, renderOptions, env, self) => {
    const token = tokens[index];
    switch (pluginOptions.target) {
      // <code tabindex="0">
      case "code": {
        // Just in case the code tag somehow already has a tabindex attribute on it
        const tabindex = token.attrGet("tabindex") || "0";
        token.attrSet("tabindex", tabindex);
        return existingRenderer(tokens, index, renderOptions, env, self);
      }
      // <pre tabindex="0">
      case "pre": {
        const defaultOutput = existingRenderer(
          tokens,
          index,
          renderOptions,
          env,
          self,
        );
        // Match any <pre> tag, preserving existing attributes/whitespace and adding tabindex
        return defaultOutput.replace(/<(pre[^>]*?)>/g, `<$1 tabindex="0">`);
      }
      default: {
        throw new Error(`Unrecognized target value: ${pluginOptions.target}`);
      }
    }
  };
};

/** @type {MarkdownItCodeTabIndexOptions} */
const defaultOptions = {
  target: "pre",
};

/** Ensures that fenced code blocks get `tabindex="0"` for keyboard accessibility.
 * @param {import('markdown-it')} md The markdown-it instance to customize.
 * @param {MarkdownItCodeTabIndexOptions} userSuppliedOptions
 */
const markdownItCodeTabIndex = (md, userSuppliedOptions) => {
  const options = { ...defaultOptions, ...userSuppliedOptions };
  // Preserve existing renderers for fenced code tokens
  const defaultFencedCodeRenderer =
    md.renderer.rules.fence || defaultRenderToken;
  md.renderer.rules.fence = makeTabIndexRenderer(
    defaultFencedCodeRenderer,
    options,
  );
};

export default markdownItCodeTabIndex;
