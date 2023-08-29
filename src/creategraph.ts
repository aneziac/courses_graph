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

export default function createGraph(
        courses: Map<string, Course>,
        degree: string = "Department",
        division: Division = Division.all,
        otherDepartments: boolean = true,
        requiredOnly: boolean = false,
        recentlyOfferedOnly: boolean = true,
        ) : DirectedGraph {

    let graph = new DirectedGraph();

    let colors = ["red", "orange", "green", "blue", "purple"];
    let currColor = 0;
    let optionalConcurrencyColor = "black";

    for (var key in courses) { // add in all the nodes first, no edges
        graph.addNode(key, { label: key, color: "blue" });
    }

    // add in all the edges
    for (var key in courses) {
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

                if (!graph.hasNode(prereqClass)) {
                    if (inDept) {
                        continue;
                    }
                    graph.addNode(prereqClass, { label: prereqClass });
                }

                if (optionalConcurrency) {
                    graph.addDirectedEdge(key, prereqClass, { color: optionalConcurrencyColor });
                } else {
                    graph.addDirectedEdge(key, prereqClass, { color: colors[currColor] });
                }

                if (j == prereqs[i].length - 1) {
                    currColor = (currColor + 1) % colors.length;
                }
            }
        }
    }

    // 0-100               100-200          200+
    // Lower division   Upper division    Graduate

    // sort by division
    if (division) {
        for (let key in courses) {
            if (graph.hasNode(key)) {
                let courseNumber = parseInt(courses[key].number);
                if (!((division - 1) * 100 <= courseNumber && courseNumber <= division * 100)) {
                    graph.dropNode(key);
                }
            }
        }
    }

    // remove based on degree, requirement, recently offered
    // TODO


    let noPrereqNodeCount = 0;

    // construct a mapping for nodes such that
    // no prereqs -> 0
    // >= 1 prereq -> -1
    const degreeMapping: Map<string, number> = new Map();
    graph.forEachNode((node) => {
        if (graph.outDegree(node) == 0) {
            degreeMapping.set(node, 0);
            noPrereqNodeCount++;
        } else {
            degreeMapping.set(node, -1);
        }
    });

    // deduce longest backwards path per node - O(n^2)
    for (let i = noPrereqNodeCount; i < graph.order; i++) {
        graph.forEachNode((node) => {
            // test for having prereqs
            if (degreeMapping.get(node) != -1) {
                return;
            }

            // test that prereqs don't have prereqs
            graph.outNeighbors(node).forEach(prereq => {
                if (degreeMapping.get(prereq) == -1) {
                    return;
                }
            });

            // find max degree of prereqs
            let maxPrereqDegree = 0;
            graph.outNeighbors(node).forEach(prereq => {
                if (degreeMapping.get(prereq) > maxPrereqDegree) {
                    maxPrereqDegree = degreeMapping.get(prereq);
                }
            });

            // node has degree of maximum prereq + itself
            degreeMapping.set(node, maxPrereqDegree + 1);
        });
    }

    // root nodes are red
    graph.forEachNode((node) => {
        if (graph.outDegree(node) == 0) {
            graph.updateNode(node, attr => {
                return {
                    ...attr,
                    color: "red"
                };
            });
        }
    });

    // other departments are green and/or are removed
    graph.forEachNode((node) => {
        if (!courses[node] && otherDepartments) {
            graph.updateNode(node, attr => {
                return {
                    ...attr,
                    color: "green"
                };
            });
        }
    });

    // good for now - TODO return after prereq parser rebuild
    for (let key in courses) {
        if (graph.hasNode(key) && (courses[key].prereq_description.includes("Consent of instructor")
            || courses[key].prereq_description.includes("consent of instructor"))) {
            graph.setNodeAttribute(key, "color", "purple");
        }
    }

    let maxY = Math.max(...degreeMapping.values());

    // calculate number of nodes at each height
    const nodesPerHeight: Map<number, number> = new Map();
    for (let i = 0; i <= maxY; i++) {
        nodesPerHeight.set(i, 0);
        graph.forEachNode((node) => {
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

        graph.forEachNode((node) => {
            if (degreeMapping.get(node) != i) {
                return;
            }

            graph.updateNode(node, attr => {
                return {
                    ...attr,
                    x: Math.round((xCounter / (nodesPerHeight.get(i) + 1)) * 100),
                    y: yCounter
                };
            });

            xCounter++;
        });
    }

    console.log(graph.export());
    return graph;
}
