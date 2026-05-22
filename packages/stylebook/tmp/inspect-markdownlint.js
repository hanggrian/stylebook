import { lint } from 'markdownlint/sync';
import markdownIt from 'markdown-it';
import stylebookMarkdown from '@hanggrian/stylebook';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync('resources/markdownlint-cli2.json','utf8'));
const res = lint({ files: ['../../sample/markdown/unnecessary-leading-blank-line.md'], config: cfg, customRules: stylebookMarkdown, markdownItFactory: () => markdownIt({ html: true }) });

for (const [filePath, errors] of Object.entries(res)) {
  console.log('FILE:', filePath);
  console.log('ERRORS:', errors.map(e=>({lineNumber:e.lineNumber,errorDetail:e.errorDetail,ruleNames:e.ruleNames})));
}

const raw = readFileSync('../../sample/markdown/unnecessary-leading-blank-line.md', 'utf8');
console.log('RAW START---');
console.log(JSON.stringify(raw.split('\n').slice(0,10), null, 2));
console.log('RAW END---');
