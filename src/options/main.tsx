import { StrictMode, useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { getLibrary, getLoaderUrl, groupByCategory, type Loader } from '../shared/loaders';
import { getSettings, onSettingsChanged, RANDOM_LOADER, saveSettings, type Settings } from '../shared/settings';
import { addUserVideo, deleteUserVideo, renameUserVideo } from '../shared/user-videos';
import './options.css';

const PROBE_TIMEOUT_MS = 15_000;

/** Resolves with the video's duration if Chrome can decode it, or rejects with a readable reason. */
function probeVideo(file: File): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const finish = (callback: () => void) => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      callback();
    };
    const timer = setTimeout(() => finish(() => reject(new Error('Timed out reading the file.'))), PROBE_TIMEOUT_MS);

    video.preload = 'metadata';
    video.onloadedmetadata = () =>
      finish(() => {
        if (!video.videoWidth) reject(new Error('No video track Chrome can play.'));
        else resolve(Number.isFinite(video.duration) ? video.duration : null);
      });
    video.onerror = () => finish(() => reject(new Error("Chrome can't play this file. Try MP4 (H.264) or WebM.")));
    video.src = url;
  });
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return 'Unknown length';
  return seconds < 60 ? `${Math.round(seconds)}s` : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** Loading screens often open on black frames, so previews rest on a frame from partway through instead. */
function showPreviewFrame(video: HTMLVideoElement) {
  if (Number.isFinite(video.duration)) video.currentTime = video.duration * 0.4;
}

function LoaderCard({
  loader,
  inRandom,
  onToggleRandom,
  onRename,
  onDelete,
}: {
  loader: Loader;
  inRandom: boolean;
  onToggleRandom: (include: boolean) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [name, setName] = useState(loader.name);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    getLoaderUrl(loader).then(result => {
      url = result;
      if (cancelled && url?.startsWith('blob:')) URL.revokeObjectURL(url);
      else setSrc(url);
    });
    return () => {
      cancelled = true;
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    };
  }, [loader.id]);

  const commitName = () => {
    const trimmed = name.trim();
    if (!trimmed) setName(loader.name);
    else if (trimmed !== loader.name) onRename(trimmed);
  };

  return (
    <li className="card">
      <video
        src={src ?? undefined}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={e => showPreviewFrame(e.currentTarget)}
        onMouseEnter={e => e.currentTarget.play().catch(() => {})}
        onMouseLeave={e => {
          e.currentTarget.pause();
          showPreviewFrame(e.currentTarget);
        }}
      />
      <div className="card-body">
        {loader.builtIn ? (
          <h3>{loader.name}</h3>
        ) : (
          <input
            className="name"
            aria-label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
          />
        )}
        <p className="meta">
          {loader.builtIn ? 'Built-in' : `${formatDuration(loader.duration)} · ${formatSize(loader.size)}`}
        </p>
        <div className="card-actions">
          <label className="checkbox">
            <input type="checkbox" checked={inRandom} onChange={e => onToggleRandom(e.target.checked)} />
            In Random rotation
          </label>
          {!loader.builtIn && (
            <button type="button" className="danger" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function Options() {
  const [library, setLibrary] = useState<Loader[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [storageUsed, setStorageUsed] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const [nextLibrary, nextSettings, estimate] = await Promise.all([
      getLibrary(),
      getSettings(),
      navigator.storage.estimate(),
    ]);
    setLibrary(nextLibrary);
    setSettings(nextSettings);
    setStorageUsed(estimate.usage ?? null);
  }, []);

  useEffect(() => {
    refresh();
    return onSettingsChanged(() => getSettings().then(setSettings));
  }, [refresh]);

  if (!settings) return null;

  const addFiles = async (files: File[]) => {
    if (!files.length) return;
    setAdding(true);
    const failures: string[] = [];
    for (const file of files) {
      try {
        await addUserVideo(file, await probeVideo(file));
      } catch (error) {
        failures.push(`${file.name}: ${(error as Error).message}`);
      }
    }
    setErrors(failures);
    setAdding(false);
    await refresh();
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const toggleRandom = (loader: Loader, include: boolean) => {
    const excludedFromRandom = settings.excludedFromRandom.filter(id => id !== loader.id);
    if (!include) excludedFromRandom.push(loader.id);
    setSettings({ ...settings, excludedFromRandom });
    saveSettings({ excludedFromRandom });
  };

  const rename = async (loader: Loader, name: string) => {
    await renameUserVideo(loader.id, name);
    await refresh();
  };

  const remove = async (loader: Loader) => {
    if (!confirm(`Delete "${loader.name}" from your library?`)) return;
    await deleteUserVideo(loader.id);
    await saveSettings({
      loader: settings.loader === loader.id ? RANDOM_LOADER : settings.loader,
      excludedFromRandom: settings.excludedFromRandom.filter(id => id !== loader.id),
    });
    await refresh();
  };

  return (
    <main>
      <header>
        <h1>Loading screen library</h1>
        <p>
          Add your own videos to use as loading screens. They're saved inside the extension on this computer, so
          you can move or delete the original files. They don't sync to other computers and are removed if you
          uninstall the extension.
        </p>
      </header>

      <section
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onDragOver={e => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <p className="dropzone-label">{adding ? 'Adding videos…' : 'Drop video files here'}</p>
        <button type="button" disabled={adding} onClick={() => fileInput.current?.click()}>
          Choose files
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="video/*"
          multiple
          hidden
          onChange={e => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
        <p className="hint">
          MP4 (H.264) and WebM work everywhere. Clips up to 15 seconds look best; longer ones are sped up to fit.
        </p>
      </section>

      {errors.length > 0 && (
        <ul className="errors" role="alert">
          {errors.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {groupByCategory(library)
        .filter(group => group.loaders.length > 0 || group.category === 'user')
        .map(group => (
          <section key={group.category} className="category">
            <h2>{group.label}</h2>
            {group.loaders.length === 0 ? (
              <p className="hint">Videos you add appear here.</p>
            ) : (
              <ul className="grid">
                {group.loaders.map(loader => (
                  <LoaderCard
                    key={loader.id}
                    loader={loader}
                    inRandom={!settings.excludedFromRandom.includes(loader.id)}
                    onToggleRandom={include => toggleRandom(loader, include)}
                    onRename={name => rename(loader, name)}
                    onDelete={() => remove(loader)}
                  />
                ))}
              </ul>
            )}
          </section>
        ))}

      {storageUsed !== null && <p className="hint">Storage used by the extension: {formatSize(storageUsed)}</p>}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Options />
  </StrictMode>
);
