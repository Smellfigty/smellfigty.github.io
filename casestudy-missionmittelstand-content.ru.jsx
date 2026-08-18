/* casestudy-missionmittelstand-content.ru.jsx — Mission Mittelstand, русская версия.
   Та же структура и компоненты, что и в casestudy-missionmittelstand-content.jsx,
   русский текст в тоне migroplan / axiomlens / bachata.
   Экспортирует <MMCase/>, <MMDisclaimer/>, <MMPrototypeModal/>.
   Загружается из prod/ru/ — отсюда пути «../». */

const MMI = "../mm/";
const PROTOTYPE_FILE = "../mm/prototype-mobile.html";

/* ---- скриншот с браузерным «хромом» (десктоп); URL — статичный текст, не ссылка ---- */
function MMShot({ src, caption, alt = "Лендинг Mission Mittelstand", url = "mission-mittelstand.de", badge, badgeKind, placeholder }) {
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
          <button type="button" className="mm-shot-img" data-hot onClick={() => open({ src, alt, caption })} aria-label={"Открыть изображение: " + alt}>
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

/* ---- рамка телефона (мобайл) ---- */
function MMPhone({ src, caption, alt = "Mission Mittelstand на телефоне", placeholder, tag, tagKind }) {
  const open = useLightbox();
  return (
    <figure className="mm-phone">
      <div className="mm-phone-frame">
        {tag && <span className={"mm-phone-tag" + (tagKind ? " is-" + tagKind : "")}>{tag}</span>}
        {src ? (
          <button type="button" className="mm-phone-shot" data-hot onClick={() => open({ src, alt, caption })} aria-label={"Открыть изображение: " + alt}>
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
      <span className="mm-ph-t">{label || "Экран"}</span>
      <span className="mm-ph-s">Сюда идет экспорт прототипа</span>
    </div>
  );
}

/* ---- анимированная метрика ---- */
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

/* пять слабых мест */
const GAPS = [
  ["01 · Ценность", "Компания продается сильнее, чем сама шпаргалка", "Mission Mittelstand получает на странице больше внимания, чем сама шпаргалка. Ее практическая ценность — что именно получает человек после скачивания – почти не раскрыта."],
  ["02 · Темп", "Два CTA и целая страница между ними", "На странице всего два призыва к действию: один ближе к началу, второй почти в самом конце. Если пропустить первый, следующая возможность скачать появляется заметно позже."],
  ["03 · Ожидание", "«Скачать» открывает форму", "Каждый CTA обещает «Vorlage herunterladen» (скачать документ), но по клику открывается модальное окно с формой для контактных данных. PDF приходит позже по e-mail. Сценарий расходится с обещанием кнопки и добавляет трение в момент, когда пользователь уже готов действовать."],
  ["04 · Мобильный UX", "Мобильная версия раздута", "Крупные секции с небольшим количеством информации, верстка, которая начинает рассыпаться ближе к низу, и огромный футер делают страницу тяжелее, чем нужно – особенно с учетом того, что это mobile-first."],
  ["05 · Отзывы", "Trustpilot, спрятанный в модалке", "Рейтинг в 4,5 звезды на основе 870 отзывов – сильный сигнал доверия, но он появляется только внутри модального окна. На самом лендинге рейтинг не работает на доверие и даже не ведет на Trustpilot."],
];

/* «до» — их лендинг, в рамках телефона */
const BEFORE = [
  [MMI + "before-hero.png", "Первый экран обещает «Vorlage herunterladen» – то есть прямое скачивание."],
  [MMI + "before-modal.png", "Но по клику открывается форма, а PDF приходит позже по e-mail."],
  [MMI + "before-modal-trustpilot.png", "Рейтинг Trustpilot 4,5 виден только внутри модалки – до этого он скрыт и никуда не ведет."],
  [MMI + "before-wissen.png", "Большие секции несут мало информации и без необходимости растягивают мобильную страницу."],
  [MMI + "before-footer.png", "Огромный футер еще сильнее растягивает и без того длинную мобильную страницу."],
];

/* «после» — редизайн по секциям (от пользы; ведет gif) */
const VISUALS = [
  { n: "01", k: "Липкий CTA", h: "Кнопка, которая всегда под рукой", img: MMI + "sticky-button.gif",
    desc: "Моя любимая мелочь, поэтому она идет первой. Как только юзер прокручивает кнопку в hero, снизу появляется «липкий» CTA: он всегда под рукой, а до формы – один тап. Как только сама форма появляется на экране, CTA снова исчезает. Так я решил проблему длинного куска старой страницы без единой кнопки." },
  { n: "02", k: "Ценность", h: "Что вы получаете – в трех коротких пунктах", img: MMI + "after-value.png",
    desc: "Сразу под первым экраном три коротких пункта объясняют, чем полезна шпаргалка – без лишней прокрутки и догадок. Еще до формы понятно, что внутри файла и чем он может быть полезен." },
  { n: "03", k: "Доверие", h: "Сначала цифры, потом человек", img: MMI + "after-stats.png",
    desc: "Секция начинается с конкретных цифр, а затем появляется Маттиас – основатель и управляющий директор Mission Mittelstand. У компании появляется лицо, а сам блок доверия становится заметно человечнее, чем просто очередной ряд логотипов." },
  { n: "04", k: "FAQ", h: "То, чего не хватало оригиналу", img: MMI + "after-faq.png",
    desc: "В оригинале FAQ вообще не было. Я добавил его прямо перед формой – для вопросов, которые как раз возникают в этот момент: действительно ли шаблон бесплатный, что именно внутри и зачем нужен номер телефона. Так важные детали не остаются без ответа и помогают пользователю." },
  { n: "05", k: "Конверсия", h: "Честный CTA", img: MMI + "after-form.png",
    desc: "Никакой модалки и неожиданных переходов. Форма находится прямо на странице, кнопка говорит «PDF kostenlos erhalten» (получить бесплатный PDF), а подписи объясняют, зачем нужны данные и что произойдет дальше. Пользователь заранее понимает, чего ждать от этого шага." },
  { n: "06", k: "Футер", h: "Футер в меру", img: MMI + "after-footer.png",
    desc: "Старый футер тянулся слишком долго. Я оставил только нужные ссылки, уплотнил верстку и сделал финал страницы компактнее и чище." },
];

/* ---- основная статья ---- */
function MMCase({ onPrototype }) {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Кейс · Mission Mittelstand</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>· Лендинг · 2026</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title" style={{ whiteSpace: "nowrap" }}>Лид-магнит, <span className="accent">собранный заново</span></h1>
              <p className="cs-sub">Mobile-first редизайн лендинга Mission Mittelstand с бесплатной шпаргалкой - с более понятной воронкой и меньшим количеством шагов до скачивания.</p>
              <p className="cs-lead">
                Mission Mittelstand предлагает бесплатную шпаргалку для Mitarbeitergespräch (беседы с сотрудником) как лид-магнит. У страницы одна задача: убедить посетителя скачать шаблон. Это и стало основной задачей переработки лендинга – сделать в первую очередь страницу для телефона и при этом сохранить узнаваемость Mission Mittelstand.
              </p>
              <p className="cs-lead">
                Основная работа шла в двух направлениях: новая информационная архитектура и более современный визуал. Страница должна была по-прежнему ощущаться частью Mission Mittelstand, но выглядеть свежее и подарить существующему бренду глоток свежего воздуха.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="#visuals" className="btn btn-accent ax-skip-btn" data-hot style={{ flex: "1 1 0", justifyContent: "center", whiteSpace: "nowrap" }}>
                  Перейти к визуалам
                  <span className="btn-arrow btn-arrow--down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
                </a>
                <button type="button" className="btn ax-skip-btn" data-hot onClick={onPrototype} style={{ flex: "1 1 0", justifyContent: "center", whiteSpace: "nowrap" }}>
                  Открыть прототип
                  <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
                </button>
              </div>
            </Reveal>
            <Reveal className="ax-hero-media">
              <MMPhone src={MMI + "after-hero.png"} alt="Пересобранный мобильный первый экран Mission Mittelstand"
                caption={<><strong>Новый мобильный hero-блок.</strong></>} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mm-statband">
            <MMStat to={6} label="СЕКЦИЙ В НОВОЙ ВОРОНКЕ СОСТАВЛЕНО" />
            <MMStat to={5} label="СЛАБЫХ МЕСТ КОНВЕРСИИ НАЙДЕНО" />
            <MMStat to={3} label="НАПРАВЛЕНИЯ ПРОТОТИПА СРАВНЕНО" />
          </div>
        </div>
      </section>

      {/* ── Nutshell ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Проект в двух словах</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Моя роль</div>
              <div className="cs-meta-v">Стратегия воронки, UX лендинга, UX-тексты, mobile-first UI-дизайн и интерактивный HTML-прототип</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Формат</div>
              <div className="cs-meta-v">Бриф от компании, концепт-проект - без реальной аналитики</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Ограничения</div>
              <div className="cs-meta-v">Шрифт Barlow · существующий визуальный стиль Mission Mittelstand · мобильная версия обязательна / десктоп вторичен · без библиотек компонентов</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Стратегия воронки", "UX лендинга", "UX-тексты", "Mobile-First UI", "Конверсионная архитектура", "Доверие и социальные доказательства", "Интерактивный прототип"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Что я сделал</h4>
              <MPlain items={[
                "Новая информационная архитектура лендинга",
                "Интерактивный мобильный HTML-прототип как основной результат",
                "Десктоп-версия без лишнего усложнения",
                "Переписанные CTA и фиксированный CTA, который остается видимым при прокрутке",
                "Встроенная форма вместо исходного модального окна, чтобы сценарий скачивания был понятен заранее",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Гипотеза</h4>
              <MPlain items={[
                "Большая часть трафика приходит из таргетированных кампаний, поэтому у посетителей уже есть исходный интерес",
                "Оригинальная страница ослабляет этот интерес: ценность шаблона считывается не сразу, сценарий скачивания создает лишнее трение, а мобильная версия работает слабо",
                "Более прямой сценарий, который раньше показывает ценность и убирает лишние шаги, должен увеличить число скачиваний",
                "Проверить эти гипотезы можно только на реальных данных",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Потенциальные точки трения ── */}
      <section className="cs-section" id="process">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Потенциальные точки трения</h3></div>
          <p className="cs-p">
            Лендинг – финальная точка таргета, построенного вокруг шпаргалки. Я посмотрел, что происходит после перехода: насколько быстро считывается ценность, легко ли сделать следующий шаг и где на пути к скачиванию появляется лишнее трение. Выделились пять точек.</p>
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
            Обзор исходной страницы:
          </p>
          <div className="mm-carousel cs-mt-s">
            {BEFORE.map(([src, cap]) => (
              <MMPhone key={src} src={src} tag="До" tagKind="before" alt="Оригинальный лендинг Mission Mittelstand"
                caption={cap} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Как я это пересобрал ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Как я это пересобрал</h3></div>
          <p className="cs-p">
            Я начал с того, что уже было: самой страницы, ее аудитории и пути от рекламной кампании до скачивания. Затем пересобрал структуру, проверил несколько направлений и довел самое перспективное до рабочего прототипа.
          </p>
          <div className="mm-journey cs-mt-l">
            {[
              ["Посмотреть на страницу глазами посетителя", "Я прошел исходную страницу так, как это сделал бы пользователь и разложил по полочкам предложение, аудиторию и путь от первого экрана до скачивания, прежде чем что-либо менять."],
              ["Отметить трение и потенциал", "Были зафиксированы основные точки трения и места, которые явно могли работать лучше."],
              ["Сформулировать рабочую гипотезу", "Из наблюдений сложилось направление: раньше показывать ценность шпаргалки, сделать сценарий скачивания прозрачнее и держать CTA в пределах досягаемости."],
              ["Набросать три направления", "Собрал три структурно разных первых прототипа и сравнил их бок о бок, прежде чем выбрать одно направление."],
              ["Выбрать самое сильное направление", "Я остановился на варианте, который лучше всего поддерживал главную задачу – довести пользователя до скачивания шпаргалки, а два других отложил."],
              ["Довести до hi-fi", "Выбранное направление я довел до полноценного high-fidelity дизайна, сохранив узнаваемость бренда Mission Mittelstand и реалистичность реализации."],
              ["Сделать кликабельным", "Помимо общего Figma-макета, я еще собрал и полностью функциональный интерактивный mobile-first HTML-прототип страницы."],
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

      {/* ── Визуал (зигзаг) ── */}
      <section className="cs-section" id="visuals">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Редизайн: секция за секцией</h3></div>
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
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Попробуйте вживую</h4>
              <p className="cs-p" style={{ margin: 0 }}>Весь сценарий собран в рабочем HTML-прототипе – лучше всего открывать его на телефоне.</p>
            </div>
            <button type="button" className="btn btn-accent" data-hot onClick={onPrototype}>
              Открыть прототип
              <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Десктоп ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Десктоп как MVP</h3></div>
          <Reveal>
            <p className="cs-p">
              Мобайл был в приоритете, поэтому десктоп-версию я намеренно оставил более простой: та же воронка и те же ключевые сообщения, перенесенные в рабочий прототип, но без избыточной проработки широкого формата. Если бы времени было больше, я бы еще подкрутил масштабирование и добавил средним секциям визуальной глубины. Но основной сценарий уже собран.
            </p>
          </Reveal>
          <Reveal className="mm-mvp-shot">
            <MMShot src={MMI + "after-desktop.png"} url="Новый десктоп-hero" badge="После" badgeKind="after"
              alt="Пересобранный лендинг Mission Mittelstand на десктопе"
              caption={<>Та же воронка, но больше пространства. Десктоп-версия намеренно проще, но основной сценарий и ключевые сообщения уже реализованы.</>} />
          </Reveal>
        </div>
      </section>

      {/* ── Выводы ── */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Выводы</h3></div>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Начинать с четкой гипотезы.", "Она задает редизайну направление и помогает проще оценивать и объяснять отдельные дизайн-решения."],
              ["CTA должен соответствовать сценарию.", "Когда кнопка обещает именно то, что происходит дальше, путь к скачиванию становится понятнее и не создает лишних сюрпризов в самый важный момент."],
              ["Показывать ценность сразу.", "На лендинге с лид-магнитом практическая польза шаблона должна считываться с первых экранов. История компании может поддержать ее ниже по странице."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

/* ---- модалка скачивания интерактивного прототипа ---- */
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
    <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Мобильный прототип"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="contact-modal-card mm-proto-card">
        <button className="legal-x contact-modal-x" onClick={onClose} aria-label="Закрыть" data-hot ref={closeRef}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div className="contact-modal-head">
          <MonoLabel>Мобильный прототип</MonoLabel>
          <h2 className="contact-modal-title">Откройте его на телефоне</h2>
          <p className="contact-modal-sub">Это самодостаточная офлайн-страница — она существует только как один этот файл. Скачайте его и откройте в любом браузере (лучше всего на телефоне или в мобильном режиме браузера).</p>
        </div>
        <div className="mm-proto-actions">
          <a className="btn btn-accent" href={PROTOTYPE_FILE} download="mission-mittelstand-prototype.html" data-hot onClick={onClose}>
            Скачать прототип
            <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
          </a>
          <button className="btn" onClick={onClose} data-hot>Может быть, позже</button>
        </div>
      </div>
    </div>
  );
}

/* ---- дисклеймер по товарным знакам / использованию (рендерится шеллом под финальным CTA) ---- */
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
              <strong style={{ color: "var(--ink-soft)" }}>Товарные знаки и использование.</strong> «Mission Mittelstand», знак BVMW и все связанные названия, логотипы, изображения и брендовые материалы, показанные здесь, принадлежат их правообладателям. Я не владею никакими правами на них и не претендую на них.
            </p>
            <p>
              Этот кейс сделан по брифу от компании, и все показанные брендовые материалы были предоставлены мне для этой цели — воспроизведены здесь исключительно чтобы задокументировать мою работу. Это независимый концепт: не аффилирован с Mission Mittelstand, не одобрен ею и не является ее официальным продуктом, и никогда не публиковался ни на одном живом сайте.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MMCase, MMDisclaimer, MMPrototypeModal });
