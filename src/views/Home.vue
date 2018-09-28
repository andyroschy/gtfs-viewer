<template>
  <div class="main">
    <layer-list class="menu" :agencies="agencies" ></layer-list>
    <main-map class="map" :agencies="agencies"></main-map>
    <footer>
      <label class="choose-file-button" for="file-input">
          Upload Feed
      </label>
      <input id="file-input"  type="file" @change="fileSelected" multiple/>
      <span>{{loadStatus}}</span>
      <br/>
    </footer>
  </div>
</template>

<style scoped lang="scss">
 
  .main {
    display: grid;
    grid-template: 
                  "nav  main" 1fr 
                  "nav  foot " 120px 
                 / 330px 1fr;
    grid-gap: 0px;
    padding: 0px;
    height: 100%;
  }

  #file-input{
    display: none;
  }
  .choose-file-button {
    float: left;
    border: none;
    background: #66ccff; 
    text-shadow: 1px 1px rgba(0,0,0, 0.4); 
    color: #EEEEEE;
    border-radius: 100px;
    word-wrap: initial;
    white-space: nowrap;
    line-height: 90px;
    margin-left: 10px;
    height: 95px; 
    width: 95px;
    cursor: pointer;    
    box-shadow: 
      0 5px 10px -2px rgba(0,0,0,.2), 
      0 5px 10px 0 rgba(0,0,0,.14), 
      0 5px 10px 0 rgba(0,0,0,.12);
    &:hover{
      background: #55bbee; 
    }
    &:active{
      background: #50b0e0; 
    }
    
    
  }

  .map {
    grid-area: main;    
  }

  footer {
    grid-area: foot;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .menu {
    grid-area: nav;
  }

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
