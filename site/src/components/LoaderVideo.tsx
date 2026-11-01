'use client';

import { useEffect, useRef } from 'react';
import { loaderSrc } from '@/lib/loaders';

type LoaderVideoProps = {
  id: string;
  name: string;
  /** Plays on a loop as soon as it loads. Otherwise it rests on a still frame and plays while hovered. */
  autoPlay?: boolean;
};

/** Loading screens often open on black, so paused videos rest on a frame from partway through. */
const showStill = (video: HTMLVideoElement) => {
  if (Number.isFinite(video.duration)) video.currentTime = video.duration * 0.4;
};

const PREVIEW_SPEED = 1.15;

const LoaderVideo = ({ id, name, autoPlay = false }: LoaderVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the video is keyed by id, so each new element needs its rate set again.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.defaultPlaybackRate = PREVIEW_SPEED;
    video.playbackRate = PREVIEW_SPEED;
  }, [id]);

  // The metadata often loads before React hydrates and attaches onLoadedMetadata, so check once mounted too.
  useEffect(() => {
    const video = ref.current;
    if (!video || autoPlay) return;
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) showStill(video);
    else video.addEventListener('loadedmetadata', () => showStill(video), { once: true });
  }, [autoPlay]);

  return (
    <video
      ref={ref}
      key={id}
      src={loaderSrc(id)}
      aria-label={`${name} loading screen`}
      muted
      loop
      playsInline
      autoPlay={autoPlay}
      preload="metadata"
      onMouseEnter={e => !autoPlay && e.currentTarget.play().catch(() => {})}
      onMouseLeave={e => {
        if (autoPlay) return;
        e.currentTarget.pause();
        showStill(e.currentTarget);
      }}
    />
  );
};

export default LoaderVideo;
