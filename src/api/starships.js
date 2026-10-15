const API_URL = 'https://swapi.py4e.com/api';

export async function getAllRecords(resource) {
  const records = [];
  let nextPage = `${API_URL}/${resource}/?format=json`;

  while (nextPage) {
    const response = await fetch(nextPage);
    if (!response.ok) throw new Error('No se pudieron cargar los datos de la galaxia.');
    const data = await response.json();
    records.push(...(data.results || []));
    nextPage = data.next;
  }

  return records;
}

export function getAllStarships() {
  return getAllRecords('starships');
}

export function getRecordId(record) {
  return record.url.split('/').filter(Boolean).at(-1);
}

export const getStarshipId = getRecordId;
