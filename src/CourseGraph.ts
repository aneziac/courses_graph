import DirectedGraph from 'graphology';
import { SerializedGraph } from 'graphology-types';


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

export type CourseJSON = {[key: string]: Course}

enum Division {
    all,
    lowerDivision,
    upperDivision,
    graduate
}

// for numeric serialization
export interface CourseNode {
    id: number;
    name: string;
    color: string;
    x: number;
    y: number;
    adjacent: number[];
    width: number;
    height: number;
}

export let courseNodeSize = [100, 50];

interface PrereqEdge {
    source: number,
    target: number,
    color: string
}

type Color = {[color: string]: string} // return to

// TODO: find better way to do this
const colors: Color = {
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


export class CourseGraph {
    graph: DirectedGraph;
    nodeColors: Map<string, string>;
    private edgeColors: Array<string>;
    private optionalConcurrencyColor: string;

    constructor(courses: CourseJSON) {
        if (Object.keys(courses).length === 0) {
            throw new Error("Empty JSON file");
        }
        let firstEntry = courses[Object.keys(courses)[0]];
        if (!this.verifyData(firstEntry)) {
            throw new Error("Data fails minimum requirements");
        }

        this.graph = new DirectedGraph();
        this.nodeColors = new Map([
            ["default", "blue"],
            ["outsideDept", "teal"],
            ["noPrereqs", "orange"],
            ["instructorConsent", "purple"]
        ]);
        this.edgeColors = ["red7", "purple", "orange", "blue", "pink", "green"];
        this.optionalConcurrencyColor = "black";

        this.addNodes(courses);
        this.addEdges(courses);
        this.colorNodes(courses);
        let degreeMapping = this.computeDegreeMapping();
        this.assignPositions(degreeMapping);
    }

    // should soon be subdept and prereqs only
    private verifyData(data: unknown): boolean {
        if (!data || typeof data !== 'object') {
            return false;
        }
        const course = data as Course;

        return typeof course.sub_dept === 'string' &&
               Array.isArray(course.prereqs) &&
               typeof course.prereq_description === 'string';
    }

    private addNodes(courses: CourseJSON): void {
        for (let key in courses) {
            this.graph.addNode(key, { label: key, color: this.nodeColors.get("default") });
        }
    }

    private addEdges(courses: CourseJSON): void {
        let currColor = 0;

        for (let key in courses) {
            let course = courses[key];
            let prereqs = course.prereqs;

            for (let i = 0; i < prereqs.length; i++) {
                for (let j = 0; j < prereqs[i].length; j++) {
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

                        // don't color outside nodes green here because color will be overwritten
                        this.graph.addNode(prereqClass, { label: prereqClass });
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

    private colorNodes(courses: CourseJSON): void {
        // root nodes are red
        this.graph.forEachNode((node) => {
            if (this.graph.outDegree(node) == 0) {
                this.graph.updateNode(node, attr => {
                    return {
                        ...attr,
                        color: this.nodeColors.get("noPrereqs")
                    };
                });
            }
        });

        // other departments are green
        this.graph.forEachNode((node) => {
            if (!courses[node]) {
                this.graph.updateNode(node, attr => {
                    return {
                        ...attr,
                        color: this.nodeColors.get("outsideDept")
                    };
                });
            }
        });

        // good for now - TODO return after prereq parser rebuild
        for (let key in courses) {
            if (this.graph.hasNode(key) && (courses[key].prereq_description.includes("Consent of instructor")
                || courses[key].prereq_description.includes("consent of instructor"))) {
                this.graph.setNodeAttribute(key, "color", this.nodeColors.get("instructorConsent"));
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
                    if (degreeMapping.get(prereq)! > maxPrereqDegree) {
                        maxPrereqDegree = degreeMapping.get(prereq)!;
                    }
                });

                // node has degree of maximum prereq + itself
                degreeMapping.set(node, maxPrereqDegree + 1);
            });
        }

        return degreeMapping;
    }

    // phys 22, art 22, phys 1 weird behavior
    private assignPositions(degreeMapping: Map<string, number>): void {
        const maxY = Math.max(...degreeMapping.values()) + 3;

        // calculate number of nodes at each height
        let nodesPerHeight: Map<number, number> = new Map();
        for (let i = 0; i <= maxY; i++) {
            nodesPerHeight.set(i, 0)
        };

        this.graph.forEachNode((node) => {
            const height = degreeMapping.get(node);
            nodesPerHeight.set(height, nodesPerHeight.get(height) + 1);
        });

        const maxRowWidth = Math.max(...nodesPerHeight.values());

        // determines fitness for a row for nodes with no prereqs
        let fitByRow: number[] = [];
        for (let i = 0; i <= maxY; i++) {
            fitByRow.push(20 * (0.7 - (nodesPerHeight.get(i) / maxRowWidth)));
        };

        this.graph.forEachNode(node => {
            let height = degreeMapping.get(node);
            if (height === 0) {
                let currentNodeFitByRow = structuredClone(fitByRow);
                let courseNumber = parseInt(node.replace(/[A-Z]+ /, '').replace(/[A-Z]/, ''));
                let idealRow = Math.ceil((courseNumber / 300) * maxY);

                for (let i = idealRow - 2, j = 0; i < Math.min(idealRow + 2, maxY); i++, j++) {
                    if (j <= 2) {
                        currentNodeFitByRow[i] += (j + 1) * 20;
                    } else {
                        currentNodeFitByRow[i] += (5 - j)* 20;
                    }
                }
                if (node === 'PHYS 221A') {
                    console.log(currentNodeFitByRow);
                }

                let bestFitRow = currentNodeFitByRow.indexOf(Math.max(...currentNodeFitByRow));
                fitByRow[bestFitRow] -= 20 / maxRowWidth;
                height = bestFitRow;
            }

            this.graph.updateNode(node, attr => {
                return {
                    ...attr,
                    y: height
                };
            })
        });
    }

    getGraph(): SerializedGraph {
        return this.graph.export();
    }

    nodeCount(): number {
        return this.graph.order;
    }

    edgeCount(): number {
        return this.graph.size;
    }

    getGraphNumericId(): { nodes: CourseNode[], edges: PrereqEdge[] } {
        let nodeMap: Map<string, CourseNode> = new Map();
        let edges: Array<PrereqEdge> = new Array(this.edgeCount());
        let graphData = this.getGraph();

        graphData.nodes.forEach((node, i) => {
            nodeMap.set(node.key, <CourseNode>{
                id: i,
                name: node.key,
                color: colors[node.attributes!.color],
                x: 0,
                y: node.attributes!.y,
                adjacent: [],
                width:  2 * courseNodeSize[0],
                height: 2 * courseNodeSize[1]
            });
        });

        graphData.edges.forEach((edge, i) => {
            edges[i] = <PrereqEdge>{
                source: nodeMap.get(edge.source)!.id,
                target: nodeMap.get(edge.target)!.id,
                color: colors[edge.attributes!.color],
            }

            let sourceNode = nodeMap.get(edge.source)!;
            let targetNode = nodeMap.get(edge.target)!;

            sourceNode.adjacent.push(targetNode.id);
            targetNode.adjacent.push(sourceNode.id);
        });

        let nodes = Array.from(nodeMap.values());

        return { nodes, edges };
    }

    // sortDivison(division: Division): string[] {
    //     // 0-100               100-200          200+
    //     // Lower division   Upper division    Graduate

    //     // sort by division - all is falsey
    //     if (division) {
    //         return this.graph.filterNodes((node) => {
    //             let courseNumber = parseInt(node.split(" ").pop()!);
    //             return (division - 1) * 100 <= courseNumber && courseNumber <= division * 100
    //         })
    //     }
    // }

    // degree, otherDepartments, requiredOnly, recentlyOfferedOnly
}
