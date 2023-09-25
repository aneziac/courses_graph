import DirectedGraph from 'graphology';
import { SerializedGraph } from 'graphology-types';
import { colors } from './style';


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

interface PrereqEdge {
    source: number,
    target: number,
    color: string
}

export interface SerializedCourseGraph {
    nodes: CourseNode[],
    edges: PrereqEdge[]
}


export class CourseGraph {
    static courseNodeSize = [100, 50];
    graph: DirectedGraph;
    nodeColors: Map<string, string>;
    private edgeColors: Array<string>;
    private optionalConcurrencyColor: string;

    constructor(courses: CourseJSON) {
        if (Object.keys(courses).length === 0) {
            throw new Error("Empty JSON file");
        }
        const firstEntry = courses[Object.keys(courses)[0]];
        if (!this.verifyData(firstEntry)) {
            throw new Error("Data fails minimum requirements");
        }

        this.graph = new DirectedGraph();
        this.nodeColors = new Map([
            ["default", colors.blue],
            ["outsideDept", colors.teal],
            ["noPrereqs", colors.orange],
            ["instructorConsent", colors.purple]
        ]);
        this.edgeColors = [colors.red7, colors.purple, colors.orange,
                           colors.blue, colors.pink, colors.green];
        this.optionalConcurrencyColor = colors.black;

        this.addNodes(courses);
        this.addEdges(courses);
        this.colorNodes(courses);
        const degreeMapping = this.computeDegreeMapping();
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
        for (const key in courses) {
            this.graph.addNode(key, { label: key, color: this.nodeColors.get("default") });
        }
    }

