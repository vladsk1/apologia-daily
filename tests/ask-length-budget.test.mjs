/**
 * The Asked & Answered follow-up length budget.
 *
 * WHY THIS EXISTS. api/ask.js rejects a `question` over a fixed character cap with HTTP 413, and it
 * measures the COMPOSED string. asked-and-answered.html's follow-up mode rebuilds the whole thread
 * into that one field, so a question that passed on its own could never be followed up: the reader
 * got "Something went wrong reaching the answer service. Please try again in a moment," which is
 * both wrong (nothing was wrong with the service) and useless (retrying can never succeed).
 *
 * Two things have to hold, and neither can be held by a comment:
 *   1. The client's ASK_MAX must equal the server's cap. They live in different files, the page
 *      cannot import from the API, and nothing else would notice them drifting apart.
 *   2. buildFollowUp() must ALWAYS come in under the cap — including when the earlier question is a
 *      pasted transcript, which is the case that produced the bug.
 *
 * The page's helpers are inline in a <script> that touches the DOM, so they are extracted by name
 * and evaluated in isolation rather than by loading the page.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = readFileSync(path.join(ROOT, 'asked-and-answered.html'), 'utf8');
const API = readFileSync(path.join(ROOT, 'api', 'ask.js'), 'utf8');

/** Pull `function <name>(...) { ... }` out of the page by brace-matching from its opening brace. */
function extractFn(name) {
  const start = PAGE.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `asked-and-answered.html no longer defines ${name}()`);
  let i = PAGE.indexOf('{', start), depth = 0;
  for (let j = i; j < PAGE.length; j++) {
    if (PAGE[j] === '{') depth++;
    else if (PAGE[j] === '}' && --depth === 0) return PAGE.slice(start, j + 1);
  }
  throw new Error(`unbalanced braces while extracting ${name}()`);
}

const ASK_MAX = Number(/const ASK_MAX\s*=\s*(\d+)/.exec(PAGE)?.[1]);
const ASK_MARGIN = Number(/const ASK_MARGIN\s*=\s*(\d+)/.exec(PAGE)?.[1]);

const sandbox = new Function(
  `const ASK_MAX = ${ASK_MAX}, ASK_MARGIN = ${ASK_MARGIN};
   ${extractFn('clipHead')}
   ${extractFn('buildFollowUp')}
   return { clipHead, buildFollowUp };`
)();

test('the client cap matches the cap api/ask.js actually enforces', () => {
  const server = /inputTooLong\(\s*question\s*,\s*(\d+)\s*\)/.exec(API);
  assert.ok(server, 'api/ask.js no longer guards `question` with inputTooLong(question, N)');
  assert.equal(
    ASK_MAX, Number(server[1]),
    `asked-and-answered.html ASK_MAX=${ASK_MAX} but api/ask.js caps at ${server[1]}. ` +
    'They must match, or follow-ups 413 again.'
  );
});

test('a follow-up on a long pasted transcript still fits under the cap', () => {
  // The shape that produced the bug: a pasted auto-transcript, then a normal 550-word answer.
  const transcript = '0:000 seconds There is a doctrine that has become part of the discussion. '.repeat(220);
  const answer = 'word '.repeat(550);
  const followUp = 'are there scholarly responses to this and does it go against the Nicene creed?';
  assert.ok(transcript.length > ASK_MAX, 'test fixture is not actually oversized');

  const out = sandbox.buildFollowUp(followUp, transcript, answer);
  assert.ok(out !== null, 'a normal-length follow-up must never be refused outright');
  assert.ok(out.length <= ASK_MAX, `composed follow-up is ${out.length} chars, over the ${ASK_MAX} cap`);
  assert.ok(out.includes(followUp), 'the NEW question must never be trimmed away');
  assert.ok(out.includes('truncated'), 'a trimmed thread must say so, so the model reads it as an extract');
});

test('a short thread is passed through untouched', () => {
  const q = 'Did the disciples really die for their faith?';
  const a = 'A short answer.';
  const out = sandbox.buildFollowUp('But how do we know that?', q, a);
  assert.ok(out.includes(q) && out.includes(a), 'nothing should be trimmed when it already fits');
  assert.ok(!out.includes('truncated'), 'no truncation marker should appear when nothing was trimmed');
});

test('buildFollowUp refuses rather than returning an over-cap string', () => {
  // A new question that alone exceeds the cap cannot be threaded; the caller falls back and, if it
  // still does not fit, reports the real reason instead of POSTing a guaranteed 413.
  const out = sandbox.buildFollowUp('x'.repeat(ASK_MAX + 1), 'earlier', 'answer');
  assert.equal(out, null);
});

test('clipHead never exceeds its budget and marks what it dropped', () => {
  const s = 'sentence '.repeat(500);
  const marker = ' […truncated…]';
  const out = sandbox.clipHead(s, 400, marker);
  assert.ok(out.length <= 400, `clipHead returned ${out.length} chars for a 400 budget`);
  assert.ok(out.endsWith(marker));
  // Too small to carry a meaningful fragment: return nothing rather than a marker and three words.
  assert.equal(sandbox.clipHead(s, 40, marker), '');
});

test('composeQuestion reports when a thread had to be dropped rather than dropping it silently', () => {
  const box = new Function(
    `let followUp = true, lastQ = 'earlier question', lastA = 'earlier answer';
     const ASK_MAX = ${ASK_MAX}, ASK_MARGIN = ${ASK_MARGIN};
     ${extractFn('clipHead')}
     ${extractFn('buildFollowUp')}
     ${extractFn('composeQuestion')}
     return composeQuestion;`
  )();

  const normal = box('But how do we know that?');
  assert.equal(normal.threadDropped, false, 'a thread that fits must not be reported as dropped');
  assert.ok(normal.q.includes('earlier answer'), 'the thread should actually be carried');

  // Long enough that the wrapper cannot fit around it, but still under the cap on its own.
  const nearCap = box('x'.repeat(ASK_MAX - 50));
  assert.equal(nearCap.q.length, ASK_MAX - 50, 'the bare question should be sent through unchanged');
  assert.equal(nearCap.threadDropped, true, 'dropping the thread must be surfaced, not silent');

  assert.equal(box('x'.repeat(ASK_MAX + 1)), null);
});
