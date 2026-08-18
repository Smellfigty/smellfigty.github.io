/* portfolio-content.ru.jsx – Russian edition of the Portfolio case study.
   Loaded from prod/ru/. Exports OldDesignCase + NewDesignCase + helpers to window.
   The page shell lives in casestudy-portfolio.jsx. */

const PF = "../assets/cs/";
const OLDIMG = "../assets/";
const OLD = {
  heroGif:      OLDIMG + "video_full.gif",
  iter1:        OLDIMG + "Iteration1.png",
  iter2:        OLDIMG + "Iteration2.png",
  localization: OLDIMG + "Localization.png",
};

function CSSwitch({ view, onChange }) {
  return (
    <div className="cs-switch" role="tablist" aria-label="Выберите версию кейса">
      <span className="cs-thumb" aria-hidden="true"></span>
      <button role="tab" aria-selected={view === "old"} className={view === "old" ? "active" : ""} data-hot onClick={() => onChange("old")}>Старый дизайн</button>
      <button role="tab" aria-selected={view === "new"} className={view === "new" ? "active" : ""} data-hot onClick={() => onChange("new")}>Новый дизайн</button>
    </div>
  );
}

function PFStat({ from = null, to, pre = "", suf = "", label }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.85 && r.bottom > 0;
    };
    if (inView()) { setRun(true); return; }
    const onScroll = () => { if (inView()) { setRun(true); cleanup(); } };
    const t = setTimeout(() => { setRun(true); cleanup(); }, 2500);
    function cleanup() { window.removeEventListener("scroll", onScroll); clearTimeout(t); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);
  const start = from == null ? 0 : from;
  const [val, setVal] = useState(start);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    let raf = 0, t0 = 0, done = false;
    const dur = 1300;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (to - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick); else done = true;
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => { if (!done) setVal(to); }, dur + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [run, to]);
  return (
    <div className="gm-stat" ref={ref}>
      <div className="gm-stat-n">
        {from != null && <><span className="dim">{from}</span><span className="arr">→</span></>}
        <span className="accent">{pre}{val}{suf}</span>
      </div>
      <div className="gm-stat-k">{label}</div>
    </div>
  );
}

function PFStatBand({ stats }) {
  return (
    <section className="cs-section gm-stats-sec">
      <div className="cs-wrap">
        <div className="gm-statband">
          {stats.map((s, i) => <PFStat key={i} {...s} />)}
        </div>
      </div>
    </section>
  );
}

