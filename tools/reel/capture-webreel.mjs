#!/usr/bin/env node
/*
 * capture-webreel.mjs — render the deterministic reel template (web/reel.html) to a PNG
 * frame sequence by stepping window.__seek(tMs) frame by frame over headless Chrome.
 *
 * Same no-dependency DevTools-protocol approach as capture-screens.mjs (needs Node 22+).
 * gen_webreel.py calls this after it has synthesized the Kokoro audio and written the
 * per-scene timings, so every frame lands exactly where the narration expects it.
 *
 * Usage:
 *   node capture-webreel.mjs <template.html> <spec.json> <timings.json> --out <framesDir>
 *
 * timings.json: { fps, width, height, total, scenes:[{start,dur}, …] }  (all ms)
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
if (args.length < 3) { console.error('usage: capture-webreel.mjs <template.html> <spec.json> <timings.json> --out <dir>'); process.exit(2); }
const tpl = resolve(args[0]), specPath = resolve(args[1]), timPath = resolve(args[2]);
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : undefined; };
const outDir = resolve(opt('--out') || 'frames');

const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const tim = JSON.parse(readFileSync(timPath, 'utf8'));
const FPS = tim.fps || 30, W = tim.width || 1080, H = tim.height || 1920;
const frameMs = 1000 / FPS;
const nFrames = Math.max(1, Math.round((tim.total / 1000) * FPS));

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const exe = BROWSERS.find((p) => existsSync(p));
if (!exe) { console.error('No Chrome/Edge found; set CHROME_PATH.'); process.exit(1); }

let PORT, profile, browser;
function spawnBrowser(){
  PORT = 9833 + Math.floor(Math.random() * 400);
  profile = mkdtempSync(join(tmpdir(), 'reel-cap-'));
  browser = spawn(exe, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
}
spawnBrowser();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Reject if a promise does not settle within ms — guards against a dropped
// DevTools response (intermittent headless-Chrome stall) wedging the whole render.
const pTimeout = (p, ms, label) => Promise.race([
  p,
  new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout: ${label} (${ms}ms)`)), ms)),
]);

async function devtools() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('DevTools endpoint never came up');
}

function client(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  };
  const open = new Promise((r) => { ws.onopen = r; });
  return {
    open,
    send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }),
    close: () => ws.close(),
  };
}

async function evalp(c, expr, awaitPromise = false) {
  const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result && r.result.value;
}

// inject spec + timings BEFORE the page's own scripts run
const boot = `window.__CAPTURE=true;window.__SPEC=${JSON.stringify(spec)};window.__TIMINGS=${JSON.stringify(tim)};`
  + `document.addEventListener('DOMContentLoaded',function(){document.body.classList.add('capture');});`;

// Connect to the freshly-spawned browser and drive the page to a ready, seek-able state.
async function connectAndSetup() {
  const c = client(await devtools());
  await c.open;
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.addScriptToEvaluateOnNewDocument', { source: boot });
  await c.send('Page.navigate', { url: pathToFileURL(tpl).href });
  // wait until the template has run (defined __seek) and resolved __ready (fonts + build)
  await pTimeout(evalp(c, 'new Promise(function(res){(function w(){(window.__ready&&typeof window.__seek==="function")?window.__ready.then(function(){res(1)}):setTimeout(w,30);})();})', true), 30000, 'ready');
  await sleep(400);
  await evalp(c, 'document.body.classList.add("capture")');
  return c;
}
// Tear the current browser down (swallow all errors) — used before a relaunch and at the end.
function teardown() {
  try { browser && browser.kill(); } catch { /* ignore */ }
  try { if (profile) rmSync(profile, { recursive: true, force: true }); } catch { /* ignore */ }
}

mkdirSync(outDir, { recursive: true });
const clip = { x: 0, y: 0, width: W, height: H, scale: 1 };
process.stdout.write(`capturing ${nFrames} frames @ ${FPS}fps → ${outDir}\n`);
const FRAME_TIMEOUT = 20000, MAX_RETRY = 3, MAX_RESTART = 8;

let c = await connectAndSetup();
let restarts = 0;
try {
  for (let f = 0; f < nFrames; f++) {
    let shot = null, lastErr;
    while (shot === null) {
      for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
        try {
          await pTimeout(evalp(c, `window.__seek(${(f * frameMs).toFixed(2)})`), FRAME_TIMEOUT, `seek ${f}`);
          shot = await pTimeout(c.send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true, fromSurface: true }), FRAME_TIMEOUT, `shot ${f}`);
          break;
        } catch (e) { lastErr = e; await sleep(300); }
      }
      if (shot === null) {
        // the renderer/page is wedged (intermittent software-raster stall) — a fresh
        // browser clears it; seek(t) is a pure function of t, so we just retry this frame.
        if (restarts >= MAX_RESTART) throw new Error(`frame ${f} failed; relaunched ${restarts}x: ${lastErr && lastErr.message}`);
        restarts++;
        process.stdout.write(`\n  ⚠ frame ${f} stalled (${lastErr && lastErr.message}) — relaunching browser (${restarts}/${MAX_RESTART})\n`);
        try { c.close(); } catch { /* ignore */ }
        teardown();
        await sleep(600);
        spawnBrowser();
        c = await connectAndSetup();
      }
    }
    writeFileSync(join(outDir, String(f).padStart(6, '0') + '.png'), Buffer.from(shot.data, 'base64'));
    if (f % 30 === 0 || f === nFrames - 1) process.stdout.write(`  ${f + 1}/${nFrames}\r`);
  }
  process.stdout.write(`\n✓ ${nFrames} frames\n`);
  try { c.close(); } catch { /* ignore */ }
} finally {
  teardown();
}
