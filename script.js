document.documentElement.classList.add('js-reveal');

(function () {
  var header = document.querySelector('.site-header');
  var progress = document.getElementById('progressBar');

  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  var closeNav = function () {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Keep the current section's anchor when switching language ---------- */
  document.querySelectorAll('.lang-switch a').forEach(function (a) {
    var hash = window.location.hash;
    if (hash) a.href = a.getAttribute('href').split('#')[0] + hash;
  });

  /* ---------- Highlight the nav link for the section in view ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var setActive = function (id) {
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    };
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Localise the "last updated" date ----------
     The markup carries an ISO date (stamped at deploy time by stamp-date.py),
     which is already readable on its own — this only prettifies it. */
  var updated = document.getElementById('lastUpdated');
  if (updated && window.Intl && Intl.DateTimeFormat) {
    var iso = updated.getAttribute('datetime');
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (parts) {
      try {
        var d = new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3]));
        updated.textContent = new Intl.DateTimeFormat(
          document.documentElement.lang || 'es',
          { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
        ).format(d);
      } catch (err) {
        /* keep the ISO date already in the markup */
      }
    }
  }

  /* ---------- Copy e-mail to clipboard ---------- */
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    var resetTimer;
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');

      var flash = function () {
        copyBtn.classList.add('is-copied');
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          copyBtn.classList.remove('is-copied');
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(flash, function () {
          window.location.href = 'mailto:' + email;
        });
      } else {
        // Older browsers: select a temporary field and copy from it.
        var tmp = document.createElement('textarea');
        tmp.value = email;
        tmp.setAttribute('readonly', '');
        tmp.style.position = 'absolute';
        tmp.style.left = '-9999px';
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); flash(); }
        catch (err) { window.location.href = 'mailto:' + email; }
        document.body.removeChild(tmp);
      }
    });
  }
})();
