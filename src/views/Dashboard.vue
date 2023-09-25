<script setup lang="ts">
import { CourseJSON, CourseGraph, CourseNode } from '../CourseGraph';
import createConstraints from '../Constraints';
import * as d3 from 'd3';
import * as cola from 'webcola';
import { useRoute } from 'vue-router';
import { colors } from '../style';


// webcola overwrites source and target during processing which confuses typescript
// this seems like a bad practice on the library's part
interface OverwrittenPrereqEdge {
    source: CourseNode,
    target: CourseNode,
    color: string
}

const route = useRoute();
let topic = route.params.searchItem;


d3.json(`./data/website/${topic}.json`).then(f => {
    console.log(`Successfully loaded ${topic}`)

    let courseGraph = new CourseGraph(f as CourseJSON);
    let graph = courseGraph.getGraphNumericId();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const zoom = d3.zoom()
        .scaleExtent([0.2, 2])
        // .translateExtent([[0, 0], [width * 5, height * 5]])
        .on('zoom', e => {
            d3.selectAll('g')
                .attr('transform', e.transform);
        });

    const d3Cola = cola
        .d3adaptor(d3)
        .linkDistance(300)
        .avoidOverlaps(true)
        .size([width, height]);

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    d3Cola
        .nodes(graph.nodes)
        .links(graph.edges)
        .constraints(createConstraints(graph))
        .start(10, 100, 200);

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
        .attr("refX", "-300")
        .append("path")
        .attr("d", "M 60 0 L 0 30 L 60 60 z")
        .attr("fill", colors.darkgray);

    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("width", CourseGraph.courseNodeSize[0])
        .attr("height", CourseGraph.courseNodeSize[1])
        .attr('rx', '12')
        .attr('fill', d => d.color)
        .on("mouseenter", (_, hoveredNode: CourseNode) => {
            // @ts-ignore
            link.style('stroke-width', (edge: OverwrittenPrereqEdge) => {
                if   (hoveredNode === edge.source
                   || hoveredNode === edge.target) {
                    return 7;
                } else {
                    return 4;
                }
            });

            // @ts-ignore
            link.style('stroke', (edge: OverwrittenPrereqEdge) => {
                return edge.source === hoveredNode ||
                       edge.target === hoveredNode ? edge.color : colors.gray;
            });

            // @ts-ignore
            node.style('fill', (otherNode: CourseNode) => {
                let sameNode = hoveredNode === otherNode;
                let adjacentNode = graph.nodes[hoveredNode.id].adjacent.includes(otherNode.id)

                if (!sameNode && !adjacentNode) {
                    return colors.gray;
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
            // @ts-ignore
            .attr("x1", (d: OverwrittenPrereqEdge) => {
                return d.source.x;
            })
            // @ts-ignore
            .attr("y1", (d: OverwrittenPrereqEdge) => {
                return d.source.y;
            })
            // @ts-ignore
            .attr("x2", (d: OverwrittenPrereqEdge) => {
                return d.target.x;
            })
            // @ts-ignore
            .attr("y2", (d: OverwrittenPrereqEdge) => {
                return d.target.y;
            });

        node
            .attr("x", (d: CourseNode) => {
                return d.x - CourseGraph.courseNodeSize[0] / 2;
            })
            .attr("y", (d: CourseNode) => {
                return d.y - CourseGraph.courseNodeSize[1] / 2;
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
    pointer-events: none;
}

.edges line {
    stroke-opacity: 0.7;
    stroke-width: 4;
    marker-start: url(#arrow);
}

.nodes rect {
    stroke: #000000;
    stroke-width: 3px;
}
</style>
