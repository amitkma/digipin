import { expect } from 'chai';
import { getDigiPin, getLatLngFromDigiPin } from '../src/index';

describe('DigiPin', () => {
  describe('getDigiPin', () => {
    it('should generate correct DigiPin for valid coordinates', () => {
      // Test case for New Delhi coordinates
      const digiPin = getDigiPin(28.6139, 77.209);
      expect(digiPin).to.be.a('string');
      expect(digiPin).to.have.lengthOf(12); // Including two hyphens
      expect(digiPin).to.match(
        /^[FC9832J4567KLMPT]{3}-[FC9832J4567KLMPT]{3}-[FC9832J4567KLMPT]{4}$/
      );
    });

    it('should throw error for latitude out of range', () => {
      expect(() => getDigiPin(1.5, 77.209)).to.throw('Latitude out of range');
      expect(() => getDigiPin(39.5, 77.209)).to.throw('Latitude out of range');
    });

    it('should throw error for longitude out of range', () => {
      expect(() => getDigiPin(28.6139, 62.5)).to.throw('Longitude out of range');
      expect(() => getDigiPin(28.6139, 100.5)).to.throw('Longitude out of range');
    });

    it('should generate consistent DigiPins for same coordinates', () => {
      const digiPin1 = getDigiPin(28.6139, 77.209);
      const digiPin2 = getDigiPin(28.6139, 77.209);
      expect(digiPin1).to.equal(digiPin2);
    });
  });

  describe('getLatLngFromDigiPin', () => {
    it('should decode DigiPin to approximate original coordinates', () => {
      const originalLat = 28.6139;
      const originalLon = 77.209;
      const digiPin = getDigiPin(originalLat, originalLon);
      const result = getLatLngFromDigiPin(digiPin);

      // Convert string coordinates to numbers for comparison
      const decodedLat = parseFloat(result.latitude);
      const decodedLon = parseFloat(result.longitude);

      // Check if decoded coordinates are within 0.01 degrees of original
      expect(decodedLat).to.be.closeTo(originalLat, 0.01);
      expect(decodedLon).to.be.closeTo(originalLon, 0.01);
    });

    it('should handle DigiPins with and without hyphens', () => {
      const digiPin = getDigiPin(28.6139, 77.209);
      const withHyphens = getLatLngFromDigiPin(digiPin);
      const withoutHyphens = getLatLngFromDigiPin(digiPin.replace(/-/g, ''));

      expect(withHyphens).to.deep.equal(withoutHyphens);
    });

    it('should throw error for invalid DigiPin length', () => {
      expect(() => getLatLngFromDigiPin('ABCDEFGHIJKL')).to.throw('Invalid DIGIPIN');
    });

    it('should throw error for invalid characters in DigiPin', () => {
      expect(() => getLatLngFromDigiPin('ABC-EFG-HIJK')).to.throw('Invalid DIGIPIN');
    });

    it('should not throw error for valid characters in DigiPin', () => {
      expect(() => getLatLngFromDigiPin('39J-245-C98L')).not.to.throw('Invalid DIGIPIN');
    });

    it('should not throw error for lowercase characters in DigiPin', () => {
      expect(() => getLatLngFromDigiPin('39j-245-C98l')).not.to.throw('Invalid DIGIPIN');
    });

    it('should throw error for empty DigiPin', () => {
      expect(() => getLatLngFromDigiPin('')).to.throw('Invalid DIGIPIN');
    });
  });

  it('should encode latlon to correct DigiPin', () => {
    const originalLat = 28.6139;
    const originalLon = 77.209;
    const digiPin = getDigiPin(originalLat, originalLon);
    // Check if decoded coordinates are within 0.01 degrees of original
    expect(digiPin).to.equal('39J-438-TJC7');
  });

  it('should decode Digipin to correct latlon', () => {
    const originalLat = 28.6139;
    const originalLon = 77.209;
    const originalDigiPin = getDigiPin(originalLat, originalLon);
    const latlong = getLatLngFromDigiPin(originalDigiPin);
    // Check if decoded coordinates are within 0.01 degrees of original
    expect(parseFloat(latlong.latitude)).to.be.closeTo(originalLat, 0.01);
    expect(parseFloat(latlong.longitude)).to.be.closeTo(originalLon, 0.01);
  });

  it('should decode partial Digipin to approximate latlon', () => {
    const originalLat = 28.6139;
    const originalLon = 77.209;
    const originalDigiPin = getDigiPin(originalLat, originalLon);
    const latlong = getLatLngFromDigiPin(originalDigiPin.slice(0, 5));
    // Check if decoded coordinates are within 0.1 degrees of original
    expect(parseFloat(latlong.latitude)).to.be.closeTo(originalLat, 0.1);
    expect(parseFloat(latlong.longitude)).to.be.closeTo(originalLon, 0.1);
  });

  describe('Round Trip', () => {
    it('should maintain location accuracy within acceptable range', () => {
      const testCoordinates = [
        { lat: 28.6139, lon: 77.209 }, // New Delhi
        { lat: 19.076, lon: 72.8777 }, // Mumbai
        { lat: 13.0827, lon: 80.2707 }, // Chennai
        { lat: 22.5726, lon: 88.3639 }, // Kolkata
      ];

      testCoordinates.forEach(({ lat, lon }) => {
        const digiPin = getDigiPin(lat, lon);
        const result = getLatLngFromDigiPin(digiPin);
        const decodedLat = parseFloat(result.latitude);
        const decodedLon = parseFloat(result.longitude);

        expect(decodedLat).to.be.closeTo(lat, 0.01);
        expect(decodedLon).to.be.closeTo(lon, 0.01);
      });
    });
  });
});
