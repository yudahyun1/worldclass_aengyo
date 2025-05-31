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

    this.init();
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
        this.resetInterval();
      });
    });
    
    // 자동 슬라이드 시작
    this.startAutoplay();
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
    this.autoplayInterval = setInterval(() => this.nextSlide(), 3000);
  }

  resetInterval() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
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

    this.init();
  }

  init() {
    this.initTouchEvents();
    this.initArrowEvents();
    this.initDotEvents();
    this.updateSlideState();
    this.startAutoplay();
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
    this.autoplayInterval = setInterval(() => {
      const nextSlide = (this.currentSlide + 1) % this.slides.length;
      this.goToSlide(nextSlide);
    }, 5000);
  }

  resetInterval() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
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

    // 메뉴 항목 클릭시 메뉴 닫기
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
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

  // 다국어 지원
  const translations = {
    ko: {
      about: {
        title: 'ABOUT',
        subtitle: '\'계속 걸어가며 길을 찾아 떠나자\'',
        description: '사람은 평생 평균 1억 5천만 걸음을 걷지만, 다른 곳으로 향하는 사람은 얼마나 될까요?<br>우리는 익숙한 길에서 벗어나 모두가 걸을 수 있는 새로운 길을 찾아 만듭니다.<br>함께 나누는 순간들을 더욱 다양하고, 풍요롭게 그리고 발전을 위해.'
      },
      story: {
        title: '우리들의 이야기',
        description: '전 세계를 돌아다니며 식재료와 식문화에 영감을 받아 우리만의 길을 찾으며<br>화려한 테크닉보다는 그 나라의 문화를 이해하고 지속가능성까지 생각하며<br>우리들만의 이야기를 다양한 칵테일로 표현합니다.'
      },
      contact: {
        title: 'CONTACT',
        subtitle: '소셜에서 우리와 함께 같이 걸어보세요'
      }
    },
    en: {
      about: {
        title: 'ABOUT',
        subtitle: 'Let\'s keep walking and find our path',
        description: 'People walk an average of 150 million steps in their lifetime, but how many venture in different directions?<br>We create new paths that everyone can walk on, breaking away from the familiar.<br>For more diverse and enriching moments we share together, and for progress.'
      },
      story: {
        title: 'Our Story',
        description: 'Traveling around the world, we find our own way inspired by ingredients and food culture.<br>Rather than fancy techniques, we understand the culture of each country and consider sustainability<br>to express our story through various cocktails.'
      },
      contact: {
        title: 'CONTACT',
        subtitle: 'Walk with us on social media'
      }
    }
  };

  function updateContent(lang) {
    document.querySelector('#about h2').textContent = translations[lang].about.title;
    document.querySelector('#about p:nth-child(2)').innerHTML = translations[lang].about.subtitle;
    document.querySelector('#about p:nth-child(3)').innerHTML = translations[lang].about.description;
    
    document.querySelector('#story h2').textContent = translations[lang].story.title;
    document.querySelector('#story p').innerHTML = translations[lang].story.description;
    
    document.querySelector('#contact h2').textContent = translations[lang].contact.title;
    document.querySelector('#contact p').textContent = translations[lang].contact.subtitle;
  }

  // 언어 선택 이벤트
  document.querySelectorAll('.language-dropdown a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      updateContent(lang);
    });
  });
}); 