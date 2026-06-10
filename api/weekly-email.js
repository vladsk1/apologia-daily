// api/weekly-email.js
// Sends a personalised weekly summary email to all users every Sunday
// Triggered by Vercel cron (configure in vercel.json) or called manually
// Requires: RESEND_API_KEY environment variable
// Requires: SUPABASE_SERVICE_KEY environment variable (service role key for admin queries)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Security: only allow GET with correct secret, or POST from cron
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  const cronSecret = process.env.CRON_SECRET || 'apologia-cron-2026';
  if (secret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const SB_URL = 'https://noprgxkwniouukmrfozc.supabase.co';
  const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcHJneGt3bmlvdXVrbXJmb3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE1MTUsImV4cCI6MjA5NjEzNzUxNX0.GKmQgpndtaBUcz5SoT9H3bDsqjNSPixJJj4G3BrVkJw';
  const authKey = SB_SERVICE_KEY || SB_ANON_KEY;

  if (!RESEND_KEY) {
    return res.status(200).json({
      status: 'skipped',
      reason: 'RESEND_API_KEY not configured. Sign up at resend.com and add to Vercel environment variables.'
    });
  }

  const results = { sent: 0, failed: 0, skipped: 0, errors: [] };

  try {
    // ── GET ALL USERS ──
    const usersRes = await fetch(`${SB_URL}/auth/v1/admin/users?per_page=500`, {
      headers: {
        'apikey': authKey,
        'Authorization': `Bearer ${authKey}`
      }
    });

    if (!usersRes.ok) {
      // Fallback: if no service key, send a test email to the admin
      if (!SB_SERVICE_KEY) {
        const testEmail = process.env.ADMIN_EMAIL || 'hello@apologiadaily.com';
        await sendWeeklyEmail(RESEND_KEY, testEmail, 'Admin', null, null);
        return res.status(200).json({ status: 'test_sent', note: 'Add SUPABASE_SERVICE_KEY for full user list access' });
      }
      return res.status(500).json({ error: 'Failed to fetch users', status: usersRes.status });
    }

    const usersData = await usersRes.json();
    const users = usersData.users || [];

    // ── GET FLASHCARD STATS FOR ALL USERS ──
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    let flashcardStats = {};
    try {
      const fcRes = await fetch(`${SB_URL}/rest/v1/flashcards?select=user_id,next_review,reps,argument_title`, {
        headers: { 'apikey': authKey, 'Authorization': `Bearer ${authKey}` }
      });
      if (fcRes.ok) {
        const fcData = await fcRes.json();
        fcData.forEach(function(card) {
          if (!flashcardStats[card.user_id]) flashcardStats[card.user_id] = { total: 0, due: 0, mastered: 0 };
          flashcardStats[card.user_id].total++;
          if (card.next_review <= today) flashcardStats[card.user_id].due++;
          if (card.reps >= 3) flashcardStats[card.user_id].mastered++;
        });
      }
    } catch(e) {}

    // ── GET EXPLAIN SESSIONS FROM PAST 7 DAYS ──
    let explainStats = {};
    try {
      const exRes = await fetch(`${SB_URL}/rest/v1/explain_sessions?select=user_id,score,argument_title,created_at&created_at=gte.${weekAgo}T00:00:00`, {
        headers: { 'apikey': authKey, 'Authorization': `Bearer ${authKey}` }
      });
      if (exRes.ok) {
        const exData = await exRes.json();
        exData.forEach(function(session) {
          if (!explainStats[session.user_id]) explainStats[session.user_id] = { sessions: 0, avgScore: 0, scores: [], args: [] };
          explainStats[session.user_id].sessions++;
          if (session.score) explainStats[session.user_id].scores.push(session.score);
          if (session.argument_title) explainStats[session.user_id].args.push(session.argument_title);
        });
        Object.keys(explainStats).forEach(function(uid) {
          var s = explainStats[uid].scores;
          explainStats[uid].avgScore = s.length > 0 ? Math.round(s.reduce(function(a,b){return a+b;},0)/s.length) : 0;
        });
      }
    } catch(e) {}

    // ── SEND EMAIL TO EACH USER ──
    for (const user of users) {
      if (!user.email || !user.email_confirmed_at) { results.skipped++; continue; }

      const name = (user.user_metadata && user.user_metadata.full_name)
        ? user.user_metadata.full_name.split(' ')[0]
        : user.email.split('@')[0];

      const fc = flashcardStats[user.id] || null;
      const ex = explainStats[user.id] || null;

      try {
        await sendWeeklyEmail(RESEND_KEY, user.email, name, fc, ex);
        results.sent++;
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 100));
      } catch(e) {
        results.failed++;
        results.errors.push({ email: user.email, error: e.message });
      }
    }

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({
    status: 'complete',
    sent: results.sent,
    failed: results.failed,
    skipped: results.skipped,
    errors: results.errors.slice(0, 5)
  });
}

