<script setup lang="ts">
import { ref, onMounted } from 'vue';
import createGraph from '../creategraph';
import * as d3 from 'd3';

let jsonFile = ref(null);

function generateGraph(searchItem: string) {
    import(`../../data/website/${searchItem}.json`).then((module) => {
        jsonFile.value = module.default;
    });

    return createGraph(jsonFile.value);
}

onMounted(() => {
    const svg = d3.select("svg");
    const width = 500;
    const height = 300;

    // intialize data
    var graph = {
        nodes: [
            { name: "Alice" },
            { name: "Bob" },
            { name: "Chen" },
            { name: "Dawg" },
            { name: "Ethan" },
            { name: "George" },
            { name: "Frank" },
            { name: "Hanes" }
        ],
        links: [
            { source: "Alice", target: "Bob" },
            { source: "Chen", target: "Bob" },
            { source: "Dawg", target: "Chen" },
            { source: "Hanes", target: "Frank" },
            { source: "Hanes", target: "George" },
            { source: "Dawg", target: "Ethan" }
        ]
    };


    d3.forceSimulation(graph.nodes)
        .force(
            "link",
            d3.forceLink()
            .id(function(d) {
                return d.name;
            })
            .links(graph.links)
        )
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
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
        .text(function(d) { return d.name; })
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
});
</script>

<template>
    <div>
        <!-- <script>
            console.log(generateGraph($route.params.searchItem).export())
        </script> -->
        <svg></svg>
    </div>
</template>

<style>
svg {
    width: 50vw;
    height: 100vh;
    padding-left: 20px;
}

.label {
    font-size: 10px;
}

.links line {
    stroke: #999;
    stroke-opacity: 0.6;
}

.nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
}
</style>
