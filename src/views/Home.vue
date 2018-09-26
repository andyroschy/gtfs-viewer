<template>
  <div class="main">
    <l-map :zoom="zoom" :center="center" class="main-map">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="marker" :icon="leafIcon"></l-marker>
        <l-marker v-for="stop in stops" :key="stop.id" :lat-lng="stop.coords" :icon="leafIcon"></l-marker>
    </l-map>
    <span>Center:{{center}}</span>
    <span>Zoom{{zoom}}</span>
  </div>
</template>

<style scoped>

  .main-map {
    height: 500px;
    width: 100%;
  }

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LMarker, LTileLayer} from 'vue2-leaflet';
import L, { LatLng } from 'leaflet';
import { leaf } from '@/leflet-icons';
import { getStops } from '@/services/feedService';
import { normalize } from 'path';

@Component({
  components: {
    LMap, LMarker, LTileLayer,
  },
})
export default class Home extends Vue {
  public leafIcon = leaf;
  public zoom: number = 10;
  public center: LatLng = L.latLng(36.70365959719456, -116.70364379882814);
  public marker: LatLng =  L.latLng(47.413220, -1.219482);
  public url: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  public attribution: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'; 
  public stops: any = [];

  mounted() {
    this.stops = getStops().map( (s) => { return { coords: L.latLng(s.stopLat!,s.stopLon!), id: s.stopId}});
  }
}
</script>
