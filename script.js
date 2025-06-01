// 스크롤 애니메이션
const handleIntersection = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}

const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.1
});

class MainSlider {
  constructor(slider) {
    this.slider = slider;
    this.slides = slider.querySelectorAll('.slide');
    this.dots = slider.querySelectorAll('.dot');
    this.slideContainer = slider.querySelector('.slide-container');
    this.currentSlide = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoplayInterval = null;
    this.isVisible = false;

    this.init();
    this.setupVisibilityObserver();
  }

  init() {
    // 터치 이벤트 초기화
    this.initTouchEvents();
    
    // 첫 번째 슬라이드 상태 설정
    this.updateSlideState();
    
    // 닷 클릭 이벤트
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.setSlide(index);
        if (this.isVisible) {
          this.resetInterval();
        }
      });
    });
  }

  setupVisibilityObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.startAutoplay();
        } else {
          this.isVisible = false;
          this.stopAutoplay();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.slider);
  }

  initTouchEvents() {
    this.slideContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: false });

    this.slideContainer.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    this.slideContainer.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: false });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
      this.resetInterval();
    }
  }

  updateSlideState() {
    // 닷 업데이트
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[this.currentSlide].classList.add('active');
    
    // 슬라이드 이동
    this.slideContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
  }

  setSlide(index) {
    this.currentSlide = index;
    this.updateSlideState();
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.setSlide(next);
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.setSlide(prev);
  }

  startAutoplay() {
    if (!this.autoplayInterval) {
      this.autoplayInterval = setInterval(() => this.nextSlide(), 3000);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetInterval() {
    this.stopAutoplay();
    if (this.isVisible) {
      this.startAutoplay();
    }
  }
}

class CocktailSlider {
  constructor(slider) {
    this.slider = slider;
    this.container = slider.querySelector('.cocktail-slide-container');
    this.slides = slider.querySelectorAll('.cocktail-slide');
    this.dots = slider.querySelectorAll('.cocktail-dot');
    this.prevArrow = slider.querySelector('.prev-arrow');
    this.nextArrow = slider.querySelector('.next-arrow');
    this.currentSlide = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoplayInterval = null;
    this.isVisible = false;

    this.init();
    this.setupVisibilityObserver();
  }

  init() {
    this.initTouchEvents();
    this.initArrowEvents();
    this.initDotEvents();
    this.updateSlideState();
  }

  setupVisibilityObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.startAutoplay();
        } else {
          this.isVisible = false;
          this.stopAutoplay();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.slider);
  }

  initTouchEvents() {
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: false });

    this.container.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: false });
  }

  initArrowEvents() {
    this.prevArrow.addEventListener('click', () => {
      if (this.currentSlide > 0) {
        this.goToSlide(this.currentSlide - 1);
        this.resetInterval();
      }
    });

    this.nextArrow.addEventListener('click', () => {
      if (this.currentSlide < this.slides.length - 1) {
        this.goToSlide(this.currentSlide + 1);
        this.resetInterval();
      }
    });
  }

  initDotEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetInterval();
      });
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && this.currentSlide < this.slides.length - 1) {
        this.goToSlide(this.currentSlide + 1);
      } else if (diff < 0 && this.currentSlide > 0) {
        this.goToSlide(this.currentSlide - 1);
      }
      this.resetInterval();
    }
  }

  updateSlideState() {
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[this.currentSlide].classList.add('active');
    
    this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    
    this.prevArrow.classList.toggle('hidden', this.currentSlide === 0);
    this.nextArrow.classList.toggle('hidden', this.currentSlide === this.slides.length - 1);
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlideState();
  }

  startAutoplay() {
    if (!this.autoplayInterval) {
      this.autoplayInterval = setInterval(() => {
        const nextSlide = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextSlide);
      }, 5000);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetInterval() {
    this.stopAutoplay();
    if (this.isVisible) {
      this.startAutoplay();
    }
  }
}

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 섹션 애니메이션 관찰
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // 햄버거 메뉴 기능
  const menuBtn = document.querySelector('.menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // 메뉴 항목 클릭시 메뉴 닫기 (language 선택기 제외)
    const menuLinks = navMenu.querySelectorAll('a:not(.lang-btn)');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 언어 선택 기능
  const langSelector = document.querySelector('.language-selector');
  const langBtn = document.querySelector('.lang-btn');

  if (langBtn && langSelector) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      langSelector.classList.toggle('active');
    });

    // 다른 곳 클릭시 언어 메뉴 닫기
    document.addEventListener('click', (e) => {
      if (!langSelector.contains(e.target)) {
        langSelector.classList.remove('active');
      }
    });

    // 언어 선택 이벤트
    const langLinks = document.querySelectorAll('.language-dropdown a');
    langLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lang = e.target.dataset.lang;
        updateContent(lang);
        // 언어 선택 후에도 메뉴는 열린 상태 유지
        langSelector.classList.remove('active');
      });
    });
  }

  // 모든 일반 슬라이더 초기화
  document.querySelectorAll('.slider').forEach(slider => {
    new MainSlider(slider);
  });

  // 칵테일 슬라이더 초기화
  const cocktailSlider = document.querySelector('.cocktail-slider');
  if (cocktailSlider) {
    new CocktailSlider(cocktailSlider);
  }

  // 언어 변경 관련 코드
  const translations = {
    ko: {
      nav: {
        about: "소개",
        story: "우리들의 이야기",
        cocktail: "칵테일",
        contact: "문의"
      },
      about: {
        title: "소개",
        subtitle: "계속 걸어가며 길을 찾아 떠나자",
        description: "사람은 평생 평균 1억 5천만 걸음을 걷지만, 다른 곳으로 향하는 사람은 얼마나 될까요?<br>우리는 익숙한 길에서 벗어나 모두가 걸을 수 있는 새로운 길을 찾아 만듭니다.<br>함께 나누는 순간들을 더욱 다양하고, 풍요롭게 그리고 발전을 위해."
      },
      story: {
        title: "우리들의 이야기",
        description: "전 세계를 돌아다니며 식재료와 식문화에 영감을 받아 우리만의 길을 찾으며<br>화려한 테크닉보다는 그 나라의 문화를 이해하고 지속가능성까지 생각하며<br>우리들만의 이야기를 다양한 칵테일로 표현합니다."
      },
      cocktail: "칵테일",
      contact: {
        title: "문의",
        subtitle: "소셜에서 우리와 함께 같이 걸어보세요"
      },
      menu: {
        "하와이안피자": "하와이안피자",
        "루꼴라샐러드": "루꼴라샐러드",
        "크리스마스푸딩": "크리스마스푸딩",
        "미나리무침": "미나리무침",
        "비빔밥": "비빔밥",
        "폰즈소바": "폰즈소바"
      }
    },
    en: {
      nav: {
        about: "ABOUT",
        story: "Our Story",
        cocktail: "COCKTAIL",
        contact: "CONTACT"
      },
      about: {
        title: "ABOUT",
        subtitle: "Let's keep walking and embark on a journey to find the way",
        description: "On average, a person takes 150 million steps in their lifetime, but how many of those steps actually lead us somewhere new?<br>We step away from familiar paths to discover and create new ones that are open to all.<br>Here's to making the moments we share more diverse and more enriching… and a big step forward."
      },
      story: {
        title: "Our Story",
        description: "In search of our own unique path, we travel around the world drawing inspiration from local ingredients and culinary cultures.<br>Rather than relying on flashy techniques, we focus on understanding each place's culture and embracing sustainability along the way.<br>With this perspective, we express our story through a variety of cocktails."
      },
      cocktail: "COCKTAIL",
      contact: {
        title: "CONTACT",
        subtitle: "Keep Walking with us on social"
      },
      menu: {
        "하와이안피자": "Hawaiian Pizza",
        "루꼴라샐러드": "Arugula Salad",
        "크리스마스푸딩": "Christmas Pudding",
        "미나리무침": "Minari Muchim",
        "비빔밥": "Bibimbap",
        "폰즈소바": "Ponzu Soba"
      }
    }
  };

  let currentLang = 'ko';

  function updateContent(lang) {
    currentLang = lang;
    
    // 네비게이션 메뉴 업데이트
    document.querySelector('a[href="#about"]').textContent = translations[lang].nav.about;
    document.querySelector('a[href="#story"]').textContent = translations[lang].nav.story;
    document.querySelector('a[href="#cocktail"]').textContent = translations[lang].nav.cocktail;
    document.querySelector('a[href="#contact"]').textContent = translations[lang].nav.contact;

    // About 섹션 업데이트
    document.querySelector('#about h2').textContent = translations[lang].about.title;
    const aboutPs = document.querySelectorAll('#about p');
    aboutPs[0].innerHTML = translations[lang].about.subtitle;
    aboutPs[1].innerHTML = translations[lang].about.description;

    // Story 섹션 업데이트
    document.querySelector('#story h2').textContent = translations[lang].story.title;
    document.querySelector('#story p').innerHTML = translations[lang].story.description;

    // Cocktail 섹션 업데이트
    document.querySelector('#cocktail h2').textContent = translations[lang].nav.cocktail;

    // Contact 섹션 업데이트
    document.querySelector('#contact h2').textContent = translations[lang].contact.title;
    document.querySelector('#contact p').textContent = translations[lang].contact.subtitle;

    // 칵테일 메뉴 업데이트
    const cocktailSlides = document.querySelectorAll('.cocktail-slide');
    const imageMap = {
      'a.jpeg': '하와이안피자',
      'b.jpeg': '루꼴라샐러드',
      'c.jpeg': '크리스마스푸딩',
      'd.png': '미나리무침',
      'e.jpeg': '비빔밥',
      'f.jpeg': '폰즈소바'
    };

    cocktailSlides.forEach(slide => {
      const img = slide.querySelector('img');
      const p = slide.querySelector('p');
      const filename = img.src.split('/').pop();
      const koreanName = imageMap[filename];
      if (koreanName && translations[lang].menu[koreanName]) {
        p.textContent = translations[lang].menu[koreanName];
        img.alt = translations[lang].menu[koreanName] + (lang === 'ko' ? ' 칵테일' : ' Cocktail');
      }
    });
  }

  // 초기 언어 설정
  updateContent('ko');
}); 