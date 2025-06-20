window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".pad");
  const bigCircle = document.querySelector(".big-circle");

  const circleRadius = 294 / 2;      // 147px
  const buttonRadius = 70 / 2;       // 35px
  const spacing = 82;                // 원 중심에서 버튼 중심까지 거리

  // 수정된 위치: clap ↖, snare ↗, kick ↙, hihat ↘
  const angles = [135, 45, 225, 315]; // 각 버튼 위치 (도 단위)

  buttons.forEach((button, index) => {
    const angle = angles[index] * Math.PI / 180;
    const x = circleRadius + spacing * Math.cos(angle) - buttonRadius;
    const y = circleRadius + spacing * Math.sin(angle) - buttonRadius;

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  });

  buttons.forEach(button => {
    const soundName = button.dataset.sound;

    // 미리 오디오 객체 생성 (버튼별로)
    const audio = new Audio(`sound/${soundName}.wav`);
    audio.preload = "auto"; // 미리 로딩

    button.addEventListener("touchstart", event => {
      event.preventDefault(); // 모바일 멀티 터치 방지 해제
      playSound(audio, button);
    });

    button.addEventListener("mousedown", () => {
      playSound(audio, button);
    });
  });

  function playSound(audio, button) {
    // 오디오를 새로 생성하여 중첩 허용
    const clone = audio.cloneNode();
    clone.play();

    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 150);
  }
});
