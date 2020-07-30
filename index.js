function headingWrapperPlugin(md, options) {
  const opts = Object.assign({}, options);

  function lastItem(arr) {
    return arr[arr.length - 1];
  }

  function headingWrapper(state) {
    const tokens = [];
    const sections = [];
    let token;
    let Token = state.Token;
    let nestingLevel = 0;

    function getWrapperOpen(headerTag) {
      const token = new Token('heading_wrapper_open', '', 1);
      token.heading_wrapper_relation = headerTag;
      return token;
    }

    function getWrapperClose(headerTag) {
      const token = new Token('heading_wrapper_close', '', -1);
      token.heading_wrapper_relation = headerTag;
      return token;
    }

    function closeOpenWrappersToNesting(nestingLevel) {
      while (
        sections.length &&
        nestingLevel < lastItem(sections).nestingLevel
      ) {
        const poppedSection = sections.pop();
        if (opts[poppedSection.headerTag]) {
          tokens.push(getWrapperClose(poppedSection.headerTag));
        }
      }
    }

    function closeOpenWrappers(section) {
      while (
        sections.length &&
        section.headerTag.charAt(1) <= lastItem(sections).headerTag.charAt(1)
      ) {
        const poppedSection = sections.pop();
        if (opts[poppedSection.headerTag]) {
          tokens.push(getWrapperClose(poppedSection.headerTag));
        }
      }
    }

    function closeAllOpenWrappers(section) {
      let poppedSection;
      while ((poppedSection = sections.pop())) {
        if (opts[poppedSection.headerTag]) {
          tokens.push(getWrapperClose(poppedSection.headerTag));
        }
      }
    }

    for (let i = 0, l = state.tokens.length; i < l; i++) {
      token = state.tokens[i];

      if (token.type.indexOf('heading') !== 0) {
        nestingLevel += token.nesting;
      }

      closeOpenWrappersToNesting(nestingLevel);

      if (token.type === 'heading_open') {
        const section = {
          headerTag: token.tag,
          nestingLevel: nestingLevel,
        };
        closeOpenWrappers(section);
        if (opts[token.tag]) {
          tokens.push(getWrapperOpen(token.tag));
          sections.push(section);
        }
      }
      tokens.push(token);
    }

    // Close all open wrappers from h6 -> h1.
    closeAllOpenWrappers();

    state.tokens = tokens;
  }

  md.renderer.rules.heading_wrapper_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    return `${opts[token.heading_wrapper_relation].before}\n`;
  };

  md.renderer.rules.heading_wrapper_close = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    return `${opts[token.heading_wrapper_relation].after}\n`;
  };

  md.core.ruler.push('heading_wrapper', headingWrapper);
}

module.exports = headingWrapperPlugin;
