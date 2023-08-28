<script setup lang="ts">
/*
Ideas: size of node corresponds to average number of students
*/
import createGraph from '../creategraph';
import * as d3 from 'd3';
import { useRoute } from 'vue-router';

const route = useRoute();
let topic = route.params.searchItem;

d3.json(`../../data/website/${topic}.json`).then(f => {
    console.log(`Successfully loaded ${topic}`)

    const width = window.innerWidth;
    const height = window.innerHeight;

    const nodeWidth = 100;
    const nodeHeight = 50;

    let zoom = d3.zoom()
        .scaleExtent([0.2, 2])
        // .translateExtent([[0, 0], [width * 5, height * 5]])
        .on('zoom', e => {
            d3.selectAll('g')
                .attr('transform', e.transform);
        });

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var graph = createGraph(f).export();

    var simulation = d3.forceSimulation(graph.nodes)
        .force(
            "link",
            d3.forceLink()
            .id(function(d) {
                return d.key;
            })
            .links(graph.edges)
        )
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide(nodeWidth))
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
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr('stroke', 'black')
        .attr('rx', '12')
        .attr("fill", "#69a3b2")

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
                return d.source.x + nodeWidth / 2;
            })
            .attr("y1", function(d) {
                return d.source.y + nodeHeight / 2;
            })
            .attr("x2", function(d) {
                return d.target.x + nodeWidth / 2;
            })
            .attr("y2", function(d) {
                return d.target.y + nodeHeight / 2;
            });

        node
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            });

        label
            .attr("x", function(d) { return d.x + nodeWidth / 2 - 35; })
            .attr("y", function(d) { return d.y + nodeHeight / 2 + 6; });
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
    /* width: 50vw;
    height: 100vh; */
    padding-left: 20px;
    background: #ddd;
}

.label {
    font-size: 13px;
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
