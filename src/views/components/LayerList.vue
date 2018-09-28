<template>
  <aside class="layer-group">
    <h4>
      Agency Routes
    </h4>
    <ul >
      <!-- list of agencies -->
      <li v-for="agency of agencies" :key="agency.id" >
          <input type="checkbox" v-model="agency.visible">
          <span @click="toggleLayer(agency)"  class="layer-name" >{{agency.name}} </span>     
          <!-- routes of the agency -->
          <ul class="inner" :class="{'open': agency.isOpen}" >            
            <li class="sub-menu-header">Routes:</li>            
            <li   v-for="route of agency.routes" :key="route.id">
              <input type="checkbox" v-model="route.visible" :disabled="!agency.visible" >              
              <span @click="toggleLayer(route)" class="layer-name" >{{route.name}}</span>
              <!-- stops on the route -->
              <ul class="inner" :class="{'open': route.isOpen}"> 
                <li class="sub-menu-header"> <input type="checkbox" :disabled="!route.visible" v-model="route.stopsVisible" > <span class="layer-name" @click="toggleLayer(route)"> Stops:</span></li>
                <li v-for="stop of route.stops" :key="stop.id">{{stop.name}}</li>
              </ul>
            </li>
          </ul>
      </li>
    </ul>
    
  </aside>
</template>

<style scoped lang="scss">

 

  
  h4 {
    padding-top: 20px;
    padding-bottom: 20px;
    color: #EEEEEE;
    text-shadow: 1px 1px rgba(0,0,0, 0.4);
    vertical-align: middle;
    background: #66ccff;    
    width: 100%;    
    margin: 0px;
    text-align: center;
    box-shadow: 
      0 3px 3px -2px rgba(0,0,0,.2), 
      0 2px 2px 0 rgba(0,0,0,.14), 
      0 1px 2px 0 rgba(0,0,0,.12);
  }

  .layer-list {
 
  }

  .layer-group {

    
    
    text-align: left;
    line-height: 24px;
    z-index: 999;
    box-shadow: 
      0 3px 20px -2px rgba(0,0,0,.2), 
      0 2px 20px 0 rgba(0,0,0,.14), 
      0 1px 20px 0 rgba(0,0,0,.12);

    ul {
      margin: 0px;
      height: 100%;
      overflow: auto;
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
        transition: max-height 0.3s ease;
        &.open {
          max-height: 3000px;
          transition: max-height 0.3s ease-out;
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
