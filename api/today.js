/* Today's argument — public, tiny, cacheable.
   The service worker fetches this on a push to show a fresh, specific
   notification ("Today: the Kalam …") without needing an encrypted payload.
   Rotates deterministically by day so everyone gets the same daily pick. */
var ARGS = [
  { t: 'The Kalam Cosmological Argument', u: '/ev-m-kalam.html', b: 'Whatever begins to exist has a cause. The universe began. So…' },
  { t: 'The Fine-Tuning of the Universe', u: '/ev-m-finetuning.html', b: 'The constants are dialed in with staggering precision. Why?' },
  { t: 'The Moral Argument', u: '/ev-m-moral.html', b: 'If there is no God, are some things still really evil?' },
  { t: 'The Empty Tomb', u: '/ev-m-emptytomb.html', b: 'Even the critics conceded the tomb was empty. The question is why.' },
  { t: 'The Minimal Facts of the Resurrection', u: '/ev-m-minimal.html', b: 'Facts even skeptical scholars grant — and what best explains them.' },
  { t: 'Why the Disciples Died for What They Saw', u: '/ev-m-disciplesbelief.html', b: 'People die for what they believe. Few die for what they know is a lie.' },
  { t: 'Manuscript Evidence for the New Testament', u: '/ev-m-manuscript.html', b: 'How do we know the text we read is what was written?' },
  { t: 'Fulfilled Messianic Prophecy', u: '/ev-m-messianic_prophecy.html', b: 'Written centuries early — and met in one life.' },
  { t: 'The Dead Sea Scrolls', u: '/ev-m-deadseascrolls.html', b: 'A 1,000-year jump back in time confirmed the text held.' },
  { t: 'The Big Bang and a Beginning', u: '/ev-m-bigbang.html', b: 'Science pointed to a beginning long before it was comfortable.' },
  { t: 'The Origin of Life', u: '/ev-m-originlife.html', b: 'Where did the first information-bearing molecule come from?' },
  { t: 'The Contingency Argument', u: '/ev-m-leibniz.html', b: 'Why is there something rather than nothing at all?' },
  { t: 'The Argument from Reason', u: '/ev-m-reason.html', b: 'If thought is just chemistry, why trust it?' },
  { t: 'The Historical Jesus', u: '/ev-m-hist_jesus.html', b: 'What can we actually establish about the man from history?' },
  { t: 'Undesigned Coincidences', u: '/ev-m-coincidences.html', b: 'The Gospels dovetail in ways forgers could not have planned.' }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');
  var now = new Date();
  var start = Date.UTC(now.getUTCFullYear(), 0, 0);
  var day = Math.floor((Date.now() - start) / 86400000);
  var a = ARGS[day % ARGS.length];
  return res.status(200).json({
    title: 'Today: ' + a.t,
    body: a.b,
    url: a.u
  });
}
