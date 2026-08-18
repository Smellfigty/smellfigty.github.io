/* i18n.jsx – localized content + UI strings for every language.
   Loaded BEFORE core.jsx. The active language is chosen by window.__LANG
   (set inline in each index.html). Each language block carries its own data
   (profile, cases, certs, legal, nav, disciplines) and a `ui` map of all the
   strings that live inside the components.

   Asset/url paths are written relative to the page that loads them:
   – EN lives at  prod/index.html        → no prefix
   – DE lives at  prod/de/index.html     → "../" prefix to reach prod-level files
*/

const LANG = (typeof window !== "undefined" && window.__LANG) || "en";
const IMG = (LANG === "en" ? "assets/" : "../assets/");

const I18N = {
  /* ============================== ENGLISH ============================== */
  en: {
    htmlLang: "en",
    profile: {
      name: "Aleksandr Medved",
      alias: "Smellfigty",
      first: "Aleksandr",
      last: "Medved",
      role: "Product Designer",
      niche: "data-heavy SaaS & platform products",
      location: "Munich, Bavaria",
      langs: "DE / EN / RU",
      exp: "5+ years",
      photo: "assets/photo-hero.jpg",
      photoNeon: "assets/photo-neon.jpg",
      email: "alex@alexmedved.com",
    },
    cases: [
      {
        id: "axiomlens", n: "01", title: "AxiomLens", kicker: "Cashflow Analytics",
        desc: "A cash flow analytics dashboard for small businesses, from research and IA to UX flows, branding and UI design.",
        tags: ["Product Design", "UX Research", "IA", "Dashboard", "Branding"],
        type: "Hi-fi prototype", year: "2025", img: "assets/axiom-logo-white.png",
        plateImgStyle: { maxWidth: "82%", maxHeight: "78%" }, url: "case-study-axiomlens.html", featured: true,
      },
      {
        id: "missionmittelstand", n: "02", title: "Mission Mittelstand", kicker: "Interactive Landing Page",
        desc: "A mobile-first redesign of a free-worksheet landing page: funnel strategy, honest download logic and a clickable prototype.",
        tags: ["Funnel Strategy","Landing UX","Mobile-First UI"],
        type: "Lead Magnet", year: "2026", img: "cs-logos/missionmittelstand.png",
        plateImgStyle: { maxWidth: "88%", maxHeight: "54%" }, url: "case-study-missionmittelstand.html", featured: true,
      },
      {
        id: "migroplan", n: "03", title: "MigroPlan", kicker: "Service Landing, Design Sprint",
        desc: "From idea to live landing page in 36 hours: funnel architecture, bilingual UX, an eligibility quiz and booking integration.",
        tags: ["Funnel Design", "Landing UX", "Branding"],
        mark: "MP", type: "Client project", year: "2026", img: "cs-logos/migroplan-dark.png",
        plateImgStyle: { maxWidth: "86%", maxHeight: "58%" }, url: "case-study-migroplan.html", featured: true,
      },
      {
        id: "gaming", n: "04", title: "B2B Mobile Gaming", kicker: "New Platform, NDA",
        desc: "From concept to launch: UX/UI design, microcopy and localization for a brand-new mobile gaming platform built at NeoGroup.",
        tags: ["UX/UI", "Microcopy", "Localization", "NDA"],
        type: "Product · NDA", year: "2024", img: IMG + "B2B-Gaming.png", url: "case-study-gaming.html", featured: true,
      },
      {
        id: "bachata", n: "05", title: "Bachata in Dubai", kicker: "Landing, Overnight",
        desc: "An ambitious one-evening project: a UX review of a dance-school landing page and compelling, user-focused copy.",
        tags: ["UX Review", "Copywriting"],
        type: "Landing page", year: "2025", img: IMG + "Bachata%20Logo.png", url: "case-study-bachata.html", featured: false,
      },
      {
        id: "portfolio", n: "06", title: "alexmedved.com", kicker: "Self-made Portfolio",
        desc: "The making of this portfolio earned its place inside it – from Figma concept to coding and hosting.",
        tags: ["Web", "Front-end", "Figma"],
        type: "Portfolio · Design + Code", year: "2025", img: IMG + "FullLogo_Transparent_NoBuffer.png", url: "case-study-portfolio.html", featured: false,
      },
    ],
    certs: [
      {
        name: "UX Design Professional Certificate", by: "Google", year: "2025",
        url: "https://alexmedved.com/en/certificate-google.html",
        verify: "https://coursera.org/share/2affb55e2447078823f7bde7fc267c3c",
        img: IMG + "Google%20UX-1.png", date: "June 7, 2025",
        details: [
          ["Prerequisites", "Successfully completed 7 courses as part of the program, including all graded assignments in the form of tests, projects, and design reviews."],
          ["Length", "~82 hours of coursework over 6 months."],
          ["Skills validated", "User Experience (UX) and User Interface (UI) design, UX writing/editing, user research, usability testing, creating user journeys and customer journeys, wireframing, prototyping, and visual design with tools such as Figma."],
          ["Application", "Serves as structured, formal training that consolidates several years of practical UX and design experience. Provides a comprehensive framework that helps refine existing skills, align them with industry best practices, and strengthen professional credibility."],
        ],
      },
      {
        name: "UX Writer & Editor", by: "Netology", year: "2024",
        url: "https://alexmedved.com/en/certificate-netology.html",
        verify: "https://netology.ru/sharing/6dfeb4bf51d682333b0b4ee0101fa12e?utm_source=social&utm_campaign=certificate_lms",
        img: IMG + "UX_certificate-1.png", date: "June 1, 2024",
        details: [
          ["Prerequisites", "Completed a professional training program in UX Writing, including theory, practical assignments, and final assessment."],
          ["Length", "~4 months of structured coursework."],
          ["Skills validated", "UX Writing, microcopy creation, content design for interfaces, structuring user communication flows, working with tone of voice, and collaboration with product & design teams."],
          ["Application", "Provides formal training in UX Writing that complements practical design and product experience. Enhances the ability to create clear, user-centred communication in digital interfaces and reinforces expertise in both product design and UX communication."],
        ],
      },
      {
        name: "Goethe-Zertifikat C1", by: "Goethe-Institut", year: "2024",
        url: "https://alexmedved.com/en/certificate-goethe.html",
        verify: "https://verify.goethe.de/verify/index.html?wt_sc=verify&sap-language=DE&sap-ui-language=EN",
        img: IMG + "GoetheC1Medved-1.png", date: "December 10, 2024",
        details: [
          ["Prerequisites", "Successfully completed all four parts of the C1 examination in German: Reading, Listening, Writing, and Speaking."],
          ["Skills validated", "German proficiency at the C1 CEFR level – ability to understand demanding texts, express ideas fluently, and use language effectively for academic and professional purposes."],
          ["Application", "Enables professional use of German in complex, specialized contexts and is recognized worldwide as proof of advanced German language competence."],
        ],
      },
    ],
    legal: {
      impressum: {
        title: "Imprint", kicker: "Legal notice · Impressum",
        operator: {
          heading: "Website Operator", name: "Aleksandr Medved",
          lines: ["Klarastraße 1", "80636 München"],
          contacts: [
            { label: "Phone", text: "+49 1522 3131484", href: "tel:+4915223131484" },
            { label: "Email", text: "alex@alexmedved.com", href: "mailto:alex@alexmedved.com" },
            { label: "Website", text: "www.alexmedved.com", href: "https://www.alexmedved.com" },
          ],
        },
        sections: [
          { heading: "VAT ID (USt-IdNr.)", body: ["DE454681179"] },
          { heading: "Disclaimer", body: ["We assume no liability for the up-to-dateness, accuracy, or completeness of the information provided. All offers are non-binding and subject to change. We reserve the right to make changes and accept no liability for errors. The content of these pages is protected by copyright. Any further use is prohibited without prior written permission."] },
          { heading: "External Links", body: [
            "In its judgment of 12 May 1998 (Ref. 312 O 85/98), the Hamburg Regional Court ruled that the operator of a website may be held responsible for the content of external sites to which it provides links. This liability can only be avoided by expressly distancing oneself from such content.",
            "For all links on our website, we expressly declare that we have no influence on the design or content of the linked pages. We therefore expressly distance ourselves from all content of all linked pages on this entire website, including all subpages. This declaration applies to all links placed on this website and to all content of the pages to which those links lead.",
          ] },
        ],
      },
      privacy: {
        title: "Privacy Policy", kicker: "Data protection · GDPR",
        sections: [
          { num: "01", heading: "General Information", body: ["This website respects your privacy and processes personal data in compliance with the General Data Protection Regulation (GDPR)."] },
          { num: "02", heading: "Data Controller", body: [["Aleksandr Medved", { br: 1 }, "Klarastraße 1", { br: 1 }, "80636 München", { br: 1 }, "alex@alexmedved.com"]] },
          { num: "03", heading: "Data Collection on This Website", body: ["Personal data is collected only when you provide it voluntarily, such as when using the contact form."] },
          { num: "04", heading: "Contact Form (Formspree)", body: [["When you submit a contact form, your request is processed through Formspree (USA/EU). The data you enter (name, email, message) is transmitted securely and used solely to process your inquiry. For details, see ", { href: "https://formspree.io/legal/privacy-policy/", text: "Formspree Privacy Policy" }, "."]] },
          { num: "05", heading: "Hosting", body: [["This website is hosted by GitHub Pages (USA). GitHub automatically processes technical log data (such as IP address, browser type, time of access) to ensure security and operation of the service, in accordance with Art. 6(1)(f) GDPR. For details, see ", { href: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement", text: "GitHub Privacy Statement" }, "."]] },
          { num: "06", heading: "Data Retention", body: ["Personal data is kept only as long as necessary to process your request. Server log files are automatically deleted by GitHub after a short retention period."] },
          { num: "07", heading: "Your Rights", body: ["You have the right to access, rectify, and erase your personal data, as well as the right to restrict processing and data portability under the GDPR."] },
          { num: "08", heading: "Right to Lodge a Complaint", body: ["You also have the right to lodge a complaint with a supervisory authority under the GDPR."] },
        ],
      },
    },
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/smellfigty/", iconKey: "linkedin" },
      { label: "Telegram", url: "https://t.me/smellfigty", iconKey: "telegram" },
      { label: "WhatsApp", url: "https://wa.me/4915223131484", iconKey: "whatsapp" },
      { label: "Email", url: "mailto:alex@alexmedved.com", iconKey: "email" },
    ],
    nav: [
      { label: "Case Studies", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Certificates", href: "#certificates" },
      { label: "Contact", href: "#contact" },
    ],
    disciplines: ["Product Design", "UX Research", "Information Architecture", "Design Systems", "Prototyping", "Localization / i18n", "UX Writing", "Front-end"],
    ui: {
      langLinks: [
        { label: "EN", href: "#", active: true },
        { label: "DE", href: "de/index.html", active: false },
        { label: "RU", href: "ru/index.html", active: false },
      ],
      logoSub: "Product Designer",
      navGetInTouch: "Get in touch",
      navMenu: "Menu", navClose: "Close",
      heroEyebrowRole: "Product Designer",
      heroH1Line1: "Interfaces that",
      heroH1Line2Pre: "do the ", heroH1Accent: "work.",
      heroLeadPre: "I design ", heroLeadStrong: "interfaces for SaaS, FinTech and complex digital products",
      heroLeadPost: " – built around heavy data, clear flows and multilingual UX.",
      ctaWork: "See selected work", ctaAbout: "About me",
      heroMetaExp: "5+ years in product design",
      heroMetaExpShort: "5+ yrs in product design",
      secCaseStudies: "01 – Case Studies",
      caseCountSuffix: "projects · latest first",
      flagshipLabel: "FinTech", soonBadge: "Deep-dive in progress",
      workSoon: "Soon", workComingSoon: "Coming soon",
      secAbout: "02 – About",
      aboutOpen: "open",
      aboutH2: "[[Clarity]] for complex digital products",
      aboutLead: [
        "I am a Product Designer with 5+ years of experience in SaaS, B2B and data-heavy products. My work is about turning complex product logic into clear user flows, solid information architecture and interfaces that help both the business and the user get where they need to go.",
        "I bring a strong understanding of UX research, UX/UI design, content – including UX writing and SEO – and implementation constraints. I am comfortable working through requirements, shaping structure, evolving design systems and making decisions that can scale beyond a single screen or feature.",
        "My background in UX localisation and Product QA gave me a deeper sensitivity to language, edge cases, consistency and technical feasibility. That is why I do not think in isolated screens, but in systems, variants and real product situations."
      ],
      factPracticeV: "years of practice",
      factLangV: "languages –",
      factLocK: "Munich", factLocV: "based in Bavaria",
      capMatrix: "Capability matrix", toolkitLabel: "Toolkit",
      toolkit: ["Figma", "Prototyping", "Design Tokens", "HTML/CSS", "AI Tools", "Tailwind", "Photoshop", "Google Search Console", "Ahrefs"],
      secCerts: "03 – Certificates",
      certsHint: "Hover to preview · click for details",
      certModalLabel: "Certificate", certDate: "Date", certVerify: "Verify",
      secContact: "04 – Contact",
      contactAvail: "Open to opportunities",
      contactH2: "Need to make your product easier to work with?",
      cfName: "Name", cfEmail: "Email", cfMessage: "Message",
      cfNamePh: "Your name", cfEmailPh: "you@company.com", cfMsgPh: "What are you building?",
      cfSend: "Send message", cfSending: "Sending…",
      cfOk: "Thanks – I'll be in touch shortly.",
      cfErr: "Something went wrong. Email me directly?",
      cfEmailErr: "Please make sure the email format is correct: example@mail.com",
      footerTagline: "Passionate about UX, CX, data, interfaces and chocolate.",
      footerImprint: "Imprint", footerPrivacy: "Privacy Policy",
      footerCopyright: "© 2026 – All rights reserved.",
      tweakCaseGrid: "Case grid",
      /* case-study chrome */
      csContactTitle: "Let's work together",
      csContactSub: "Tell me about the product and what you need – I usually reply within a day.",
      csEndKicker: "Next →",
      csEndTitle: "Like what you see?",
      csEndSub: "Want to talk about your product – or see more work first?",
      csEndWork: "Work with me",
      csEndOther: "See other case studies",
      csReadingProgress: "Reading progress",
    },
  },

  /* ============================== DEUTSCH ============================== */
  de: {
    htmlLang: "de",
    profile: {
      name: "Aleksandr Medved",
      alias: "Smellfigty",
      first: "Aleksandr",
      last: "Medved",
      role: "Product Designer",
      niche: "datenintensive SaaS- & Plattformprodukte",
      location: "München, Bayern",
      langs: "DE / EN / RU",
      exp: "5+ Jahre",
      photo: "../assets/photo-hero.jpg",
      photoNeon: "../assets/photo-neon.jpg",
      email: "alex@alexmedved.com",
    },
    cases: [
      {
        id: "axiomlens", n: "01", title: "AxiomLens", kicker: "Cashflow-Analytics",
        desc: "Ein Cash-Flow-Analytics-Dashboard für kleine Unternehmen – von Research und IA über UX-Flows und Branding bis zum UI-Design.",
        tags: ["Product Design", "UX-Research", "IA", "Dashboard", "Branding"],
        type: "Hi-fi-Prototyp", year: "2025", img: "../assets/axiom-logo-white.png",
        plateImgStyle: { maxWidth: "82%", maxHeight: "78%" }, url: "case-study-axiomlens.html", featured: true,
      },
      {
        id: "missionmittelstand", n: "02", title: "Mission Mittelstand", kicker: "Interactive Landing Page",
        desc: "Ein Mobile-First-Redesign einer Gratis-Vorlagen-Landingpage: Funnel-Strategie, ehrliche Download-Logik und ein klickbarer Prototyp.",
        tags: ["Funnel-Strategie","Landing-UX","Mobile-First-UI"],
        type: "Lead-Magnet", year: "2026", img: "../cs-logos/missionmittelstand.png",
        plateImgStyle: { maxWidth: "88%", maxHeight: "54%" }, url: "case-study-missionmittelstand.html", featured: true,
      },
      {
        id: "migroplan", n: "03", title: "MigroPlan", kicker: "Service-Landing, Design-Sprint",
        desc: "Von der Idee zum Launch in 36 Stunden: Funnel-Architektur, zweisprachige UX, Eignungs-Quiz und Booking-Integration.",
        tags: ["Funnel-Design", "Landing-UX", "Branding"],
        mark: "MP", type: "Kundenprojekt", year: "2026", img: "../cs-logos/migroplan-dark.png",
        plateImgStyle: { maxWidth: "86%", maxHeight: "58%" }, url: "case-study-migroplan.html", featured: true,
      },
      {
        id: "gaming", n: "04", title: "B2B Mobile Gaming", kicker: "Neue Plattform, NDA",
        desc: "Von der Idee bis zum Launch: UX/UI-Design, Microcopy und Lokalisierung für eine brandneue Mobile-Gaming-Plattform bei NeoGroup.",
        tags: ["UX/UI", "Microcopy", "Lokalisierung", "NDA"],
        type: "Produkt · NDA", year: "2024", img: IMG + "B2B-Gaming.png", url: "case-study-gaming.html", featured: true,
      },
      {
        id: "bachata", n: "05", title: "Bachata in Dubai", kicker: "Landing, über Nacht",
        desc: "Ein ehrgeiziges Eintagesprojekt: ein UX-Review der Landingpage einer Tanzschule und überzeugende, nutzerzentrierte Texte.",
        tags: ["UX-Review", "Copywriting"],
        type: "Landingpage", year: "2025", img: IMG + "Bachata%20Logo.png", url: "case-study-bachata.html", featured: false,
      },
      {
        id: "portfolio", n: "06", title: "alexmedved.com", kicker: "Selbst erstelltes Portfolio",
        desc: "Die Entstehung dieses Portfolios hat sich ihren Platz darin verdient – vom Figma-Konzept über das Coding bis zum Hosting.",
        tags: ["Web", "Front-end", "Figma"],
        type: "Portfolio · Design + Code", year: "2025", img: IMG + "FullLogo_Transparent_NoBuffer.png", url: "case-study-portfolio.html", featured: false,
      },
    ],
    certs: [
      {
        name: "UX Design Professional Certificate", by: "Google", year: "2025",
        url: "https://alexmedved.com/de/certificate-google.html",
        verify: "https://coursera.org/share/2affb55e2447078823f7bde7fc267c3c",
        img: IMG + "Google%20UX-1.png", date: "7. Juni 2025",
        details: [
          ["Voraussetzungen", "Erfolgreicher Abschluss von 7 Kursen im Rahmen des Programms, einschließlich aller benoteten Aufgaben in Form von Tests, Projekten und Design-Reviews."],
          ["Umfang", "~82 Stunden Kursarbeit über einen Zeitraum von 6 Monaten."],
          ["Bestätigte Kompetenzen", "User Experience (UX) und User Interface (UI) Design, UX Writing/Editing, User Research, Usability-Tests, Erstellung von User Journeys und Customer Journeys, Wireframing, Prototyping sowie Visual Design mit Tools wie Figma."],
          ["Anwendung", "Strukturiertes Training, das meine mehrjährige UX- und Design-Erfahrung bündelt, einen Rahmen zur Verfeinerung von Fähigkeiten bietet, sie mit Branchenstandards harmonisiert und die berufliche Glaubwürdigkeit stärkt."],
        ],
      },
      {
        name: "UX-Writer & Editor", by: "Netology", year: "2024",
        url: "https://alexmedved.com/de/certificate-netology.html",
        verify: "https://netology.ru/sharing/6dfeb4bf51d682333b0b4ee0101fa12e?utm_source=social&utm_campaign=certificate_lms",
        img: IMG + "UX_certificate-1.png", date: "1. Juni 2024",
        details: [
          ["Voraussetzungen", "Abschluss eines professionellen Trainingsprogramms im UX-Writing, einschließlich Theorie, praktischer Aufgaben und Abschlussbewertung."],
          ["Umfang", "~4 Monate strukturiertes Training."],
          ["Bestätigte Kompetenzen", "UX-Writing, Erstellung von Microcopy, Content Design für Interfaces, Strukturierung von Nutzerkommunikationsflüssen, Festlegung des Tone of Voice sowie Zusammenarbeit mit Produkt- und Designteams."],
          ["Anwendung", "Bietet eine formale Ausbildung im UX-Writing, die praktische Design- und Produkterfahrung ergänzt. Stärkt die Fähigkeit, klare, nutzerzentrierte Kommunikation in digitalen Interfaces zu gestalten, und festigt die Expertise sowohl im Produktdesign als auch in der UX-Kommunikation."],
        ],
      },
      {
        name: "Goethe-Zertifikat C1", by: "Goethe-Institut", year: "2024",
        url: "https://alexmedved.com/de/certificate-goethe.html",
        verify: "https://verify.goethe.de/verify/index.html?wt_sc=verify&sap-language=DE&sap-ui-language=EN",
        img: IMG + "GoetheC1Medved-1.png", date: "10. Dezember 2024",
        details: [
          ["Voraussetzungen", "Erfolgreiches Bestehen aller vier Teile der C1-Prüfung in Deutsch: Lesen, Hören, Schreiben und Sprechen."],
          ["Bestätigte Kompetenzen", "Deutschkenntnisse auf dem Niveau C1 des GER – die Fähigkeit, anspruchsvolle Texte zu verstehen, Gedanken fließend auszudrücken und die Sprache für akademische und berufliche Zwecke effektiv einzusetzen."],
          ["Anwendung", "Ermöglicht die professionelle Nutzung der deutschen Sprache in komplexen, fachlichen Kontexten und wird weltweit als Nachweis fortgeschrittener Deutschkenntnisse anerkannt."],
        ],
      },
    ],
    legal: {
      impressum: {
        title: "Impressum", kicker: "Rechtliche Hinweise · Impressum",
        operator: {
          heading: "Betreiber dieser Webseite", name: "Aleksandr Medved",
          lines: ["Klarastraße 1", "80636 München"],
          contacts: [
            { label: "Mobil", text: "+49 1522 3131484", href: "tel:+4915223131484" },
            { label: "E-Mail", text: "alex@alexmedved.com", href: "mailto:alex@alexmedved.com" },
            { label: "Website", text: "www.alexmedved.com", href: "https://www.alexmedved.com" },
          ],
        },
        sections: [
          { heading: "USt-IdNr.", body: ["DE454681179"] },
          { heading: "Haftungshinweis", body: ["Wir übernehmen keine Gewähr für Aktualität, Richtigkeit und Vollständigkeit der bereitgestellten Informationen. Alle Angebote sind freibleibend und unverbindlich. Änderungen und Irrtümer bleiben vorbehalten. Der Inhalt dieser Seiten ist urheberrechtlich geschützt. Jede weitergehende Verwendung ist ohne ausdrückliche Zustimmung untersagt."] },
          { heading: "Externe Links", body: [
            "Mit Urteil vom 12.05.1998 (Az.: 312 O 85/98) hat das Landgericht Hamburg entschieden, dass der Betreiber einer Internetseite durch die Anbringung eines Links die Inhalte der gelinkten Seite gegebenenfalls mitzuverantworten hat. Dies kann nur dadurch verhindert werden, dass man sich ausdrücklich von diesen Inhalten distanziert.",
            "Für alle auf unserer Internetseite befindlichen Links erklären wir ausdrücklich, dass wir keinerlei Einfluss auf die Gestaltung und die Inhalte der verlinkten Seiten besitzen. Deshalb distanzieren wir uns hiermit ausdrücklich von allen Inhalten aller verlinkten Seiten auf dieser gesamten Internetseite inklusive aller Unterseiten. Diese Erklärung gilt für alle auf dieser Internetseite angebrachten Links und für alle Inhalte der Seiten, zu denen Links führen.",
          ] },
        ],
      },
      privacy: {
        title: "Datenschutzerklärung", kicker: "Datenschutz · DSGVO",
        sections: [
          { num: "01", heading: "Allgemeine Informationen", body: ["Diese Website respektiert Ihre Privatsphäre und verarbeitet personenbezogene Daten in Übereinstimmung mit der Datenschutz-Grundverordnung (DSGVO)."] },
          { num: "02", heading: "Verantwortlicher für die Datenverarbeitung", body: [["Aleksandr Medved", { br: 1 }, "Klarastraße 1", { br: 1 }, "80636 München", { br: 1 }, "alex@alexmedved.com"]] },
          { num: "03", heading: "Datenerhebung auf dieser Website", body: ["Personenbezogene Daten werden nur erhoben, wenn Sie diese freiwillig angeben, zum Beispiel bei der Nutzung des Kontaktformulars."] },
          { num: "04", heading: "Kontaktformular (Formspree)", body: [["Wenn Sie über das Kontaktformular eine Nachricht senden, wird Ihre Anfrage durch Formspree (USA/EU) verarbeitet. Die von Ihnen eingegebenen Daten (Name, E-Mail, Nachricht) werden sicher übertragen und ausschließlich zur Bearbeitung Ihrer Anfrage genutzt. Einzelheiten finden Sie in der ", { href: "https://formspree.io/legal/privacy-policy/", text: "Datenschutzerklärung von Formspree" }, "."]] },
          { num: "05", heading: "Hosting", body: [["Diese Website wird von GitHub Pages (USA) gehostet. GitHub verarbeitet automatisch technische Log-Daten (z. B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs), um die Sicherheit und den Betrieb des Dienstes gemäß Art. 6 Abs. 1 lit. f DSGVO zu gewährleisten. Einzelheiten finden Sie in der ", { href: "https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement", text: "Datenschutzerklärung von GitHub" }, "."]] },
          { num: "06", heading: "Speicherdauer der Daten", body: ["Personenbezogene Daten werden nur so lange aufbewahrt, wie es zur Bearbeitung Ihrer Anfrage erforderlich ist. Server-Logdateien werden von GitHub nach einer kurzen Aufbewahrungsfrist automatisch gelöscht."] },
          { num: "07", heading: "Ihre Rechte", body: ["Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten sowie das Recht auf Einschränkung der Verarbeitung und auf Datenübertragbarkeit gemäß der DSGVO."] },
          { num: "08", heading: "Beschwerderecht", body: ["Sie haben außerdem das Recht, gemäß der DSGVO eine Beschwerde bei einer Aufsichtsbehörde einzureichen."] },
        ],
      },
    },
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/smellfigty/", iconKey: "linkedin" },
      { label: "Telegram", url: "https://t.me/smellfigty", iconKey: "telegram" },
      { label: "WhatsApp", url: "https://wa.me/4915223131484", iconKey: "whatsapp" },
      { label: "Email", url: "mailto:alex@alexmedved.com", iconKey: "email" },
    ],
    nav: [
      { label: "Fallstudien", href: "#work" },
      { label: "Über mich", href: "#about" },
      { label: "Zertifikate", href: "#certificates" },
      { label: "Kontakt", href: "#contact" },
    ],
    disciplines: ["Product Design", "UX-Research", "Informationsarchitektur", "Design-Systeme", "Prototyping", "Lokalisierung / i18n", "UX Writing", "Front-end"],
    ui: {
      langLinks: [
        { label: "EN", href: "../index.html", active: false },
        { label: "DE", href: "#", active: true },
        { label: "RU", href: "../ru/index.html", active: false },
      ],
      logoSub: "Product Designer",
      navGetInTouch: "Kontakt aufnehmen",
      navMenu: "Menü", navClose: "Schließen",
      heroEyebrowRole: "Product Designer",
      heroH1Line1: "Interfaces, die",
      heroH1Line2Pre: "mehr ", heroH1Accent: "leisten.",
      heroLeadPre: "Ich gestalte ", heroLeadStrong: "Interfaces für SaaS, FinTech und komplexe digitale Produkte",
      heroLeadPost: " – mit klarer Struktur für große Datenmengen, verständliche Flows und mehrsprachige UX.",
      ctaWork: "Ausgewählte Projekte ansehen", ctaAbout: "Über mich",
      heroMetaExp: "5+ Jahre in Product Design",
      heroMetaExpShort: "5+ J. im Product Design",
      secCaseStudies: "01 – Fallstudien",
      caseCountSuffix: "Projekte · neueste zuerst",
      flagshipLabel: "FinTech", soonBadge: "Deep-Dive in Arbeit",
      workSoon: "Bald", workComingSoon: "Demnächst",
      secAbout: "02 – Über mich",
      aboutOpen: "offen",
      aboutH2: "[[Klarheit]] für komplexe digitale Produkte.",
      aboutLead: [
        "Ich bin Product Designer mit über 5 Jahren Erfahrung in SaaS-, B2B- und datenintensiven Produkten. Meine Arbeit besteht darin, komplexe Produktlogik in klare User-Flows, belastbare Informationsarchitektur und Interfaces zu übersetzen, die sowohl dem Business als auch den Nutzern helfen, ihr Ziel zu erreichen.",
        "Ich bringe ein starkes Verständnis für UX Research, UX/UI Design, Content – einschließlich UX Writing und SEO – sowie technische Umsetzungsfragen mit. Anforderungen zu sortieren, Struktur zu schaffen, Designsysteme weiterzuentwickeln und skalierbare Entscheidungen zu treffen, gehört für mich zum Kern guter Produktarbeit.",
        "Meine Erfahrung in UX-Lokalisierung und Product QA hat meinen Blick für Sprache, Randfälle, Konsistenz und technische Machbarkeit geschärft. Deshalb denke ich nicht in einzelnen Screens, sondern in Systemen, Varianten und realen Nutzungssituationen."
      ],
      factPracticeV: "Jahre Praxis",
      factLangV: "Sprachen –",
      factLocK: "München", factLocV: "in Bayern",
      capMatrix: "Kompetenzmatrix", toolkitLabel: "Toolkit",
      toolkit: ["Figma", "Prototyping", "Design Tokens", "HTML/CSS", "AI Tools", "Tailwind", "Photoshop", "Google Search Console", "Ahrefs"],
      secCerts: "03 – Zertifikate",
      certsHint: "Für Vorschau hovern · für Details klicken",
      certModalLabel: "Zertifikat", certDate: "Datum", certVerify: "Verifizieren",
      secContact: "04 – Kontakt",
      contactAvail: "Offen für Projekte",
      contactH2: "Soll dein Produkt weniger Reibung erzeugen?",
      cfName: "Name", cfEmail: "E-Mail", cfMessage: "Nachricht",
      cfNamePh: "Dein Name", cfEmailPh: "du@unternehmen.com", cfMsgPh: "Woran arbeitest du?",
      cfSend: "Nachricht senden", cfSending: "Senden…",
      cfOk: "Danke – ich melde mich in Kürze.",
      cfErr: "Etwas ist schiefgelaufen. Schreib mir direkt?",
      cfEmailErr: "Bitte überprüfe das Format der E-Mail: muster@mail.com",
      footerTagline: "Begeistert von UX, CX, Daten, Interfaces und Schokolade.",
      footerImprint: "Impressum", footerPrivacy: "Datenschutzerklärung",
      footerCopyright: "© 2026 – Alle Rechte vorbehalten.",
      tweakCaseGrid: "Case-Raster",
      /* case-study chrome */
      csContactTitle: "Lass uns zusammenarbeiten",
      csContactSub: "Erzähl mir von deinem Produkt und was du brauchst – ich antworte meist innerhalb eines Tages.",
      csEndKicker: "Weiter →",
      csEndTitle: "Gefällt dir meine Arbeit?",
      csEndSub: "Möchtest du über dein Produkt sprechen – oder erst weitere Projekte ansehen?",
      csEndWork: "Kontakt aufnehmen",
      csEndOther: "Weitere Fallstudien ansehen",
      csReadingProgress: "Lesefortschritt",
    },
  },

  /* ============================== РУССКИЙ ============================== */
  ru: {
    htmlLang: "ru",
    profile: {
      name: "Александр Медведь",
      alias: "Smellfigty",
      first: "Александр",
      last: "Медведь",
      role: "Продуктовый дизайнер",
      niche: "data-heavy SaaS- и платформенные продукты",
      location: "Мюнхен, Бавария",
      langs: "DE / EN / RU",
      exp: "5+ лет",
      photo: "../assets/photo-hero.jpg",
      photoNeon: "../assets/photo-neon.jpg",
      email: "alex@alexmedved.com",
    },
    cases: [
      {
        id: "axiomlens", n: "01", title: "AxiomLens", kicker: "Финансовая аналитика",
        desc: "Дашборд аналитики денежных потоков для малого бизнеса — от исследований и IA до UX-сценариев, брендинга и UI-дизайна.",
        tags: ["Продуктовый дизайн", "UX-исследования", "IA", "Дашборд", "Брендинг"],
        type: "Hi-fi прототип", year: "2025", img: "../assets/axiom-logo-white.png",
        plateImgStyle: { maxWidth: "82%", maxHeight: "78%" }, url: "case-study-axiomlens.html", featured: true,
      },
      {
        id: "missionmittelstand", n: "02", title: "Mission Mittelstand", kicker: "Интерактивный лендинг",
        desc: "Mobile-first редизайн лендинга с бесплатной шпаргалкой: стратегия воронки, честная логика скачивания и кликабельный прототип.",
        tags: ["Стратегия воронки","Лендинг UX","Mobile-First UI"],
        type: "Лид-магнит", year: "2026", img: "../cs-logos/missionmittelstand.png",
        plateImgStyle: { maxWidth: "88%", maxHeight: "54%" }, url: "case-study-missionmittelstand.html", featured: true,
      },
      {
        id: "migroplan", n: "03", title: "MigroPlan", kicker: "Сервисный лендинг, Дизайн-спринт",
        desc: "От идеи до запуска за 36 часов: структура воронки, UX на двух языках, квиз для оценки шансов и интеграция записи.",
        tags: ["Дизайн воронки", "Лендинг UX", "Брендинг"],
        mark: "MP", type: "Клиентский проект", year: "2026", img: "../cs-logos/migroplan-dark.png",
        plateImgStyle: { maxWidth: "86%", maxHeight: "58%" }, url: "case-study-migroplan.html", featured: true,
      },
      {
        id: "gaming", n: "04", title: "B2B Mobile Gaming", kicker: "Новая платформа, NDA",
        desc: "От концепции до запуска: UX/UI-дизайн, микротексты и локализация для совершенно новой мобильной игровой платформы в NeoGroup.",
        tags: ["UX/UI", "Микротексты", "Локализация", "NDA"],
        type: "Продукт · NDA", year: "2024", img: IMG + "B2B-Gaming.png", url: "case-study-gaming.html", featured: true,
      },
      {
        id: "bachata", n: "05", title: "Bachata in Dubai", kicker: "Лендинг, за вечер",
        desc: "Амбициозный проект одного вечера: UX-ревью лендинга школы танцев и убедительные, ориентированные на пользователя тексты.",
        tags: ["UX-ревью", "Копирайтинг"],
        type: "Лендинг", year: "2025", img: IMG + "Bachata%20Logo.png", url: "case-study-bachata.html", featured: false,
      },
      {
        id: "portfolio", n: "06", title: "alexmedved.com", kicker: "Веб-портфолио своими руками",
        desc: "История создания этого портфолио заслужила место в нём самом — от концепта в Figma до вёрстки и хостинга.",
        tags: ["Веб", "Front-end", "Figma"],
        type: "Портфолио · Дизайн + Код", year: "2025", img: IMG + "FullLogo_Transparent_NoBuffer.png", url: "case-study-portfolio.html", featured: false,
      },
    ],
    certs: [
      {
        name: "UX Design Professional Certificate", by: "Google", year: "2025",
        url: "https://alexmedved.com/ru/certificate-google.html",
        verify: "https://coursera.org/share/2affb55e2447078823f7bde7fc267c3c",
        img: IMG + "Google%20UX-1.png", date: "7 июня 2025",
        details: [
          ["Условия получения", "Успешное завершение 7 курсов программы, включая все оцениваемые задания в форме тестов, проектов и дизайн-ревью."],
          ["Длительность", "~82 часа на протяжении 6 месяцев."],
          ["Подтверждённые навыки", "UI/UX-дизайн, UX-копирайтинг и редактура, пользовательские исследования, юзабилити-тестирования, создание пользовательских и клиентских сценариев, разработка вайрфреймов и прототипов, а также визуальный дизайн в Figma."],
          ["Применение", "Структурированное обучение, объединившее годы моего практического опыта в UX и дизайне, помогло отточить навыки, сопоставить их с отраслевыми стандартами и укрепить профессиональный авторитет."],
        ],
      },
      {
        name: "UX-писатель и редактор", by: "Нетология", year: "2024",
        url: "https://alexmedved.com/ru/certificate-netology.html",
        verify: "https://netology.ru/sharing/6dfeb4bf51d682333b0b4ee0101fa12e?utm_source=social&utm_campaign=certificate_lms",
        img: IMG + "certificatenetology_ru-1.png", date: "1 июня 2024",
        details: [
          ["Условия получения", "Успешное прохождение программы профессиональной подготовки по UX-копирайтингу, включая теоретические занятия, практические задания и итоговую аттестацию."],
          ["Длительность", "~4 месяца структурированного обучения."],
          ["Подтверждённые навыки", "UX-райтинг, создание микротекстов, контент-дизайн для интерфейсов, разработка сценариев пользовательской коммуникации, разработка голоса продукта (ToV) и межкомандная коммуникация."],
          ["Применение", "Курс даёт формальную подготовку в области UX-райтинга, дополняющую практический опыт в дизайне и продуктовой разработке. Развивает умение создавать понятные, ориентированные на пользователя коммуникации в цифровых интерфейсах и укрепляет экспертность как в продуктовом дизайне, так и в UX-коммуникации."],
        ],
      },
      {
        name: "Goethe-Zertifikat C1", by: "Goethe-Institut", year: "2024",
        url: "https://alexmedved.com/ru/certificate-goethe.html",
        verify: "https://verify.goethe.de/verify/index.html?wt_sc=verify&sap-language=DE&sap-ui-language=EN",
        img: IMG + "GoetheC1Medved-1.png", date: "10 декабря 2024",
        details: [
          ["Условия получения", "Успешная сдача всех четырёх частей экзамена C1 по немецкому языку: чтение, аудирование, письмо и устная речь."],
          ["Подтверждённые навыки", "Владение немецким языком на уровне C1 по шкале CEFR — способность понимать сложные тексты, свободно выражать мысли и эффективно использовать язык в академических и профессиональных целях."],
          ["Применение", "Позволяет профессионально использовать немецкий язык в сложных специализированных контекстах и служит признанным доказательством высокого уровня владения немецким языком."],
        ],
      },
    ],
    legal: {
      impressum: {
        title: "Импрессум", kicker: "Правовая информация · Импрессум",
        operator: {
          heading: "Владелец сайта", name: "Александр Медведь",
          lines: ["Klarastraße 1", "80636 München"],
          contacts: [
            { label: "Телефон", text: "+49 1522 3131484", href: "tel:+4915223131484" },
            { label: "Email", text: "alex@alexmedved.com", href: "mailto:alex@alexmedved.com" },
            { label: "Сайт", text: "www.alexmedved.com", href: "https://www.alexmedved.com" },
          ],
        },
        sections: [
          { heading: "ИНН для уплаты НДС (USt-IdNr.)", body: ["DE454681179"] },
          { heading: "Отказ от ответственности", body: ["Мы не гарантируем актуальность, точность и полноту предоставленной информации. Любые предложения не имеют юридической силы и могут быть изменены без предварительного уведомления. Мы оставляем за собой право на изменения и не несём ответственности за возможные ошибки. Содержание этих страниц защищено авторским правом. Любое дальнейшее использование запрещено без предварительного письменного согласия."] },
          { heading: "Внешние ссылки", body: [
            "Решением Земельного суда Гамбурга от 12.05.1998 (дело № 312 O 85/98) было установлено, что владелец сайта может нести ответственность за содержимое сторонних сайтов, на которые ведут ссылки. Избежать такой ответственности можно только путём явного отказа от этих материалов.",
            "Относительно всех ссылок, размещённых на нашем сайте, мы заявляем, что не имеем никакого влияния ни на оформление, ни на содержание связанных страниц. Поэтому мы прямо отказываемся от ответственности за все материалы любых связанных страниц на данном сайте, включая все подстраницы. Настоящее заявление распространяется на все ссылки, размещённые на этом сайте, равно как и на все материалы таких страниц.",
          ] },
        ],
      },
      privacy: {
        title: "Политика конфиденциальности", kicker: "Защита данных · GDPR",
        sections: [
          { num: "01", heading: "Общие сведения", body: ["Этот сайт уважает вашу конфиденциальность и обрабатывает персональные данные в соответствии с Общим регламентом по защите данных (GDPR/DSGVO)."] },
          { num: "02", heading: "Оператор данных", body: [["Александр Медведь", { br: 1 }, "Klarastraße 1", { br: 1 }, "80636 München", { br: 1 }, "alex@alexmedved.com"]] },
          { num: "03", heading: "Сбор данных на этом сайте", body: ["Персональные данные собираются только в том случае, если вы предоставляете их добровольно, например при использовании контактной формы."] },
          { num: "04", heading: "Форма обратной связи (Formspree)", body: [["Когда вы отправляете сообщение через форму обратной связи, ваш запрос обрабатывается через сервис Formspree (США/ЕС). Введённые вами данные (имя, email, сообщение) передаются по защищённому каналу и используются исключительно для обработки вашего обращения. Подробности доступны в ", { href: "https://formspree.io/legal/privacy-policy/", text: "Политике конфиденциальности Formspree" }, "."]] },
          { num: "05", heading: "Хостинг", body: [["Этот сайт размещён на GitHub Pages (США). GitHub автоматически обрабатывает технические данные журналов (например, IP-адрес, тип браузера, время доступа) для обеспечения безопасности и работы сервиса в соответствии со ст. 6(1)(f) GDPR/DSGVO. Подробности доступны в ", { href: "https://docs.github.com/ru/site-policy/privacy-policies/github-general-privacy-statement", text: "Политике конфиденциальности GitHub" }, "."]] },
          { num: "06", heading: "Хранение данных", body: ["Персональные данные сохраняются только на время, необходимое для обработки вашего запроса. Файлы серверных журналов автоматически удаляются GitHub после короткого периода хранения."] },
          { num: "07", heading: "Ваши права", body: ["Вы имеете право на доступ к своим персональным данным, их исправление и удаление, а также право на ограничение обработки и переносимость данных в соответствии с GDPR/DSGVO."] },
          { num: "08", heading: "Право на подачу жалобы", body: ["Вы также имеете право подать жалобу в надзорный орган в соответствии с GDPR/DSGVO."] },
        ],
      },
    },
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/smellfigty/", iconKey: "linkedin" },
      { label: "Telegram", url: "https://t.me/smellfigty", iconKey: "telegram" },
      { label: "WhatsApp", url: "https://wa.me/4915223131484", iconKey: "whatsapp" },
      { label: "Email", url: "mailto:alex@alexmedved.com", iconKey: "email" },
    ],
    nav: [
      { label: "Кейсы", href: "#work" },
      { label: "Обо мне", href: "#about" },
      { label: "Сертификаты", href: "#certificates" },
      { label: "Контакты", href: "#contact" },
    ],
    disciplines: ["Продуктовый дизайн", "UX-исследования", "Информационная архитектура", "Дизайн-системы", "Прототипирование", "Локализация / i18n", "UX-тексты", "Front-end"],
    ui: {
      langLinks: [
        { label: "EN", href: "../index.html", active: false },
        { label: "DE", href: "../de/index.html", active: false },
        { label: "RU", href: "#", active: true },
      ],
      logoSub: "Продуктовый дизайнер",
      navGetInTouch: "Связаться со мной",
      navMenu: "Меню", navClose: "Закрыть",
      heroEyebrowRole: "Продуктовый дизайнер",
      heroH1Line1: "UI с акцентом",
      heroH1Line2Pre: "на ", heroH1Accent: "ясность.",
      heroLeadPre: "Я создаю ", heroLeadStrong: "интерфейсы для SaaS, FinTech и сложных цифровых продуктов",
      heroLeadPost: " — с ясной структурой, понятными сценариями и мультиязычным UX.",
      ctaWork: "Избранные проекты", ctaAbout: "Обо мне",
      heroMetaExp: "5+ лет в продуктовом дизайне",
      heroMetaExpShort: "5+ лет в продуктовом дизайне",
      secCaseStudies: "01 – Кейсы",
      caseCountSuffix: "проектов · сначала свежие",
      flagshipLabel: "FinTech", soonBadge: "Подробный разбор в работе",
      workSoon: "Скоро", workComingSoon: "Скоро",
      secAbout: "02 – Обо мне",
      aboutOpen: "открыт",
      aboutH2: "[[Ясность]] для сложных цифровых продуктов.",
      aboutLead: [
        "Я продуктовый дизайнер с опытом свыше 5 лет в SaaS, B2B и продуктах с большим количеством данных. Моя основная задача – переводить сложную продуктовую логику в понятные сценарии, крепкую информационную архитектуру и интерфейсы, которые помогут и бизнесу, и пользователям получить желаемое.",
        "Моя экспертиза находится на стыке UX-исследований, UX/UI-дизайна, контента (UX-тексты и SEO) и разработки. Для меня не проблема разобрать требования, выстроить структуру, развивать дизайн-систему и принимать масштабируемые решения.",
        "Опыт в UX-локализации и Product QA дал мне глубокий взгляд на важность языка, пограничных сценариев, консистентности и технической реализации. Поэтому я мыслю не отдельными экранами, а системами, вариантами и реальными пользовательскими ситуациями."
      ],
      factPracticeV: "лет практики",
      factLangV: "языка —",
      factLocK: "Мюнхен", factLocV: "живу в Баварии",
      capMatrix: "Матрица компетенций", toolkitLabel: "Инструменты",
      toolkit: ["Figma", "Прототипирование", "Design Tokens", "HTML/CSS", "AI Tools", "Tailwind", "Photoshop", "Google Search Console", "Ahrefs"],
      secCerts: "03 – Сертификаты",
      certsHint: "Наведите для предпросмотра · нажмите для подробностей",
      certModalLabel: "Сертификат", certDate: "Дата", certVerify: "Верифицировать",
      secContact: "04 – Контакты",
      contactAvail: "Открыт для предложений",
      contactH2: "Хотите сделать UX продукта удобнее?",
      cfName: "Имя", cfEmail: "Email", cfMessage: "Сообщение",
      cfNamePh: "Ваше имя", cfEmailPh: "you@company.com", cfMsgPh: "Над чем вы работаете?",
      cfSend: "Отправить", cfSending: "Отправка…",
      cfOk: "Спасибо — скоро свяжусь с вами.",
      cfErr: "Что-то пошло не так. Напишите мне напрямую?",
      cfEmailErr: "Введите email в правильном формате: primer@mail.com",
      footerTagline: "Влюблён в UX, CX, данные, интерфейсы и шоколад.",
      footerImprint: "Импрессум", footerPrivacy: "Политика конфиденциальности",
      footerCopyright: "© 2026 – Все права защищены.",
      tweakCaseGrid: "Сетка кейсов",
      /* case-study chrome */
      csContactTitle: "Давайте поработаем вместе",
      csContactSub: "Расскажите о продукте и о том, что нужно — обычно отвечаю в течение дня.",
      csEndKicker: "Дальше →",
      csEndTitle: "Понравилось увиденное?",
      csEndSub: "Хотите обсудить свой продукт – или сначала посмотреть другие проекты?",
      csEndWork: "Связаться со мной",
      csEndOther: "Другие кейсы",
      csReadingProgress: "Прогресс чтения",
    },
  },
};

const T = I18N[LANG] || I18N.en;

/* flatten the active language to the globals the components already expect */
const PROFILE = T.profile;
const CASES = T.cases;
const CERTS = T.certs;
const LEGAL = T.legal;
const SOCIALS = T.socials;
const NAV = T.nav;
const DISCIPLINES = T.disciplines;
const UI = T.ui;

Object.assign(window, {
  LANG, IMG, I18N, T,
  PROFILE, CASES, CERTS, LEGAL, SOCIALS, NAV, DISCIPLINES, UI,
});
