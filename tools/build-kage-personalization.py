import re, sys, pathlib, hashlib

BASE = pathlib.Path("public/landing-pages")
SRC, DST = BASE/"kage.html", BASE/"kage.portfolio.html"
s = SRC.read_text(encoding="utf-8")
orig = s          # pristine reference for the self-check below
orig_len = len(s)
fails = []

def lit(old, new):
    """Literal replace, must match exactly once."""
    global s
    if s.count(old) != 1:
        fails.append(("lit", s.count(old), old[:64].replace("\n","\\n"))); return
    s = s.replace(old, new)

def rx(pattern, new, flags=0):
    """Regex replace, must match exactly once. new may use \\g<1> group refs."""
    global s
    n = len(re.findall(pattern, s, flags))
    if n != 1:
        fails.append(("rx", n, pattern[:64])); return
    # NOTE: do NOT escape backslashes here -- re.sub reads \g<1> as a group ref.
    s = re.sub(pattern, new, s, flags=flags)

# ---------- brand ----------
lit('<span class="brand-tx"><b>KAGE</b><i>HIDDEN REALMS OF KYOTO</i></span>',
    '<span class="brand-tx"><b>PARAM PAMBHAR</b><i>FULL-STACK DEVELOPER</i></span>')

# ---------- nav: retitle + replace decorative glyphs (anchored on ASCII href) ----------
for href, en, jp in [("#gate","Work","仕事"), ("#pathways","About","紹介"),
                     ("#lessons","Stack","技"), ("#eternity","Contact","沿革")]:
    rx(r'(<a class="nav-link" href="'+re.escape(href)+r'" data-cursor><span>)[^<]*(</span><span class="alt">)[^<]*(</span></a>)',
       r'\g<1>'+en+r'\g<2>'+jp+r'\g<3>')

# ---------- hero ----------
lit('<span class="dot"></span> Chapter 00 — The Hidden Gate',
    '<span class="dot"></span> Five public repositories')
lit('<span>Where stillness</span></span>', '<span>Five shipped</span></span>')
lit('<span>reveals the</span></span>',  '<span>products, end</span></span>')
lit('<span>unseen.</span></span>',       '<span>to end.</span></span>')
lit('''<p class="hero-sub body" data-rv="up">Enter Kyoto through its quiet thresholds, where ritual,
      craft, and memory shape the path.</p>''',
    '''<p class="hero-sub body" data-rv="up">Schema, API, interface and deploy. Five of them are public, spanning
      two years of real work.</p>''')
lit('<div class="word-fb" aria-hidden="true">KAGE</div>',
    '<div class="word-fb" aria-hidden="true">PARAM</div>')
rx(r'(<div class="hero-side" data-rv="up">\s*<span class="v jp">)[^<]*(</span>)', r'\g<1>仕事\g<2>')
lit('aria-label="Preview: Sanmon, before the bell"', 'aria-label="Preview: drain assembly, exploded"')
rx(r'(<span class="peek-cap"><b class="jp">)[^<]*(</b><i>)[^<]*(</i></span>)', r'\g<1>排水\g<2>Drain assembly, exploded\g<3>')

# ---------- hero chips: four projects ----------
for en, title, desc in [
    ("Thresholds","POP-UP Drain Assembly","Exploded-view WebGL viewer where a shopper takes the product apart."),
    ("Still Gardens","Movit","Two-sided logistics marketplace with competing bids and three dashboards."),
    ("Sacred Craft","Premier Products","B2B catalogue built around a services layer and a full admin console."),
    ("Night Rituals","Herb Veda","Ayurvedic storefront: cart, checkout, ratings and seeded catalogue.")]:
    rx(r'(<span class="tx"><b>' + en + r'</b><p>)[^<]*(</p></span>)',
       r'\g<1>' + desc + r'\g<2>')
    lit('<b>' + en + '</b>', '<b>' + title + '</b>')

# ---------- gate stats: real figures only ----------
lit('''  <div class="gate-stats" data-rv="up">
    <div><b>05</b><span>Chapters</span></div>
    <div><b>92</b><span>Minutes</span></div>
    <div><b>1611</b><span>Hall raised</span></div>
    <div><b>∞</b><span>Stillness</span></div>
  </div>''',
    '''  <div class="gate-stats" data-rv="up">
    <div><b>05</b><span>Projects</span></div>
    <div><b>03</b><span>Dashboards</span></div>
    <div><b>02</b><span>Years</span></div>
    <div><b>01</b><span>Developer</span></div>
  </div>''')

# ---------- chapter I: flagship project ----------
rx(r'(<span class="k"><b>01</b> — )[^<]*(</span><span class="rule"></span><span class="k jp">)[^<]*(</span>)',
   r'\g<1>POP-UP Drain Assembly\g<2>排水\g<3>')
lit('<h2 class="display h-sec" data-rv="up">Charred cypress, worn stone, one gate left open.</h2>',
    '<h2 class="display h-sec" data-rv="up">A shopper takes the product apart instead of reading about it.</h2>')
