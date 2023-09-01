<script setup lang="ts">
import CourseGraph from '../CourseGraph';
import * as d3 from 'd3';
import { useRoute } from 'vue-router';

const route = useRoute();
let topic = route.params.searchItem;

// TODO: find way to access level 4 colors
const bootstrapColor = color => {
    const colors = {
        "red": "#D3656D",
        "blue": "#5289F5",
        "green": "#5F9D79",
        "purple": "#8669C7"
    }

    return colors[color];
}

d3.json(`../../data/website/${topic}.json`).then(f => {
    console.log(`Successfully loaded ${topic}`)

    let courseGraph = new CourseGraph(f);
    let graphData = courseGraph.graph.export();

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

    svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("markerWidth", "5")
        .attr("orient", "auto")
        .attr("viewBox", "0 0 60 60")
        .attr("markerUnits", "strokeWidth")
        .attr("refY", "30")
        .attr("refX", "50%")
        .append("path")
        .attr("d", "M 60 0 L 0 30 L 60 60 z")
        .attr("fill", "#343a40");

    d3.forceSimulation(graphData.nodes)
        .force(
            "link",
            d3.forceLink()
            .id(function(d) {
                return d.key;
            })
            .links(graphData.edges)
        )
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide(nodeWidth))
        .on("tick", ticked);

    var link = svg
        .append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(graphData.edges)
        .enter()
        .append("line")

    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(graphData.nodes)
        .enter()
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr('rx', '12')
        .attr('fill', d => bootstrapColor(d.attributes.color))

    var label = svg
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graphData.nodes)
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
})
</script>

<template>
    <div id="graph">
    </div>
</template>

<style>
graph {
    /* padding-left: 20px; */
    background: #ddd;
}

.label {
    font-size: 13px;
    font-weight: bold;
}

.edges line {
    stroke: #999;
    stroke-opacity: 0.6;
    stroke-width: 3;
    marker-end: url(#arrow);
}

.nodes rect {
    stroke: #000000;
    stroke-width: 3px;
    /* fill: #69a3b2; */
}
</style>