    private addEdges(courses: CourseJSON): void {
        let currColor = 0;

        for (const key in courses) {
            const course = courses[key];
            const prereqs = course.prereqs;

            for (let i = 0; i < prereqs.length; i++) {
                for (let j = 0; j < prereqs[i].length; j++) {
                    let prereqClass = prereqs[i][j];
                    const optionalConcurrency = prereqClass.includes("[O]");
                    const inDept = prereqClass.slice(0, course.sub_dept.length) == course.sub_dept;

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
        for (const key in courses) {
            if (this.graph.hasNode(key) && (courses[key].prereq_description.includes("Consent of instructor")
                || courses[key].prereq_description.includes("consent of instructor"))) {
                this.graph.setNodeAttribute(key, "color", this.nodeColors.get("instructorConsent"));
            }
        }
    }

    computeDegreeMapping(): Map<string, number> {
        let noPrereqNodeCount = 0;

        // construct a mapping for nodes such that
        // >= 1 prereq -> -2
        // degree 0 nodes -> -1
        // no prereqs -> 0
        const degreeMapping: Map<string, number> = new Map();

        this.graph.forEachNode((node) => {
            // no prereqs
            if (this.graph.outDegree(node) === 0) {
                if (this.graph.inDegree(node) === 0) {
                    // no prereqs or postreqs, thus degree 0
                    degreeMapping.set(node, -1);
                } else {
                    // no prereqs
                    degreeMapping.set(node, 0);
                }
                noPrereqNodeCount++;

            } else {
                degreeMapping.set(node, -2);
            }
        });

        // deduce longest backwards path per node - O(n^2)
        for (let i = noPrereqNodeCount; i < this.graph.order; i++) {
            this.graph.forEachNode((node) => {
                // get rid of nodes with no prereqs
                if (degreeMapping.get(node) != -2) {
                    return;
                }

                // get rid of nodes with prereqs that haven't been evaluated or have no prereqs
                this.graph.outNeighbors(node).forEach(prereq => {
                    if (degreeMapping.get(prereq) === -2) {
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

    /* TODO
    X constraint on nodes that are part of long continuous chain with high degree
    Cap number of courses appearing in a single row
    Constraint forcing nodes toward the center
    */

    // phys 22, art 22, phys 1 weird behavior
    private assignPositions(degreeMapping: Map<string, number>): void {
        const maxY = Math.max(...degreeMapping.values()) + 3;
        const idealRowSpread = 5;
        const halfRowSpread = Math.floor(idealRowSpread / 2);
        const maxCourseNumber = 300;

        // calculate number of nodes at each height
        const nodesPerHeight: Map<number, number> = new Map();
        for (let i = -1; i <= maxY; i++) {
            nodesPerHeight.set(i, 0);
        }

        this.graph.forEachNode((node) => {
            const height = degreeMapping.get(node)!;
            nodesPerHeight.set(height, nodesPerHeight.get(height)! + 1);
        });

        const maxRowWidth = Math.max(...nodesPerHeight.values());

        // determines fitness for a row for nodes with no prereqs
        const fitByRow: number[] = [];
        for (let i = 0; i <= maxY; i++) {
            fitByRow.push(-50 * (nodesPerHeight.get(i)! / maxRowWidth));
        }

        this.graph.forEachNode(node => {
            let height = degreeMapping.get(node)!;

            if (height === 0) {
                // remapped to min postreq height - 1

                let minY = maxY;

                this.graph.inNeighbors(node).forEach(postreq => {
                    minY = Math.min(minY, degreeMapping.get(postreq)!);
                })

                height = minY - 1;

            } else if (height === -1) {
                // remapped to fill in space and according to number

                const currentNodeFitByRow = structuredClone(fitByRow);
                const courseNumber = parseInt(node.replace(/[A-Z]+ /, '').replace(/[A-Z]/, ''));
                const idealRow = Math.ceil((courseNumber / maxCourseNumber) * maxY);
                const maxRow = Math.min(idealRow + halfRowSpread, maxY)

                for (let i = idealRow - halfRowSpread, j = 0; i < maxRow; i++, j++) {
                    if (j <= halfRowSpread) {
                        currentNodeFitByRow[i] += (j + 1) * 8;
                    } else {
                        currentNodeFitByRow[i] += (idealRowSpread - j) * 8;
                    }
                }

                const bestFitRow = currentNodeFitByRow.indexOf(Math.max(...currentNodeFitByRow));
                fitByRow[bestFitRow] -= 40 / maxRowWidth;
                height = bestFitRow;
            }

            this.graph.updateNode(node, attr => {
                return {
                    ...attr,
                    y: height
                };
            });
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

    getGraphNumericId(): SerializedCourseGraph {
        const nodeMap: Map<string, CourseNode> = new Map();
        const edges: Array<PrereqEdge> = new Array(this.edgeCount());
        const graphData = this.getGraph();

        graphData.nodes.forEach((node, i) => {
            nodeMap.set(node.key, <CourseNode>{
                id: i,
                name: node.key,
                color: node.attributes!.color,
                x: 0,
                y: node.attributes!.y,
                adjacent: [],
                width:  2 * CourseGraph.courseNodeSize[0],
                height: 2 * CourseGraph.courseNodeSize[1]
            });
        });
        // console.log(structuredClone(nodeMap));

        graphData.edges.forEach((edge, i) => {
            edges[i] = <PrereqEdge>{
                source: nodeMap.get(edge.source)!.id,
                target: nodeMap.get(edge.target)!.id,
                color: edge.attributes!.color,
            }

            const sourceNode = nodeMap.get(edge.source)!;
            const targetNode = nodeMap.get(edge.target)!;

            sourceNode.adjacent.push(targetNode.id);
            targetNode.adjacent.push(sourceNode.id);
        });

        const nodes = Array.from(nodeMap.values());

        return { nodes, edges };
    }

    sortDivison(division: Division): string[] {
        // 0-100               100-200          200+
        // Lower division   Upper division    Graduate

        // sort by division - all is falsey
        if (division) {
            return this.graph.filterNodes((node) => {
                const courseNumber = parseInt(node.split(" ").pop()!);
                return (division - 1) * 100 <= courseNumber && courseNumber <= division * 100
            })
        }
        return this.graph.nodes();
    }

    // degree, otherDepartments, requiredOnly, recentlyOfferedOnly
}
