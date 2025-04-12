(function () {
  // Храним последний src видео, чтобы отслеживать изменения
  let lastVideoSrc = "";

  // Функция применяет сохранённую скорость из localStorage к видео
  function applyStoredSpeed(video) {
    const storedSpeed = localStorage.getItem("defaultPlaybackSpeed");
    if (storedSpeed) {
      const speed = parseFloat(storedSpeed);
      video.playbackRate = speed;
      const btn = document.getElementById("speed-control-button");
      if (btn) {
        btn.textContent = speed.toFixed(2) + "x";
      }
      console.log("[BYTS] Applied stored speed: " + speed);
    }
  }

  // Функция, создающая панель управления скоростью
  function insertSpeedControl() {
    const video = document.querySelector("video");
    if (!video) return;

    // Если элемент управления уже существует, удаляем его для обновления
    const existingContainer = document.getElementById("speed-control-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    // Применяем сохранённую скорость к текущему видео
    applyStoredSpeed(video);

    // Создаем контейнер для управления
    const container = document.createElement("div");
    container.id = "speed-control-container";
    container.style.position = "fixed";
    container.style.bottom = "30px";
    container.style.right = "30px";
    container.style.zIndex = "999999";
    container.style.cursor = "pointer";

    // Создаем кнопку-контроллер, показывающую текущую скорость
    const button = document.createElement("div");
    button.id = "speed-control-button";
    button.textContent = video.playbackRate.toFixed(2) + "x";
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    button.style.color = "white";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.fontSize = "16px";
    button.style.border = "2px solid red";
    button.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.5)";
    container.appendChild(button);

    // Создаем панель со списком доступных скоростей (скрыта по умолчанию)
    const panel = document.createElement("div");
    panel.id = "speed-control-panel";
    panel.style.position = "absolute";
    panel.style.bottom = "70px";
    panel.style.right = "0";
    panel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    panel.style.padding = "10px";
    panel.style.borderRadius = "4px";
    panel.style.display = "none";
    panel.style.flexDirection = "column";

    // Обновлённый список вариантов скоростей
    const speeds = [1, 1.35, 1.5, 1.75, 2.0, 2.15, 2.25, 2.35, 2.5, 2.75, 3];
    speeds.forEach(function (speed) {
      const speedOption = document.createElement("div");
      speedOption.textContent = speed + "x";
      speedOption.style.padding = "5px 10px";
      speedOption.style.cursor = "pointer";
      speedOption.style.color = "white";
      speedOption.style.fontSize = "14px";
      speedOption.addEventListener("mouseenter", function () {
        speedOption.style.backgroundColor = "rgba(255,255,255,0.2)";
      });
      speedOption.addEventListener("mouseleave", function () {
        speedOption.style.backgroundColor = "transparent";
      });
      // При клике устанавливаем новую скорость, обновляем отображение и сохраняем значение
      speedOption.addEventListener("click", function (e) {
        video.playbackRate = speed;
        button.textContent = speed.toFixed(2) + "x";
        panel.style.display = "none";
        localStorage.setItem("defaultPlaybackSpeed", speed);
        console.log("[BYTS] Speed set to: " + speed);
        e.stopPropagation();
      });
      panel.appendChild(speedOption);
    });
    container.appendChild(panel);

    // Переключение отображения панели по клику на кнопку
    button.addEventListener("click", function (e) {
      panel.style.display =
        panel.style.display === "none" || panel.style.display === "" ? "flex" : "none";
      e.stopPropagation();
    });

    // Если клик вне контейнера – панель закрывается
    document.addEventListener("click", function () {
      panel.style.display = "none";
    });

    document.body.appendChild(container);
    console.log("[BYTS] Inserted speed control");
  }

  // Функция, проверяющая, изменилось ли видео или пропал ли контейнер управления
  function checkForVideoChange() {
    const video = document.querySelector("video");
    if (!video) return;

    // Если видео изменилось или контейнер управления отсутствует, вставляем панель заново
    if (video.src !== lastVideoSrc || !document.getElementById("speed-control-container")) {
      lastVideoSrc = video.src;
      console.log("[BYTS] Video change detected or missing control. Re-inserting control for video src: " + video.src);
      insertSpeedControl();
    }
  }

  // При первой загрузке, если видео уже есть, вставляем элементы управления
  const initialVideo = document.querySelector("video");
  if (initialVideo) {
    lastVideoSrc = initialVideo.src;
    insertSpeedControl();
  }

  // Каждую секунду проверяем, нужно ли обновлять элементы управления
  setInterval(checkForVideoChange, 1000);
})();
