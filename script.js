// ============ Krushi Bhoomi Farm - interactions ============
// Shared across all pages (Home, About, Farmland, Contact, Terms, Privacy).
// Every selector is null-checked so pages without a given element never error.

// Image fallback: if a farm photo fails to load, swap to a placeholder
document.querySelectorAll('img').forEach((img, i) => {
  img.addEventListener('error', () => {
    img.src = `https://picsum.photos/seed/krushi-fallback-${i}/800/600`;
  }, { once: true });
});

// Cookie consent (gates Google Analytics via Consent Mode - see <head> gtag snippet)
const CONSENT_KEY = 'kb-cookie-consent';
const consentChoice = localStorage.getItem(CONSENT_KEY);

if (typeof gtag === 'function' && consentChoice === 'granted') {
  gtag('consent', 'update', { analytics_storage: 'granted' });
}

if (!consentChoice) {
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <p>We use cookies to understand site traffic via Google Analytics. See our <a href="privacy">Privacy Policy</a>.</p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn-outline cookie-decline">Decline</button>
      <button type="button" class="btn-dark cookie-accept">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  banner.querySelector('.cookie-accept').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' });
    banner.remove();
  });

  banner.querySelector('.cookie-decline').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    banner.remove();
  });
}

// Home page statement tabs
const statementTabs = document.getElementById('statementTabs');
if (statementTabs) {
  const statementPanel = document.getElementById('statementPanel');
  const statementTitle = document.getElementById('statementTitle');
  const statementDesc = document.getElementById('statementDesc');
  const statementLabelLeft = document.getElementById('statementLabelLeft');
  const statementLabelRight = document.getElementById('statementLabelRight');
  const tabButtons = Array.from(statementTabs.querySelectorAll('.tag[data-statement]'));
  const statementContext = statementPanel?.dataset.statementContext || 'home';

  const statementContentByContext = {
    home: {
      sandalwood: {
        title: 'Where Nature Meets Opportunity - Own Land, Trees, And A Living Legacy.',
        desc: "Krushi Bhoomi Farms is a one-of-a-kind managed farmland project spread across 120 acres of lush greenery in Yelandur, Karnataka. Each 6,500 sq.ft. plot is thoughtfully designed with 40 to 50 sandalwood and fruit-bearing trees for long-term, high-value returns. Every plot owner can also keep a cow and sheep on the farm - generating regular income and a deeper connection with nature. We're not just selling land, we're helping you create a legacy.",
        left: 'Harvesting Legacy.',
        right: 'Planting Tomorrow'
      },
      orchards: {
        title: 'Fruit Orchards That Add Beauty, Yield, And Steady Seasonal Income.',
        desc: 'Every plot is enriched with fruit-bearing trees chosen to complement the sandalwood plantation and create a balanced ecosystem. These orchards add recurring harvest potential, diversify the land use, and make every visit to your farm feel vibrant, productive, and alive.',
        left: 'Seasonal Harvests.',
        right: 'Living Orchard'
      },
      livestock: {
        title: 'Cattle & Sheep Turn Your Farm Into A Living, Income-Generating Ecosystem.',
        desc: 'Plot owners can keep a cow and sheep on the farm, creating an added layer of value beyond the trees themselves. Livestock supports regular milk-based income, natural farm activity, and a stronger emotional connection to the land while our team manages the day-to-day care.',
        left: 'Daily Value.',
        right: 'Nature In Motion'
      }
    },
    about: {
      'managed-farmland': {
        title: 'A Visionary Project Redefining How You Invest In Nature, Agriculture, And Your Future.',
        desc: 'Krushi Bhoomi Farms is dedicated to redefining the way you invest in nature, agriculture, and your future. Our managed farmland initiative is built on a simple yet transformative idea - a sustainable, integrated farming ecosystem that marries financial growth with the nurturing power of nature. Founded by entrepreneurs with deep roots in both urban real estate and rural agronomy, Krushi Bhoomi Farms emerged from a desire to help modern investors reconnect with the land. Spread across 120 acres of fertile red soil in Yelandur, our carefully planned 6,500 sq.ft. plots are designed to deliver multiple streams of revenue and personal fulfillment.',
        left: 'Harvesting Legacy.',
        right: 'Planting Tomorrow'
      },
      sandalwood: {
        title: 'Sandalwood Anchors The Long-Term Vision Behind Every Plot We Develop.',
        desc: 'Sandalwood is at the heart of the Krushi Bhoomi model because it represents patience, value creation, and long-term thinking. By integrating high-value sandalwood trees into every planned plot, we create an investment experience that grows steadily over time while remaining rooted in ecological balance and careful management.',
        left: 'Long-Term Value.',
        right: 'Rooted Growth'
      },
      'livestock-model': {
        title: 'Our Livestock Model Brings Daily Life, Purpose, And Utility To The Farm.',
        desc: 'The Krushi Bhoomi ecosystem is designed to be more than a plantation. By including cattle and sheep as part of the broader managed-farm concept, we create a more connected agricultural model - one that supports recurring value, practical farm utility, and a richer bond between the owner and the land.',
        left: 'Living Ecosystem.',
        right: 'Daily Connection'
      }
    }
  };

  const updateStatement = key => {
    const statementContent = statementContentByContext[statementContext] || {};
    const content = statementContent[key];
    if (!content || !statementTitle || !statementDesc || !statementLabelLeft || !statementLabelRight) return;

    statementTitle.textContent = content.title;
    statementDesc.textContent = content.desc;
    statementLabelLeft.textContent = content.left;
    statementLabelRight.textContent = content.right;

    tabButtons.forEach(button => {
      const isActive = button.dataset.statement === key;
      button.classList.toggle('tag-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  };

  tabButtons.forEach(button => {
    button.addEventListener('click', () => updateStatement(button.dataset.statement));
  });
}

// Horizontal scroll affordance for About timeline
document.querySelectorAll('[data-scrollable-region]').forEach(region => {
  const scroller = region.querySelector('.timeline');
  const thumb = region.querySelector('.timeline-scroll-thumb');
  if (!scroller || !thumb) return;

  let activeTimer;

  const updateScrollableState = () => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const isScrollable = maxScroll > 8;
    region.classList.toggle('is-scrollable', isScrollable);

    if (!isScrollable) {
      region.classList.remove('is-active');
      thumb.style.width = '100%';
      thumb.style.transform = 'translateX(0)';
      return;
    }

    const thumbRatio = Math.min(1, scroller.clientWidth / scroller.scrollWidth);
    const trackWidth = region.querySelector('.timeline-scroll-track')?.clientWidth || 0;
    const thumbWidth = Math.max(44, trackWidth * thumbRatio);
    const progress = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
    const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${maxThumbOffset * progress}px)`;
  };

  const showActivity = () => {
    if (!region.classList.contains('is-scrollable')) return;
    region.classList.add('is-active', 'is-interacted');
    clearTimeout(activeTimer);
    activeTimer = setTimeout(() => {
      region.classList.remove('is-active');
    }, 700);
  };

  updateScrollableState();
  scroller.addEventListener('scroll', () => {
    updateScrollableState();
    showActivity();
  });
  scroller.addEventListener('pointerdown', showActivity);
  scroller.addEventListener('touchstart', showActivity, { passive: true });
  window.addEventListener('resize', updateScrollableState);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Highlight the nav link matching the current page, and close mobile menu on click.
// Works with clean URLs ("/about"), legacy ".html" URLs, and local file:// paths -
// every path is reduced to a bare page slug ("" = home) before comparing.
const navLinks = document.querySelectorAll('.nav-link');
if (navLinks.length) {
  const pageSlug = value => {
    let s = (value || '').split('#')[0].split('?')[0];
    s = s.replace(/^.*\//, '').replace(/\.html$/i, '');
    return s === 'index' ? '' : s;
  };

  const currentSlug = pageSlug(location.pathname);

  navLinks.forEach(link => {
    if (pageSlug(link.getAttribute('href')) === currentSlug) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

    link.addEventListener('click', () => {
      document.querySelector('.nav-link.active')?.classList.remove('active');
      link.classList.add('active');
      mainNav?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

// Carousel arrows (home page only)
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const CARD_STEP = 284; // card width + gap

if (track && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -CARD_STEP, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: CARD_STEP, behavior: 'smooth' });
  });

  // Update collab badge as carousel scrolls (01/05 ... 05/05)
  const badge = document.getElementById('collabBadge');
  if (badge) {
    const totalCards = track.children.length;
    track.addEventListener('scroll', () => {
      const idx = Math.min(
        totalCards,
        Math.round(track.scrollLeft / CARD_STEP) + 1
      );
      badge.textContent = `0${idx}/0${totalCards}`;
    });
  }
}

// Animated stat counters (run once when visible) - home page only
const stats = document.querySelectorAll('.stat h3[data-count]');
const fmt = n => n.toLocaleString('en-US');

const animateStat = el => {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (stats.length) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(s => statObserver.observe(s));
}

const sendForm = async (form, payload, messageElement, successMessage) => {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton ? submitButton.innerHTML : '';

  if (messageElement) {
    messageElement.textContent = '';
    messageElement.classList.remove('form-status-error');
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }

  try {
    const response = await fetch('/contact.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'We could not send your request. Please try again.');
    }

    form.reset();
    if (messageElement) messageElement.textContent = successMessage;
  } catch (error) {
    if (messageElement) {
      messageElement.textContent = error.message || 'We could not send your request. Please try again.';
      messageElement.classList.add('form-status-error');
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonContent;
    }
  }
};

// Newsletter subscribe form (home page)
const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('emailInput');
    const msg = document.getElementById('ctaMsg');
    const website = subscribeForm.querySelector('[name="website"]');
    await sendForm(subscribeForm, {
      formType: 'newsletter',
      email: email ? email.value.trim() : '',
      website: website ? website.value : ''
    }, msg, 'Thanks for joining! We\'ll be in touch. 🌱');
  });
}

// Contact form (contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nameEl = document.getElementById('nameInput');
    const msg = document.getElementById('contactMsg');
    const name = nameEl && nameEl.value ? nameEl.value : 'there';
    const website = contactForm.querySelector('[name="website"]');
    await sendForm(contactForm, {
      formType: 'contact',
      name: nameEl ? nameEl.value.trim() : '',
      email: document.getElementById('contactEmailInput').value.trim(),
      phone: document.getElementById('phoneInput').value.trim(),
      subject: document.getElementById('subjectInput').value.trim(),
      message: document.getElementById('messageInput').value.trim(),
      website: website ? website.value : ''
    }, msg, `Thanks, ${name}! Your message has been sent - we'll get back to you within one business day. 🌱`);
  });
}

// Farmland filter tags (farmland page only)
const farmlandFilter = document.getElementById('farmlandFilter');
if (farmlandFilter) {
  const filterButtons = farmlandFilter.querySelectorAll('.tag');
  const farmlandCards = document.querySelectorAll('.farmland-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('tag-active'));
      btn.classList.add('tag-active');

      const filter = btn.dataset.filter;
      farmlandCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
}

// Gallery lightbox (gallery page only)
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');

if (galleryGrid && lightbox) {
  const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  let current = 0;

  const show = index => {
    current = (index + items.length) % items.length;
    const img = items[current].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = `${current + 1} / ${items.length}`;
  };

  const open = index => {
    show(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => open(index));
  });

  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  closeBtn.addEventListener('click', close);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

// Fade-in on scroll for sections
const fadeEls = document.querySelectorAll('section, .sol-card, .c-card, .farmland-card, .team-card');
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
});

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));