lit('''<p class="lead" data-rv="up">Kage begins where the city stops: a mountain gate of cedar burned black,
        standing in its own weather. The soot is not decoration. It is how a board is taught to survive a
        hundred rainy seasons, and the first thing this place asks you to understand.</p>''',
    '''<p class="lead" data-rv="up">Every other product in this set describes itself. This one lets you open it.
        The drain assembly loads as an interactive Three.js scene with per-part hotspots, so a buyer
        inspects the mechanism before buying rather than trusting a photograph of it.</p>''')
lit('''<p class="body" data-rv="up">Climb the worn steps and the worship hall lifts out of the mist, its paper
        screens lit from inside like a lantern the size of a house. Above the eaves a vermilion moon holds
        its place, patient, half hidden. Nothing here is in a hurry. Neither, for the next ninety minutes,
        are you.</p>''',
    '''<p class="body" data-rv="up">It runs on React 19, React Three Fiber 9, drei 10 and Three.js 0.186, served
        through Vite 7 and backed by an Express 5 and MongoDB API. Cart, wishlist and checkout sit over the
        same endpoints. One developer took it from schema to deployment.</p>''')
lit('<span>Cross the threshold</span>', '<span>View the project</span>')

# ---------- lessons: all five projects, real summaries and years ----------
for en, title, jp, desc, yr in [
    ("The Hidden Gate","POP-UP Drain Assembly","排水","Exploded-view viewer with per-part hotspots, over cart and checkout.","2026"),
    ("Borrowed Scenery","Movit","物流","Shippers post jobs, carriers bid, three role dashboards.","2026"),
    ("Charred Cypress","Premier Products","銅装","Services layer plus admin console over the same endpoints.","2025"),
    ("Lantern Light","Herb Veda","薬草","Cart, checkout, ratings and upload on thirteen products.","2026"),
    ("The Vermilion Moon","CodeQuest","問答","Tags, reputation and profiles on Redux Toolkit.","2025")]:
    rx(r'<h3>'+re.escape(en)+r'<em class="jp">[^<]*</em></h3>\s*<p>[^<]*</p>\s*<span class="t">[^<]*</span>',
       '<h3>'+title+'<em class="jp">'+jp+'</em></h3>\n      <p>'+desc+'</p>\n      <span class="t">'+yr+'</span>')

# ---------- afterlight -> contact ----------
lit('<div class="eyebrow" data-rv="fade">Chapter 04 — Afterlight</div>',
    '<div class="eyebrow" data-rv="fade">Contact — say hello</div>')
lit('<h2 class="display" data-rv="up">Afterlight</h2>',
    '<h2 class="display" data-rv="up">Get in touch</h2>')
lit('''<p class="body-lg" data-rv="up">The gate does not close behind you. Take the walk whenever the noise
    gets loud — it is always the same path, and never the same light.</p>''',
    '''<p class="body-lg" data-rv="up">Everything in this set is public and was built by one person. The
    repositories are the proof, and the commit history is the record.</p>''')
lit('<i></i><span>Begin the walk</span>', '<i></i><span>See the work</span>')

# ---------- footer ----------
lit('''<p>A five-chapter night walk through a Kyoto mountain temple. Three illustrated garden field notes
        sit inside a live Three.js sanctuary.</p>''',
    '''<p>A portfolio of five shipped products: interface, API, database and deploy. Real-time
        WebGL, marketplaces and complete purchase flows, built end to end.</p>''')
lit('''    <div><h4>Chapters</h4><ul>
      <li><a href="#gate" data-cursor>The Sanmon</a></li>
      <li><a href="#pathways" data-cursor>Still Gardens</a></li>
      <li><a href="#lessons" data-cursor>Sacred Craft</a></li>
      <li><a href="#eternity" data-cursor>Afterlight</a></li>
    </ul></div>''',
    '''    <div><h4>Work</h4><ul>
      <li><a href="#gate" data-cursor>POP-UP Drain Assembly</a></li>
      <li><a href="#pathways" data-cursor>Movit</a></li>
      <li><a href="#lessons" data-cursor>Premier Products</a></li>
      <li><a href="#eternity" data-cursor>Herb Veda</a></li>
    </ul></div>''')
lit('''    <div><h4>Practice</h4><ul>
      <li><a href="#lessons" data-cursor>Borrowed scenery</a></li>
      <li><a href="#lessons" data-cursor>Lantern light</a></li>
      <li><a href="#lessons" data-cursor>Charred cypress</a></li>
      <li><a href="#lessons" data-cursor>Raked gravel</a></li>
    </ul></div>''',
    '''    <div><h4>Stack</h4><ul>
      <li><a href="#lessons" data-cursor>Interface</a></li>
      <li><a href="#lessons" data-cursor>Server</a></li>
      <li><a href="#lessons" data-cursor>Practice</a></li>
      <li><a href="#lessons" data-cursor>CodeQuest</a></li>
    </ul></div>''')
