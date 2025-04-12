// Глобальная переменная для сохранения выбранной скорости
let savedSpeed = 1;

// Функция для создания и добавления контроллера скорости
function addSpeedControl(videoElement) {
  // Проверяем, чтобы контроллер не добавлялся повторно
  if (document.getElementById('speed-selector')) return;

  // Создаем контейнер для контроллера скорости
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
      <option value="2.35">2.35x</option>
      <option value="2.5">2.5x</option>
      <option value="2.75">2.75x</option>
      <option value="3">3x</option>
    </select>
  `;

  // Стилизация в стиле YouTube
  speedControl.style.position = 'fixed';
  speedControl.style.zIndex = '10000';
  speedControl.style.backgroundColor = '#f9f9f9';
  speedControl.style.border = '1px solid #ddd';
  speedControl.style.borderRadius = '12px';
  speedControl.style.padding = '8px 12px';
  speedControl.style.fontFamily = '"Roboto", Arial, sans-serif';
  speedControl.style.fontSize = '14px';
  speedControl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  speedControl.style.color = '#333';

  // Динамическое вычисление позиции
  const videoBounds = videoElement.getBoundingClientRect();
  speedControl.style.top = `${videoBounds.top + videoBounds.height / 2}px`;
  speedControl.style.left = `${videoBounds.right + 10}px`;

  document.body.appendChild(speedControl); // Добавляем контроллер к `body`

  const selector = document.getElementById('speed-selector');
  selector.value = savedSpeed; // Устанавливаем сохранённое значение скорости
  selector.addEventListener('change', (event) => {
    savedSpeed = parseFloat(event.target.value); // Сохраняем выбранную скорость
    videoElement.playbackRate = savedSpeed; // Применяем скорость к текущему видео
  });

  videoElement.playbackRate = savedSpeed; // Применяем сохранённую скорость при создании меню
}

// Наблюдение за изменениями DOM с проверкой URL
const observer = new MutationObserver(() => {
  const videoElement = document.querySelector('video');
  
  // Проверяем, что мы находимся в разделе YouTube Shorts
  if (window.location.pathname.startsWith('/shorts') && videoElement) {
    if (!document.getElementById('speed-selector')) {
      addSpeedControl(videoElement); // Добавляем контрол скорости
    }
    videoElement.playbackRate = savedSpeed; // Применяем сохранённую скорость
  } else {
    // Удаляем меню, если не на Shorts
    const existingControl = document.getElementById('speed-selector');
    if (existingControl) {
      existingControl.parentElement.remove(); // Убираем элемент меню
    }
  }
});

// Настройка наблюдения только для основного контейнера YouTube
window.addEventListener('load', () => {
  observer.observe(document.querySelector('ytd-app'), { childList: true, subtree: true });
});
