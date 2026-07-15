const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const mode = process.argv[2] || 'all';
const passthroughArgs = process.argv.slice(3);

const reportsDir = path.resolve(__dirname, '../cypress/reports');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const rawScriptMap = {
  all: 'cypress:raw',
  api: 'cypress:raw:api',
  frontend: 'cypress:raw:frontend',
};

const rawScript = rawScriptMap[mode];
if (!rawScript) {
  console.error(`Invalid mode: ${mode}. Use one of: all, api, frontend.`);
  process.exit(1);
}

prepareReportsDir(reportsDir);

const cypressExitCode = runNpmScript(rawScript, passthroughArgs);
const reportExitCode = generateReportsIfPossible(reportsDir);

if (cypressExitCode !== 0) {
  process.exit(cypressExitCode);
}

process.exit(reportExitCode);

function prepareReportsDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function runNpmScript(scriptName, args = []) {
  const result = spawnSync(npmCmd, ['run', scriptName, '--', ...args], {
    stdio: 'inherit',
    shell: false,
  });

  if (typeof result.status === 'number') {
    return result.status;
  }

  return 1;
}

function generateReportsIfPossible(dir) {
  const jsonFiles = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name);

  if (jsonFiles.length === 0) {
    console.warn('No mochawesome JSON files found. HTML report generation skipped.');
    return 0;
  }

  const mergeCode = runNpmScript('report:merge');
  if (mergeCode !== 0) {
    return mergeCode;
  }

  const generateCode = runNpmScript('report:generate');
  if (generateCode !== 0) {
    return generateCode;
  }

  return runNpmScript('report:executive');
}
