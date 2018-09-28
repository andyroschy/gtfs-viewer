<template>
  <aside class="layer-group">
    <ul >
      <li v-for="agency of agencies" :key="agency.id">
          {{agency.name}}
          <ul>
            <li  v-for="route of agency.routes" :key="route.id">
              {{route.name}}
              Stops:
              <ul>
                <li v-for="stop of route.stops" :key="stop.id">{{stop.name}}</li>
              </ul>
            </li>
          </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped>

  .layer-group {
    overflow: auto;
  }

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AgencyLayer from '@/types/agency-layer';

@Component
export default class LayerList extends Vue {
  @Prop()
  public agencies!: AgencyLayer[];
}

</script>
