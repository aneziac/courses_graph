<script setup lang="ts">
import { CourseGraph, CourseNode } from '../CourseGraph';
import { WebsiteCourse, WebsiteCourseJSON, APICourse, APICourseJSON, Major, MajorJSON } from '../jsontypes';
import createConstraints from '../Constraints';
import * as d3 from 'd3';
import { d3adaptor } from 'webcola';
import { RouteParams, useRoute } from 'vue-router';
import { colors } from '../style';
import CourseInfoPane from '../components/CourseInfoPane.vue';
import { ref, Ref, watch } from 'vue';
import SearchBar from '../components/SearchBar.vue';


// webcola overwrites source and target during processing which confuses typescript
// this seems like a bad practice on the library's part
interface OverwrittenPrereqEdge {
    source: CourseNode,
    target: CourseNode,
    color: string
}

interface CourseInfo {
    web: WebsiteCourse,
    api: APICourse
}

const route = useRoute();
loadData(route.params)
let activeNode: Ref<CourseInfo | null> = ref(null);
let searchBarFocused = ref(false);


function loadData(url: RouteParams): void {
    let major: string | undefined = undefined;
    if (Object.keys(url).length === 2) {
        major = url.major as string;
    }
    const dept = url.dept as string;

    d3.json(`/data/website/${dept}.json`).then(f => {
        d3.json(`/data/api/${dept}.json`).then(g => {
            if (major) {
                d3.json(`/data/majors/${dept}.json`).then(h => {
                    const majorCourses = getMajorCourses(h as MajorJSON, major!);
                    loadGraph(dept, f as WebsiteCourseJSON, g as APICourseJSON, majorCourses);
                });
            } else {
                loadGraph(dept, f as WebsiteCourseJSON, g as APICourseJSON);
            }
        });
    });
}

function getMajorCourses(majorData: MajorJSON, major: string): Major | undefined {
    for (let key in majorData) {
        if (major === key.toLowerCase().replaceAll(' ', '-')) {
            return majorData[key];
        }
    }

    return undefined;
}

watch(() => route.params, (newDept, _) => {
    d3.select("svg").remove();
    loadData(newDept);
});

function loadGraph(dept: string, websiteData: WebsiteCourseJSON, apiData: APICourseJSON, major?: Major): void {
    console.log(`Successfully loaded ${dept}`);

    let courseGraph: CourseGraph;
    if (major) {
        courseGraph = new CourseGraph(dept, websiteData, apiData, major.requirements);
    } else {
        courseGraph = new CourseGraph(dept, websiteData, apiData);
    }
    let graph = courseGraph.getGraphNumericId();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 2])
        // .translateExtent([[0, 0], [width * 5, height * 5]])
        .on('zoom', e => {
            d3.selectAll('g')
                .attr('transform', e.transform);
        });

    const d3Cola = d3adaptor(d3)
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

            if (hoveredNode.name.includes(dept.toUpperCase())) {
                activeNode.value = { web: websiteData[hoveredNode.name], api: apiData[hoveredNode.name] };
            }
        })
        .on("mouseout", () => {
            link.style('stroke-width', 4);
            link.style('stroke', edge => {
                return edge.color;
            });
            node.style('fill', node => {
                return node.color;
            });

            activeNode.value = null;
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
}

function quantizeProbabilities(probabilities: number[]): string {
    let output = '';
    const quarterNames = ["Winter", "Spring", "Summer", "Fall"];
    for (let i = 0; i < probabilities.length; i++) {
        output += quarterNames[i] + ': ';
        const probability = probabilities[i];

        if (probability > 0.9) {
            output += "Very likely";
        } else if (probability > 0.7) {
            output += "Likely";
        } else if (probability > 0.3) {
            output += "Even chance";
        } else if (probability > 0.1) {
            output += "Unlikely";
        } else {
            output += "Very unlikely";
        }
        output += ' ';
    }
    return output;
}
</script>

<template>
    <div id="dashboard">
        <div id="search-bar" :class=" { selected: searchBarFocused } ">
            <SearchBar @focus="(focus) => searchBarFocused = focus" :searchResultCount="searchBarFocused ? 8 : 0"/>
        </div>
        <div id="info-panel">
            <CourseInfoPane v-if="activeNode">
                <template #title>
                    {{ `${activeNode.web.sub_dept} ${activeNode.web.number} - ${activeNode.web.title}` }}
                </template>
                <template #description>
                    {{ activeNode.web.description }}
                </template>
                <template #prereqs>
                    {{ activeNode.web.prereq_description ?
                       activeNode.web.prereq_description : "None" }}
                </template>
                <template #units>
                    {{ activeNode.web.units }}
                </template>
                <template #gefields>
                    {{ activeNode.api.general_education_fields.length ?
                       activeNode.api.general_education_fields.join(', ') : "None" }}
                </template>
                <template #lastoffered>
                    {{ activeNode.api.offered[activeNode.api.offered.length - 1] }}
                </template>
                <template #offeringchances>
                    {{ quantizeProbabilities(activeNode.api.offered_probabilities) }}
                </template>
            </CourseInfoPane>
        </div>
        <div id="graph">
        </div>
    </div>
</template>

<style>
#dashboard {
    width: 100%;
    height: 100%;
    position: relative;
}

#search-bar {
    position: absolute;
    background: #ffffff;
    height: 0;
    width: 70vw;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-left: auto;
    margin-right: auto;
    font-size: 20px;
    margin-top: 20px;
}

#search-bar.selected {
    height: 50vh;
}

#info-panel {
    position: absolute;
    background: #ffffff;
    margin-top: 10%;
    margin-left: 10px;
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
