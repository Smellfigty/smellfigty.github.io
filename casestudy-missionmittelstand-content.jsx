/* casestudy-missionmittelstand-content.jsx — Mission Mittelstand case study.
   Exports <MMCase/>, <MMDisclaimer/>, <MMPrototypeModal/>.
   Depends on core.jsx + casestudy-shared.jsx. */

const MMI = "mm/";
const PROTOTYPE_FILE = "mm/prototype-mobile.html";

/* ---- browser-chrome shot (desktop); URL is static text, never a link ---- */
function MMShot({ src, caption, alt = "Mission Mittelstand landing page", url = "mission-mittelstand.de", badge, badgeKind, placeholder }) {
  const open = useLightbox();
  return (
    <figure className="mm-shot">
      <div className="mm-shell">
        <div className="mm-chrome">
          <span className="mm-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="mm-url">{url}</span>
          {badge && <span className={"mm-badge" + (badgeKind ? " is-" + badgeKind : "")}>{badge}</span>}
        </div>
        {src ? (
          <button type="button" className="mm-shot-img" data-hot onClick={() => open({ src, alt, caption })} aria-label={"Expand image: " + alt}>
            <img src={src} alt={alt} loading="eager" />
            <span className="mm-zoom" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            </span>
          </button>
        ) : <Placeholder label={placeholder} />}
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

/* ---- phone bezel (mobile) ---- */
function MMPhone({ src, caption, alt = "Mission Mittelstand on mobile", placeholder, tag, tagKind }) {
  const open = useLightbox();
  return (
    <figure className="mm-phone">
      <div className="mm-phone-frame">
        {tag && <span className={"mm-phone-tag" + (tagKind ? " is-" + tagKind : "")}>{tag}</span>}
        {src ? (
          <button type="button" className="mm-phone-shot" data-hot onClick={() => open({ src, alt, caption })} aria-label={"Expand image: " + alt}>
            <img src={src} alt={alt} loading="eager" />
          </button>
        ) : <Placeholder label={placeholder} />}
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

function Placeholder({ label }) {
  return (
    <div className="mm-ph">
      <span className="mm-ph-ico" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 15l5-5 4 4 3-3 6 6" /><circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
      </span>
      <span className="mm-ph-t">{label || "Screen"}</span>
      <span className="mm-ph-s">Prototype export goes here</span>
    </div>
  );
}

/* ---- animated stat ---- */
function MMStat({ to, pre = "", suf = "", text, label }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const inView = () => { const r = el.getBoundingClientRect(); return r.top < (window.innerHeight || 800) * 0.85 && r.bottom > 0; };
    if (inView()) { setRun(true); return; }
    const onScroll = () => { if (inView()) { setRun(true); cleanup(); } };
    const t = setTimeout(() => { setRun(true); cleanup(); }, 2500);
    function cleanup() { window.removeEventListener("scroll", onScroll); clearTimeout(t); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to == null ? 0 : to); return; }
    let raf = 0, start = 0, done = false; const target = to == null ? 0 : to; const dur = 1300;
    const tick = (t) => { if (!start) start = t; const p = Math.min((t - start) / dur, 1); setVal(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) raf = requestAnimationFrame(tick); else done = true; };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => { if (!done) setVal(target); }, dur + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [run, to]);
  return (
    <div className="gm-stat" ref={ref}>
      <div className="gm-stat-n">{text ? text : <span className="accent">{pre}{val}{suf}</span>}</div>
      <div className="gm-stat-k">{label}</div>
    </div>
  );
}

function MPlain({ items }) {
  return <ul className="cs-steps">{items.map((t, i) => <li className="cs-li" key={i}>{t}</li>)}</ul>;
}
function KL({ items }) {
  return <ul className="cs-steps">{items.map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}</ul>;
}

/* the five gaps */
const GAPS = [
  ["01 · Value", "Sells the company harder than the worksheet", "The page gives Mission Mittelstand more space than the worksheet itself. The template's concrete value — what someone actually gets from downloading it — is barely explained."],
  ["02 · Momentum", "Two CTAs, a whole page apart", "There are only two calls to action, one near the top and one near the bottom. Miss the first and the next opportunity to download comes much later."],
  ["03 · Expectation", "A \u201Cdownload\u201D that opens a form", "Every CTA says \u201CVorlage herunterladen\u201D, but clicking it opens a modal asking for contact details. The PDF arrives later by email. That mismatch adds friction right at the point of conversion."],
  ["04 · Mobile UX", "Clumsy on a phone", "Large sections with little information, a layout that becomes awkward near the bottom and an oversized footer make the page feel heavier than it needs to on mobile — especially when mobile is the primary experience."],
  ["05 · Proof", "Trustpilot, wasted", "A 4.5 rating from 870 Trustpilot reviews is strong social proof, but it only appears inside the modal. It is not clickable and never gets a chance to support the landing page itself."],
];

/* before evidence (their landing, in phone frames) */
const BEFORE = [
  [MMI + "before-hero.png", "The hero promises \u201CVorlage herunterladen\u201D \u2014 a direct download."],
  [MMI + "before-modal.png", "The click opens a form instead, and the PDF arrives later by email."],
  [MMI + "before-modal-trustpilot.png", "The 4.5 Trustpilot rating sits inside the modal, out of sight until this point and with no link through."],
  [MMI + "before-wissen.png", "Large sections carry very little information, making the page feel unnecessarily long on mobile."],
  [MMI + "before-footer.png", "The oversized footer adds even more length to an already long mobile page."],
];

/* after — the redesign, section by section (benefit-led; gif leads) */
const VISUALS = [
  { n: "01", k: "Sticky CTA", h: "The button that follows you down", img: MMI + "sticky-button.gif",
    desc: "My favourite little detail, so it goes first. Scroll past the hero button and a slim CTA slides in and stays within thumb's reach – one tap to the form. It ducks back out the second the form is on screen, so it helps without ever nagging. That long, CTA-less stretch in the middle of the old page? Gone." },
  { n: "02", k: "Value", h: "What you get, in three quick lines", img: MMI + "after-value.png",
    desc: "Right below the hero, three short points make the worksheet's value clear – no scrolling, no guessing. You know what's in the file and why it might be useful before the form asks for your details." },
  { n: "03", k: "Trust", h: "Hard numbers, then a real face", img: MMI + "after-stats.png",
    desc: "The section starts with concrete numbers, then introduces Matthias – founder and managing director of Mission Mittelstand. The company gets a face, not just another row of logos, and the trust section feels noticeably more human." },
  { n: "04", k: "FAQ", h: "The section the original never had", img: MMI + "after-faq.png",
    desc: "The original page had no FAQ. I added one right before the form to answer questions that can come up at exactly that point: Is the template really free? What do I actually get? Why do you need my phone number? It also adds useful question-and-answer content to the page instead of leaving those details unexplained." },
  { n: "05", k: "Convert", h: "A CTA that tells the truth", img: MMI + "after-form.png",
    desc: "No modal, no surprise. The form sits right on the page, the button reads \u201CPDF kostenlos erhalten\u201D, and a line underneath explains why each field is there and what happens next. Nothing about the ask should catch you off guard." },
  { n: "06", k: "Footer", h: "A footer that knows when to stop", img: MMI + "after-footer.png",
    desc: "The old footer went on forever. I cut it down to the links that matter, tightened the layout and gave the page a cleaner ending." },
];

/* ---- main article ---- */
function MMCase({ onPrototype }) {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Case Study · Mission Mittelstand ·</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>Landing page · 2026</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">A lead magnet, <span className="accent">rebuilt to convert</span></h1>
              <p className="cs-sub">A mobile-first redesign of Mission Mittelstand's free worksheet landing page, with a clearer funnel, and fewer barriers to download.</p>
              <p className="cs-lead">
                Mission Mittelstand offers a free Mitarbeitergespräch (employee review) worksheet as a lead magnet. The page has one job: get visitors to download it. The brief was to redesign it with that goal in mind – mobile first, desktop secondary – while keeping it unmistakably Mission Mittelstand.
              </p>
              <p className="cs-lead">
                Much of the work went into two things: reshaping the information architecture and finding a new visual direction. The page still needed to feel unmistakably part of the Mission Mittelstand family, but with a fresher look that could give the existing brand a bit more room to breathe.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="#visuals" className="btn btn-accent ax-skip-btn" data-hot>
                  Skip to the visuals
                  <span className="btn-arrow btn-arrow--down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
                </a>
                <button type="button" className="btn ax-skip-btn" data-hot onClick={onPrototype}>
                  See the prototype
                  <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
                </button>
              </div>
            </Reveal>
            <Reveal className="ax-hero-media">
              <MMPhone src={MMI + "after-hero.png"} alt="Redesigned Mission Mittelstand mobile hero"
                caption={<><strong>The redesigned mobile hero.</strong></>} />
            </Reveal>
            <div className="ax-skip-wrap mm-cta-mobile">
              <a href="#visuals" className="btn btn-accent ax-skip-btn" data-hot>
                Skip to the visuals
                <span className="btn-arrow btn-arrow--down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
              </a>
              <button type="button" className="btn ax-skip-btn" data-hot onClick={onPrototype}>
                See the prototype
                <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mm-statband">
            <MMStat to={6} label="SECTIONS IN THE NEW FUNNEL DESIGNED" />
            <MMStat to={5} label="CONVERSION GAPS FOUND" />
            <MMStat to={3} label="PROTOTYPE DIRECTIONS COMPARED" />
          </div>
        </div>
      </section>

      {/* ── Nutshell ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Project in a Nutshell</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">My role</div>
              <div className="cs-meta-v">Funnel strategy, landing page UX, UX writing, mobile-first UI design and an interactive HTML prototype</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Format</div>
              <div className="cs-meta-v">Company brief, independent project</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Constraints</div>
              <div className="cs-meta-v">Existing Mission Mittelstand visual identity, mobile required, desktop secondary, feasible without component libraries</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Funnel Strategy", "Landing UX", "UX Writing", "Mobile-First UI", "Conversion Architecture", "Trust & Social Proof", "Interactive Prototype"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>What I delivered</h4>
              <MPlain items={[
                "A new information architecture for the worksheet landing page",
                "An interactive mobile HTML prototype as the main deliverable",
                "A desktop version kept deliberately lean",
                "Reworked CTA copy and a sticky CTA that stays visible while scrolling",
                "An inline form that replaces the original download modal and makes the download flow clear upfront",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>The hypothesis</h4>
              <MPlain items={[
                "Most traffic comes from targeted campaigns, so visitors arrive with some initial interest",
                "The original page weakens that intent through unclear value, friction in the download flow and a weak mobile experience",
                "A tighter funnel that explains the value earlier and reduces friction should increase downloads",
                "These remain hypotheses until tested with live data",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Potential friction points ── */}
      <section className="cs-section" id="process">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Potential Friction Points</h3></div>
          <p className="cs-p">
            The page sits at the end of targeted campaigns built around the worksheet. I looked at what happens once visitors land: how clearly the value comes across, how easy it is to act, and where the path to download starts creating friction. Five points stood out.
          </p>
          <div className="mm-gaps mm-gaps--5 cs-mt-l">
            {GAPS.map(([n, t, d]) => (
              <Reveal className="mm-gap" key={n}>
                <span className="mm-gap-n">{n}</span>
                <span className="mm-gap-t">{t}</span>
                <span className="mm-gap-d">{d}</span>
              </Reveal>
            ))}
          </div>

          <p className="cs-p cs-mt-l">
            A closer look at the original page:
          </p>
          <div className="mm-carousel cs-mt-s">
            {BEFORE.map(([src, cap]) => (
              <MMPhone key={src} src={src} tag="Before" tagKind="before" alt="Original Mission Mittelstand landing page"
                caption={cap} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How I rebuilt it ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">How I Rebuilt It</h3></div>
          <p className="cs-p">
            The process started with the existing journey: the page itself, the audience it speaks to and the path from campaign to download. From there, I worked through the structure, tested a few directions and took the strongest one into a working prototype.
          </p>
          <div className="mm-journey cs-mt-l">
            {[
              ["Read the page like a visitor", "Went through the original page as a visitor would — on a phone — and mapped the offer, the audience and the path from landing to download before changing anything."],
              ["Mark the friction and the upside", "Flagged the main friction points, along with the parts that had clear potential to work harder."],
              ["Commit to a hypothesis", "Turned those findings into a working direction: lead with the template's value, make the download flow clear and keep the CTA within easy reach."],
              ["Sketch three directions", "Built three structurally different first-pass prototypes and compared them side by side before choosing a direction."],
              ["Choose the strongest direction", "Picked the version that best supported the main task — getting the worksheet downloaded — and set the other two aside."],
              ["Take it to hi-fi", "Developed the chosen direction into a full high-fidelity design, keeping it recognisably Mission Mittelstand and realistic to build."],
              ["Make it clickable", "Built an interactive, mobile-first HTML prototype that could be tapped through like a real page rather than reviewed as a set of flat screens."],
            ].map(([b, t], i) => (
              <Reveal className="mm-jstep" key={i}>
                <span className="mm-jnode" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="mm-jcard">
                  <h4 className="mm-jt">{b}</h4>
                  <p className="mm-jd">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visuals (zigzag) ── */}
      <section className="cs-section" id="visuals">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">The Redesign, Section by Section</h3></div>
          <div className="ax-screens cs-mt-l">
            {VISUALS.map((s, i) => (
              <div className={"ax-screen" + (i % 2 ? " rev" : "")} key={s.n}>
                <Reveal className="ax-screen-text">
                  <div className="ax-index"><span className="ax-index-n">{s.n}</span><span className="ax-index-k">{s.k}</span></div>
                  <h4 className="ax-screen-h">{s.h}</h4>
                  <p className="cs-p">{s.desc}</p>
                </Reveal>
                <Reveal className="ax-screen-media">
                  <MMPhone src={s.img} alt={s.h} />
                </Reveal>
              </div>
            ))}
          </div>
          <Reveal className="mm-proto-cta cs-mt-l">
            <div>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Try the real thing</h4>
              <p className="cs-p" style={{ margin: 0 }}>The whole flow is a working, self-contained HTML prototype – best opened on a phone.</p>
            </div>
            <button type="button" className="btn btn-accent" data-hot onClick={onPrototype}>
              Try the mobile prototype
              <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Desktop ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">The Desktop MVP</h3></div>
          <Reveal>
            <p className="cs-p">
              Mobile was the priority, so I kept the desktop version deliberately lean: the same funnel and messaging, carried over into a working prototype without overworking the wider layout. With more time, I'd refine the scaling and give the mid-page sections more visual depth. The core experience is already there. Given more time I'd push the scaling and design richer mid-page sections — but the full story is already here.
            </p>
          </Reveal>
          <Reveal className="mm-mvp-shot">
            <MMShot src={MMI + "after-desktop.png"} url="New Desktop Hero" badge="After" badgeKind="after"
              alt="Redesigned Mission Mittelstand landing page on desktop"
              caption={<>Same funnel, wider canvas. The desktop version stays deliberately lean, with the core flow and messaging fully in place.</>} />
          </Reveal>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Learnings</h3></div>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Start with a clear hypothesis.", "A defined point of view gives the redesign direction and makes individual design decisions easier to evaluate and explain."],
              ["Make the CTA match the flow.", "When the copy reflects what actually happens next, the conversion path feels clearer and avoids unnecessary surprise at a critical moment."],
              ["Show the value early.", "On a lead-magnet page, the template's concrete benefits need to be clear from the start. The company story can support them further down the page."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

/* ---- Interactive-prototype download modal ---- */
function MMPrototypeModal({ open, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Mobile prototype"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="contact-modal-card mm-proto-card">
        <button className="legal-x contact-modal-x" onClick={onClose} aria-label="Close" data-hot ref={closeRef}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div className="contact-modal-head">
          <MonoLabel>Mobile prototype</MonoLabel>
          <h2 className="contact-modal-title">See it on your phone</h2>
          <p className="contact-modal-sub">This is a self-contained, offline page — it lives only as this one file. Download it, then open it in any browser (a phone, or your browser's mobile view, works best).</p>
        </div>
        <div className="mm-proto-actions">
          <a className="btn btn-accent" href={PROTOTYPE_FILE} download="mission-mittelstand-prototype.html" data-hot onClick={onClose}>
            Download the prototype
            <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
          </a>
          <button className="btn" onClick={onClose} data-hot>Maybe later</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Trademark / usage disclaimer (rendered by the shell, below the closing CTA) ---- */
function MMDisclaimer() {
  return (
    <section className="cs-section mm-disclaimer-sec">
      <div className="cs-wrap">
        <div className="mm-disclaimer">
          <span className="mm-disclaimer-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
          </span>
          <div>
            <p>
              <strong style={{ color: "var(--ink-soft)" }}>Trademarks &amp; usage.</strong> "Mission Mittelstand", the BVMW mark, and all related names, logos, imagery and brand assets shown here are the property of their respective owners. I don't own or claim any rights to them.
            </p>
            <p>
              This case study was produced for a brief from the company, and all brand materials shown were provided to me for that purpose — reproduced here solely to document my work. It is an independent project: not affiliated with, endorsed by, or an official product of Mission Mittelstand, and it was never deployed on any live site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MMCase, MMDisclaimer, MMPrototypeModal });