async function sendWeeklyEmail(resendKey, email, name, fc, ex) {
  const html = buildEmailHtml(name, fc, ex);
  const subject = buildSubject(fc, ex);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Apologia Daily <hello@apologiadaily.com>',
      to: email,
      subject: subject,
      html: html
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error ${response.status}: ${err}`);
  }

  return response.json();
}

function buildSubject(fc, ex) {
  if (fc && fc.due > 0) return `${fc.due} flashcard${fc.due !== 1 ? 's' : ''} due for review this week`;
  if (ex && ex.sessions > 0) return `Your apologetics practice this week`;
  return `Your weekly apologetics update`;
}

function buildEmailHtml(name, fc, ex) {
  // Personalised sections
  let flashcardSection = '';
  if (fc && fc.total > 0) {
    const dueText = fc.due > 0
      ? `<span style="color:#c8a951;font-weight:600;">${fc.due} card${fc.due !== 1 ? 's' : ''} due for review</span>`
      : `<span style="color:#22c55e;font-weight:600;">All caught up</span>`;
    flashcardSection = `
      <div style="background:#0f2040;border-radius:6px;padding:1.25rem 1.5rem;margin-bottom:1rem;">
        <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#c8a951;margin-bottom:0.5rem;">Your Flashcard Deck</div>
        <div style="font-size:0.9rem;color:rgba(255,255,255,0.8);margin-bottom:0.25rem;">${dueText} &nbsp;&middot;&nbsp; ${fc.total} total cards &nbsp;&middot;&nbsp; ${fc.mastered} mastered</div>
        <div style="font-size:0.8rem;color:rgba(255,255,255,0.45);margin-top:0.5rem;">Spaced repetition only works when you review on schedule. Even 3 minutes today makes a difference.</div>
        <a href="https://apologiadaily.com/flashcards.html" style="display:inline-block;margin-top:0.875rem;font-size:0.8rem;font-weight:600;background:#c8a951;color:#050d1a;padding:7px 16px;border-radius:3px;text-decoration:none;">Review cards now</a>
      </div>`;
  } else {
    flashcardSection = `
      <div style="background:#0f2040;border-radius:6px;padding:1.25rem 1.5rem;margin-bottom:1rem;">
        <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#c8a951;margin-bottom:0.5rem;">Flashcard Deck</div>
        <div style="font-size:0.88rem;color:rgba(255,255,255,0.7);margin-bottom:0.75rem;">You have not started your flashcard deck yet. This is the single most effective thing you can do to remember arguments long term.</div>
        <a href="https://apologiadaily.com/flashcards.html" style="display:inline-block;font-size:0.8rem;font-weight:600;background:#c8a951;color:#050d1a;padding:7px 16px;border-radius:3px;text-decoration:none;">Build your deck</a>
      </div>`;
  }

  let explainSection = '';
  if (ex && ex.sessions > 0) {
    const scoreColour = ex.avgScore >= 8 ? '#22c55e' : ex.avgScore >= 6 ? '#4a7ab5' : '#eab308';
    explainSection = `
      <div style="background:#0f2040;border-radius:6px;padding:1.25rem 1.5rem;margin-bottom:1rem;">
        <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#c8a951;margin-bottom:0.5rem;">Explain It Back</div>
        <div style="font-size:0.9rem;color:rgba(255,255,255,0.8);">This week: <strong>${ex.sessions} practice session${ex.sessions !== 1 ? 's' : ''}</strong> &nbsp;&middot;&nbsp; Average score: <span style="color:${scoreColour};font-weight:600;">${ex.avgScore}/10</span></div>
        ${ex.args.length > 0 ? `<div style="font-size:0.78rem;color:rgba(255,255,255,0.45);margin-top:0.35rem;">Arguments practised: ${[...new Set(ex.args)].slice(0,3).join(', ')}</div>` : ''}
        <a href="https://apologiadaily.com/explain-it-back.html" style="display:inline-block;margin-top:0.875rem;font-size:0.8rem;font-weight:600;background:rgba(200,169,81,0.15);color:#c8a951;padding:7px 16px;border-radius:3px;text-decoration:none;border:1px solid rgba(200,169,81,0.3);">Keep practising</a>
      </div>`;
  }

  // This week's argument (rotate by week number)
  const weekNum = Math.floor(Date.now() / (7 * 86400000)) % 10;
  const WEEKLY_ARGS = [
    { title: 'The Kalam Cosmological Argument', q: 'What caused the Big Bang?', link: 'evidence-library.html' },
    { title: 'The Fine-Tuning Argument', q: 'Is the universe fine-tuned for life?', link: 'evidence-library.html' },
    { title: 'The Minimal Facts Argument', q: 'Why did the disciples die for the resurrection?', link: 'evidence-library.html' },
    { title: 'The Moral Argument', q: 'Was the Holocaust objectively evil?', link: 'evidence-library.html' },
    { title: 'The Empty Tomb', q: 'Why did Jesus\'s enemies never produce a body?', link: 'evidence-library.html' },
    { title: 'The Manuscript Evidence', q: 'How many manuscripts does the NT have vs Plato?', link: 'evidence-library.html' },
    { title: 'Lord, Liar, or Lunatic', q: 'Why can\'t Jesus just be a great moral teacher?', link: 'evidence-library.html' },
    { title: 'The Islamic Dilemma', q: 'What does Surah 10:94 say about the Bible?', link: 'worldviews.html' },
    { title: 'The Dead Sea Scrolls', q: 'Why do the Dead Sea Scrolls matter for prophecy?', link: 'evidence-library.html' },
    { title: 'The Argument from Consciousness', q: 'Why does the hard problem of consciousness point to God?', link: 'evidence-library.html' },
  ];
  const weeklyArg = WEEKLY_ARGS[weekNum];

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your weekly update</title></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:'Georgia',serif;">
<div style="max-width:580px;margin:0 auto;background:#f7f4ef;">

  <!-- HEADER -->
  <div style="background:#050d1a;padding:1.75rem 2rem;border-bottom:2px solid #c8a951;">
    <div style="font-family:Georgia,serif;font-size:1.3rem;font-weight:700;color:#fff;">Apologia<span style="color:#c8a951;">Daily</span></div>
    <div style="font-family:Arial,sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:3px;">Weekly Summary</div>
  </div>

  <!-- GREETING -->
  <div style="background:#050d1a;padding:2rem 2rem 1.5rem;">
    <div style="font-family:Georgia,serif;font-size:1.35rem;font-weight:700;color:#fff;margin-bottom:0.5rem;">Good morning, ${name}. New week.</div>
    <div style="font-family:Arial,sans-serif;font-size:0.88rem;color:rgba(255,255,255,0.55);line-height:1.7;">Here is your apologetics focus for this week. Consistent short sessions beat occasional long ones &mdash; ten minutes today matters more than two hours next month.</div>
  </div>

  <!-- STATS SECTION -->
  <div style="background:#0a1628;padding:1.5rem 2rem;">
    ${flashcardSection}
    ${explainSection}
  </div>

  <!-- THIS WEEK'S ARGUMENT -->
  <div style="background:#fff;padding:1.75rem 2rem;border-top:1px solid #e8e2d8;">
    <div style="font-family:Arial,sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#3a4a62;margin-bottom:0.75rem;">Argument of the week</div>
    <div style="font-family:Georgia,serif;font-size:1.1rem;font-weight:700;color:#0f1f38;margin-bottom:0.5rem;">${weeklyArg.title}</div>
    <div style="font-family:Georgia,serif;font-size:0.92rem;color:#3a4a62;font-style:italic;line-height:1.7;margin-bottom:1rem;padding-left:1rem;border-left:3px solid #c8a951;">"${weeklyArg.q}"</div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <a href="https://apologiadaily.com/${weeklyArg.link}" style="font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;background:#050d1a;color:#fff;padding:8px 16px;border-radius:3px;text-decoration:none;">Study the argument</a>
      <a href="https://apologiadaily.com/daily-argument.html" style="font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;background:none;color:#1e4278;padding:8px 16px;border-radius:3px;text-decoration:none;border:1px solid #1e4278;">Daily argument</a>
    </div>
  </div>

  <!-- QUICK LINKS -->
  <div style="background:#f7f4ef;padding:1.5rem 2rem;border-top:1px solid #e8e2d8;">
    <div style="font-family:Arial,sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#3a4a62;margin-bottom:0.875rem;">Jump back in</div>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0.5rem 0.5rem 0;width:50%;">
          <a href="https://apologiadaily.com/debate-arena.html" style="display:block;background:#fff;border:1px solid #e8e2d8;border-radius:6px;padding:0.875rem;text-decoration:none;">
            <div style="font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;color:#0f1f38;">Debate Arena</div>
            <div style="font-family:Arial,sans-serif;font-size:0.72rem;color:#3a4a62;margin-top:2px;">Practise under pressure</div>
          </a>
        </td>
        <td style="padding:0 0 0.5rem 0.5rem;width:50%;">
          <a href="https://apologiadaily.com/daily-devotional.html" style="display:block;background:#fff;border:1px solid #e8e2d8;border-radius:6px;padding:0.875rem;text-decoration:none;">
            <div style="font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;color:#0f1f38;">Daily Devotional</div>
            <div style="font-family:Arial,sans-serif;font-size:0.72rem;color:#3a4a62;margin-top:2px;">Faith and reason daily</div>
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0.5rem 0 0;">
          <a href="https://apologiadaily.com/ask-anything.html" style="display:block;background:#fff;border:1px solid #e8e2d8;border-radius:6px;padding:0.875rem;text-decoration:none;">
            <div style="font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;color:#0f1f38;">Ask Anything</div>
            <div style="font-family:Arial,sans-serif;font-size:0.72rem;color:#3a4a62;margin-top:2px;">Hard questions answered</div>
          </a>
        </td>
        <td style="padding:0 0 0 0.5rem;">
          <a href="https://apologiadaily.com/evidence-library.html" style="display:block;background:#fff;border:1px solid #e8e2d8;border-radius:6px;padding:0.875rem;text-decoration:none;">
            <div style="font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;color:#0f1f38;">Evidence Library</div>
            <div style="font-family:Arial,sans-serif;font-size:0.72rem;color:#3a4a62;margin-top:2px;">61 arguments</div>
          </a>
        </td>
      </tr>
    </table>
  </div>

  <!-- VERSE -->
  <div style="background:#050d1a;padding:1.5rem 2rem;">
    <div style="font-family:Georgia,serif;font-size:0.92rem;color:rgba(255,255,255,0.7);font-style:italic;line-height:1.8;text-align:center;">"Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have &mdash; but do this with gentleness and respect."</div>
    <div style="font-family:Arial,sans-serif;font-size:0.72rem;color:rgba(255,255,255,0.35);text-align:center;margin-top:0.5rem;">1 Peter 3:15</div>
  </div>

  <!-- FOOTER -->
  <div style="background:#050d1a;padding:1.25rem 2rem;border-top:1px solid rgba(255,255,255,0.06);">
    <div style="font-family:Arial,sans-serif;font-size:0.72rem;color:rgba(255,255,255,0.3);text-align:center;line-height:1.7;">
      Apologia Daily &nbsp;&middot;&nbsp; apologiadaily.com<br>
      <a href="https://apologiadaily.com/dashboard.html" style="color:rgba(255,255,255,0.3);">Dashboard</a> &nbsp;&middot;&nbsp;
      You are receiving this because you have an Apologia Daily account.<br>
      <a href="https://apologiadaily.com" style="color:rgba(200,169,81,0.5);text-decoration:none;">Unsubscribe</a>
    </div>
  </div>

</div>
</body>
</html>`;
}
