<script setup lang="ts">
import { nextTick, ref } from 'vue';
import Sigma from 'sigma';
import createGraph from "./creategraph";
import loadJSON from "./load_json";
import DeptDropdown from './components/DeptDropdown.vue'
import DivisionDropdown from './components/DivisionDropdown.vue';
import MajorDropdown from './components/MajorDropdown.vue';
import QuarterDropdown from './components/QuarterDropdown.vue';
import DeptToggle from './components/DeptToggle.vue';
import RequiredToggle from './components/RequiredToggle.vue';
import { forceSimulation } from 'd3-force';

function changeSerialization(graphologyGraph) {
  const graph = graphologyGraph.export()
  return {
    nodes: graph.nodes.map(n => ({id: n.key, ...n}) ),
    links: graph.edges
  }
}

const container = ref()

let json = loadJSON();
let graph = changeSerialization(createGraph(json));
// let sigma: Sigma;

let dept: string;
let division: string;
let major: string;
let quarter: Array<string>;
let showAll: boolean = true;
let showRequired: boolean = false;

nextTick(() => {
    let simulation = new forceSimulation(graph, container.value as HTMLElement);
})

function update() {
    json = loadJSON(dept);
    graph = changeSerialization(createGraph(json, major, division, showAll, showRequired, quarter));
    // sigma.setGraph(changeSerialization(graph));
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

function setShowAll() {
    showAll = !showAll;
    update();
}
function setShowRequired() {
    showRequired = !showRequired;
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
    <DeptToggle @update="setShowAll"/>
    <RequiredToggle @update="setShowRequired"/>
  </div>
</template>

<style>
.container {
  position: fixed;
  left: 3vw;
  width: 100vw;
  height: 100vh;
  /* background-color: seashell; */
}
.ui-bar {
    position: absolute;
    margin: auto;
    top: 10vh;
    width: 20vw;
    height: 25vh;
    text-align: center;
    display: block;
}
h1 {
    color:brown;
    font-family: Courier New;
    padding-left:20px;
}
</style>
