<script setup lang="ts">
import { ref } from 'vue';
import createGraph from '../creategraph';
import { create } from 'domain';

let jsonFile = ref(null);

function generateGraph(searchItem: string) {
    import(`../../data/website/${searchItem}.json`).then((module) => {
        jsonFile.value = module.default // modify var1 by assigning to var1.value
    });

    let graph = createGraph(jsonFile.value);
    console.log(graph);
    return graph;
}

</script>

<template>
    <p> Test: {{ generateGraph($route.params.searchItem).export() }}</p>
</template>
