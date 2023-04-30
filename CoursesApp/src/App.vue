<script setup lang="ts">
import { nextTick, ref } from 'vue'
import Sigma from 'sigma'
import createGraph from "../creategraph";
import loadJSON from "./load_json";
import DeptDropdown from './components/DeptDropdown.vue'
import DivisionDropdown from './components/DivisionDropdown.vue';
import MajorDropdown from './components/MajorDropdown.vue';
import QuarterDropdown from './components/QuarterDropdown.vue';

const container = ref()
let sigma: Sigma

let dept = DeptDropdown.data().selected[0];
let division = DivisionDropdown.data().selected[0];
let major = MajorDropdown.data().selected[0];
let quarter = QuarterDropdown.data().selected[0];

let json = loadJSON(dept);
console.log(dept, division, major, quarter);
let graph = createGraph(json, major, division, true, quarter);

nextTick(() => {
  sigma = new Sigma(graph, container.value as HTMLElement)
})
</script>

<template>
  <h1>UCSB Course Prerequisite Graph</h1>
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
