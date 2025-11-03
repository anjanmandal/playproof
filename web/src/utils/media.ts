const FRAME_TIMESTAMPS = [0.15, 0.5, 0.85];

export const extractFramesFromVideo = async (file: File, maxFrames = 3): Promise<Blob[]> => {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = objectUrl;
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';
  video.muted = true;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error('Unable to load video for processing.'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');

  if (!context) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Unable to create canvas to extract frames.');
  }

  const duration = video.duration || 1;
  const timestamps = FRAME_TIMESTAMPS.slice(0, maxFrames).map((ratio) =>
    Math.min(duration * ratio, duration - 0.05),
  );

  const frames: Blob[] = [];

  const captureFrameAt = (time: number) =>
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.onseeked = null;
        video.onerror = null;
      };

      const onSeeked = async () => {
        cleanup();
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              frames.push(blob);
              resolve();
            } else {
              reject(new Error('Failed to convert frame to image blob.'));
            }
          },
          'image/jpeg',
          0.92,
        );
      };

      video.onseeked = onSeeked;
      video.onerror = () => {
        cleanup();
        reject(new Error('Failed to seek video for frame extraction.'));
      };
      video.currentTime = Math.max(time, 0);
    });

  for (const time of timestamps) {
    // eslint-disable-next-line no-await-in-loop
    await captureFrameAt(time);
  }

  video.pause();
  video.removeAttribute('src');
  video.load();
  URL.revokeObjectURL(objectUrl);
  return frames;
};

export const speakCues = (cues: string[]) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cues.join('. '));
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};
