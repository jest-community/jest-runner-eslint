const fs = require('fs');
const semver = require('semver');
const { version } = require('jest/package.json');

// Jest v30 changed the snapshot header link
const headerLink = semver.satisfies(version, '30')
  ? 'https://jestjs.io/docs/snapshot-testing'
  : 'https://goo.gl/fbAQLP';

for (const file of fs.readdirSync('./integrationTests/__snapshots__')) {
  const content = fs.readFileSync(
    `./integrationTests/__snapshots__/${file}`,
    'utf-8',
  );

  fs.writeFileSync(
    `./integrationTests/__snapshots__/${file}`,
    `// Jest Snapshot v1, ${headerLink}` + content.slice(content.indexOf('\n')),
    'utf-8',
  );
}

// Jest v30.1.0 apparently removed a newline from its github actions reporter
const ghaSnapshotContent = fs.readFileSync(
  './integrationTests/__snapshots__/github-actions.test.js.snap',
  'utf-8',
);

const extraContent = semver.lt(version, '30.1.0') ? '%0A' : '';

fs.writeFileSync(
  './integrationTests/__snapshots__/github-actions.test.js.snap',
  ghaSnapshotContent
    .replace(/is not defined.%0A%0A/g, 'is not defined.%0A')
    .replace(/is not defined.%0A/g, 'is not defined.%0A' + extraContent),
  'utf-8',
);
