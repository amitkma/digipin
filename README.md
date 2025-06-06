[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release&style=flat-square)](https://github.com/semantic-release/semantic-release) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![lang: typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)](https://www.typescriptlang.org/) [![NPM Version](https://img.shields.io/npm/v/digitalpin?style=flat-square)](https://www.npmjs.com/package/digitalpin) [![NPM Downloads](https://img.shields.io/npm/dw/digitalpin?style=flat-square)](https://www.npmjs.com/package/digitalpin) [![CI](https://github.com/amitkma/digipin/actions/workflows/ci.yml/badge.svg)](https://github.com/amitkma/digipin/actions/workflows/ci.yml)

# DigiPin

A JavaScript/TypeScript library for India Post's Geospatial Addressing Solution. This library provides methods to encode and decode DigiPins - a 10-character alphanumeric code that represents a unique geographical location in India.

## Installation

```bash
npm install digitalpin
```

## Usage

### JavaScript

```javascript
const { getDigiPin, getLatLngFromDigiPin } = require('digitalpin');

// Convert latitude and longitude to DigiPin
const digiPin = getDigiPin(28.6139, 77.209); // Delhi coordinates
console.log(digiPin); // Returns formatted DigiPin like "ABC-DEF-GHIJ"

// Convert DigiPin back to coordinates
const coordinates = getLatLngFromDigiPin('ABC-DEF-GHIJ');
console.log(coordinates); // { latitude: "28.613900", longitude: "77.209000" }
```

### TypeScript

```typescript
import { getDigiPin, getLatLngFromDigiPin } from 'digitalpin';

// Convert latitude and longitude to DigiPin
const digiPin = getDigiPin(28.6139, 77.209); // Delhi coordinates
console.log(digiPin); // Returns formatted DigiPin like "39J-438-TJC7"

// Convert DigiPin back to coordinates
const coordinates = getLatLngFromDigiPin('39J-438-TJC7');
console.log(coordinates); // { latitude: "28.613900", longitude: "77.209000" }
```

## API Reference

### getDigiPin(lat: number, lon: number): string

Converts latitude and longitude coordinates to a DigiPin.

- **Parameters:**
  - `lat` (number): Latitude value between 2.5 and 38.5
  - `lon` (number): Longitude value between 63.5 and 99.5
- **Returns:** A formatted DigiPin string (e.g., "39J-438-TJC7")
- **Throws:** Error if latitude or longitude is out of range

### getLatLngFromDigiPin(digiPin: string): { latitude: string, longitude: string }

Converts a DigiPin back to its corresponding coordinates.

- **Parameters:**
  - `digiPin` (string): A 10-digit DigiPin string (with or without hyphens)
- **Returns:** Object containing the decoded latitude and longitude as strings
- **Throws:** Error if DigiPin format is invalid

## Geographic Coverage

This library works for coordinates within India's geographic bounds:

- Latitude: 2.5°N to 38.5°N
- Longitude: 63.5°E to 99.5°E

## License

```
   Copyright 2025 Amit Kumar

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

## Author

Amit Kumar
