/* ══════════════════════════════════════════════════════════════════════════
   NITISIT SENAHARN — PORTFOLIO / script.js
   ------------------------------------------------------------------------
     01. Project data          — edit here to add gallery images
     02. Small helpers
     03. Navbar: scroll state, hamburger, scroll-spy
     04. Scroll progress bar
     05. Scroll reveal (IntersectionObserver)
     06. Hero stat count-up
     07. Project card pointer glow
     08. Project modal
     09. Lightbox gallery
     10. Copy-to-clipboard
     11. Misc (footer year)
   ══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ══ 01. PROJECT DATA ═══════════════════════════════════════════════════
     Everything the modal renders lives here.

     TO ADD AEGIS PHOTOS: drop the files into assets/projects/aegis/ and add
     an entry to that project's `gallery` array — { file, caption }.
     Any image that 404s degrades to a labelled placeholder tile, so it is
     safe to list files before they exist.                                */

  const PROJECTS = {

    /* ─────────────────────────── DC-1 ─────────────────────────── */
    dc1: {
      chip:      "Penetration Test",
      chipClass: "chip--danger",
      chipIcon:  "shield-alert",
      title:     "DC-1 — Boot-to-Root Penetration Test",
      subtitle:  "Group project · Cyber Security course · OffSec Proving Grounds · Target: DC-1",

      role: "Group project for the Cyber Security course. I was responsible for the <strong>DC-1</strong> target end to end — reconnaissance through to root and proof collection.",

      challenge:
        "A black-box penetration test against a Drupal 7 Linux server hosted on OffSec Proving Grounds. " +
        "No credentials, no source access and no prior knowledge of the stack — everything had to come from " +
        "what the host exposed to the network.",

      chainTitle: "Attack Chain",
      chain: [
        {
          h: "Reconnaissance — Nmap",
          p: "Full port and service-version scan to map the attack surface, identifying the exposed web service and the Drupal 7 application behind it."
        },
        {
          h: "Web Enumeration — Gobuster & Nikto",
          p: "Directory and file brute-forcing with Gobuster alongside Nikto vulnerability scanning to surface CMS paths, version indicators and misconfigurations."
        },
        {
          h: "Initial Access — Drupalgeddon2 (CVE-2018-7600)",
          p: "Exploited the unauthenticated remote code execution flaw in Drupal 7 via Metasploit, landing a shell on the target as the <code>www-data</code> service account."
        },
        {
          h: "Privilege Escalation — SUID on /usr/bin/find",
          p: "Enumerated SUID binaries and found <code>/usr/bin/find</code> misconfigured with the SUID bit set, then abused its <code>-exec</code> option to execute commands as root."
        },
        {
          h: "Post-Exploitation — Proof Collection",
          p: "Established root-level access and retrieved both flags to verify the compromise end to end."
        }
      ],

      vulnAssessment: {
        intro: "Automated vulnerability scanning was performed using Tenable Nessus, identifying 51 findings across the target.",
        severity: [
          { label: "Critical", count: 2 },
          { label: "High",     count: 2 },
          { label: "Medium",   count: 4 },
          { label: "Low",      count: 4 },
          { label: "Info",     count: 39 }
        ],
        findings: [
          "Debian Linux 7.x End-of-Life",
          "PHP Unsupported Version (5.4.45)",
          "Drupal Database Abstraction API SQL Injection (CVE-2014-3704)",
          "PHP < 7.3.24 Multiple Vulnerabilities"
        ]
      },

      result: {
        h: "Full system compromise",
        p: "Root access achieved on the DC-1 host, with <code>local.txt</code> and <code>proof.txt</code> retrieved and verified."
      },

      tools: ["Nmap", "Gobuster", "Nikto", "Metasploit", "SearchSploit", "Linux"],

      galleryPath: "assets/projects/dc1/",
      gallery: [
        { file: "01-target-overview.jpg",           caption: "Target overview" },
        { file: "02-attack-chain-summary.jpg",      caption: "Attack chain summary" },
        { file: "03-nmap-recon.jpg",                caption: "Nmap reconnaissance" },
        { file: "04-drupalgeddon2-exploit.jpg",     caption: "Drupalgeddon2 exploitation" },
        { file: "05-suid-enumeration.jpg",          caption: "SUID binary enumeration" },
        { file: "06-privilege-escalation-root.jpg", caption: "Privilege escalation to root" },
        { file: "07-root-proof-verification.jpg",   caption: "Root proof verification" },
        { file: "09-nessus-scan-summary.jpg",          caption: "Nessus scan summary — severity donut chart" },
        { file: "10-nessus-vulnerability-table-1.jpg", caption: "Vulnerability summary — CVE & CVSS scoring (1 of 2)" },
        { file: "11-nessus-vulnerability-table-2.jpg", caption: "Vulnerability summary — CVE & CVSS scoring (2 of 2)" }
      ]
    },

    /* ─────────────────────────── AEGIS ─────────────────────────── */
    aegis: {
      chip:      "SIEM · AI Security",
      chipClass: "chip--accent",
      chipIcon:  "brain-circuit",
      title:     "AEGIS — AI-Enhanced SIEM for Cloud Infrastructure",
      subtitle:  "Group project · Industry-Driven Innovation Project",

      challenge:
        "The brief came from SIAM.AI Cloud, a GPU cloud infrastructure provider. At their scale, " +
        "traditional security monitoring produces far more alerts than a team can realistically " +
        "review, and the ones that signal a real threat get lost in the noise. They needed a system " +
        "that could watch a high volume of activity, judge what actually mattered, and give analysts " +
        "a clear signal instead of an endless list.",

      whatBuilt:
        "AEGIS is an AI-enhanced SIEM (Security Information and Event Management) system designed " +
        "for that scale. It collects activity from across the infrastructure, streams it through a " +
        "processing pipeline, scores each event for how suspicious it is using a model running on " +
        "GPU, and presents analysts with a single prioritised view. A human always makes the final " +
        "call — the system recommends, it doesn't act on its own.",

      reflection:
        "This was my first time working on something that had to handle real scale, as a team, " +
        "against a brief from an actual company. I learned as much about how the pieces of a system " +
        "fit together — and where they break under load — as I did about security itself.",

      galleryPath: "assets/projects/aegis/",
      gallery: [
        { file: "aegis-04-dashboard-overview.jpg", caption: "Analyst dashboard — alert queue with composite risk scoring and severity distribution." }
      ]
    }
  };


  /* ══ 02. SMALL HELPERS ══════════════════════════════════════════════════ */

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Escape user-facing strings before they go into innerHTML. */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }


  /* ══ 03. NAVBAR ═════════════════════════════════════════════════════════ */

  const nav        = $("#nav");
  const navLinks   = $("#nav-links");
  const hamburger  = $("#hamburger");
  const linkEls    = $$(".nav__link");

  /* — 4a. Hamburger drawer — */
  function setMenu(open) {
    navLinks.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  hamburger.addEventListener("click", () =>
    setMenu(!navLinks.classList.contains("is-open"))
  );

  /* Close the drawer after tapping a link, and on outside click / Escape */
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest(".nav__link")) setMenu(false);
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("is-open")) return;
    if (e.target.closest("#nav-links") || e.target.closest("#hamburger")) return;
    setMenu(false);
  });

  /* Reset the drawer if the viewport grows past the mobile breakpoint */
  window.matchMedia("(min-width: 801px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* — 4b. Glass background once scrolled — */
  function updateNavState() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  /* — 4c. Scroll-spy: highlight the section currently in view — */
  const sections = $$("main section[id]");

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        linkEls.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
        );
      });
    },
    /* Band across the middle of the viewport = "the current section" */
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => spy.observe(s));


  /* ══ 04. SCROLL PROGRESS BAR ════════════════════════════════════════════ */

  const progressBar = $("#progress-bar");

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }

  /* Single rAF-throttled scroll handler for both nav state and progress */
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateNavState();
        updateProgress();
        ticking = false;
      });
    },
    { passive: true }
  );

  updateNavState();
  updateProgress();


  /* ══ 05. SCROLL REVEAL ══════════════════════════════════════════════════ */

  const revealEls = $$(".reveal");

  if (prefersReducedMotion) {
    /* Motion is off — show everything immediately. */
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);   /* animate once, then stop watching */
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }


  /* ══ 06. HERO STAT COUNT-UP ═════════════════════════════════════════════ */

  const counters = $$("[data-count]");

  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) return;

    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);          /* easeOutCubic */
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  if (!prefersReducedMotion && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => {
      c.textContent = "0";
      counterObserver.observe(c);
    });
  }


  /* ══ 07. PROJECT CARD POINTER GLOW ══════════════════════════════════════ */

  $$(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });


  /* ══ 08. PROJECT MODAL ══════════════════════════════════════════════════ */

  const modal        = $("#project-modal");
  const modalContent = $("#modal-content");
  let lastFocused    = null;   /* restore focus here after closing */

  /** Build the modal's inner HTML for a given project key. */
  function buildModal(key) {
    const p = PROJECTS[key];
    if (!p) return "";

    /* Numbered attack-chain / pipeline-steps block — optional, only
       rendered for projects that define a `chain` array (DC-1 has one;
       AEGIS currently doesn't). */
    const chainBlock = p.chain
      ? `
      <div class="m-block">
        <h3 class="m-h">${esc(p.chainTitle)}</h3>
        <div class="m-steps">${p.chain
          .map(
            (s) => `
          <div class="m-step">
            <span class="m-step__n" aria-hidden="true"></span>
            <div class="m-step__body">
              <strong>${s.h}</strong>
              <span>${s.p}</span>
            </div>
          </div>`
          )
          .join("")}</div>
      </div>`
      : "";

    /* Plain narrative block (e.g. AEGIS's "What We Built") — optional. */
    const whatBuiltBlock = p.whatBuilt
      ? `
      <div class="m-block">
        <h3 class="m-h">What We Built</h3>
        <p>${esc(p.whatBuilt)}</p>
      </div>`
      : "";

    /* Vulnerability Assessment — only DC-1 has this data, so the whole
       block is omitted for projects that don't define it (e.g. AEGIS). */
    const vulnBlock = p.vulnAssessment
      ? `
      <div class="m-block">
        <h3 class="m-h">Vulnerability Assessment</h3>
        <p>${esc(p.vulnAssessment.intro)}</p>
        <div class="m-severity">${p.vulnAssessment.severity
          .map(
            (s) => `
          <div class="m-severity__item m-severity__item--${esc(s.label.toLowerCase())}">
            <strong>${esc(s.count)}</strong>
            <span>${esc(s.label)}</span>
          </div>`
          )
          .join("")}
        </div>
        <ul class="m-findings">${p.vulnAssessment.findings
          .map((f) => `<li>${esc(f)}</li>`)
          .join("")}
        </ul>
      </div>`
      : "";

    /* Gallery: render tiles when files are listed, otherwise a hint. */
    const gallery = p.gallery.length
      ? `<div class="m-gallery">${p.gallery
          .map(
            (img, i) => `
          <button class="g-item" type="button"
                  data-project="${esc(key)}" data-index="${i}"
                  aria-label="View image ${i + 1}: ${esc(img.caption)}">
            <img src="${esc(p.galleryPath + img.file)}" alt="${esc(img.caption)}"
                 loading="lazy"
                 onerror="this.closest('.g-item').classList.add('is-empty')" />
            <span class="g-item__ph" aria-hidden="true">
              <span>${esc(img.file)}</span>
            </span>
            <span class="g-item__cap">${esc(img.caption)}</span>
          </button>`
          )
          .join("")}</div>`
      : `<div class="m-gallery-note">
          <span>Gallery coming soon — drop photos into <code>${esc(p.galleryPath)}</code> and list them in the <code>gallery</code> array in <code>script.js</code>.</span>
        </div>`;

    /* "My Role" only renders when a project defines it — AEGIS omits it. */
    const roleBlock = p.role
      ? `
      <div class="m-block">
        <h3 class="m-h">My Role</h3>
        <p>${p.role}</p>
      </div>`
      : "";

    /* Small muted footnote (e.g. a confidentiality note) — optional. */
    const noteBlock = p.note ? `<p class="m-note">${esc(p.note)}</p>` : "";

    /* Gallery block is skippable per-project (e.g. a project with none to show). */
    const galleryBlock = p.hideGallery
      ? ""
      : `
      <div class="m-block">
        ${gallery}
      </div>`;

    /* Closing section: DC-1 uses the tinted "Result" callout (headline +
       detail). AEGIS instead has a plain reflective paragraph — rendered
       as ordinary body text under "What I Took From It" rather than the
       callout, since it isn't a headline/detail pair. */
    const closingBlock = p.result
      ? `
      <div class="m-block">
        <h3 class="m-h">Result</h3>
        <div class="m-result">
          <div>
            <strong>${esc(p.result.h)}</strong>
            <p>${p.result.p}</p>
          </div>
        </div>
      </div>`
      : p.reflection
      ? `
      <div class="m-block">
        <h3 class="m-h">What I Took From It</h3>
        <p>${esc(p.reflection)}</p>
      </div>`
      : "";

    return `
      <header class="m-head">
        <span class="chip ${p.chipClass}">${esc(p.chip)}</span>
        <h2 class="m-title" id="modal-title">${esc(p.title)}</h2>
        <p class="m-sub">${esc(p.subtitle)}</p>
      </header>
      ${roleBlock}

      <div class="m-block">
        <h3 class="m-h">The Challenge</h3>
        <p>${esc(p.challenge)}</p>
      </div>
      ${chainBlock}
      ${whatBuiltBlock}
      ${vulnBlock}
      ${closingBlock}
      ${galleryBlock}
      ${noteBlock}
    `;
  }

  function openModal(key) {
    if (!PROJECTS[key]) return;

    lastFocused = document.activeElement;
    modalContent.innerHTML = buildModal(key);

    modal.hidden = false;
    document.body.classList.add("is-locked");

    /* Next frame so the CSS transition has a starting state to animate from */
    requestAnimationFrame(() => modal.classList.add("is-open"));

    modalContent.scrollTop = 0;
    $(".modal__close", modal).focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");

    const finish = () => {
      modal.hidden = true;
      modalContent.innerHTML = "";
      /* Only unlock if the lightbox isn't still open on top */
      if (lightbox.hidden) document.body.classList.remove("is-locked");
      if (lastFocused) lastFocused.focus();
    };

    prefersReducedMotion ? finish() : setTimeout(finish, 320);
  }

  /* Open from card click or keyboard (cards are role="button", tabindex=0) */
  $$(".project-card").forEach((card) => {
    const key = card.dataset.project;
    card.addEventListener("click", () => openModal(key));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(key);
      }
    });
  });

  /* Close on overlay / close button */
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-modal]")) closeModal();
  });

  /* Delegated: gallery tiles are injected, so listen on the container */
  modalContent.addEventListener("click", (e) => {
    const tile = e.target.closest(".g-item");
    if (!tile) return;
    openLightbox(tile.dataset.project, parseInt(tile.dataset.index, 10));
  });

  /* Keep Tab focus inside the open modal */
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;

    const focusables = $$(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      modal
    ).filter((el) => el.offsetParent !== null);

    if (!focusables.length) return;

    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });


  /* ══ 09. LIGHTBOX ═══════════════════════════════════════════════════════ */

  const lightbox   = $("#lightbox");
  const lbImage    = $("#lb-image");
  const lbCaption  = $("#lb-caption");
  const lbCounter  = $("#lb-counter");
  const lbPrev     = $("#lb-prev");
  const lbNext     = $("#lb-next");

  let lbSet   = [];   /* current gallery array */
  let lbPath  = "";
  let lbIndex = 0;

  /* Shown in place of any gallery image whose file isn't on disk yet. */
  const LB_PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600">' +
      '<rect width="960" height="600" fill="#f4f2ec"/>' +
      '<rect x="1" y="1" width="958" height="598" fill="none" stroke="#4b6e8c" ' +
      'stroke-opacity="0.3" stroke-width="2" stroke-dasharray="10 8"/>' +
      '<text x="480" y="300" text-anchor="middle" fill="#6e7680" ' +
      'font-family="sans-serif" font-size="26">Image not found</text></svg>'
    );

  /* If the file is missing, fall back once — guarded so a failing
     placeholder can never loop the error handler. */
  lbImage.addEventListener("error", () => {
    if (lbImage.dataset.fallback === "1") return;
    lbImage.dataset.fallback = "1";
    lbImage.src = LB_PLACEHOLDER;
  });

  function showLightboxImage(i) {
    const total = lbSet.length;
    if (!total) return;

    lbIndex = (i + total) % total;      /* wrap around both directions */
    const img = lbSet[lbIndex];

    /* Re-trigger the entry animation on every change */
    lbImage.style.animation = "none";
    void lbImage.offsetWidth;
    lbImage.style.animation = "";

    lbImage.dataset.fallback = "0";
    lbImage.src = lbPath + img.file;
    lbImage.alt = img.caption;
    lbCaption.textContent = img.caption;
    lbCounter.textContent = (lbIndex + 1) + " / " + total;

    /* Only offer navigation/counter when there's more than one image —
       a single certificate image has no "1 / 1" to show. */
    const multi = total > 1;
    lbPrev.style.display = multi ? "" : "none";
    lbNext.style.display = multi ? "" : "none";
    lbCounter.style.display = multi ? "" : "none";
  }

  /** Core opener: show `images` (an array of {file, caption}) resolved
      against `path`, starting at `index`. Nav arrows auto-hide via
      showLightboxImage() whenever there's only one image in the set. */
  function openLightboxSet(images, path, index) {
    if (!images || !images.length) return;

    lbSet  = images;
    lbPath = path;

    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    requestAnimationFrame(() => lightbox.classList.add("is-open"));

    showLightboxImage(index);
    $(".lightbox__close", lightbox).focus();
  }

  function openLightbox(key, index) {
    const p = PROJECTS[key];
    if (!p) return;
    openLightboxSet(p.gallery, p.galleryPath, index);
  }

  const ACTIVITY_IMAGE_PATH = "assets/activities/";

  /** Photos for each activity card — keyed by that card's `data-activity`
      attribute. Sets with more than one image get working prev/next nav
      for free from the shared lightbox core. */
  const ACTIVITY_GALLERIES = {
    hackathon: [
      { file: "ai-mini-hackathon-certificate.jpg", caption: "AI Mini Hackathon 2026 — certificate" }
    ],
    nextgen: [
      { file: "nextgen-tech-01-group-photo.jpg",       caption: "NextGen Tech — group photo" },
      { file: "nextgen-tech-02-panel-discussion.jpg",  caption: "NextGen Tech — panel discussion" },
      { file: "nextgen-tech-03-audience.jpg",          caption: "NextGen Tech — audience" },
      { file: "nextgen-tech-04-presentation.jpg",      caption: "NextGen Tech — presentation" },
      { file: "activity-nextgen-tech-certificate.jpg", caption: "NextGen Tech — certificate" }
    ],
    itEmpowering: [
      { file: "it-empowering-day-01-booth-poster.jpg",  caption: "IT Empowering Day 2026 — booth poster" },
      { file: "it-empowering-day-02-presenting.jpg",    caption: "IT Empowering Day 2026 — presenting" },
      { file: "it-empowering-day-03-judges-review.jpg", caption: "IT Empowering Day 2026 — judges review" },
      { file: "it-empowering-day-04-team-onstage.jpg",  caption: "IT Empowering Day 2026 — team onstage" }
    ],
    cyberApocalypse: [
      { file: "cyber-apocalypse-ctf-2026-certificate.jpg", caption: "Cyber Apocalypse CTF 2026 — certificate" }
    ]
  };

  function openActivityLightbox(key) {
    const images = ACTIVITY_GALLERIES[key];
    if (!images) return;
    openLightboxSet(images, ACTIVITY_IMAGE_PATH, 0);
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");

    const finish = () => {
      lightbox.hidden = true;
      /* Arm the guard before clearing: an empty src resolves to the page
         URL and would otherwise fire `error` and load the placeholder. */
      lbImage.dataset.fallback = "1";
      lbImage.removeAttribute("src");
      /* The modal underneath may still be open — keep the lock if so */
      if (modal.hidden) document.body.classList.remove("is-locked");
    };

    prefersReducedMotion ? finish() : setTimeout(finish, 320);
  }

  lbPrev.addEventListener("click", () => showLightboxImage(lbIndex - 1));
  lbNext.addEventListener("click", () => showLightboxImage(lbIndex + 1));

  lightbox.addEventListener("click", (e) => {
    /* Close on the backdrop or the X — but not on the image itself */
    if (e.target.closest("[data-close-lightbox]") || e.target === lightbox) {
      closeLightbox();
    }
  });


  /* ══ Global keyboard handling for both overlays ═════════════════════════ */

  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden) {
      if (e.key === "Escape")     closeLightbox();
      if (e.key === "ArrowLeft")  showLightboxImage(lbIndex - 1);
      if (e.key === "ArrowRight") showLightboxImage(lbIndex + 1);
      return;                       /* lightbox sits on top — it wins */
    }
    if (!modal.hidden && e.key === "Escape") closeModal();
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenu(false);
  });


  /* Each activity card opens its photo set in the lightbox. Certifications
     display their images inline now, so they no longer open anything. */
  $$(".timeline__card[data-activity]").forEach((card) => {
    const key = card.dataset.activity;

    card.addEventListener("click", () => openActivityLightbox(key));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openActivityLightbox(key);
      }
    });
  });


  /* ══ 10. COPY TO CLIPBOARD ══════════════════════════════════════════════ */

  const toast     = $("#toast");
  const copyBtn   = $("#copy-email");
  let toastTimer  = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  /** Clipboard API with a document.execCommand fallback for file:// pages. */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0;";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const value = copyBtn.dataset.copy;
      const label = $(".btn__label", copyBtn);

      try {
        await copyText(value);

        copyBtn.classList.add("is-copied");
        label.textContent = "Copied";
        showToast("Email copied to clipboard");

        setTimeout(() => {
          copyBtn.classList.remove("is-copied");
          label.textContent = "Copy";
        }, 2200);
      } catch (err) {
        showToast("Press Ctrl+C to copy");
      }
    });
  }


  /* ══ 11. MISC ═══════════════════════════════════════════════════════════ */

  $("#year").textContent = new Date().getFullYear();

})();
