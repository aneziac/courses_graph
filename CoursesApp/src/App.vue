<script setup lang="ts">
import { nextTick, ref } from 'vue'
import Sigma from 'sigma'
import createGraph from "../creategraph";
import local_json from "../data/math.json";
import DeptDropdown from './components/DeptDropdown.vue'
import DivisionDropdown from './components/DivisionDropdown.vue';
import MajorDropdown from './components/MajorDropdown.vue';
import QuarterDropdown from './components/QuarterDropdown.vue';

const container = ref()
const graph = createGraph(local_json)
let sigma: Sigma
nextTick(() => {
  sigma = new Sigma(graph, container.value as HTMLElement)
})

</script>

<template>
  <h1>UCSB Course Graph</h1>
  <div ref="container" class="container" ></div>
  <div class="ui-bar">
    <DeptDropdown />
    <QuarterDropdown />
    <MajorDropdown />
    <DivisionDropdown />
  </div>
</template>

<style>
.container {
  position: fixed;
  width: 100vw;
  height: 80vh;
  overflow: hidden;
  /* background-color: seashell; */
}
.ui-bar {
    position: absolute;
    margin: auto;
    top: 80vh;
    width: 95vw;
    height: 20vh;
}
h1 {
    color:brown;
    font-family: Courier New;
    padding-left:20px;
}
</style>
