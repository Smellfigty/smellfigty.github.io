/* legal.jsx – hash-routed Impressum & Privacy modals (new design language) */

/* render one paragraph: string = plain text; array = rich segments */
function LegalPara({ parts }) {
  if (typeof parts === "string") return <p className="legal-p">{parts}</p>;
  return (
    <p className="legal-p">
      {parts.map((seg, i) => {
        if (seg && seg.br) return <br key={i} />;
        if (typeof seg === "string") return <React.Fragment key={i}>{seg}</React.Fragment>;
        if (seg && seg.href) return (
          <a key={i} className="legal-link" href={seg.href} target="_blank" rel="noopener" data-hot>{seg.text}</a>
        );
        return null;
      })}
    </p>
  );
}

function LegalOperator({ op }) {
  return (
    <div className="legal-operator">
      <span className="legal-h">{op.heading}</span>
      <address className="legal-address">
        <span className="legal-operator-name">{op.name}</span>
        {op.lines.map((l, i) => <span key={i}>{l}</span>)}
      </address>
      <dl className="legal-contacts">
        {op.contacts.map((c) => (
          <div className="legal-contact-row" key={c.label}>
            <dt>{c.label}</dt>
            <dd><a className="legal-link" href={c.href} target="_blank" rel="noopener" data-hot>{c.text}</a></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function LegalModal({ which, onClose }) {
  const data = which ? LEGAL[which] : null;
  const closeRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!which) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    closeRef.current && closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [which, onClose]);

  if (!which || !data) return null;
  return (
    <div
      className="legal-modal"
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="legal-card">
        <header className="legal-head">
          <div className="stack" style={{ gap: ".5rem", minWidth: 0 }}>
            <MonoLabel>{data.kicker}</MonoLabel>
            <h2 className="legal-title">{data.title}</h2>
          </div>
          <button className="legal-x" onClick={onClose} aria-label={UI.navClose} data-hot ref={closeRef}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="legal-body" ref={bodyRef}>
          {data.operator && <LegalOperator op={data.operator} />}
          {data.sections.map((s, i) => (
            <section className="legal-section" key={i}>
              <div className="legal-section-head">
                {s.num && <span className="legal-num">{s.num}</span>}
                <h3 className="legal-h">{s.heading}</h3>
              </div>
              <div className="legal-paras">
                {s.body.map((p, j) => <LegalPara key={j} parts={p} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LegalModal, LegalPara });
