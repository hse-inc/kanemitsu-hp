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
  const setGuide = (img) => {
    const fr = img.parentElement, W = fr.offsetWidth, H = fr.offsetHeight;
    const bw = img.offsetWidth, bh = img.offsetHeight, bl = img.offsetLeft, bt = img.offsetTop;
    const k = Math.max(bw / img.naturalWidth, bh / img.naturalHeight) || 1;
    const rw = img.naturalWidth * k, rh = img.naturalHeight * k;
    const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const cs = getComputedStyle(img), fx = parseFloat(cs.getPropertyValue('--fx')) / 100, fy = parseFloat(cs.getPropertyValue('--fy')) / 100;
    const s = 1.03, x = (bw - rw) * px + rw * fx, y = (bh - rh) * py + rh * fy;
    fvGuide.style.setProperty('--gx', ((bl + bw / 2 + (x - bw / 2) * s) / W * 100).toFixed(2) + '%');
    fvGuide.style.setProperty('--gy', ((bt + bh / 2 + (y - bh / 2) * s) / H * 100).toFixed(2) + '%');
  };
  let fvCur = 0;
  const fvCards = [...document.querySelectorAll('.fv__card-ph')].map((c) => [...c.querySelectorAll('.fv__sub')]);
  if (fvImgs.length > 1 && fvGuide && fvFlash) {
    const fitGuide = () => setGuide(fvImgs[fvCur]);
    if (fvImgs[0].complete) fitGuide(); else fvImgs[0].addEventListener('load', fitGuide);
    addEventListener('resize', fitGuide);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let n = 0;
      setInterval(() => {
        fvFlash.classList.remove('is-on'); void fvFlash.offsetWidth; fvFlash.classList.add('is-on');
        setTimeout(() => {
          fvImgs[n].classList.remove('is-on'); fvCards.forEach((c) => c[n % c.length].classList.remove('is-on'));
          n = (n + 1) % fvImgs.length;
          fvImgs[n].classList.add('is-on'); fvCards.forEach((c) => c[n % c.length].classList.add('is-on'));
          fvCur = n; setGuide(fvImgs[n]);
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
