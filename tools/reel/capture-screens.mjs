#!/usr/bin/env node
/*
 * capture-screens.mjs — phone-sized screenshots of live site pages, for feature reels.
 *
 * Drives a headless Chrome/Edge over the DevTools protocol (no npm dependencies; needs
 * Node 22+ for the global WebSocket). Each shot loads a URL, optionally runs a setup
 * script in the page (open a tab, expand a card, scroll an element into view), waits,
 * then saves a PNG of the viewport.
 *
 * Usage:
 *   node tools/reel/capture-screens.mjs <shots.json> [--out <dir>] [--base <url>]
 *
 * shots.json:
 *   { "base": "https://apologiadaily.com", "width": 390, "height": 640, "scale": 2,
 *     "shots": [ { "name": "hub", "path": "/evidence-library.html",
 *                  "js": "document.querySelector('.tab').scrollIntoView()", "wait": 1500 } ] }
 *
 * The screenshots are for reels only (tools/ is never deployed). They show already-published
 * pages exactly as a visitor sees them, so they add no new wording of their own — but a reel
 * that uses them is still gated content: check each image matches what its scene claims.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
if (!args[0]) { console.error('usage: capture-screens.mjs <shots.json> [--out dir] [--base url]'); process.exit(2); }
const cfgPath = resolve(args[0]);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : undefined; };
const outDir = resolve(opt('--out') || join(dirname(cfgPath), 'shots'));
const base = (opt('--base') || cfg.base || 'https://apologiadaily.com').replace(/\/$/, '');
const W = cfg.width || 390, H = cfg.height || 640, SCALE = cfg.scale || 2;

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const exe = BROWSERS.find((p) => existsSync(p));
if (!exe) { console.error('No Chrome/Edge found; set CHROME_PATH.'); process.exit(1); }

const PORT = 9333 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), 'reel-shots-'));
const browser = spawn(exe, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function devtools() {
  for (let i = 0; i < 50; i++) {
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
  let id = 0; const pending = new Map(); const waiters = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
    } else if (m.method) {
      for (const w of waiters.splice(0)) if (w.method === m.method) w.res(m.params); else waiters.push(w);
    }
  };
  const open = new Promise((r) => { ws.onopen = r; });
  return {
    open,
    send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }),
    once: (method, ms = 30000) => new Promise((res, rej) => { waiters.push({ method, res }); setTimeout(() => rej(new Error(`timeout waiting for ${method}`)), ms); }),
    close: () => ws.close(),
  };
}

try {
  const c = client(await devtools());
  await c.open;
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: SCALE, mobile: true });
  await c.send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36' });
  mkdirSync(outDir, { recursive: true });
  for (const s of cfg.shots) {
    const loaded = c.once('Page.loadEventFired');
    await c.send('Page.navigate', { url: base + s.path });
    await loaded.catch(() => {});
    await sleep(s.settle ?? 1500);
    // Optional config-level "prep" script runs before every shot unless the shot sets
    // "noPrep" (e.g. to hide floating widgets that would cover the page).
    const setup = [s.noPrep ? '' : (cfg.prep || ''), s.js || ''].join('\n').trim();
    if (setup) {
      const r = await c.send('Runtime.evaluate', { expression: `(async()=>{${setup}})()`, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) console.warn(`  ! ${s.name}: setup script threw: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
      await sleep(s.wait ?? 1200);
    }
    // Optional "clip": a CSS selector; the PNG is cropped to that element (plus a small
    // margin) instead of the viewport — e.g. to show one card without surrounding layout.
    let clip;
    if (s.clip) {
      const r = await c.send('Runtime.evaluate', { returnByValue: true, expression:
        `(()=>{const e=document.querySelector(${JSON.stringify(s.clip)});if(!e)return null;const b=e.getBoundingClientRect();return {x:b.left+scrollX,y:b.top+scrollY,w:b.width,h:b.height};})()` });
      const b = r.result && r.result.value;
      if (b) { const m = s.clipMargin ?? 8; clip = { x: Math.max(0, b.x - m), y: Math.max(0, b.y - m), width: b.w + 2 * m, height: b.h + 2 * m, scale: 1 }; }
      else console.warn(`  ! ${s.name}: clip selector ${s.clip} not found; capturing viewport`);
    }
    const shot = await c.send('Page.captureScreenshot', clip ? { format: 'png', clip, captureBeyondViewport: true } : { format: 'png' });
    const file = join(outDir, `${s.name}.png`);
    writeFileSync(file, Buffer.from(shot.data, 'base64'));
    console.log(`  ✓ ${s.name} -> ${file}`);
  }
  c.close();
} finally {
  browser.kill();
}
