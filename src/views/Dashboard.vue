<script setup lang="ts">
import { CourseJSON, CourseGraph, CourseNode, courseNodeSize } from '../CourseGraph';
import * as d3 from 'd3';
import * as cola from 'webcola';
import { useRoute } from 'vue-router';


// webcola overwrites source and target during processing which confuses typescript
interface OverwrittenPrereqEdge {
    source: CourseNode,
    target: CourseNode,
    color: string
}

const route = useRoute();
let topic = route.params.searchItem;

let gray = '#b8b8b8';

d3.json(`../../data/website/${topic}.json`).then((f: CourseJSON) => {
    console.log(`Successfully loaded ${topic}`)

    let courseGraph = new CourseGraph(f);
    let graph = courseGraph.getGraphNumericId();

    const width = window.innerWidth;
    const height = window.innerHeight;

    let zoom = d3.zoom()
        .scaleExtent([0.2, 2])
        // .translateExtent([[0, 0], [width * 5, height * 5]])
        .on('zoom', e => {
            d3.selectAll('g')
                .attr('transform', e.transform);
        });

    const d3Cola = cola
        .d3adaptor(d3)
        .symmetricDiffLinkLengths(50)
        .avoidOverlaps(true)
        .size([width, height]);

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    let constraints = [];

    d3Cola
        .nodes(graph.nodes)
        .links(graph.edges)
        .flowLayout("y", 150)
        .constraints(constraints)
        .start(10, 20, 20);

    var link = svg
        .append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(graph.edges)
        .enter()
        .append("line")
        .attr('stroke', d => d.color);

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

    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("width", courseNodeSize[0])
        .attr("height", courseNodeSize[1])
        .attr('rx', '12')
        .attr('fill', d => d.color)
        .on("mouseenter", (_, hoveredNode: CourseNode) => {
            link.style('stroke-width', (edge: OverwrittenPrereqEdge) => {
                if   (hoveredNode === edge.source
                   || hoveredNode === edge.target) {
                    return 7;
                } else {
                    return 4;
                }
            });
            link.style('stroke', (edge: OverwrittenPrereqEdge) => {
                return edge.source === hoveredNode ||
                       edge.target === hoveredNode ? edge.color : gray;
            });

            node.style('fill', (otherNode: CourseNode) => {
                let sameNode = hoveredNode === otherNode;
                let adjacentNode = graph.nodes[hoveredNode.id].adjacent.includes(otherNode.id)

                if (!sameNode && !adjacentNode) {
                    return gray;
                }
            });
        })
        .on("mouseout", () => {
            link.style('stroke-width', 4);
            link.style('stroke', edge => {
                return edge.color;
            });
            node.style('fill', node => {
                return node.color;
            });
        });

    var label = svg
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(d => d.name)
        .attr("text-anchor", "middle")
        .attr("class", "label");

    d3Cola.on("tick", () => {
        link
            .attr("x1", (d: OverwrittenPrereqEdge) => {
                return d.source.x;
            })
            .attr("y1", (d: OverwrittenPrereqEdge) => {
                return d.source.y;
            })
            .attr("x2", (d: OverwrittenPrereqEdge) => {
                return d.target.x;
            })
            .attr("y2", (d: OverwrittenPrereqEdge) => {
                return d.target.y;
            });

        node
            .attr("x", (d: CourseNode) => {
                return d.x - courseNodeSize[0] / 2;
            })
            .attr("y", (d: CourseNode) => {
                return d.y - courseNodeSize[1] / 2;
            });

        label
            .attr("x", d => {
                return d.x;
            })
            .attr("y", d => {
                return d.y + 5;
            });
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
    stroke-width: 4;
    marker-end: url(#arrow);
}

.nodes rect {
    stroke: #000000;
    stroke-width: 3px;
}
</style>
