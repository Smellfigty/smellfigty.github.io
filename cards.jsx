/* cards.jsx – CaseCard, WorkList, About, Certificates, Contact, Marquee */

/* highlight [[keyword]] markers in brand accent */
function hl(str) {
  if (typeof str !== "string") return str;
  return str.split(/\[\[(.+?)\]\]/g).map((p, i) =>
    i % 2 === 1 ? <span key={i} className="accent">{p}</span> : p
  );
}

function CaseGo() {
  return (
    <span className="case-go" aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* Bespoke brand lockups for projects without a polished raster logo –
   built in CSS/SVG so they share the dark "app-icon" tile language of
   AxiomLens & MigroPlan instead of clashing white text blocks. */
function BrandLogo({ kind }) {
  if (kind === "axiom") {
    return (
      <div className="brandlogo brandlogo-axiom" aria-hidden="true">
        <svg className="brandlogo-ico" viewBox="0 0 48 48">
          <path d="M11 7 V37 H41" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
          <path d="M14 32 L21 26 L28 29 L35 17" fill="none" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30.5 16 L36 15 L35 20.5" fill="none" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="14" cy="32" r="2.5" fill="currentColor" />
          <circle cx="21" cy="26" r="2.5" fill="currentColor" />
          <circle cx="28" cy="29" r="2.5" fill="currentColor" />
        </svg>
        <span className="brandlogo-word">AxiomLens</span>
      </div>
    );
  }
  if (kind === "gaming") {
    return (
      <div className="brandlogo brandlogo-gaming" aria-hidden="true">
        <svg className="brandlogo-ico" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="17.4" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M17.6 13.6 31.5 22 17.6 30.4Z" fill="currentColor" />
        </svg>
        <span className="brandlogo-word">B2B</span>
        <span className="brandlogo-sub">Mobile Gaming</span>
      </div>
    );
  }
  if (kind === "bachata") {
    return (
      <div className="brandlogo brandlogo-bachata" aria-hidden="true">
        <svg className="brandlogo-ico" viewBox="0 0 44 44">
          <path d="M28 7a16 16 0 1 0 0 30 12.6 12.6 0 1 1 0-30Z" fill="currentColor" />
        </svg>
        <span className="brandlogo-word">Bachata</span>
        <span className="brandlogo-sub">in Dubai</span>
      </div>
    );
  }
  return null;
}

function CaseMedia({ c }) {
  return (
    <div className="case-media">
      <span className="case-ghost" aria-hidden="true">{c.n}</span>
      <div className="case-plate" style={c.plateStyle || {}}>
        {c.logo
          ? <BrandLogo kind={c.logo} />
          : c.img
            ? <img src={c.img} alt={c.title + " – " + c.kicker} loading="lazy" style={c.plateImgStyle || {}} />
            : <span className="case-mark" aria-hidden="true">{c.mark || c.title.slice(0, 2)}<span className="case-mark-dot">.</span></span>}
      </div>
      {c.soon && <span className="badge-new case-soon-badge">{UI.soonBadge}</span>}
    </div>
  );
}

function CaseCardInner({ c }) {
  const Wrapper = c.soon ? "div" : "a";
  const extra = c.soon ? {} : { href: c.url, target: c.url.startsWith("http") ? "_blank" : undefined, rel: "noopener" };
  return (
    <Wrapper className="case" data-hot {...extra}>
      <CaseMedia c={c} />
      {!c.soon && <CaseGo />}
      <div className="case-body">
        <div className="row" style={{ justifyContent: "space-between", gap: "1rem" }}>
          <span className="case-index" style={{ color: "var(--accent)" }}>{c.type}</span>
          <span className="case-index">{c.year}</span>
        </div>
        <div className="stack" style={{ gap: ".25rem" }}>
          <h3 className="case-title">{c.title}</h3>
          <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>{c.kicker}</span>
        </div>
        <p className="case-desc">{c.desc}</p>
        <div className="case-tags">
          {c.tags.map((t, i) => (
            <span key={t} className={"tag" + (i === 0 ? " tag-accent" : "")}>{t}</span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

function CaseCard({ c, d }) {
  return (
    <Reveal as="div" d={d} className="case-wrap">
      <CaseCardInner c={c} />
    </Reveal>
  );
}

/* ---------- Editorial work list with cursor peek ---------- */
function WorkList({ items }) {
  const peekRef = useRef(null);
  const wrapRef = useRef(null);
  const [src, setSrc] = useState(null);
  const onMove = (e) => {
    const p = peekRef.current; if (!p) return;
    p.style.left = e.clientX + 28 + "px";
    p.style.top = e.clientY - 20 + "px";
  };
  return (
    <div className={"worklist" + (src ? " peeking" : "")} ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setSrc(null)}>
      {items.map((c) => {
        const Wrapper = c.soon ? "div" : "a";
        const extra = c.soon ? {} : { href: c.url, target: c.url.startsWith("http") ? "_blank" : undefined, rel: "noopener" };
        return (
          <Reveal key={c.id} as="div" className="workrow-reveal">
            <Wrapper className="workrow" data-hot {...extra}
              onMouseEnter={() => setSrc(c.soon ? "soon" : c.img)}>
              <span className="mono" style={{ color: "var(--ink-faint)" }}>{c.n}</span>
              <span className="stack" style={{ gap: ".3rem" }}>
                <span className="workrow-title">{c.title}{c.soon && <span className="badge-new" style={{ marginLeft: ".7rem", verticalAlign: "middle" }}>{UI.workSoon}</span>}</span>
                <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>{c.kicker}</span>
              </span>
              <span className="workrow-meta">
                {c.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
              </span>
            </Wrapper>
          </Reveal>
        );
      })}
      <div className={"workrow-peek" + (src ? " show" : "")} ref={peekRef} aria-hidden="true">
        {src && src !== "soon" && <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "14%", background: "var(--bg-2)" }} />}
        {src === "soon" && <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", backgroundImage: "repeating-linear-gradient(135deg, color-mix(in oklab, var(--accent) 18%, transparent) 0 2px, transparent 2px 13px)" }}><span className="badge-new">{UI.workComingSoon}</span></div>}
      </div>
    </div>
  );
}

/* ---------- Marquee ---------- */
function Marquee({ items = DISCIPLINES }) {
  const seq = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {seq.map((t, i) => (
          <span className="marq-item" key={i}>
            <span className="marq-dot"></span>
            <span className="display" style={{ fontSize: "clamp(1.6rem,4vw,3rem)" }}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- About (3 selectable variants) ---------- */
// Toolkit chips are localized via UI.toolkit (see i18n.jsx).

function AboutHead() {
  return (
    <div className="section-head">
      <Reveal><MonoLabel>{UI.secAbout}</MonoLabel></Reveal>
    </div>
  );
}

/* About – Dossier (photo left, everything about me on the right) */
function AboutDossier({ showPhoto }) {
  return (
    <div className="about-grid" style={{ display: "grid", gridTemplateColumns: showPhoto ? ".72fr 1.28fr" : "1fr", gap: "clamp(2rem,4vw,3.5rem)", alignItems: "stretch" }}>
      {showPhoto && (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.2rem" }}>
          <Reveal d="1" className="dossier-card">
            <div className="dossier-portrait">
              <img src={PROFILE.photoNeon} alt="Aleksandr Medved" />
            </div>
            <div className="row" style={{ justifyContent: "flex-start", gap: "1rem", padding: ".8rem 1rem" }}>
              <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>{PROFILE.first} <span style={{ color: "var(--accent)" }}>{PROFILE.alias}</span> {PROFILE.last}</span>
            </div>
          </Reveal>
          <Reveal d="5">
            <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", background: "color-mix(in oklab, var(--card) 82%, transparent)", padding: ".85rem 1rem", display: "flex", flexDirection: "column", gap: ".65rem" }}>
              <MonoLabel>{UI.toolkitLabel}</MonoLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                {UI.toolkit.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </Reveal>
        </div>
      )}

      <div className="stack" style={{ gap: "1.5rem", height: "100%" }}>
        <Reveal as="h2" className="display" d="2" style={{ fontSize: "clamp(1.6rem,3.2vw,2.7rem)" }}>
          {hl(UI.aboutH2)}
        </Reveal>
        {Array.isArray(UI.aboutLead)
          ? <div className="stack" style={{ gap: "0.55em" }}>{UI.aboutLead.map((para, i) => <Reveal key={i} as="p" className="lead" d="3" style={{ margin: 0 }}>{hl(para)}</Reveal>)}</div>
          : <Reveal as="p" className="lead" d="3" style={{ margin: 0 }}>{hl(UI.aboutLead)}</Reveal>}
        <Reveal d="3" className="row" style={{ gap: "2.4rem", flexWrap: "wrap", marginTop: ".2rem" }}>
          <div className="stack"><span className="fact-k">5+</span><span className="fact-v">{UI.factPracticeV}</span></div>
          <div className="stack"><span className="fact-k">3</span><span className="fact-v">{UI.factLangV} DE <span style={{color:"var(--accent)"}}>/ </span>EN <span style={{color:"var(--accent)"}}>/ </span>RU</span></div>
          <div className="stack"><span className="fact-k">{UI.factLocK}</span><span className="fact-v">{UI.factLocV}</span></div>
        </Reveal>
        <Reveal d="4" className="stack" style={{ gap: ".7rem", marginTop: "auto" }}>
          <MonoLabel>{UI.capMatrix}</MonoLabel>
          <div className="cap-matrix">
            {DISCIPLINES.map((t) => <span key={t} className="cap-cell">{t}</span>)}
          </div>
        </Reveal>
        {!showPhoto && (
          <Reveal d="5" className="stack" style={{ gap: ".7rem", marginTop: ".2rem" }}>
            <MonoLabel>{UI.toolkitLabel}</MonoLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
              {UI.toolkit.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function AboutSection({ showPhoto = true }) {
  return (
    <section className="section" id="about">
      <div className="wrap-wide">
        <AboutHead />
        <AboutDossier showPhoto={showPhoto} />
      </div>
    </section>
  );
}

/* ---------- Certificates (with hover preview of the actual document) ---------- */
function CertPreview({ c }) {
  return (
    <div className="cert-preview-card">
      <div className="cert-pv-img">
        <img src={c.img} alt={c.name + " – certificate"} loading="lazy" />
      </div>
      <div className="cert-pv-body">
        <span className="cert-pv-name">{c.name}</span>
        <span className="cert-pv-by">{c.by} · {c.year}</span>
      </div>
    </div>
  );
}

/* ---------- Certificate modal (full detail, in the new design language) ---------- */
function CertModal({ cert, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!cert) return null;
  return (
    <div
      className="cert-modal"
      role="dialog"
      aria-modal="true"
      aria-label={cert.name + " – certificate"}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="cert-modal-card">
        <button className="cert-modal-x" onClick={onClose} aria-label={UI.navClose} data-hot ref={closeRef}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="cert-modal-grid">
          {/* Document */}
          <figure className="cert-modal-doc">
            <img src={cert.img} alt={cert.name + " – certificate document"} />
          </figure>

          {/* Details */}
          <div className="cert-modal-body">
            <MonoLabel>{UI.certModalLabel}</MonoLabel>
            <h3 className="cert-modal-title">{cert.name}</h3>
            <p className="cert-modal-issuer">{cert.by}</p>

            <dl className="cert-modal-dl">
              <div className="cert-modal-row">
                <dt>{UI.certDate}</dt>
                <dd>{cert.date}</dd>
              </div>
              {cert.details.map(([label, value]) => (
                <div className="cert-modal-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <div className="cert-modal-actions">
              <a
                className="btn btn-accent btn-arrow"
                href={cert.verify}
                target="_blank"
                rel="noopener"
                data-hot
              >
                {UI.certVerify}
                <span className="btn-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <button className="btn" onClick={onClose} data-hot>{UI.navClose}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificatesSection() {
  const peekRef = useRef(null);
  const [active, setActive] = useState(null);
  const [openCert, setOpenCert] = useState(null);
  // pre-warm certificate scans so the hover preview appears instantly
  useEffect(() => {
    CERTS.forEach((c) => { if (c.img) { const i = new Image(); i.src = c.img; } });
  }, []);
  const onMove = (e) => {
    const p = peekRef.current; if (!p) return;
    const w = window.innerWidth;
    const flip = e.clientX > w - 400;
    p.style.left = (flip ? e.clientX - 380 : e.clientX + 28) + "px";
    p.style.top = Math.max(16, Math.min(e.clientY - 140, window.innerHeight - 360)) + "px";
  };
  const open = (e, c) => {
    e.preventDefault();
    setActive(null);
    setOpenCert(c);
  };
  return (
    <section className="section" id="certificates">
      <div className="wrap-wide">
        <div className="section-head">
          <Reveal><MonoLabel>{UI.secCerts}</MonoLabel></Reveal>
          <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>{UI.certsHint}</Reveal>
        </div>
        <div className={"certlist" + (active ? " peeking" : "")} onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
          {CERTS.map((c, i) => (
            <Reveal key={c.name} d={String(i + 1)}>
              <a className="cert" href={c.url} data-hot onMouseEnter={() => setActive(c)} onClick={(e) => open(e, c)}>
                <span className="stack" style={{ gap: ".25rem" }}>
                  <span className="cert-name">{c.name}</span>
                  <span className="cert-by">{c.by}</span>
                </span>
                <span className="row" style={{ gap: "1.2rem" }}>
                  <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>{c.year}</span>
                  <span aria-hidden="true" style={{ color: "var(--accent)" }}>↗</span>
                </span>
              </a>
            </Reveal>
          ))}
          <div className={"cert-peek" + (active ? " show" : "")} ref={peekRef} aria-hidden="true">
            {active && <CertPreview c={active} />}
          </div>
        </div>
      </div>
      {openCert && <CertModal cert={openCert} onClose={() => setOpenCert(null)} />}
    </section>
  );
}

/* ---------- Contact (keeps the Formspree form) ---------- */
function ContactForm() {
  const f = useContactForm();
  return (
    <form className="contact-form" action={FORMSPREE} method="POST" noValidate onSubmit={f.submit}>
      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">{UI.cfName}</span>
          <input name="name" type="text" required autoComplete="name" placeholder={UI.cfNamePh} data-hot
            value={f.name} onChange={f.onName} />
        </label>
        <label className="cf-field">
          <span className="cf-label">{UI.cfEmail}</span>
          <input ref={f.emailRef} name="email" type="email" required autoComplete="email" placeholder={UI.cfEmailPh} data-hot
            value={f.email} onChange={f.onEmail} aria-invalid={f.showEmailErr ? "true" : undefined} />
          {f.showEmailErr && <span className="cf-note err" role="alert" aria-live="polite">{UI.cfEmailErr}</span>}
        </label>
      </div>
      <label className="cf-field">
        <span className="cf-label">{UI.cfMessage}</span>
        <textarea name="message" rows="4" required maxLength={f.MAX} placeholder={UI.cfMsgPh} data-hot
          value={f.message} onChange={f.onMessage}></textarea>
        <span className="cf-count" data-full={f.atMax ? "true" : undefined}>{f.message.length} / {f.MAX}</span>
      </label>
      <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" style={{ display: "none" }} />
      <div className="row" style={{ gap: "1rem", flexWrap: "wrap", marginTop: ".2rem" }}>
        <button type="submit" className="btn btn-accent" data-hot disabled={!f.canSend}>
          {f.status === "sending" ? UI.cfSending : UI.cfSend}
          <span className="btn-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </button>
        {f.status === "ok" && <span className="cf-note ok">{UI.cfOk}</span>}
        {f.status === "error" && <span className="cf-note err">{UI.cfErr}</span>}
      </div>
    </form>
  );
}

function ContactSection() {
  const [a, b] = PROFILE.email.split("@");
  return (
    <section className="section" id="contact">
      <div className="wrap-wide">
        <div className="section-head">
          <Reveal><MonoLabel>{UI.secContact}</MonoLabel></Reveal>
          <Reveal as="span" className="avail" d="1"><span className="dot"></span> {UI.contactAvail}</Reveal>
        </div>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4.5rem)", alignItems: "start" }}>
          <div className="stack contact-info-col" style={{ gap: "1.6rem" }}>
            <Reveal as="h2" className="display" d="1" style={{ fontSize: "clamp(1.8rem,3.4vw,2.9rem)", maxWidth: "15ch" }}>
              {UI.contactH2}
            </Reveal>
            <Reveal d="2">
              <a className="contact-mail" href={"mailto:" + PROFILE.email} data-hot style={{ fontSize: "clamp(1.4rem,3.2vw,2.4rem)" }}>
                {a}<span className="at">@</span>{b}
              </a>
            </Reveal>
            {/* Desktop: chips with labels */}
            <Reveal d="3" className="row contact-socials-desktop" style={{ gap: ".7rem", flexWrap: "wrap", marginTop: ".4rem" }}>
              {SOCIALS.map((s) => <SocialLink key={s.label} s={s} className="social-chip" />)}
            </Reveal>
            {/* Mobile: icon-only large buttons, centered */}
            <div className="contact-socials-mobile">
              {SOCIALS.map((s) => <SocialLink key={s.iconKey} s={s} showLabel={false} className="contact-soc-icon-btn" />)}
            </div>
          </div>
          <Reveal d="2" className="contact-form-wrap">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  CaseCard, CaseCardInner, CaseGo, CaseMedia, WorkList, Marquee, AboutSection, CertificatesSection, ContactSection,
});
