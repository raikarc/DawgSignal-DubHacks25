import Resolver from '@forge/resolver';

const resolver = new Resolver();

// Hardcoded person location
const userLocation = { lat: 47.6553, lng: -122.3035 }; // example: UW Seattle

// Hardcoded bus stop locations
const busStops = [
  { name: 'Stop A', lat: 47.6570, lng: -122.3050 },
  { name: 'Stop B', lat: 47.6535, lng: -122.3010 },
  { name: 'Stop C', lat: 47.6548, lng: -122.3075 },
];

// Helper to calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

resolver.define('findClosestBusStop', async () => {
  let closest = null;
  let minDistance = Infinity;

  for (const stop of busStops) {
    const dist = getDistance(userLocation.lat, userLocation.lng, stop.lat, stop.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = stop;
    }
  }

  return {
    stop: closest.name,
    distance: minDistance.toFixed(2),
  };
});

export const handler = resolver.getDefinitions();
