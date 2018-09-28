<template>
  <div class="main">
    <layer-list :agencies="agencies" ></layer-list>
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
                :icon="markerIcon"
                @click="alert(stop.name)" />
          </l-layer-group>
        </l-layer-group>
       
        <!-- <l-marker :lat-lng="marker" :icon="leafIcon"></l-marker>
        <l-marker v-for="stop in stops" :key="stop.id" :lat-lng="stop.coords" :icon="leafIcon"></l-marker> -->
    </l-map>
    <input type="file" @change="fileSelected" multiple/>
    <span>{{loadStatus}}</span>
    <br/>
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
import LayerList  from '@/views/components/LayerList.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LMarker, LTileLayer, LPolyline, LLayerGroup} from 'vue2-leaflet';
import L, { LatLng, imageOverlay } from 'leaflet';
import { marker } from '@/leflet-icons';
import { getTestFeed, parseFeed, getFeedFromFile } from '@/services/feed-service';
import { getAgencies } from '@/services/layer-service';
import { normalize } from 'path';
import AgencyLayer from '@/types/agency-layer';
import jszip from 'jszip'


@Component({
  components: {
    LMap, LMarker, LTileLayer, LPolyline, LLayerGroup, LayerList
  },
})
export default class Home extends Vue {
  public markerIcon = marker;
  public zoom: number = 10;
  public center: LatLng = L.latLng(36.70365959719456, -116.70364379882814);
  //public marker: LatLng =  L.latLng(47.413220, -1.219482);
  public baseLayer: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  public attribution: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  public agencies: AgencyLayer[] = [];
  public loadStatus: string = '';

  public alert(value: string) {
    alert(value);
  }

  public created() {
    const self = this;
    let rawFeed = getTestFeed();
    parseFeed(rawFeed).then( (feed) => {
      self.agencies = getAgencies(feed);
    });
  }

  public fileSelected(event: any) {
    const self = this;
    const files: File[] = event.target.files;
    // if only one file, assume it's a zip
    const filesToParse = files.length === 1 ? files[0] : files;
    this.loadStatus = 'Processing...';
    getFeedFromFile(filesToParse).then( (feed) => {
      self.loadStatus = 'Done!';
      const agencies = getAgencies(feed);
      this.agencies = [...this.agencies, ...agencies];
    }).catch( (e) => {
      console.error(e);
      this.loadStatus = 'Ooops! Something went wrong when processing the file';
    });
  }
}
</script>
