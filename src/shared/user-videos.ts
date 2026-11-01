const DB_NAME = 'loading-screenz';
const DB_VERSION = 1;
const STORE = 'videos';

export interface UserVideo {
  id: string;
  name: string;
  blob: Blob;
  /** Seconds, or null when the file doesn't report a finite duration. */
  duration: number | null;
  addedAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = run(transaction.objectStore(STORE));
    transaction.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function listUserVideos(): Promise<UserVideo[]> {
  const videos = await withStore<UserVideo[]>('readonly', store => store.getAll());
  return videos.sort((a, b) => a.addedAt - b.addedAt);
}

export function getUserVideo(id: string): Promise<UserVideo | undefined> {
  return withStore<UserVideo | undefined>('readonly', store => store.get(id));
}

export async function addUserVideo(file: File, duration: number | null): Promise<UserVideo> {
  const video: UserVideo = {
    id: `user-${crypto.randomUUID()}`,
    name: file.name.replace(/\.[^.]+$/, ''),
    blob: file,
    duration,
    addedAt: Date.now(),
  };
  await withStore('readwrite', store => store.add(video));
  return video;
}

export async function renameUserVideo(id: string, name: string): Promise<void> {
  const video = await getUserVideo(id);
  if (!video) return;
  await withStore('readwrite', store => store.put({ ...video, name }));
}

export async function deleteUserVideo(id: string): Promise<void> {
  await withStore('readwrite', store => store.delete(id));
}
