import { marked } from 'marked';
import extendedTable from '../src/index.js';

function trimLines(s) {
  return s.split('\n').map(l => l.trim()).join('\n');
}

describe('extended-table', () => {
  let startTime;

  beforeEach(() => {
    marked.setOptions(marked.getDefaults());
    startTime = new Date().getTime();
  });

  afterEach(() => {
    const elapsed = new Date().getTime() - startTime;
    if (elapsed > 50)
      throw new Error(`Test took too long: ${elapsed} ms`);
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
    marked.use(extendedTable({ skipEmptyRows: false }));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Row Merging - skipEmptyRows: true', () => {
    marked.use(extendedTable({ skipEmptyRows: true }));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Row Merging - config empty', () => {
    marked.use(extendedTable({}));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      | 1                ^| Cell B ^|
      |                  ^|        ^|
    `))).toMatchSnapshot();
  });

  test('Incomplete Row', () => {
    marked.use(extendedTable({}));
    expect(marked(trimLines(`
      | H1                | H2      |
      |-------------------|---------|
      | Merge empty rows  | Cell A  |
      |
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
    marked.use(extendedTable({interruptPatterns : ['aaaa']}));
    expect(marked(trimLines(`
      | Header A | Header B |
      |----------|----------|
      | Cell A   | Cell B   |
      aaaa
    `))).toMatchSnapshot();
  });

  test('Stops at custom multiline terminators', () => {
    marked.use(extendedTable({interruptPatterns : ['aaaa\nbbbb']}));
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

  test('No catastophic backtracking for bad delimiter row', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      | Header A | Header B | Header C | Header D | Header E | Header F | Header G | Header H |
      |:---10%---|:--------:|---------:|:--------:|:--------:|:--------:|:--------:|:-------- :|
      | Cell A   | Cell B   | Cell C   | Cell D   | Cell E   | Cell F   | Cell G   | Cell H   |
    `))).toMatchSnapshot();
  });

  test('Works with text immediately before', () => {
    marked.use(extendedTable());
    expect(marked(trimLines(`
      12
      | A     | B |
      |:-20%-:|:--:|
      | A1    | B1 |
    `))).toMatchSnapshot();
  });

  test('Colgroups added to header', () => {
    marked.use(extendedTable({ colGroups: true }));
    expect(marked(trimLines(`
      | Header A | Header B |
      |----------|----------|
      | Cell A   | Cell B   |
      aaaa
      bbbb
      cccc
    `))).toMatchSnapshot();
  });
});
