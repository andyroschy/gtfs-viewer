<template>
  <div class="main">
    <l-map :zoom="zoom" :center="center" class="main-map">
        <l-tile-layer :url="baseLayer" :attribution="attribution"></l-tile-layer>
        <!-- Agency layers -->
        <l-layer-group
            v-for="agency in agencies"
            :key="agency.id"
            :visible="agency.visible"
            layerType="overlay"
            :name="agency.name">
            <!-- Route layers -->
          <l-layer-group 
              v-for="route in agency.routes"
              :key="route.id"
              :visible="route.visible"
              layerType="overlay"
              :name="route.name" >
              <!-- route line -->
              <l-polyline
                :key="route.id"
                :lat-lngs="route.geometry"
                :visible="route.visible"/>
                <!-- route stops -->
              <l-marker
                v-for="stop in route.stops"
                :key="stop.id"
                :visible="stop.visible"
                :lat-lng="stop.latlng"
                @click="alert(stop.name)" />
          </l-layer-group>
        </l-layer-group>
       
        <!-- <l-marker :lat-lng="marker" :icon="leafIcon"></l-marker>
        <l-marker v-for="stop in stops" :key="stop.id" :lat-lng="stop.coords" :icon="leafIcon"></l-marker> -->
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
import {LMap, LMarker, LTileLayer, LPolyline, LLayerGroup} from 'vue2-leaflet';
import L, { LatLng } from 'leaflet';
import { leaf } from '@/leflet-icons';
import { getTestFeed, parseFeed } from '@/services/feed-service';
import { getAgencies } from '@/services/layer-service';
import { normalize } from 'path';
import AgencyLayer from '@/types/agency-layer';

@Component({
  components: {
    LMap, LMarker, LTileLayer, LPolyline, LLayerGroup
  },
})
export default class Home extends Vue {
  public leafIcon = leaf;
  public zoom: number = 10;
  public center: LatLng = L.latLng(36.70365959719456, -116.70364379882814);
  //public marker: LatLng =  L.latLng(47.413220, -1.219482);
  public baseLayer: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  public attribution: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  public agencies: AgencyLayer[] = [];

  public created() {
    let rawFeed = getTestFeed();
    let feed = parseFeed(rawFeed);
    this.agencies = getAgencies(feed);
  }
}
</script>
