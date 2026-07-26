/**
 * delete-account.js — erase a user's account and all their data.
 *
 * Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we are
 * at the Hobby 12-function limit); it is bundled into the endpoint that imports
 * it — see api/new-signup.js (?do=delete-account).
 *
 * WHY IT EXISTS: Apple App Store Guideline 5.1.1(v) requires any app that offers
 * account creation to let the user delete the account FROM INSIDE THE APP. An
 * "email us to delete" link is explicitly not sufficient and is a reliable
 * rejection. Google Play has a matching requirement. It is also simply what the
 * privacy policy promises.
 *
 * SECURITY INVARIANTS (do not weaken):
 *   - The user id MUST come from a verified access token (lib/verify-user.js),
 *     never from the request body. Otherwise this deletes arbitrary accounts.
 *   - Fails closed: with no service-role key configured, it deletes NOTHING and
 *     reports failure, rather than half-deleting and reporting success.
 *
 * ORDER MATTERS: application rows are removed BEFORE the auth user. Most tables
 * declare `references auth.users(id) on delete cascade`, so deleting the auth
 * user would usually be enough — but a table that predates that convention (or
 * loses the constraint) would silently orphan personal data. Deleting explicitly
 * first means the outcome does not depend on a constraint we cannot see from here.
 */

const SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';

/**
 * Tables holding user-scoped rows, keyed by the column naming the owner.
 * A table that does not exist (or lacks the column) is skipped, not fatal —
 * this list is deliberately broader than the current schema so that adding a
 * table cannot silently leave data behind.
 */
const USER_TABLES = [
  ['user_progress', 'user_id'],
  ['journal_entries', 'user_id'],
  ['flashcards', 'user_id'],
  ['study_plans_progress', 'user_id'],
  ['explain_sessions', 'user_id'],
  ['coach_signals', 'user_id'],
  ['group_members', 'user_id'],
  ['group_messages', 'user_id'],
  ['group_activity', 'user_id'],
  ['groups', 'created_by'],
];

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
}

/**
 * Delete every trace of `userId`.
 *
 * @param {string} userId  a user id taken from a VERIFIED token
 * @returns {Promise<{ok: boolean, deleted: string[], failed: string[], error?: string}>}
 */
export async function deleteAccount(userId) {
  const KEY = serviceKey();
  const deleted = [];
  const failed = [];

  if (!KEY) {
    // Fail closed and loudly: silently "succeeding" here would tell a user their
    // data was erased when it was not.
    return { ok: false, deleted, failed, error: 'not_configured' };
  }
  if (!userId || typeof userId !== 'string') {
    return { ok: false, deleted, failed, error: 'bad_user_id' };
  }

  // Defence in depth on a service-role DELETE: a Supabase user id is a UUID.
  // Nothing today can smuggle another shape in here (the id comes from GoTrue),
  // but this is the cheapest guard against a future change to the filter.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return { ok: false, deleted, failed, error: 'bad_user_id' };
  }

  const headers = {
    apikey: KEY,
    Authorization: 'Bearer ' + KEY,
    'Content-Type': 'application/json',
  };

  // 1) Application rows. Run concurrently: ordering *among tables* is irrelevant
  //    (only "auth user last" matters), and 10 serial round-trips risked burning
  //    the function's time budget mid-loop, which is itself a way to half-delete.
  const results = await Promise.allSettled(USER_TABLES.map(async ([table, column]) => {
    const r = await fetch(
      `${SB_URL}/rest/v1/${table}?${column}=eq.${encodeURIComponent(userId)}`,
      { method: 'DELETE', headers, signal: AbortSignal.timeout(8000) }
    );
    if (r.ok) return { table, status: 'deleted' };

    // A table this project does not have is genuinely fine — USER_TABLES is
    // deliberately broader than the current schema. But we must NOT wave through
    // every 4xx: an undefined COLUMN (42703) means our filter was wrong and the
    // user's rows are all still there. Swallowing that would report a completed
    // deletion while none of the data was touched.
    let code = '';
    try { code = ((await r.json()) || {}).code || ''; } catch (e) { /* no body */ }
    const TABLE_ABSENT = ['42P01', 'PGRST205', 'PGRST106'];
    if (TABLE_ABSENT.includes(code)) return { table, status: 'absent' };

    throw new Error(`${table}: ${r.status} ${code}`);
  }));

  results.forEach((res, i) => {
    const table = USER_TABLES[i][0];
    if (res.status === 'fulfilled') {
      if (res.value.status === 'deleted') deleted.push(table);
    } else {
      failed.push(table);
    }
  });

  // ABORT before touching the auth user if any table failed. Deleting the auth
  // user "last" only protects the user if we actually stop: destroying the login
  // while their rows survive would leave orphaned personal data they can never
  // reach or ask us to remove. Better to delete nothing further and report honestly.
  if (failed.length) {
    return { ok: false, deleted, failed, error: 'rows_failed' };
  }

  // 2) The auth user itself — the step that actually ends the account.
  try {
    const r = await fetch(`${SB_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok && r.status !== 404) {
      return { ok: false, deleted, failed: failed.concat('auth_user'), error: 'auth_delete_failed' };
    }
    // A 404 means there was no such auth user to remove — don't claim we deleted one.
    if (r.ok) deleted.push('auth_user');
  } catch (e) {
    return { ok: false, deleted, failed: failed.concat('auth_user'), error: 'auth_delete_failed' };
  }

  return { ok: true, deleted, failed };
}

export const _USER_TABLES = USER_TABLES;   // exported for tests
