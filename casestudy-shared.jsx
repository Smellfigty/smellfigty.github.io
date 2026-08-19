/* casestudy-shared.jsx – reusable case-study chrome:
   maskStyleCS, CaseLogo, ReadingProgress, CaseStudyNav (full nav 1:1 with homepage),
   ContactModal (Formspree), CaseEndCTA (Work with me · See other case studies).
   Loaded on every case-study page. Depends on core.jsx (FORMSPREE, MonoLabel, ThemeToggle, useStuck). */

/* ---- smooth anchor scroll (intercepts all a[href^="#"] on the page) ---- */
function useSmoothAnchorScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 70,
          behavior: "smooth",
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

/* ---- shared helpers ---- */
function maskStyleCS(uri) {
  const v = 'url("' + (uri || "") + '")';
  return { WebkitMaskImage: v, maskImage: v };
}

/* Logo that links back to the portfolio homepage */
function CaseLogo() {
  const I = (typeof window !== "undefined" && window.ICONS) || {};
  return (
    <a href="index.html#top" className="row" data-hot style={{ gap: ".62rem" }} aria-label="Aleksandr Medved – home">
      <span className="sm-mark" aria-hidden="true">
        <span className="sm-mark-layer sm-mark-ink" style={maskStyleCS(I.logoInk)}></span>
        <span className="sm-mark-layer sm-mark-accent" style={maskStyleCS(I.logoAccent)}></span>
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span className="brand-name" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "-.02em" }}>Aleksandr Medved</span>
        <span className="mono-sm brand-sub" style={{ color: "var(--ink-faint)", marginTop: 3 }}><span className="brand-line">Product Designer</span><span className="brand-sep" style={{ color: "var(--accent)" }}> // </span><span className="brand-line">Smellfigty</span></span>
      </span>
    </a>
  );
}

/* Slim reading-progress bar driven by scroll position */
function ReadingProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (ref.current) ref.current.style.width = (p * 100).toFixed(2) + "%";
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="cs-progress" aria-hidden="true"><div className="cs-progress-bar" ref={ref}></div></div>;
}

/* Nav links for case-study pages – labels come from i18n NAV, hrefs point to the
   same-folder index.html so they work in every language folder. */
function csNav() {
  return (typeof NAV !== "undefined" ? NAV : []).map((n) => ({
    label: n.label,
    href: "index.html" + n.href,
  }));
}

/* Per-page language links: same filename, swapped language folder, so switching
   language opens the SAME case study in the chosen language.
   EN lives at prod/<file>, DE at prod/de/<file>, RU at prod/ru/<file>. */
function csLangLinks() {
  const lang = (typeof window !== "undefined" && window.__LANG) || "en";
  let file = "index.html";
  try { file = (location.pathname.split("/").filter(Boolean).pop()) || file; } catch (_) {}
  const base = lang === "en" ? "" : "../";
  const hrefFor = (code) => (code === "en" ? base + file : base + code + "/" + file);
  return [["EN", "en"], ["DE", "de"], ["RU", "ru"]].map(([label, code]) => ({
    label, href: hrefFor(code), active: code === lang,
  }));
}

/* compact language dropdown – mobile case-study header */
function CSLangMenu() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const links = csLangLinks();
  const cur = links.find((l) => l.active) || links[0];
  return (
    <span className="lang-menu" ref={ref}>
      <button type="button" className="theme-toggle lang-menu-btn" data-hot aria-label="Language" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {cur.label}
        <svg className="lang-caret" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <span className="lang-menu-pop">
          {links.filter((l) => !l.active).map((l) => (
            <a key={l.label} href={l.href} className={l.active ? "active" : ""} data-hot onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </span>
      )}
    </span>
  );
}

function CSLangSwitch({ style }) {
  return (
    <span className="lang" aria-label="Language" style={style}>
      {csLangLinks().map((l) => (
        <a key={l.label} className={l.active ? "active" : ""} href={l.href} data-hot>{l.label}</a>
      ))}
    </span>
  );
}

/* Full navigation bar – 1:1 with the homepage Nav, adapted for case-study pages.
   Links point to index.html sections; "Get in touch" opens the contact modal via onContact prop. */
