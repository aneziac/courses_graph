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

let json = loadJSON();
let graph = createGraph(json);
let sigma: Sigma;

let dept: string;
let division: string;
let major: string;
let quarter: Array<string>;

nextTick(() => {
    sigma = new Sigma(graph, container.value as HTMLElement);
})

function update() {
    json = loadJSON(dept);
    graph = createGraph(json, major, division, true, quarter);
    sigma.setGraph(graph);
}

function setDept(value) {
    dept = value;
    update();
}

function setDivision(value) {
    division = value;
    update();
}

function setMajor(value) {
    major = value;
    update();
}

function setQuarter(value) {
    quarter = value;
    update();
}
</script>

<template>
  <h1>UCSB Course Prerequisite Graph</h1>
  <div ref="container" class="container" ></div>
  <div class="ui-bar">
    <DeptDropdown @update="setDept" />
    <QuarterDropdown @update="setQuarter" />
    <MajorDropdown @update="setMajor" />
    <DivisionDropdown @update="setDivision" />
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
