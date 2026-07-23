export interface Area {
  id: string;
  str_number_full: string;
  house: {
    address: string;
  };
}

export interface AreasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Area[];
}

export async function getAreas(areaIds: string[]): Promise<AreasResponse> {
  const params = new URLSearchParams();

  areaIds.forEach((id) => {
    params.append('id__in', id);
  });

  const response = await fetch(
    `/api/c300/api/v4/test/areas/?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Не удалось загрузить адреса');
  }

  return response.json();
}
