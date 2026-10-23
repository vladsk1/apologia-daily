// Sender identification for marketing / lifecycle emails (weekly summary, group
// nudges). Anti-spam law (US CAN-SPAM; also expected under the Australian Spam Act
// and UK PECR) requires a valid physical postal address in every commercial email.
// The address is NOT hardcoded: set EMAIL_POSTAL_ADDRESS in Vercel (a PO box is fine)
// and, optionally, EMAIL_SENDER_NAME (the legal name: a sole trader's name or the
// business name). See docs/OWNER_TODO.md.

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/** HTML line for an email footer, or '' if no address is configured. */
export function postalFooterHtml(env = process.env) {
  const addr = (env.EMAIL_POSTAL_ADDRESS || '').trim();
  if (!addr) return '';
  const who = (env.EMAIL_SENDER_NAME || 'Apologia Daily').trim();
  return esc(who) + ' &middot; ' + esc(addr) + '<br>';
}

export function hasPostalAddress(env = process.env) {
  return !!(env.EMAIL_POSTAL_ADDRESS || '').trim();
}
