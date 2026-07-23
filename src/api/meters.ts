import type { MeterResponse } from '../types/meter';

export async function getMeters(
  limit = 20,
  offset = 0
): Promise<MeterResponse> {
  const response = await fetch(
    `/api/c300/api/v4/test/meters/?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error('Не удалось загрузить счётчики');
  }

  return response.json();
}
export async function deleteMeter(meterId: string): Promise<void> {
  const response = await fetch(`/api/c300/api/v4/test/meters/${meterId}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить счётчик');
  }
}
