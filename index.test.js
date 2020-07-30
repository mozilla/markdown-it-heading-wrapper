const { stripIndent } = require('common-tags');
const md = require('markdown-it');

let markdown;

describe('Full config', () => {
  beforeAll(() => {
    markdown = md({
      html: true,
    }).use(require('./index.js'), {
      h1: {
        before: '<section><!-- open h1 section -->',
        after: '</section><!-- close h1 section -->',
      },
      h2: {
        before: '<section><!-- open h2 section -->',
        after: '</section><!-- close h2 section -->',
      },
      h3: {
        before: '<section><!-- open h3 section -->',
        after: '</section><!-- close h3 section -->',
      },
      h4: {
        before: '<section><!-- open h4 section -->',
        after: '</section><!-- close h4 section -->',
      },
      h5: {
        before: '<section><!-- open h5 section -->',
        after: '</section><!-- close h5 section -->',
      },
      h5: {
        before: '<section><!-- open h6 section -->',
        after: '</section><!-- close h6 section -->',
      },
    });
  });

  it('wraps headings', () => {
    const sampleMarkdown = stripIndent`
      # Heading level 1

      This is some markup

      ## Heading level 2

      This is some more markup

      ### Heading level 3

      Something else

      ## Heading level 2

      Some more content`;

    const expected = stripIndent`
      <section><!-- open h1 section -->
      <h1>Heading level 1</h1>
      <p>This is some markup</p>
      <section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      <p>This is some more markup</p>
      <section><!-- open h3 section -->
      <h3>Heading level 3</h3>
      <p>Something else</p>
      </section><!-- close h3 section -->
      </section><!-- close h2 section -->
      <section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      <p>Some more content</p>
      </section><!-- close h2 section -->
      </section><!-- close h1 section -->`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });

  it('handles bad heading order', () => {
    const sampleMarkdown = stripIndent`
      ## Heading level 2

      This is some markup

      # Heading level 1

      This is some more markup`;

    const expected = stripIndent`
      <section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      <p>This is some markup</p>
      </section><!-- close h2 section -->
      <section><!-- open h1 section -->
      <h1>Heading level 1</h1>
      <p>This is some more markup</p>
      </section><!-- close h1 section -->`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });

  it('handles nesting', () => {
    const sampleMarkdown = stripIndent`
      * List item 1
        ## Heading level 2
      * List item 2
        ### Heading level 3
        Some text`;

    const expected = stripIndent`
      <ul>
      <li>List item 1<section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      </section><!-- close h2 section -->
      </li>
      <li>List item 2<section><!-- open h3 section -->
      <h3>Heading level 3</h3>
      Some text</section><!-- close h3 section -->
      </li>
      </ul>`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });

  it('handles headings in block quotes', () => {
    const sampleMarkdown = stripIndent`
      > This is a block quote
      > #### This is a heading
      > This is some more text`;

    const expected = stripIndent`
      <blockquote>
      <p>This is a block quote</p>
      <section><!-- open h4 section -->
      <h4>This is a heading</h4>
      <p>This is some more text</p>
      </section><!-- close h4 section -->
      </blockquote>`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });
});

describe('Partial config', () => {
  beforeAll(() => {
    markdown = md({
      html: true,
    }).use(require('./index.js'), {
      h2: {
        before: '<section><!-- open h2 section -->',
        after: '</section><!-- close h2 section -->',
      },
    });
  });

  it('wraps headings', () => {
    const sampleMarkdown = stripIndent`
      # Heading level 1

      This is some markup

      ## Heading level 2

      This is some more markup

      ### Heading level 3

      Something else

      ## Heading level 2

      Some more content`;

    const expected = stripIndent`
      <h1>Heading level 1</h1>
      <p>This is some markup</p>
      <section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      <p>This is some more markup</p>
      <h3>Heading level 3</h3>
      <p>Something else</p>
      </section><!-- close h2 section -->
      <section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      <p>Some more content</p>
      </section><!-- close h2 section -->`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });

  it('handles bad heading order only for configured headings', () => {
    const sampleMarkdown = stripIndent`
      ## Heading level 2

      This is some markup

      # Heading level 1

      This is some more markup`;

    const expected = stripIndent`
      <section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      <p>This is some markup</p>
      </section><!-- close h2 section -->
      <h1>Heading level 1</h1>
      <p>This is some more markup</p>`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });

  it('handles nesting only for configured headings', () => {
    const sampleMarkdown = stripIndent`
      * List item 1
        ## Heading level 2
      * List item 2
        ### Heading level 3
        Some text`;

    const expected = stripIndent`
      <ul>
      <li>List item 1<section><!-- open h2 section -->
      <h2>Heading level 2</h2>
      </section><!-- close h2 section -->
      </li>
      <li>List item 2
      <h3>Heading level 3</h3>
      Some text</li>
      </ul>`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });

  it('handles headings only configured headings in block quotes', () => {
    const sampleMarkdown = stripIndent`
      > This is a block quote
      > ## This is a heading
      > This is some more text
      > ### This is another heading`;

    const expected = stripIndent`
      <blockquote>
      <p>This is a block quote</p>
      <section><!-- open h2 section -->
      <h2>This is a heading</h2>
      <p>This is some more text</p>
      <h3>This is another heading</h3>
      </section><!-- close h2 section -->
      </blockquote>`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });
});

describe('Other plugins', () => {
  beforeAll(() => {
    markdown = md({
      html: true,
    })
      .use(require('markdown-it-anchor'))
      .use(require('./index.js'), {
        h2: {
          before: '<section><!-- open h2 section -->',
          after: '</section><!-- close h2 section -->',
        },
      });
  });

  it('wraps headings without causing problems with other plugins', () => {
    const sampleMarkdown = stripIndent`
      # Heading level 1

      This is some markup

      ## Heading level 2

      This is some more markup

      ### Heading level 3

      Something else

      ## Heading level 2

      Some more content`;

    const expected = stripIndent`
      <h1 id="heading-level-1">Heading level 1</h1>
      <p>This is some markup</p>
      <section><!-- open h2 section -->
      <h2 id="heading-level-2">Heading level 2</h2>
      <p>This is some more markup</p>
      <h3 id="heading-level-3">Heading level 3</h3>
      <p>Something else</p>
      </section><!-- close h2 section -->
      <section><!-- open h2 section -->
      <h2 id="heading-level-2-2">Heading level 2</h2>
      <p>Some more content</p>
      </section><!-- close h2 section -->`;

    const rendered = markdown.render(sampleMarkdown).trim();
    expect(rendered).toEqual(expected);
  });
});
