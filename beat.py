import numpy as np
from scipy.signal import butter, filtfilt
import soundfile as sf
import os

# 저장 경로 만들기
os.makedirs("sound", exist_ok=True)

def generate_kick(duration=0.5, sample_rate=44100):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

    # 1. 메인 베이스: 40Hz → 살짝 내려가는 감
    freq = 60 - 40 * t  # 점점 낮아지는 베이스 주파수
    base_wave = np.sin(2 * np.pi * freq * t)

    # 2. 펀치 어택: 200Hz 고주파 사인 + 노이즈
    attack_duration = 0.02  # 20ms
    attack_len = int(sample_rate * attack_duration)
    punch_wave = np.sin(2 * np.pi * 200 * t[:attack_len]) * 0.7
    noise = np.random.uniform(-0.5, 0.5, attack_len)
    attack = punch_wave + noise * 0.5  # 어택용 노이즈 믹스

    # 3. 전체 합성
    full = np.copy(base_wave)
    full[:attack_len] += attack  # 어택 섞기

    # 4. 엔벨로프 적용
    envelope = np.exp(-t * 8)  # 느린 디케이
    kick = full * envelope * 0.9  # 최종 볼륨 조절

    return kick

def generate_snare(duration=0.3, sample_rate=44100):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    noise = np.random.normal(0, 1, len(t))
    envelope = np.exp(-t * 15)
    return noise * envelope * 0.8

def generate_hihat(duration=0.15, sample_rate=44100):
    noise = np.random.uniform(-1, 1, int(duration * sample_rate))
    b, a = butter(N=4, Wn=[2500, 8000], btype='bandpass', fs=sample_rate)
    filtered = filtfilt(b, a, noise)
    t = np.linspace(0, duration, len(filtered))
    envelope = np.exp(-t * 20)
    return filtered * envelope * 0.6

def generate_clap(duration=0.25, sample_rate=44100):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    noise = np.random.normal(0, 1, len(t))
    envelope = np.exp(-t * 12)
    delayed = np.pad(noise[:int(len(t) * 0.2)], (int(len(t) * 0.05), 0))
    combined = noise[:len(delayed)] + delayed[:len(noise)]
    return combined * envelope[:len(combined)] * 0.7

# 사운드 저장
sample_rate = 44100
sf.write("sound/kick.wav", generate_kick(), sample_rate)
sf.write("sound/snare.wav", generate_snare(), sample_rate)
sf.write("sound/hihat.wav", generate_hihat(), sample_rate)
sf.write("sound/clap.wav", generate_clap(), sample_rate)

print("✅ 모든 사운드가 생성되었습니다!")
