# markdown-it-heading-wrapper

[![CircleCI](https://circleci.com/gh/mozilla/markdown-it-heading-wrapper.svg?style=svg)](https://circleci.com/gh/mozilla/eslint-config-amo)

A plugin very much inspired by and based on [markdown-it-header-sections](https://github.com/arve0/markdown-it-header-sections),
albeit in this case it's designed to allow for arbitrary markup wrappers
rather than just a single `section`.

The idea behind this is to allow a document author to focus on pure
documentation and to have the renderer add boilerplate markup to affect a
specific layout.

## Usage

```js
  markdown = md({
    html: true,
  }).use(require('markdown-it-heading-wrapper'), {
    h1: {
      before: '<section>',
      after: '</section>',
    },
  });
```
