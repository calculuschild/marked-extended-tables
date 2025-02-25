import { marked } from 'marked';
import extendedTable from '../src/index.js';

function trimLines(s) {
  return s.split('\n').map(l => l.trim()).join('\n');
}

describe('extended-table', () => {
  beforeEach(() => {
    marked.setOptions(marked.getDefaults());
  });

  test('Column Spanning', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | H1      | H2      | H3      |
      |---------|---------|---------|
      | This cell spans 3 columns |||
    `))).toMatchSnapshot();
  });

  test('Row Spanning', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | H1           | H2      |
      |--------------|---------|
      | This cell    | Cell A  |
      | spans three ^| Cell B  |
      | rows        ^| Cell C  |
    `))).toMatchSnapshot();
  });

  test('Row Merging - skipEmptyRows: default', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Row Merging - skipEmptyRows: false', () => {
    marked.use(extendedTable(undefined, { skipEmptyRows: false }));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Row Merging - skipEmptyRows: true', () => {
    marked.use(extendedTable(undefined, { skipEmptyRows: true }));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Row Merging - config empty', () => {
    marked.use(extendedTable(undefined, {}));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Multi-row headers', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | This header spans two   || Header A |
      | columns *and* two rows ^|| Header B |
      |-------------|------------|----------|
      | Cell A      | Cell B     | Cell C   |
    `))).toMatchSnapshot();
  });

  test('Stops at custom terminators', () => {
    marked.use(extendedTable(['aaaa']));
    expect(marked(trimLines(`
      | Header A | Header B |
      |----------|----------|
      | Cell A   | Cell B   |
      aaaa
    `))).toMatchSnapshot();
  });

  test('Stops at custom multiline terminators', () => {
    marked.use(extendedTable(['aaaa\nbbbb']));
    expect(marked(trimLines(`
      | Header A | Header B |
      |----------|----------|
      | Cell A   | Cell B   |
      aaaa
      bbbb
      cccc
    `))).toMatchSnapshot();
  });

  test('Works with minimal delimiter rows', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | Header A | Header B | Header C | Header D |
      |-|:-|-:|:-:|
      | Cell A   | Cell B   | Cell C   | Cell D   |
    `))).toMatchSnapshot();
  });

  test('Works with percentage widths', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | Header A |
      |---10%----|
      | Cell A   |
    `))).toMatchSnapshot();
  });

  test('Works with mix of widths and not', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | Header A | Header B | Header C |
      |---10%----|----------|--- 50% --|
      | Cell A   | Cell B   | Cell C   |
    `))).toMatchSnapshot();
  });

  test('Works with combined widths and alignment', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | Header A | Header B | Header C |
      |:---10%---|:-- 20% -:|---50%---:|
      | Cell A   | Cell B   | Cell C   |
    `))).toMatchSnapshot();
  });
});
