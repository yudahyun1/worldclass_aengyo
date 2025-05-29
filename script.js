// 스크롤 애니메이션
function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}

const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.1
});

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
}); 