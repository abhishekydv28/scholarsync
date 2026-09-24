// Web Audio API ambient sound generator for Zen Mode Focus Screen
// Fully client-side, zero network dependencies, calm relaxing tones

let audioCtx: AudioContext | null = null;
let activeSourceNode: AudioNode | null = null;
let activeGainNode: GainNode | null = null;
let isPlaying = false;
let currentSoundType: 'rain' | 'whitenoise' | 'forest' | 'waves' | 'none' = 'none';

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAmbientSound(type: 'rain' | 'whitenoise' | 'forest' | 'waves', volume: number = 0.25) {
  stopAmbientSound();
  const ctx = getAudioContext();
  
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  // Generate pink/brown noise suited for calm concentration
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (type === 'whitenoise') {
      output[i] = white * 0.15;
    } else if (type === 'rain' || type === 'forest') {
      // Pink noise
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    } else {
      // Brown noise for ocean waves
      b0 = (b0 + (0.02 * white)) / 1.02;
      output[i] = b0 * 0.5;
    }
  }

  const whiteNoiseSource = ctx.createBufferSource();
  whiteNoiseSource.buffer = noiseBuffer;
  whiteNoiseSource.loop = true;

  // Filter based on sound type
  const filter = ctx.createBiquadFilter();
  if (type === 'rain') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
  } else if (type === 'forest') {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);
  } else if (type === 'waves') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
  } else {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime);
  }

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  whiteNoiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  whiteNoiseSource.start();
  activeSourceNode = whiteNoiseSource;
  activeGainNode = gain;
  isPlaying = true;
  currentSoundType = type;
}

export function setAmbientVolume(vol: number) {
  if (activeGainNode && audioCtx) {
    activeGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}

export function stopAmbientSound() {
  if (activeSourceNode) {
    try {
      (activeSourceNode as AudioScheduledSourceNode).stop();
      activeSourceNode.disconnect();
    } catch (e) {
      // ignore
    }
    activeSourceNode = null;
  }
  if (activeGainNode) {
    activeGainNode.disconnect();
    activeGainNode = null;
  }
  isPlaying = false;
  currentSoundType = 'none';
}

export function getAmbientStatus() {
  return { isPlaying, currentSoundType };
}
