<template>
  <div class="main">
    <layer-list :agencies="agencies" ></layer-list>
    <main-map :agencies="agencies"></main-map>
    <input type="file" @change="fileSelected" multiple/>
    <span>{{loadStatus}}</span>
    <br/>
    <span>Center:{{center}}</span>
    <span>Zoom{{zoom}}</span>
  </div>
</template>

<style scoped>

</style>


<script lang="ts">
import LayerList  from '@/views/components/LayerList.vue';
import MainMap  from '@/views/components/MainMap.vue';
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
     LayerList, MainMap
  },
})
export default class Home extends Vue {  
  public agencies: AgencyLayer[] = [];  
  public loadStatus: string = '';

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