lit('''    <div><h4>Elsewhere</h4><ul>
      <li><a href="#top" data-cursor>Journal</a></li>
      <li><a href="#top" data-cursor>Field notes</a></li>
      <li><a href="#top" data-cursor>Colophon</a></li>
    </ul></div>''',
    '''    <div><h4>Elsewhere</h4><ul>
      <li><a href="https://github.com/param004" data-cursor rel="noopener noreferrer" target="_blank">GitHub profile</a></li>
      <li><a href="https://github.com/param004/POP-UP-Drain-Assembly" data-cursor rel="noopener noreferrer" target="_blank">POP-UP Drain Assembly</a></li>
      <li><a href="https://github.com/param004/movit" data-cursor rel="noopener noreferrer" target="_blank">Movit</a></li>
      <li><a href="https://github.com/param004/codequest1" data-cursor rel="noopener noreferrer" target="_blank">CodeQuest</a></li>
    </ul></div>''')
# NOTE: profile.email and profile.linkedin are intentionally empty strings in
# src/data/profile.ts (a university address leaked via commit metadata), so no
# contact link is invented here. Add one only after confirming it by hand.
lit('<span>© 2026 Kage — Kage no Michi</span>', '<span>© 2026 Param Pambhar</span>')
rx(r'<span class="jp">[^<]*静けさは[^<]*</span>', '<span class="jp">仕事は一つの技である</span>')

if fails:
    print("FAILED EDITS:")
    for kind, n, t in fails: print(f"  [{kind}] {n} match(es): {t}")
    sys.exit(1)

BANNER = """<!--
  ============================================================================
  PERSONALIZED COPY -- NOT the original ThreeUI source.
  ============================================================================
  Derived copy of the byte-exact registered source:
      kage.html   (SHA-256 c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49)

  CHANGED: visible TEXT CONTENT ONLY -- brand, nav labels, headings,
  paragraphs, chapter cards, stats, footer, decorative glyphs.

  NOT CHANGED: CSS, JavaScript, shaders, asset paths, markup structure,
  element ids, classes, data-* attributes, ARIA wiring, and every hash-checked
  asset under secret-pathways-assets/.

  CONTENT SOURCES OF TRUTH:
      src/data/profile.ts
      src/data/projects.ts

  TO REVERT:  delete this file and point the loader back at kage.html,
              which is untouched and still passes its registered hash.

  REGENERATE:  python3 tools/build-kage-personalization.py
  ============================================================================
-->
"""
m = re.search(r"<head>", s)
assert m
out = s[:m.end()] + "\n" + BANNER + s[m.end():]

# ---- self-check: only TEXT may differ from the registered source ----
def strip_banner(x):
    return re.sub(r"\n<!--\n  =+\n  PERSONALIZED COPY.*?  =+\n-->\n", "\n", x, flags=re.S)
def tags(x):     return re.findall(r"<(/?[a-zA-Z][^>\s]*)", x)
def attrs(x):    return re.findall(r'\b(?:id|class|data-[\w-]+)="[^"]*"', x)
def blocks(x,t): return re.findall(rf"<{t}\b[^>]*>.*?</{t}>", x, re.S)
def assets(x):   return re.findall(r'secret-pathways-assets/[^"\')]+', x)
def anchors(x):  return re.findall(r'href="(#[^"]+)"', x)

nb = strip_banner(out)

# The footer's "Elsewhere" column is the ONE sanctioned structural change: its
# three placeholder "#top" links become four real GitHub URLs. Mask that single
# column on both sides so every other byte is still compared.
def mask_elsewhere(x):
    return re.sub(r'<h4>Elsewhere</h4><ul>.*?</ul>',
                  '<h4>Elsewhere</h4><ul>__MASKED__</ul>', x, flags=re.S)
o2, n2 = mask_elsewhere(orig), mask_elsewhere(nb)

EXPECTED_EXTERNAL = [
    "https://github.com/param004",
    "https://github.com/param004/POP-UP-Drain-Assembly",
    "https://github.com/param004/movit",
    "https://github.com/param004/codequest1",
]

checks = [
    ("original kage.html hash", hashlib.sha256((SRC).read_bytes()).hexdigest()
        == "c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49"),
    ("tag sequence",      tags(o2) == tags(n2)),
    ("id/class/data",     attrs(o2) == attrs(n2)),
    ("internal anchors",  anchors(o2) == anchors(n2)),
    ("local assets",      assets(o2) == assets(n2)),
    ("<style> blocks",    blocks(o2,"style") == blocks(n2,"style")),
    ("<script> blocks",   blocks(o2,"script") == blocks(n2,"script")),
    ("external links are only the 4 documented repos",
        re.findall(r'href="(https://[^"]+)"', nb) == EXPECTED_EXTERNAL),
]
bad = [n for n, ok in checks if not ok]
if bad:
    print("SELF-CHECK FAILED (derived file diverges beyond text):")
    for n in bad: print("   -", n)
    sys.exit(1)

DST.write_text(out, encoding="utf-8")
print(f"OK   0 failed edits, 0 self-check failures")
print(f"     kage.html            {orig_len:>7} B  (untouched, hash-verified)")
print(f"     kage.portfolio.html  {len(out):>7} B  (derived, text-only)")
