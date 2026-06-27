/* Returns the VAPID public key so the browser can subscribe to push.
   The public key is safe to expose. Set VAPID_PUBLIC_KEY in Vercel env. */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var key = process.env.VAPID_PUBLIC_KEY || '';
  return res.status(200).json({ key: key });
}
