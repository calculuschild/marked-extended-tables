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

  test('Drops empty TRs in multiple tbody Mode', () => {
    marked.use(extendedTable());
    extendedTable().extensions[0].setMode(false);
    expect(marked(trimLines(`
      | Race     | Multi-class options                                         |
      |:---------|:------------------------------------------------------------|
      | Dwarf    | fighter/cleric, fighter/thief                               |
      | Elf      | fighter/mage, fighter/thief, mage/thief,                    |
      |         ^| fighter/mage/thief                                         ^|
      | Gnome    | fighter/thief, fighter/cleric, fighter/illusionist,         | 
      |         ^| thief/cleric, thief/illusionist, cleric/illusionist        ^|
      | Half-elf | fighter/priest, fighter/mage, fighter/thief, ranger/priest, |
      |         ^| mage/priest, mage/thief,                                   ^|
      |         ^| fighter/mage/priest, fighter/mage/thief                    ^|
      | Halfling | fighter/thief                                               |
      | Human    | none                                                        |
    `))).toMatchSnapshot();
  });

  test('Leave empty TRs in single tbody Mode', () => {
    marked.use(extendedTable());
    extendedTable().extensions[0].setMode(true);
    expect(marked(trimLines(`
      | Race     | Multi-class options                                         |
      |:---------|:------------------------------------------------------------|
      | Dwarf    | fighter/cleric, fighter/thief                               |
      | Elf      | fighter/mage, fighter/thief, mage/thief,                    |
      |         ^| fighter/mage/thief                                         ^|
      | Gnome    | fighter/thief, fighter/cleric, fighter/illusionist,         | 
      |         ^| thief/cleric, thief/illusionist, cleric/illusionist        ^|
      | Half-elf | fighter/priest, fighter/mage, fighter/thief, ranger/priest, |
      |         ^| mage/priest, mage/thief,                                   ^|
      |         ^| fighter/mage/priest, fighter/mage/thief                    ^|
      | Halfling | fighter/thief                                               |
      | Human    | none                                                        |
    `))).toMatchSnapshot();
  });
});
