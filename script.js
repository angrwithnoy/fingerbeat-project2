window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".pad");
  const bigCircle = document.querySelector(".big-circle");

  const circleRadius = 294 / 2;
  const buttonRadius = 70 / 2;
  const spacing = 82;

  // 새로운 순서: [Clap, Snare, Kick, Hihat]
  const angles = [135, 45, 225, 315];

  buttons.forEach((button, index) => {
    const angle = angles[index] * Math.PI / 180;
    const x = circleRadius + spacing * Math.cos(angle) - buttonRadius;
    const y = circleRadius + spacing * Math.sin(angle) - buttonRadius;

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  });

  const audioSources = {
    kick: new Audio("sound/kick.wav"),
    snare: new Audio("sound/snare.wav"),
    hihat: new Audio("sound/hihat.wav"),
    clap: new Audio("sound/clap.wav")
  };

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const soundName = button.dataset.sound;
      const source = audioSources[soundName].cloneNode(); // 딜레이 제거 및 중첩 허용
      source.play();

      button.classList.add("active");
      setTimeout(() => button.classList.remove("active"), 150);
    });
  });
});
