// Renders the README hero image: a styled mock of an MCP client (Claude) calling
// this server's `get_experience` tool. Dependency-free: builds an HTML document
// and screenshots it with headless Chrome or Edge (auto-detected on Windows).
//
// Usage:
//   node scripts/generate-hero.mjs
// Output:
//   docs/images/demo.png
//
// The transcript mirrors the "See it in action" example in the README, so the
// hero stays in sync with the documented behavior.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'docs/images');
const outPng = resolve(outDir, 'demo.png');
const htmlPath = resolve(outDir, '.hero.html');
mkdirSync(outDir, { recursive: true });

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #0d1117; }
  body { font-family: -apple-system, "Segoe UI", system-ui, sans-serif; padding: 40px; width: 960px; }
  .card { background: #161b22; border: 1px solid #30363d; border-radius: 14px; overflow: hidden; box-shadow: 0 18px 50px rgba(0,0,0,.45); }
  .bar { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 1px solid #30363d; background: #1c2128; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .r { background: #ff5f57; } .y { background: #febc2e; } .g { background: #28c840; }
  .bar .title { margin-left: 10px; color: #8b949e; font-size: 13px; font-weight: 500; letter-spacing: .2px; }
  .bar .badge { margin-left: auto; font-size: 12px; color: #c9d1d9; background: #21262d; border: 1px solid #30363d; padding: 4px 10px; border-radius: 999px; }
  .body { padding: 26px 30px 30px; }
  .turn { display: flex; gap: 14px; margin-bottom: 22px; }
  .avatar { flex: 0 0 30px; width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; }
  .you .avatar { background: #2f81f7; }
  .claude .avatar { background: #d97757; }
  .who { color: #8b949e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 7px; }
  .msg { color: #e6edf3; font-size: 17px; line-height: 1.55; }
  .toolcall { display: inline-flex; align-items: center; gap: 8px; margin: 4px 0 14px; font-family: "Cascadia Code", "SF Mono", Consolas, monospace; font-size: 13px; color: #7ee787; background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 7px 12px; }
  .toolcall .tag { color: #8b949e; }
  ul { list-style: none; margin: 10px 0 0; }
  li { color: #c9d1d9; font-size: 15.5px; line-height: 1.5; padding: 4px 0 4px 18px; position: relative; }
  li::before { content: "–"; position: absolute; left: 0; color: #6e7681; }
  li b { color: #e6edf3; font-weight: 600; }
</style></head><body>
  <div class="card">
    <div class="bar">
      <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
      <span class="title">Claude  ·  derek (MCP server)</span>
      <span class="badge">Model Context Protocol</span>
    </div>
    <div class="body">
      <div class="turn you">
        <div class="avatar">You</div>
        <div>
          <div class="who">You</div>
          <div class="msg">What has Derek done with RAG?</div>
        </div>
      </div>
      <div class="turn claude">
        <div class="avatar">C</div>
        <div>
          <div class="who">Claude</div>
          <div class="toolcall"><span class="tag">calls</span> get_experience { "skill": "RAG" }</div>
          <div class="msg">Three RAG engagements stand out:</div>
          <ul>
            <li><b>PG&amp;E GenAI Regulatory Chatbot</b> (Azure OpenAI + Azure AI Search)</li>
            <li><b>HarperCollins Book Catalog RAG Chatbot</b> (semantic search over 500 books)</li>
            <li>A hospital document-processing proof of concept</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</body></html>`;

writeFileSync(htmlPath, html, 'utf8');

const candidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('ERROR: could not find Chrome or Edge. Set CHROME_PATH or install one.');
  process.exit(2);
}

const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/ /g, '%20');
const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=2',
  '--window-size=1040,476',
  `--screenshot=${outPng}`,
  fileUrl,
];
let res = spawnSync(browser, args, { encoding: 'utf8' });
if (res.status !== 0 && !existsSync(outPng)) {
  res = spawnSync(browser, ['--headless', ...args.slice(1)], { encoding: 'utf8' });
}
rmSync(htmlPath, { force: true });
if (!existsSync(outPng)) {
  console.error('ERROR: screenshot failed.');
  console.error(res.stderr || '');
  process.exit(3);
}
console.log('Wrote', outPng);