function CaseStudyNav({ theme, onToggleTheme, onContact }) {
  const stuck = useStuck();
  const [open, setOpen] = useState(false);
  useSmoothAnchorScroll();
  return (
    <header className={"nav" + (stuck ? " stuck" : "")}>
      <div className="wrap-wide nav-inner">
        <CaseLogo />
        <nav className="nav-links desktop">
          {csNav().map((n) => (
            <a key={n.href} href={n.href} className="nav-link" data-hot>{n.label}</a>
          ))}
          <CSLangSwitch />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" className="btn" data-hot style={{ padding: ".7em 1.1em" }} onClick={onContact}>{UI.navGetInTouch}</button>
        </nav>
        <span className="nav-toggle">
          <CSLangMenu />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="btn" data-hot onClick={() => setOpen((v) => !v)} style={{ padding: ".55em .9em" }} aria-label="Menu">
            {open ? UI.navClose : UI.navMenu}
          </button>
        </span>
      </div>
      {open && (
        <div className="wrap-wide" style={{ paddingBottom: "1.2rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>
          {csNav().map((n) => (
            <a key={n.href} href={n.href} className="nav-link" data-hot onClick={() => setOpen(false)} style={{ fontSize: "1.1rem", padding: ".4rem 0" }}>{n.label}</a>
          ))}
          <button type="button" className="btn btn-accent" data-hot style={{ marginTop: ".6rem", alignSelf: "flex-start" }}
            onClick={() => { setOpen(false); onContact && onContact(); }}>{UI.navGetInTouch}</button>
        </div>
      )}
    </header>
  );
}

Object.assign(window, { maskStyleCS, CaseLogo, ReadingProgress, CaseStudyNav, csNav, csLangLinks, CSLangSwitch, CSLangMenu });

/* ---- modals ---- */

function ContactModal({ open, onClose }) {
  const f = useContactForm();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    f.reset();
    closeRef.current && closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Contact"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="contact-modal-card">
        <button className="legal-x contact-modal-x" onClick={onClose} aria-label={UI.navClose} data-hot ref={closeRef}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="contact-modal-head">
          <MonoLabel>{UI.navGetInTouch}</MonoLabel>
          <h2 className="contact-modal-title">{UI.csContactTitle}</h2>
          <p className="contact-modal-sub">{UI.csContactSub}</p>
        </div>

        {f.status === "ok" ? (
          <div className="contact-modal-done">
            <div className="contact-modal-check" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="contact-modal-thanks">{UI.cfOk}</p>
            <button className="btn" onClick={onClose} data-hot>{UI.navClose}</button>
          </div>
        ) : (
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
              {f.status === "error" && <span className="cf-note err">{UI.cfErr}</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* Closing band for every case study: two clear next steps. */
function CaseEndCTA({ onContact, homeHref = "index.html" }) {
  return (
    <section className="cs-section cs-end">
      <div className="cs-prose cs-end-inner">
        <MonoLabel>{UI.csEndKicker}</MonoLabel>
        <h3 className="cs-h cs-end-title">{UI.csEndTitle}</h3>
        <p className="cs-p cs-end-sub">{UI.csEndSub}</p>
        <div className="cs-end-actions">
          <button type="button" className="btn btn-accent" data-hot onClick={onContact}>{UI.csEndWork}</button>
          <a className="btn" href={homeHref + "#work"} data-hot>{UI.csEndOther}</a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ContactModal, CaseEndCTA });


/* ============================================================
   Lightbox – clickable images that expand to a full-screen view.
   Wrap the app in <LightboxProvider>, then use <ZoomImg> anywhere.
   ============================================================ */
const LightboxCtx = React.createContext(null);
function useLightbox() { return React.useContext(LightboxCtx); }

function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="lbx" role="dialog" aria-modal="true" aria-label={item.alt || "Image"}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lbx-x" onClick={onClose} aria-label="Close" data-hot>
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      <figure className="lbx-fig" onMouseDown={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt || ""} />
        {item.caption && <figcaption className="lbx-cap">{item.caption}</figcaption>}
      </figure>
    </div>
  );
}

function LightboxProvider({ children }) {
  const [item, setItem] = useState(null);
  const open = useCallback((it) => setItem(it), []);
  const close = useCallback(() => setItem(null), []);
  return (
    <LightboxCtx.Provider value={open}>
      {children}
      {item && <Lightbox item={item} onClose={close} />}
    </LightboxCtx.Provider>
  );
}

/* Clickable figure: shows an expand affordance, opens the lightbox on click. */
function ZoomImg({ src, alt, caption, capAccent, className = "", imgClass = "" }) {
  const open = useLightbox();
  const cap = caption && (
    <figcaption className="cs-cap">{capAccent && <span className="accent">{capAccent} </span>}{caption}</figcaption>
  );
  return (
    <figure className={"cs-fig zoomfig " + className}>
      <button type="button" className={"zoomfig-btn " + imgClass} data-hot
        onClick={() => open({ src, alt, caption })} aria-label={"Expand image" + (alt ? ": " + alt : "")}>
        <img src={src} alt={alt || ""} loading="lazy" />
        <span className="zoomfig-ico" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </button>
      {cap}
    </figure>
  );
}

Object.assign(window, { LightboxProvider, useLightbox, ZoomImg });
