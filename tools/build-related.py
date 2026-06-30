#!/usr/bin/env python3
"""Build library/related.json: for each deep-dive essay, the most related essays.
Offline content-similarity: TF-IDF cosine over the .art-body text, boosted when
two essays share a breadcrumb category. No external services / keys / DB.
"""
import os, re, json, math, html
from collections import defaultdict

LIB = "/home/user/apologia-daily/library"
TOPN = 5
CAT_BOOST = 0.18

STOP = set("""the a an and or but of to in on at for with as by from is are was were be been being
this that these those it its their his her our your my we you they he she them us i me also not no
which who whom whose what when where why how all any both each few more most other some such only own
same so than too very can will just don should now would could may might must shall into onto over under
about above below between through during before after again further then once here there because while
have has had do does did having one two three four five first second third new even much many own god
""".split())

def strip(s): return re.sub(r"<[^>]+>", " ", s)
def unent(s): return html.unescape(s)

def text_of(blockre, s):
    m = blockre.search(s)
    return m.group(1) if m else ""

H1 = re.compile(r"<h1[^>]*>(.*?)</h1>", re.S)
CRUMB = re.compile(r'<nav class="art-crumbs">(.*?)</nav>', re.S)
BODY = re.compile(r'<div class="art-body">(.*?)<div class="art-refs">', re.S)
BODY2 = re.compile(r'<div class="art-body">(.*?)</div>\s*<section', re.S)
DESC = re.compile(r'"description":"(.*?)"')
WORD = re.compile(r"[a-z][a-z'\-]{2,}")

def category(crumb_html):
    txt = unent(strip(crumb_html))
    parts = [p.strip() for p in re.split(r"›|&rsaquo;|>", txt) if p.strip()]
    # parts[0] = "Evidence Library"; category is parts[1]
    if len(parts) >= 2 and parts[1].lower() != "deep dive":
        return parts[1]
    return "General"

docs = {}
for fn in sorted(os.listdir(LIB)):
    if not fn.endswith(".html") or fn == "index.html":
        continue
    s = open(os.path.join(LIB, fn), encoding="utf-8").read()
    h1 = unent(strip(text_of(H1, s))).strip()
    if not h1:
        continue
    cat = category(text_of(CRUMB, s))
    body = text_of(BODY, s) or text_of(BODY2, s)
    body_text = unent(strip(body)).lower()
    toks = [w for w in WORD.findall(body_text) if w not in STOP]
    desc = ""
    md = DESC.search(s)
    if md:
        desc = unent(md.group(1)).strip()
    docs[fn] = {"title": h1, "cat": cat, "toks": toks, "blurb": desc}

print(f"parsed {len(docs)} essays")

# TF-IDF
df = defaultdict(int)
for d in docs.values():
    for w in set(d["toks"]):
        df[w] += 1
N = len(docs)
idf = {w: math.log((N + 1) / (c + 1)) + 1 for w, c in df.items()}

vecs = {}
for fn, d in docs.items():
    tf = defaultdict(int)
    for w in d["toks"]:
        tf[w] += 1
    n = len(d["toks"]) or 1
    v = {w: (c / n) * idf[w] for w, c in tf.items()}
    norm = math.sqrt(sum(x * x for x in v.values())) or 1.0
    vecs[fn] = ({w: x / norm for w, x in v.items()})

def cos(a, b):
    if len(b) < len(a):
        a, b = b, a
    return sum(x * b.get(w, 0.0) for w, x in a.items())

out = {}
slugs = list(docs.keys())
for fn in slugs:
    scores = []
    for other in slugs:
        if other == fn:
            continue
        sc = cos(vecs[fn], vecs[other])
        if docs[fn]["cat"] == docs[other]["cat"] and docs[fn]["cat"] != "General":
            sc += CAT_BOOST
        scores.append((sc, other))
    scores.sort(reverse=True)
    rel = [{"slug": o, "title": docs[o]["title"], "cat": docs[o]["cat"]}
           for sc, o in scores[:TOPN]]
    out[fn] = {"title": docs[fn]["title"], "cat": docs[fn]["cat"], "related": rel}

with open(os.path.join(LIB, "related.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

# quick sanity print
import random
for fn in ["minimalfacts.html", "kalam.html"]:
    if fn in out:
        print(f"\n{fn} [{out[fn]['cat']}] ->")
        for r in out[fn]["related"]:
            print(f"   {r['slug']:28} [{r['cat']}]  {r['title'][:50]}")
print("\nwrote related.json")
