import DirectedGraph from 'graphology';


// see ../scraper/datatypes.py Course and WebsiteCourse
interface Course {
    number: string,
    sub_dept: string
    title: string,
    dept: string,
    prereqs: Array<Array<string>>,
    prereq_description: string,
    comments: string,
    units: string,
    description: string,
    recommended_prep: string,
    professor: string,
    college: string
}

enum Division {
    all,
    lowerDivision,
    upperDivision,
    graduate
}

export default class CourseGraph {
    graph: DirectedGraph;
    edgeColors: Array<string>;
    optionalConcurrencyColor: string;

    constructor(courses: Map<string, Course>) {
        this.graph = new DirectedGraph();
        this.edgeColors = ["red", "orange", "green", "blue", "purple"];
        this.optionalConcurrencyColor = "black";

        this.addNodes(courses);
        this.addEdges(courses);
        this.colorNodes(courses);
        let degreeMapping = this.computeDegreeMapping();
        this.assignPositions(degreeMapping);
    }

    addNodes(courses: Map<string, Course>) {
        for (var key in courses) {
            this.graph.addNode(key, { label: key, color: "blue" });
        }
    }

    addEdges(courses: Map<string, Course>) {
        let currColor = 0;

        for (let key in courses) {
            let course: Course = courses[key];
            let prereqs = course.prereqs;

            for (var i = 0; i < prereqs.length; i++) {
                for (var j = 0; j < prereqs[i].length; j++) {
                    let prereqClass = prereqs[i][j];
                    let optionalConcurrency = prereqClass.includes("[O]");
                    let inDept = prereqClass.slice(0, course.sub_dept.length) == course.sub_dept;

                    // removing the '[O]'
                    if (optionalConcurrency) {
                        prereqClass = prereqClass.slice(0, prereqClass.length - 4);
                    }

                    if (!this.graph.hasNode(prereqClass)) {
                        if (inDept) {
                            continue;
                        }
                        this.graph.addNode(prereqClass, { label: prereqClass, color: "green" });
                    }

                    if (optionalConcurrency) {
                        this.graph.addDirectedEdge(key, prereqClass, { color: this.optionalConcurrencyColor });
                    } else {
                        this.graph.addDirectedEdge(key, prereqClass, { color: this.edgeColors[currColor] });
                    }

                    if (j == prereqs[i].length - 1) {
                        currColor = (currColor + 1) % this.edgeColors.length;
                    }
                }
            }
        }
    }

    colorNodes(courses: Map<string, Course>) {
        // root nodes are red
        this.graph.forEachNode((node) => {
            if (this.graph.outDegree(node) == 0) {
                this.graph.updateNode(node, attr => {
                    return {
                        ...attr,
                        color: "red"
                    };
                });
            }
        });

        // good for now - TODO return after prereq parser rebuild
        for (let key in courses) {
            if (this.graph.hasNode(key) && (courses[key].prereq_description.includes("Consent of instructor")
                || courses[key].prereq_description.includes("consent of instructor"))) {
                this.graph.setNodeAttribute(key, "color", "purple");
            }
        }
    }

    computeDegreeMapping(): Map<string, number> {
        let noPrereqNodeCount = 0;

        // construct a mapping for nodes such that
        // no prereqs -> 0
        // >= 1 prereq -> -1
        const degreeMapping: Map<string, number> = new Map();

        this.graph.forEachNode((node) => {
            if (this.graph.outDegree(node) == 0) {
                degreeMapping.set(node, 0);
                noPrereqNodeCount++;
            } else {
                degreeMapping.set(node, -1);
            }
        });

        // deduce longest backwards path per node - O(n^2)
        for (let i = noPrereqNodeCount; i < this.graph.order; i++) {
            this.graph.forEachNode((node) => {
                // test for having prereqs
                if (degreeMapping.get(node) != -1) {
                    return;
                }

                // test that prereqs don't have prereqs
                this.graph.outNeighbors(node).forEach(prereq => {
                    if (degreeMapping.get(prereq) == -1) {
                        return;
                    }
                });

                // find max degree of prereqs
                let maxPrereqDegree = 0;
                this.graph.outNeighbors(node).forEach(prereq => {
                    if (degreeMapping.get(prereq) > maxPrereqDegree) {
                        maxPrereqDegree = degreeMapping.get(prereq);
                    }
                });

                // node has degree of maximum prereq + itself
                degreeMapping.set(node, maxPrereqDegree + 1);
            });
        }

        return degreeMapping;
    }

    assignPositions(degreeMapping: Map<string, number>) {
        let maxY = Math.max(...degreeMapping.values());

        // calculate number of nodes at each height
        const nodesPerHeight: Map<number, number> = new Map();
        for (let i = 0; i <= maxY; i++) {
            nodesPerHeight.set(i, 0);
            this.graph.forEachNode((node) => {
                if (degreeMapping.get(node) == i) {
                    nodesPerHeight.set(i, nodesPerHeight.get(i) + 1);
                }
            });
        }

        let yCounter = 0;

        // assign x-coordinates
        for (let i = 0; i <= maxY; i++) {
            let xCounter = 1;

            if (i > 0) {
                if (nodesPerHeight.get(i) < 3) {
                    yCounter++;
                } else {
                    yCounter += 2;
                }
            }

            this.graph.forEachNode((node) => {
                if (degreeMapping.get(node) != i) {
                    return;
                }

                this.graph.updateNode(node, attr => {
                    return {
                        ...attr,
                        x: Math.round((xCounter / (nodesPerHeight.get(i) + 1)) * 100),
                        y: yCounter
                    };
                });

                xCounter++;
            });
        }
    }

    getEdges() {
        return this.graph.export().edges;
    }
    getNodes() {
        return this.graph.export().nodes;
    }
}

function sortDivison(inGraph: DirectedGraph, division: Division): DirectedGraph {
    // 0-100               100-200          200+
    // Lower division   Upper division    Graduate

    // sort by division
    if (division) {
        inGraph.forEachNode((node) => {
            let courseNumber = parseInt(node.split(" ").pop());
            if (!((division - 1) * 100 <= courseNumber && courseNumber <= division * 100)) {
                inGraph.dropNode(node);
            }
        })
    }

    return inGraph;
}
