import L from 'leaflet';

export const marker = L.icon({
    iconUrl: require('@/assets/marker-icon.png'),
    shadowUrl: require('@/assets/marker-shadow.png'),
  iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41],
  });
