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

  const slideContainer = document.querySelector('.slide-container');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  
  let currentSlide = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // 마우스/터치 이벤트 핸들러 추가
  slideContainer.addEventListener('mousedown', dragStart);
  slideContainer.addEventListener('touchstart', dragStart);
  slideContainer.addEventListener('mousemove', drag);
  slideContainer.addEventListener('touchmove', drag);
  slideContainer.addEventListener('mouseup', dragEnd);
  slideContainer.addEventListener('touchend', dragEnd);
  slideContainer.addEventListener('mouseleave', dragEnd);

  function dragStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    slideContainer.style.transition = 'none';
  }

  function drag(event) {
    if (!isDragging) return;
    event.preventDefault();
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
    slideContainer.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -100 && currentSlide < slides.length - 1) {
      currentSlide += 1;
    }
    if (movedBy > 100 && currentSlide > 0) {
      currentSlide -= 1;
    }
    
    updateSlider();
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  // 슬라이더 업데이트 함수 수정
  function updateSlider() {
    slideContainer.style.transition = 'transform 0.3s ease-out';
    currentTranslate = -currentSlide * slideContainer.clientWidth / 3;
    prevTranslate = currentTranslate;
    slideContainer.style.transform = `translateX(${currentTranslate}px)`;
    
    // 도트 업데이트
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // 도트 클릭 이벤트
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider();
    });
  });
  
  // 자동 슬라이드
  function autoSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }
  
  // 5초마다 자동 슬라이드
  const slideInterval = setInterval(autoSlide, 5000);
  
  // 초기 상태 설정
  dots[0].classList.add('active');
  updateSlider();
}); 