function BrowserShot({ src, alt, caption, url = "alexmedved.com", tag, isNew = false }) {
  const open = useLightbox();
  return (
    <figure className="pf-browser">
      <div className="pf-shell">
        <div className="pf-chrome">
          <span className="pf-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="pf-url">{url}</span>
          {tag && (
            <span className={"pf-tag" + (isNew ? " is-new" : "")}>
              {isNew && <span className="pf-pulse" aria-hidden="true"></span>}{tag}
            </span>
          )}
        </div>
        <button type="button" className="pf-shot" data-hot
          onClick={() => open({ src, alt, caption })} aria-label={"Открыть изображение: " + alt}>
          <img src={src} alt={alt} loading="lazy" />
          <span className="pf-zoom" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </span>
        </button>
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

function SkillMarquee({ items }) {
  const row = (key) => (
    <div className="pf-marq-item" key={key} aria-hidden={key === "b" ? "true" : undefined}>
      {items.map((w, i) => (
        <React.Fragment key={i}>
          <span className="pf-marq-word">{w}</span>
          <span className="pf-marq-sep">//</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="pf-marquee">
      <div className="pf-marquee-track">{row("a")}{row("b")}</div>
    </div>
  );
}

/* ============================================================
   СТАРЫЙ ДИЗАЙН
   ============================================================ */
function OldDesignCase() {
  return (
    <div className="cs-view">
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Кейс-стади · Портфолио v1</MonoLabel></Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Это портфолио,<br /><span className="accent">создано с нуля.</span></h1>
              <p className="cs-sub">Почему я не стал пользоваться шаблонами и разработал собственный многоязычный сайт</p>
              <p className="cs-lead">
                UXfolio был слишком ограничивающим, а Behance хоть и удобен, но не совсем мой формат. Мне нужен был
                сайт, который будет расти вместе со мной, отражать мою идентичность и показывать настоящее
                продуктовое мышление и мои навыки в работе – поэтому я сам его спроектировал, задизайнил
                и написал для него тексты и код.
              </p>
            </Reveal>
            <Reveal>
              <BrowserShot src={OLD.heroGif} url="alexmedved.com" tag="v1 · 2024"
                alt="Оригинальное портфолио alexmedved.com – анимированный превью hero"
                caption="Логотип был первым, что я разработал, и на это ушло лишь несколько часов." />
            </Reveal>
          </div>
        </div>
      </section>

      <PFStatBand stats={[
        { pre: "~", to: 1, suf: " мес.", label: "От нуля до запуска, в свободное время" },
        { to: 4, label: "Страницы при запуске" },
        { to: 3, label: "Языка – EN / DE / RU" },
        { to: 0, label: "Шаблонов или конструкторов" },
      ]} />

      <SkillMarquee items={["Идентичность и брендинг", "UX / UI", "Контент и ToV", "Фронтенд", "Локализация"]} />

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Проект в двух словах</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Моя роль</div>
              <div className="cs-meta-v">UX/UI-дизайн, UX-райтинг, бренд и логотип, фронтенд, локализация (EN → DE/RU), публикация</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Сроки</div>
              <div className="cs-meta-v">~1 месяц нерегулярных вечеров после работы</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Инструменты</div>
              <div className="cs-meta-v">Figma, VS Code, Tailwind, GitHub Pages, HTML/CSS/JS, ChatGPT, Google Docs, CodePen</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Идентичность и брендинг", "UX / UI", "Контент и ToV", "Фронтенд", "Локализация (EN / DE / RU)"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Вызовы</h3>
              <p className="cs-p">
                Создать профессиональную идентичность, придумать подходящий логотип и собрать адаптивное
                портфолио без шаблонов и без опыта full-time разработчика. Нужно было быстро запустить
                сайт и при этом сделать его простым в обслуживании.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Задача</h3>
              <p className="cs-p">
                Создать адаптивный многоязычный сайт, который ясно рассказывает мою историю, показывает
                кейсы в едином формате и даёт мне полный контроль над контентом, кодом и средой.
              </p>
            </Reveal>
          </div>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel pf-lift">
              <h4>Основные достижения</h4>
              <ul className="cs-steps">
                {["Свой стиль и логотип, отражающие голос и работу",
                  "Универсальный шаблон кейсов для единого сторителлинга",
                  "Многоязычная структура (EN → DE/RU) заложена с первого дня",
                  "Быстрый статический стек с Tailwind на GitHub Pages",
                  "Доступные типографика и дизайн для лёгкого сканирования"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Результаты</h4>
              <ul className="cs-steps">
                {["Сайт, который ощущается личным, внушает доверие и готов к росту",
                  "Чёткий сторителлинг о навыках, процессе и реальных проектах",
                  "Полный контроль над хостингом, технической стороной и ядром SEO",
                  "Никакой привязки к провайдеру – всё работает из моего репозитория",
                  "Адаптивный сайт, которым я владею до последнего символа и пикселя"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Процесс</h3></div>
          <p className="cs-p" style={{ maxWidth: "70ch" }}>
            Я подошёл к созданию сайта как к небольшому продукту: небольшие блоки, реалистичные ограничения
            и быстрое обучение. Целью была не просто «сайт», а понятная, развивающаяся система, которая
            растёт вместе с моей работой.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Найти голос.", "Я наметил направления, собрал визуальные референсы и задал тон – простой, уверенный и тёплый."],
              ["Сформировать идентичность.", "За пару часов я создал логотип и проверил, как он отражает меня и как выглядит в мокапах."],
              ["Спланировать работу.", "В Figma я набросал первые страницы: Главная, Обо мне, Портфолио, Контакты – с акцентом на десктоп."],
              ["Проверить ритм.", "Позже я сделал интерактивные мокапы, чтобы протестировать флоу, отступы и темп чтения до написания кода."],
              ["Собрать по блокам.", "С помощью HTML/Tailwind/JS я разбил сайт на компонентные секции и подключил ChatGPT, чтобы ускорить рутинную работу."],
              ["Добавить языки.", "Сначала все тексты я написал на английском, затем локализовал на DE/RU, сохранив тон и ясность."],
              ["Выйти в релиз.", "Опубликовал сайт на GitHub Pages, протестировал вживую и собрал документацию, чтобы будущие правки были проще."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={b}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>
          <Reveal className="cs-mt-l">
            <ZoomImg src={OLD.iter1} alt="Ранний концепт-борд в Figma – карта страниц для десктопа и мобайла"
              capAccent="Figma →"
              caption="Ранний концепт-борд в Figma: первые страницы для запуска с акцентом на десктоп. Позже я переработал систему кейсов (отступы, пропорции и поля) для более плавного ритма чтения." />
          </Reveal>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Ключевые решения и принципы дизайна</h3></div>
          <p className="cs-p" style={{ maxWidth: "70ch" }}>
            Вместо того чтобы делать раздел «до/после», я хотел показать решения, которые сформировали
            сайт, и принципы, которые помогли поддержать его цельность – чтобы дизайн оставался ясным,
            гибким и отражал мою работу.
          </p>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel cs-panel-accent pf-lift">
              <h4>Ключевые решения</h4>
              <ul className="cs-steps">
                {[["С нуля и без компромиссов:", "полный контроль, выше эффективность, личный бренд, который отражает меня. Кроме того, это инвестиция в новые навыки."],
                  ["Собственный логотип вместо вордмарка:", "современный и личный символ с характером, который можно использовать в favicon, соцсетях и печати."],
                  ["Сначала десктоп, мобайл потом:", "кейсы чаще читают с компьютера, поэтому задав там ритм чтения, мобильные версии получились чище и быстрее."],
                  ["Локализация вручную:", "тон, терминология и контекст крайне важны. Живой перевод вызывает больше доверия и лучше работает для SEO и UX."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Принципы дизайна на практике</h4>
              <ul className="cs-steps">
                {[["Ясность:", "чёткая иерархия в кейсах – роль, результат и эффект считываются мгновенно."],
                  ["Последовательность:", "система отступов и типографский ритм держат страницы вместе; повторяемые блоки выравнивают текст и дизайн."],
                  ["Идентичность:", "логотип, тон портфолио и цвета формируют спокойный, дружелюбный бренд – от хедера до футера."],
                  ["Гибкость:", "сайт собран как система (Tailwind + модульный контент), поэтому добавлять новые кейсы можно быстро и эффективно."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Результаты</h3></div>
          <p className="cs-p" style={{ maxWidth: "72ch" }}>
            Этот проект во многом изменил мой подход к дизайну и работе в целом. Я научился новым навыкам,
            отточил существующие и осознал всю мощь творческой свободы – без пейволов и ограничений платформы.
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Читаемость.", "Чёткая структура помогает воспринимать даже длинные страницы."],
                ["Мой бренд.", "Логотип и тон придают портфолио живой голос."],
                ["Контроль.", "Весь контент и код в репозитории – без привязок и лишних плагинов."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Локализация.", "Ручной перевод сохраняет нюансы и показывает профессионализм."],
                ["Эффективность.", "Лёгкий статический билд делает страницы быстрыми и стабильными."],
                ["Эмпатия к разработчикам.", "На своей шкуре почувствовал, каково бывает разработчику."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
          </div>
          <div className="cs-grid2 ax-equal pf-oldpair cs-mt-l">
            <Reveal>
              <ZoomImg className="pf-oldfig" src={OLD.iter2} alt="Итерация 2 – переработанный макет раздела с кейсами"
                caption="Итерация 2, предпоследний макет – кейсы переработаны, система отступов пересмотрена, всё выверено и готово к переходу в код." />
            </Reveal>
            <Reveal>
              <ZoomImg className="pf-oldfig" src={OLD.localization} alt="Компонентный фрейм с блоками и переводами"
                caption="Все блоки создавались как компоненты, а тексты сразу собирались и переводились на три языка в удобной таблице." />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Уроки</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Это был урок по созданию продукта от начала до конца. Я научился совмещать идентичность, структуру
            и код, сохраняя ясность и удобство – именно это и должен делать дизайн.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Системное мышление.", "Чёткая система дизайна и сетка сэкономили часы при работе с кодом."],
              ["От дизайна к коду.", "Аккуратные компоненты в Figma превратились в чистый HTML/CSS."],
              ["Учёт локализации.", "Знание особенностей EN, DE и RU уберегло от ломаных макетов."],
              ["Перфекционизм мешает.", "Самый лучший принцип: сперва создай, улучшить можно потом."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   НОВЫЙ ДИЗАЙН
   ============================================================ */
function NewDesignCase() {
  return (
    <div className="cs-view">
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Кейс-стади · Портфолио v2</MonoLabel></Reveal>
          </div>
          <Reveal as="h1" className="cs-title">То же портфолио,<br /><span className="accent">пересобрано с ИИ.</span></Reveal>
          <Reveal as="p" className="cs-lead">
            Спустя год после запуска v1 контент не устарел, а вот визуальное оформление уже не читалось как
            «дизайн data-heavy продуктов». Поэтому я пересобрал весь фронтенд вместе с Claude как
            дизайн-партнёром – я ставил задачи и проверял каждый экран. Одна неделя вечеров, тот же
            сторителлинг, более чёткий сигнал.
          </Reveal>
          <Reveal className="cs-meta cs-mt-l">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Моя роль</div>
              <div className="cs-meta-v">Арт-дирекция, дизайн-система, постановка задач и ревью, QA фронтенда</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">ИИ в работе</div>
              <div className="cs-meta-v">Claude как основной дизайн/код-партнёр, плюс разные LLM для текстов и ревью</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Что сохранено / изменено</div>
              <div className="cs-meta-v">Тот же контент и сторителлинг · новый визуальный язык, архитектура и интерфейс</div>
            </div>
          </Reveal>
        </div>
      </section>

      <PFStatBand stats={[
        { pre: "~", to: 1, suf: " нед.", label: "На пересборку системы и перенос" },
        { from: 33, to: 16, label: "Страниц после пересборки" },
        { from: 15, to: 2, label: "Сертификаты и правовые – теперь модалки" },
        { to: 3, label: "Языка, без сдвигов вёрстки" },
      ]} />

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">До / После</h2></div>
          <Reveal className="pf-ba">
            <BrowserShot src={PF + "pf-old-hero.png"} url="alexmedved.com" tag="v1 · 2024"
              alt="Старое портфолио – светлый, шаблонный макет"
              caption={<><strong>До.</strong> Чистый, но универсальный светлый макет – фото, должность и одно предложение.</>} />
            <BrowserShot src={PF + "pf-new-hero.png"} url="alexmedved.com" tag="v2 · 2026" isNew
              alt="Новое портфолио – крупная редакционная типографика на тёмном фоне"
              caption={<><strong>После.</strong> Точка зрения в большой типографике, осознанная палитра и структурный мотив дата-сетки.</>} />
          </Reveal>
          <p className="cs-cap pf-fig-note">
            Заголовок вырос из должности в заявление. Типографика стала крупнее, палитра – увереннее,
            а сетка за всем этим отсылает к дашбордам, которые я и проектирую.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2 ax-equal" style={{ alignItems: "center" }}>
            <div>
              <div className="cs-head"><h3 className="cs-h">Система, лежащая в основе пересборки</h3></div>
              <p className="cs-p">
                Прежде чем браться за экраны, мы с Claude зафиксировали небольшой набор правил, чтобы
                каждая страница держалась вместе и была намеренной.
              </p>
              <ul className="cs-steps cs-mt-m">
                {[["Типографика.", "Archivo для уверенных заголовков, Space Mono для меток и метаданных – ощущение продуктового лабнотбука."],
                  ["Палитра.", "Тёплый почти-чёрный фон и единственный решительный акцент. Светлый и тёмный – оба полноценные."],
                  ["Мотив.", "Едва заметная 12-колоночная дата-сетка за всем – отсылка к дашбордам и структуре."],
                  ["Ритм.", "Единая система отступов и каденция reveal-on-scroll, повторяемые от хиро до карточек и кейсов."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </div>
            <Reveal>
              <BrowserShot src={PF + "pf-new-case.png"} url="alexmedved.com/case-study" tag="кейс-стади" isNew
                alt="Новая страница кейса с моно-метками, статами и лайв-скриншотами"
                caption={<><span className="accent">Система → </span>Один набор токенов управляет каждым кейсом: моно-метки индекса, акцентная система, анимированные стат-полосы и flagship-хиро.</>} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Меньше страниц, удобнее UX</h3></div>
          <p className="cs-p" style={{ maxWidth: "74ch" }}>
            Старый сайт разрастался: сертификаты, импрессум и политика конфиденциальности – это 15 отдельных
            страниц на трёх языках. В v2 они схлопываются в превью при наведении и модалки на одной
            странице – с хеш-роутингом в URL (<code>/#impressum</code>), чтобы правовые страницы оставались
            прямыми ссылками. Меньше переводить, меньше рассинхронизации.
          </p>
          <Reveal className="pf-twin cs-mt-l">
            <BrowserShot src={PF + "pf-new-anim.png"} url="alexmedved.com/#certificates" tag="наведи для превью" isNew
              alt="Новый список сертификатов с превью-карточкой при наведении"
              caption={<><strong>Сертификаты – список.</strong> Наведение поднимает живой превью скана; карточка, следящая за курсором, и кольцо акцента – чистое взаимодействие, без лишних страниц.</>} />
            <BrowserShot src={PF + "pf-smoother-ux.png"} url="alexmedved.com/#certificates" tag="кликни для деталей" isNew
              alt="Модалка с детальной информацией о сертификате"
              caption={<><strong>Клик – полная карточка.</strong> Единственная модалка содержит дату, навыки и ссылку для верификации – то, что раньше было 15 страницами, теперь в одном консистентном компоненте.</>} />
          </Reveal>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Осознанные компромиссы</h3></div>
          <div className="cs-grid2">
            <Reveal className="cs-panel pf-lift">
              <div className="cs-stat">
                <div className="cs-stat-n">33 <span className="arrow">→</span> <span className="accent">16</span></div>
                <div className="cs-stat-k">страниц схлопнуто</div>
              </div>
              <p className="cs-p cs-mt-m">
                Половина сайта была задублирована в трёх языках. Свернув всё в модалки и живой переключатель
                языков, я сократил количество страниц примерно вдвое – и вместе с ним поверхность для перевода.
              </p>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Осознанные решения</h4>
              <ul className="cs-steps">
                {[["Живые тогглы.", "Тема, акцент, сетка кейсов и стиль карточек – живые тогглы: направления сравниваются, а не угадываются."],
                  ["SPA против статики.", "React-фронтенд жертвует простотой SEO; компенсирую контентом в обычной разметке и реальными URL."],
                  ["ИИ делает черновики, я направляю.", "Модели работают быстро, но усредняют результат. Каждый экран я вручную доводил за пределы первого «сойдёт»."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Работа с ИИ как дизайн-партнёром</h3></div>
          <ul className="cs-steps cs-mt-s">
            {[["Вкус – это узкое место.", "Модель может сгенерировать десять вариантов за минуту; понять, какой из них правильный и почему – всё ещё твоя работа."],
              ["Конкретика важнее настроения.", "Чёткие ограничения (токены, сетка, правила движения) давали результаты намного лучше, чем «сделай современно»."],
              ["Ревью как тимлид.", "Каждый проход я воспринимал как дизайн-крит: оставить, убрать, доработать. Темп оставался высоким, планка не падала."],
              ["Результат принадлежит мне.", "Всё так же живёт в моём репозитории, в коде, который я понимаю и могу отредактировать до последнего пикселя."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
          <p className="cs-p cs-mt-m" style={{ textAlign: "center", maxWidth: "52ch", marginInline: "auto" }}>
            Итог – портфолио, которое наконец выглядит как продукты, о которых рассказывает, и рабочий
            процесс, который я использовал бы снова на любом продуктовом интерфейсе.
          </p>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { CSSwitch, PFStat, PFStatBand, BrowserShot, SkillMarquee, OldDesignCase, NewDesignCase });
