// Shared, defensive request-body parser for the Claude-calling API endpoints.
//
// Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we're at
// the Hobby 12-function limit); it's bundled into each endpoint that imports it.
//
// Vercel usually parses a JSON body into req.body, but a request that arrives with
// no body, a non-JSON content-type, or a raw string leaves req.body undefined or a
// string. Destructuring that throws a TypeError, so the caller gets a generic 500
// instead of an honest 400. This always returns a plain object, so the endpoint's
// own field validation runs and can answer 400 (or handle the empty case) cleanly.
export function parseBody(req) {
  let body = req && req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  return (body && typeof body === 'object') ? body : {};
}
