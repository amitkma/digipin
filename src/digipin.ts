/**
 * Taken from https://github.com/CEPT-VZG/digipin
 */

type LatLngResult = {
  latitude: string;
  longitude: string;
};

const DIGIPIN_GRID: string[][] = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T'],
];

const GRID_SIZE = 4;
const REVERSED_ROW_INDEX = GRID_SIZE - 1;

// Flatten the grid into a Set for fast lookup
const VALID_DIGIPIN_CHARS = new Set(DIGIPIN_GRID.flat());

function isValidDigiPinString(input: string): boolean {
  return [...input].every(char => VALID_DIGIPIN_CHARS.has(char));
}

const BOUNDS = {
  maxLat: 38.5,
  maxLon: 99.5,
  minLat: 2.5,
  minLon: 63.5,
};

/**
 * Encodes latitude & longitude into a 10-digit alphanumeric DIGIPIN
 * @param lat - Latitude value between 2.5 and 38.5
 * @param lon - Longitude value between 63.5 and 99.5
 * @returns A formatted DIGIPIN string (e.g., "ABC-DEF-GHIJ")
 * @throws {Error} If latitude or longitude is out of range
 */
export function getDigiPin(lat: number, lon: number): string {
  if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) throw new Error('Latitude out of range');
  if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) throw new Error('Longitude out of range');

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  let digiPin = '';

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / GRID_SIZE;
    const lonDiv = (maxLon - minLon) / GRID_SIZE;

    let row = REVERSED_ROW_INDEX - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    row = Math.max(0, Math.min(row, GRID_SIZE - 1));
    col = Math.max(0, Math.min(col, GRID_SIZE - 1));

    digiPin += DIGIPIN_GRID[row][col];

    if (level === 3 || level === 6) digiPin += '-';

    maxLat = minLat + latDiv * (REVERSED_ROW_INDEX - row + 1);
    minLat = minLat + latDiv * (REVERSED_ROW_INDEX - row);

    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  return digiPin;
}

/**
 * Decodes a DIGIPIN back into its central latitude & longitude
 * @param digiPin - A 10-digit DIGIPIN string (with or without hyphens)
 * @returns Object containing the decoded latitude and longitude
 * @throws {Error} If DIGIPIN format is invalid
 */
export function getLatLngFromDigiPin(digiPin: string): LatLngResult {
  const pin = digiPin.toUpperCase().replace(/-/g, '');
  if (pin.length > 10 || pin.length < 1) throw new Error('Invalid DIGIPIN');

  if (!isValidDigiPinString(pin)) throw new Error('Invalid DIGIPIN');

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  for (let i = 0; i < pin.length; i++) {
    const char = pin[i];
    let found = false;
    let ri = -1,
      ci = -1;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (DIGIPIN_GRID[r][c] === char) {
          ri = r;
          ci = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) throw new Error('Invalid character in DIGIPIN');

    const latDiv = (maxLat - minLat) / GRID_SIZE;
    const lonDiv = (maxLon - minLon) / GRID_SIZE;

    const lat1 = maxLat - latDiv * (ri + 1);
    const lat2 = maxLat - latDiv * ri;
    const lon1 = minLon + lonDiv * ci;
    const lon2 = minLon + lonDiv * (ci + 1);

    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  return {
    latitude: centerLat.toFixed(6),
    longitude: centerLon.toFixed(6),
  };
}
