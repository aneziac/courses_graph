<script setup lang="ts">
import { CourseJSON, CourseGraph } from '../CourseGraph';
import * as d3 from 'd3';
import * as cola from 'webcola';
import { useRoute } from 'vue-router';


const route = useRoute();
let topic = route.params.searchItem;

// TODO: find better way to do this
const themeColor = color => {
    const colors = {
        "red7": "#7A282C",
        "red5": "#CA444B",
        "pink": "#CE649B",
        "orange": "#EF9D55",
        "yellow": "#F6C344",
        "blue": "#5289F5",
        "teal": "#60C69B",
        "green": "#5F9D79",
        "purple": "#8669C7",
        "black": "#000000"
    }

    return colors[color];
}

d3.json(`../../data/website/${topic}.json`).then((f: CourseJSON) => {
    console.log(`Successfully loaded ${topic}`)

    let courseGraph = new CourseGraph(f);
    let graph = courseGraph.getGraphNumericId();

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

    const d3Cola = cola
        .d3adaptor(d3)
        .avoidOverlaps(true)
        .size([width, height]);

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

    d3Cola
        .nodes(graph.nodes)
        .links(graph.edges)
        .flowLayout("y", 150)
        .linkDistance(50)
        .symmetricDiffLinkLengths(40)
        .avoidOverlaps(true)
        .start();

    var link = svg
        .append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(graph.edges)
        .enter()
        .append("line")
        .attr('stroke', d => themeColor(d.color))

    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr('rx', '12')
        .attr('fill', d => themeColor(d.color))

    var label = svg
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(function(d) { return d.name; })
        .attr("class", "label");

    d3Cola.on("tick", () => {
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
    });
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
    stroke-opacity: 0.7;
    stroke-width: 3;
    marker-end: url(#arrow);
}

.nodes rect {
    stroke: #000000;
    stroke-width: 3px;
}
</style>
