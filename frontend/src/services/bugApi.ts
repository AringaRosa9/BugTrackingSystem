import { Bug } from '../types/bug';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchBugs() {
  const result = await readJson<{ data: Bug[] }>(await fetch(buildUrl('/api/bugs')));
  return result.data;
}

export async function patchBug(bugId: string, patch: Partial<Bug>) {
  const result = await readJson<{ data: Bug }>(
    await fetch(buildUrl(`/api/bugs/${bugId}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch),
    }),
  );

  return result.data;
}
