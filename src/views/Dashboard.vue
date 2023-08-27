<script setup lang="ts">
import createGraph from '../creategraph';
import * as d3 from 'd3';
import { useRoute } from 'vue-router';

const route = useRoute();
let topic = route.params.searchItem;

d3.json(`../../data/website/${topic}.json`).then(f => {
    console.log(`Successfully loaded ${topic}`)

    const width = 1000;
    const height = 500;

    const svg = d3.select("#graph").append("svg")
        .attr("width", "100vw")
        .attr("height", "100vh");

    var graph = createGraph(f).export();

    d3.forceSimulation(graph.nodes)
        .force(
            "link",
            d3.forceLink()
            .id(function(d) {
                return d.key;
            })
            .links(graph.edges)
        )
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    var link = svg.append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(graph.edges)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
            return 3;
        });

    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "blue");

    var label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(function(d) { return d.key; })
        .attr("class", "label");

    function ticked() {
        link
            .attr("x1", function(d) {
            return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });

        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }

}).catch(() => {
    console.error(`Could not load ${topic} json`);
})
</script>

<template>
    <div id="graph">
    </div>
</template>

<style>
graph {
    width: 50vw;
    height: 100vh;
    padding-left: 20px;
}

.label {
    font-size: 10px;
}

.edges line {
    stroke: #999;
    stroke-opacity: 0.6;
}

.nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
}
</style>
