(() => {
  const header = document.querySelector('.header');
  const fv = document.querySelector('.fv');
  const onScroll = () => header.classList.toggle('is-scrolled', !fv || window.scrollY > fv.offsetHeight - header.offsetHeight);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const btn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  if (btn && drawer) {
    const set = (open) => {
      drawer.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.documentElement.classList.toggle('is-locked', open);
    };
    btn.addEventListener('click', () => set(!drawer.classList.contains('is-open')));
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  document.querySelectorAll('.ttl__en').forEach((t) => t.querySelectorAll('.mask').forEach((m, i) => m.style.setProperty('--m', i)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains('rv')) {
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('rv'));
        el.style.setProperty('--rv-delay', `${sibs.indexOf(el) * 0.12}s`);
      }
      el.classList.add('is-on');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rv, .ttl__en').forEach((el) => io.observe(el));

  document.querySelectorAll('form[data-todo]').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));

  const fvImgs = [...document.querySelectorAll('.fv__img')];
  const fvGuide = document.querySelector('.fv__guide');
  const fvFlash = document.querySelector('.fv__flash');
  const setGuide = (img) => { fvGuide.style.setProperty('--gx', img.style.getPropertyValue('--gx')); fvGuide.style.setProperty('--gy', img.style.getPropertyValue('--gy')); };
  const fvCards = [...document.querySelectorAll('.fv__card-ph')].map((c) => [...c.querySelectorAll('.fv__sub')]);
  if (fvImgs.length > 1 && fvGuide && fvFlash) {
    setGuide(fvImgs[0]);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let n = 0;
      setInterval(() => {
        fvFlash.classList.remove('is-on'); void fvFlash.offsetWidth; fvFlash.classList.add('is-on');
        setTimeout(() => {
          fvImgs[n].classList.remove('is-on'); fvCards.forEach((c) => c[n % c.length].classList.remove('is-on'));
          n = (n + 1) % fvImgs.length;
          fvImgs[n].classList.add('is-on'); fvCards.forEach((c) => c[n % c.length].classList.add('is-on'));
          setGuide(fvImgs[n]);
        }, 130);
      }, 4000);
    }
  }

  document.querySelectorAll('.reel__track, .ct__track').forEach((t) => {
    [...t.children].forEach((img) => { const c = img.cloneNode(); c.alt = ''; t.appendChild(c); });
  });
  const hdIo = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-on'); hdIo.unobserve(en.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.hd').forEach((el) => hdIo.observe(el));
})();
