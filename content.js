// Глобальная переменная для сохранения скорости
let savedSpeed = parseFloat(localStorage.getItem('savedSpeed')) || 1;

// Функция для установки скорости видео
function applySpeed(videoElement) {
  if (videoElement) {
    videoElement.playbackRate = savedSpeed; // Применяем сохранённую скорость
  }
}

// Функция для создания меню скорости
function createSpeedControl() {
  const speedControl = document.createElement('div');
  speedControl.innerHTML = `
    <select id="speed-selector">
      <option value="0.1">0.1x</option>
      <option value="0.25">0.25x</option>
      <option value="0.5">0.5x</option>
      <option value="0.75">0.75x</option>
      <option value="1" selected>1x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="1.75">1.75x</option>
      <option value="2">2x</option>
	  <option value="2.15">2.15x</option>
	  <option value="2.25">2.25x</option>
      <option value="2.35">2.35x</option>
      <option value="2.5">2.5x</option>
      <option value="2.75">2.75x</option>
      <option value="3">3x</option>
    </select>
  `;

  // Стилизация меню
  speedControl.style.position = 'absolute';
  speedControl.style.zIndex = '10000';
  speedControl.style.backgroundColor = '#f9f9f9';
  speedControl.style.border = '1px solid #ddd';
  speedControl.style.borderRadius = '12px';
  speedControl.style.padding = '8px 12px';
  speedControl.style.fontFamily = '"Roboto", Arial, sans-serif';
  speedControl.style.fontSize = '14px';
  speedControl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  speedControl.style.color = '#333';

  return speedControl;
}

// Функция для добавления контроллера скорости
function addSpeedControl(videoElement) {
  const existingControl = document.getElementById('speed-selector');
  if (existingControl) return; // Если меню уже существует, не добавляем заново

  const speedControl = createSpeedControl();

  // Расчет позиции меню
  const updatePosition = () => {
    const videoBounds = videoElement.getBoundingClientRect();
    speedControl.style.top = `${window.scrollY + videoBounds.top + videoBounds.height / 2 - 20}px`;
    speedControl.style.left = `${window.scrollX + videoBounds.right + 10}px`;
  };

  updatePosition(); // Устанавливаем позицию
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);

  document.body.appendChild(speedControl);

  // Обработчик изменения скорости
  const selector = document.getElementById('speed-selector');
  selector.value = savedSpeed;
  selector.addEventListener('change', (event) => {
    savedSpeed = parseFloat(event.target.value);
    localStorage.setItem('savedSpeed', savedSpeed);
    applySpeed(videoElement); // Применяем выбранную скорость
  });

  applySpeed(videoElement); // Применяем сохранённую скорость
}

// Функция для обработки нового видео
function handleNewVideo() {
  const videoElement = document.querySelector('video');

  if (window.location.pathname.startsWith('/shorts') && videoElement) {
    addSpeedControl(videoElement); // Создаём контроллер скорости
    applySpeed(videoElement); // Применяем сохранённую скорость
  }
}

// Основной код
window.addEventListener('load', () => {
  handleNewVideo(); // Проверяем видео при загрузке страницы

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        handleNewVideo(); // Проверяем каждое добавление нового узла
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// Обработчик изменения URL
window.addEventListener('popstate', () => {
  handleNewVideo();
});

// Перехват pushState
const originalPushState = history.pushState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  handleNewVideo();
};
