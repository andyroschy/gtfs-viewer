<template>
  <div class="main">
    <l-map :zoom="zoom" :center="center" class="main-map">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="marker" :icon="leafIcon"></l-marker>
    </l-map>
    <span>{{center}}</span>
  </div>
</template>

<style scoped>

  .main-map {
    height: 500px;
    width: 500px;
  }

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LMarker, LTileLayer} from 'vue2-leaflet';
import L, { LatLng } from 'leaflet';
import { leaf } from '@/leflet-icons';


@Component({
  components: {
    LMap, LMarker, LTileLayer,
  },
})
export default class Home extends Vue {
  public leafIcon = leaf;
  public zoom: number = 13;
  public center: LatLng = L.latLng(47.413220, -1.219482);
  public marker: LatLng =  L.latLng(47.413220, -1.219482);
  public url: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  public attribution: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'; 

}
</script>
