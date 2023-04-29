<script setup lang="ts">
import { nextTick, ref } from 'vue'
import Graph from 'graphology'
import Sigma from 'sigma'
import createGraph from "../creategraph";
import local_json from "../data/math.json";

const container = ref()
const graph = createGraph(local_json)
let sigma: Sigma
nextTick(() => {
  sigma = new Sigma(graph, container.value as HTMLElement)
})

</script>

<template>
  <div ref="container" class="container" />
</template>

<style>
.container {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
