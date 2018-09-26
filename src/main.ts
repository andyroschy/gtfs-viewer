import Vue from 'vue';
import App from './App.vue';
import router from './router';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

Vue.config.productionTip = false;

// // BUG https://github.com/Leaflet/Leaflet/issues/4968
// import iconRetinaUrl from '@/assets/marker-icon.png'
// import iconUrl from '@/assets/marker-icon.png'
// import shadowUrl from '@/assets/marker-shadow.png'

// L.Marker.prototype.options.icon = L.icon({
//   iconRetinaUrl: '/assets/marker-icon.png',
//   iconUrl: '/assets/marker-icon.png',
//   shadowUrl: '/assets/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41]
// })

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
