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

                // removing the '[O]'
                if (optionalConcurrency) {
                    prereqClass = prereqClass.slice(0, prereqClass.length - 4);
                }

                if (!graph.hasNode(prereqClass)) {
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
        for (var key in courses) {
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


    // r
    var count = 0;
    let map = new Map();

    graph.forEachNode((node) => {
        if (graph.outDegree(node) == 0) {
            map.set(node, 0);
            count++;
        }
        else {
            map.set(node, -1);
        }
    });

    var sent: boolean;
    var max = 1;

    // console.debug("Node count: " + graph.order);

    while (count < graph.order) {
        graph.forEachNode((node) => {
            max = 1;
            if (map.get(node) == -1) {
                sent = true;
            }
            else {
                sent = false;
            }
            graph.outNeighbors(node).forEach(prereq => {
                if (map.get(prereq) == -1) {
                    sent = false;
                }
            });
            if (sent) {
                graph.outNeighbors(node).forEach(prereq => {
                    if (map.get(prereq) + 1 > max) {
                        max = map.get(prereq) + 1;
                    }
                });

                map.set(node, max);
                count++;
            }
        });
    }

    // good
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

    // good
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
        else if (!courses[node]) {
            graph.dropNode(node);
        }
    });

    // good for now - return after prereq parser rebuild
    for (var key7 in courses) {
        if (graph.hasNode(key7) && (courses[key7].prereq_description.includes("Consent of instructor") || courses[key7].prereq_description.includes("consent of instructor"))) {
            graph.setNodeAttribute(key7, "color", "purple");
        }
    }

    // r v
    // calculate number of nodes at each height
    const numaty = new Map();
    for (var i = 0; i < 10; i++) {
        numaty.set(i, 0);
        graph.forEachNode((node) => {
            if (map.get(node) == i) {
                numaty.set(i, numaty.get(i) + 1);
            }
        });
    }

    // assign x-coordinates
    var counter;
    for (var i = 0; i < 15; i++) {
        var random = Math.random();
        counter = 1;
        graph.forEachNode((node) => {
            if (map.get(node) == i && numaty.get(i) > 1) {
                graph.updateNode(node, attr => {
                    return {
                        ...attr,
                        x: (counter / (numaty.get(i) + 1)) * 50 + random,
                        y: 3 * map.get(node)
                    };
                });
                counter++;
            }
            else if (map.get(node) == i && numaty.get(i) == 1) {
                graph.updateNode(node, attr => {
                    return {
                        ...attr,
                        x: 24.5 + random,
                        y: 3 * map.get(node)
                    };
                });
            }
        });
    }

    return graph;
}
