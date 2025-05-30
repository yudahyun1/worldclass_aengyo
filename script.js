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

// DOM이 완전히 로드된 후 실행되도록 수정
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

  // 각 슬라이더에 대한 설정
  const sliders = document.querySelectorAll('.slider');
  
  sliders.forEach((slider, sliderIndex) => {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;
    
    // 첫 번째 슬라이드와 닷 활성화
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    
    // 닷 클릭 이벤트
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setSlide(index);
      });
    });
    
    // 자동 슬라이드 설정
    setInterval(() => {
      nextSlide();
    }, 3000);
    
    // 슬라이드 설정 함수
    function setSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    
    // 다음 슬라이드로 이동
    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      setSlide(next);
    }
  });

  const cocktailContainer = document.querySelector('.cocktail-slide-container');
  const cocktailSlides = document.querySelectorAll('.cocktail-slide');
  const cocktailDots = document.querySelectorAll('.cocktail-dot');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');
  let cocktailCurrentSlide = 0;

  // 터치 이벤트 관련 변수
  let touchStartX = 0;
  let touchEndX = 0;

  // 터치 이벤트 리스너 추가
  cocktailContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: false });

  cocktailContainer.addEventListener('touchmove', (e) => {
    e.preventDefault(); // 스크롤 방지
  }, { passive: false });

  cocktailContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: false });

  // 스와이프 처리 함수
  function handleSwipe() {
    const swipeThreshold = 50; // 스와이프 감지 임계값
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // 왼쪽으로 스와이프
        if (cocktailCurrentSlide < cocktailSlides.length - 1) {
          goToSlide(cocktailCurrentSlide + 1);
          resetInterval();
        }
      } else {
        // 오른쪽으로 스와이프
        if (cocktailCurrentSlide > 0) {
          goToSlide(cocktailCurrentSlide - 1);
          resetInterval();
        }
      }
    }
  }

  // 초기 활성화 닷과 화살표
  updateSlideState();

  // 슬라이드 상태 업데이트 함수
  function updateSlideState() {
    // 닷 업데이트
    cocktailDots.forEach(dot => dot.classList.remove('active'));
    cocktailDots[cocktailCurrentSlide].classList.add('active');
    
    // 슬라이드 이동
    cocktailContainer.style.transform = `translateX(-${cocktailCurrentSlide * 100}%)`;
    
    // 화살표 표시/숨김
    prevArrow.classList.toggle('hidden', cocktailCurrentSlide === 0);
    nextArrow.classList.toggle('hidden', cocktailCurrentSlide === cocktailSlides.length - 1);
  }

  // 슬라이드 이동 함수
  function goToSlide(slideIndex) {
    cocktailCurrentSlide = slideIndex;
    updateSlideState();
  }

  // 이전 슬라이드로 이동
  prevArrow.addEventListener('click', () => {
    if (cocktailCurrentSlide > 0) {
      goToSlide(cocktailCurrentSlide - 1);
    }
  });

  // 다음 슬라이드로 이동
  nextArrow.addEventListener('click', () => {
    if (cocktailCurrentSlide < cocktailSlides.length - 1) {
      goToSlide(cocktailCurrentSlide + 1);
    }
  });

  // 닷 클릭 이벤트
  cocktailDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // 자동 슬라이드 (선택사항)
  let slideInterval = setInterval(autoSlide, 5000);

  function autoSlide() {
    let nextSlide = (cocktailCurrentSlide + 1) % cocktailSlides.length;
    goToSlide(nextSlide);
  }

  // 화살표나 닷 클릭시 자동 슬라이드 멈춤
  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 5000);
  }

  prevArrow.addEventListener('click', resetInterval);
  nextArrow.addEventListener('click', resetInterval);
  cocktailDots.forEach(dot => {
    dot.addEventListener('click', resetInterval);
  });

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

  document.querySelectorAll('.language-dropdown a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      updateContent(lang);
    });
  });

  const languageSelector = document.querySelector('.language-selector');
  const languageDropdown = document.querySelector('.language-dropdown');

  // LANGUAGE 버튼 클릭 이벤트
  const languageButton = languageSelector.querySelector('a');
  languageButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
  });

  // 각 언어 옵션 클릭 이벤트
  languageDropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const lang = this.getAttribute('data-lang');
      updateContent(lang);
      languageDropdown.classList.remove('show');
    });
  });

  // 문서 클릭 이벤트 - 메뉴 외부 클릭시에만 닫기
  document.addEventListener('click', function(e) {
    const isClickInside = languageSelector.contains(e.target);
    if (!isClickInside && languageDropdown.classList.contains('show')) {
      languageDropdown.classList.remove('show');
    }
  });

  // 드롭다운 자체 클릭 이벤트 - 버블링 방지
  languageDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});

class Slider {
  constructor(slider, options = {}) {
    this.slider = slider;
    this.container = slider.querySelector('.slide-container');
    this.slides = slider.querySelectorAll('.slide');
    this.dots = slider.querySelectorAll('.dot');
    this.currentSlide = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.interval = null;
    
    // 기본 옵션
    this.options = {
      autoplay: options.autoplay ?? true,
      interval: options.interval ?? 3000,
      swipeThreshold: options.swipeThreshold ?? 50
    };

    this.init();
  }

  init() {
    // 첫 번째 슬라이드 위치 설정
    this.container.style.transform = 'translateX(0)';

    // 터치 이벤트 설정
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: true });

    // 닷 클릭 이벤트
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.setSlide(index);
        this.resetInterval();
      });
    });

    // 자동 재생 시작
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > this.options.swipeThreshold) {
      if (diff > 0) {
        // 왼쪽으로 스와이프
        this.nextSlide();
      } else {
        // 오른쪽으로 스와이프
        this.prevSlide();
      }
      this.resetInterval();
    }
  }

  setSlide(index) {
    this.dots[this.currentSlide].classList.remove('active');
    this.currentSlide = index;
    this.dots[this.currentSlide].classList.add('active');
    this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
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
    this.interval = setInterval(() => this.nextSlide(), this.options.interval);
  }

  resetInterval() {
    if (this.options.autoplay) {
      clearInterval(this.interval);
      this.startAutoplay();
    }
  }
}

// DOM이 로드된 후 슬라이더 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 일반 슬라이더 초기화
  document.querySelectorAll('.slider').forEach(slider => {
    new Slider(slider);
  });

  // 칵테일 슬라이더 초기화
  const cocktailSlider = document.querySelector('.cocktail-slider');
  if (cocktailSlider) {
    initCocktailSlider(cocktailSlider);
  }

  // ... existing code (메뉴 버튼 등) ...
});

// 칵테일 슬라이더 초기화 함수는 그대로 유지
function initCocktailSlider(slider) {
  // ... existing cocktail slider code ...
} 