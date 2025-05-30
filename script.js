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
}); 