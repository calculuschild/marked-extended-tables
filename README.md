# marked-extended-tables
Extends the standard [Github-Flavored tables](https://github.github.com/gfm/#tables-extension-) to support advanced features:

  - Column Spanning
  - Row Spanning
  - Multi-row headers

## Column Spanning
Easily denote cells that should span multiple columns by grouping multiple pipe `|` characters at the end of the cell:

```
| H1      | H2      | H3      |
|---------|---------|---------|
| This cell spans 3 columns |||
```

## Row Spanning
Easily denote cells that should span across the previous row by inserting a caret `^` character immediately before the closing pipes:

```
| H1           | H2      |
|--------------|---------|
| This cell    | Cell A  |
| spans three ^| Cell B  |
| rows        ^| Cell C  |
```

Cell contents across rows will be concatenated together with a single whitespace character ` `. Note that cells can only span multiple rows if they have the same column span.

## Multi-row headers
Headers can now follow the same structure as cells, to include multiple rows, and also support row and column spans.

```
| This header spans two   || Header A |
| columns *and* two rows ^|| Header B |
|-------------|------------|----------|
| Cell A      | Cell B     | Cell C   |
```

## Column widths
Column widths may be set by percentage. At least one hyphen on is required on each side of the width value. Padding around the width value with any number of spaces is allowed: `|-10%-|` or `|- 10% -|`.

```
|Column One|Column Two|Column Three|
|--10%-----|-- 40% ---|:---50%-----|
```

# Usage
<!-- Show most examples of how to use this extension -->

```js
const marked = require("marked");
const extendedTables = require("marked-extended-tables");

// or ES Module script
// import marked from "https://cdn.jsdelivr.net/gh/markedjs/marked/lib/marked.esm.js";
// import this extension from "https://cdn.jsdelivr.net/gh/calculuschild/marked-extended-tables/lib/index.mjs";

marked.use(extendedTables(options));

const html = marked.parse("| spanned header ||\n|----|----|\n|cell 1|cell 2|");
console.log(html);
// <table>
//   <thead>
//     <tr><th colspan="2">spanned header</th></tr>
//   </thead>
//   <tbody>
//     <tr><td>cell 1</td><td>cell 2</td></tr>
//   </tbody>
// </table>
```

## `options`

| option            |  type        | default | description |
|-------------------|--------------|---------|:------------|
| interruptPatterns | string array |  `[]`   | Array of any string patterns (regex strings allowed) that should interrupt parsing of a table. For example, the start of another Markdown token that should not be interpreted as a new row in the table |
| skipEmptyRows     | bool         | `true`  | If every cell in a row has been merged into the previous row via the rowspan `^` syntax, this will leave an empty `<tr>` row in the table with no `<td>` or other content. By default, empty rows will simply be removed from the output. Setting this option to `false` will retain the empty rows. |
