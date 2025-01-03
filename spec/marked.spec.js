import { runAllMarkedSpecTests } from '@markedjs/testutils';
import extendedTable from '../src/index.js';

runAllMarkedSpecTests({ addExtension: (marked) => { marked.use(extendedTable()); }, outputCompletionTables: true });
