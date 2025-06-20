window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".pad");
  const circleRadius = 294 / 2;
  const buttonRadius = 70 / 2;
  const spacing = 82;

  const angles = [135, 45, 225, 315]; // clap, snare, kick, hihat

  buttons.forEach((button, index) => {
    const angle = angles[index] * Math.PI / 180;
    const x = circleRadius + spacing * Math.cos(angle) - buttonRadius;
    const y = circleRadius + spacing * Math.sin(angle) - buttonRadius;

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  });

  // AudioContext 초기화
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const soundBuffers = {};

  const sounds = ["kick", "snare", "hihat", "clap"];

  // 각 wav 파일을 불러와 buffer에 저장
  sounds.forEach(name => {
    fetch(`sound/${name}.wav`)
      .then(res => res.arrayBuffer())
      .then(data => audioCtx.decodeAudioData(data))
      .then(buffer => {
        soundBuffers[name] = buffer;
      });
  });

  function playSound(name) {
    if (!soundBuffers[name]) return;
    const source = audioCtx.createBufferSource();
    source.buffer = soundBuffers[name];
    source.connect(audioCtx.destination);
    source.start();
  }

  buttons.forEach(button => {
    const sound = button.dataset.sound;

    const trigger = () => {
      playSound(sound);
      button.classList.add("active");
      setTimeout(() => button.classList.remove("active"), 150);
    };

    // 모바일 다중 터치 대응
    button.addEventListener("touchstart", e => {
      e.preventDefault();
      trigger();
    }, { passive: false });

    // 데스크탑 대응
    button.addEventListener("mousedown", trigger);
  });

  // iOS 및 일부 브라우저에서 오디오 재생 허용을 위한 사용자 상호작용 트리거
  document.body.addEventListener("touchstart", () => {
    if (audioCtx.state !== 'running') {
      audioCtx.resume();
    }
  }, { once: true });
});
