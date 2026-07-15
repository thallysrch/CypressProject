const fs = require('fs');
const path = require('path');

const reportsDir = path.resolve(__dirname, '../cypress/reports');
const mergedPath = path.join(reportsDir, 'merged.json');
const cssPath = path.resolve(__dirname, './templates/executive-report.css');

if (!fs.existsSync(mergedPath)) {
  console.error('Merged report not found. Run report:merge before report:executive.');
  process.exit(1);
}

const merged = JSON.parse(fs.readFileSync(mergedPath, 'utf-8'));
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';

const stats = merged.stats || {};
const totalTests = stats.tests || 0;
const passed = stats.passes || 0;
const failed = stats.failures || 0;
const skipped = (stats.pending || 0) + (stats.skipped || 0);
const durationSeconds = Number(((stats.duration || 0) / 1000).toFixed(2));
const passRate = totalTests > 0 ? Number(((passed / totalTests) * 100).toFixed(2)) : 0;
const runAt = stats.start ? new Date(stats.start).toISOString() : new Date().toISOString();

const failures = [];
for (const result of merged.results || []) {
  for (const suite of result.suites || []) {
    for (const test of suite.tests || []) {
      if (test.fail) {
        failures.push({
          suite: suite.fullFile || suite.title || 'Suite',
          test: test.fullTitle || test.title || 'Unnamed test',
          error: test.err?.message || test.fail.message || 'No error message',
        });
      }
    }
  }
}

const markdownLines = [
  '# Executive Test Summary',
  '',
  `- Run at: ${runAt}`,
  `- Total tests: ${totalTests}`,
  `- Passed: ${passed}`,
  `- Failed: ${failed}`,
  `- Skipped/Pending: ${skipped}`,
  `- Pass rate: ${passRate}%`,
  `- Duration (s): ${durationSeconds}`,
  '',
  '## Technical quality gate',
  failed === 0 ? '- Status: APPROVED' : '- Status: REQUIRES ATTENTION',
  '',
  '## Top failures',
];

if (failures.length === 0) {
  markdownLines.push('- No failed tests in this execution.');
} else {
  failures.slice(0, 15).forEach((failure, index) => {
    markdownLines.push(`${index + 1}. ${failure.test}`);
    markdownLines.push(`   - Suite: ${failure.suite}`);
    markdownLines.push(`   - Error: ${failure.error.replace(/\n/g, ' ')}`);
  });
}

const markdownPath = path.join(reportsDir, 'executive-summary.md');
fs.writeFileSync(markdownPath, markdownLines.join('\n'));

const failureRows = failures
  .slice(0, 20)
  .map(
    (failure) =>
      `<tr><td>${escapeHtml(failure.suite)}</td><td>${escapeHtml(failure.test)}</td><td>${escapeHtml(
        failure.error
      )}</td></tr>`
  )
  .join('');

const statusClass = failed === 0 ? 'status-passed' : 'status-failed';
const statusText = failed === 0 ? 'APPROVED' : 'REQUIRES ATTENTION';

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Executive Test Summary</title>
    <style>${css}</style>
  </head>
  <body>
    <div class="card">
      <h1>Executive Test Summary</h1>
      <p>Run at ${runAt}</p>
      <div class="kpi-grid">
        <div class="kpi"><strong>${totalTests}</strong><small>Total tests</small></div>
        <div class="kpi"><strong>${passed}</strong><small>Passed</small></div>
        <div class="kpi"><strong>${failed}</strong><small>Failed</small></div>
        <div class="kpi"><strong>${passRate}%</strong><small>Pass rate</small></div>
        <div class="kpi"><strong>${durationSeconds}s</strong><small>Duration</small></div>
      </div>
    </div>

    <div class="card">
      <h2>Quality gate</h2>
      <p class="${statusClass}">${statusText}</p>
      <p>This summary is generated automatically from mochawesome merged JSON.</p>
    </div>

    <div class="card">
      <h2>Top failures</h2>
      <table>
        <thead>
          <tr>
            <th>Suite</th>
            <th>Test</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          ${
            failureRows ||
            '<tr><td colspan="3" class="status-passed">No failed tests in this execution.</td></tr>'
          }
        </tbody>
      </table>
    </div>
  </body>
</html>`;

const htmlPath = path.join(reportsDir, 'executive-report.html');
fs.writeFileSync(htmlPath, html);

console.log('Executive reports generated:');
console.log(`- ${markdownPath}`);
console.log(`- ${htmlPath}`);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
