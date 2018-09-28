<template>
  <aside class="layer-group">
    <ul >
      <!-- list of agencies -->
      <li v-for="agency of agencies" :key="agency.id" >
          <input type="checkbox" v-model="agency.visible">
          <span @click="toggleLayer(agency)"  class="layer-name" >{{agency.name}} </span>     
          <!-- routes of the agency -->
          <ul class="inner" :class="{'open': agency.isOpen}" >            
            <li class="sub-menu-header">Routes:</li>
            <li   v-for="route of agency.routes" :key="route.id">
              <input type="checkbox" v-model="route.visible">
              <span @click="toggleLayer(route)" class="layer-name" >{{route.name}}</span>
              <!-- stops on the route -->
              <ul class="inner" :class="{'open': route.isOpen}"> 
                <li class="sub-menu-header">Stops:</li>
                <li v-for="stop of route.stops" :key="stop.id">{{stop.name}}</li>
              </ul>
            </li>
          </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped lang="scss">

  .layer-group {
    overflow: auto;
    text-align: left;
    line-height: 24px; 
    ul {
      padding-left: 15px;
      list-style: none;
      span.layer-name {
        cursor: pointer;
      }
      li.sub-menu-header {
        margin-left: -10px;
      }
      ul.inner {
        //transform: scaleY(0);
        max-height: 0px;
        overflow: hidden;
        transition: max-height 0.4s ease;
        &.open {
          max-height: 3000px;
          //transform: scale(1);
        }
      }
      
    }
    
  }

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AgencyLayer from '@/types/agency-layer';
import GtfsLayer from '@/types/gtfs-layer';
import { debug } from 'util';

@Component
export default class LayerList extends Vue {
  @Prop()
  public agencies!: AgencyLayer[];

  public toggleLayer(layer: GtfsLayer){
    layer.isOpen = !layer.isOpen;
  }
}

</script>
