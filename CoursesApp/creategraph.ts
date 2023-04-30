import DirectedGraph from 'graphology';

// creates graph w/ negative edge keys for postreq direction and w/ positive edge keys for prereq direction



export default function createGraph(json: JSON, major: string = "All", division: string = "Both", otherDepartments: boolean = true, quarters: Array<string> = [""]) : DirectedGraph {
    const graph = new DirectedGraph();

    if (quarters[0] == "") {
        quarters = ["Winter 2020", "Spring 2020", "Summer 2020", "Fall 2020", "Winter 2021", "Spring 2021", "Summer 2021", "Fall 2021", "Winter 2022", "Spring 2022", "Summer 2022", "Fall 2022", "Winter 2023", "Spring 2023", "Summer 2023"];
    }

    var x = 0;
    var i = 0;
    var y = 0;

    var colors = ["red", "orange", "green", "blue", "purple"];
    var currColor = 0;

    for (var key in json) { // add in all the nodes first, no edges
        graph.addNode(key, { x: 0, y: 0, size: 5, label: key.substring(key.lastIndexOf(" ")), color: "blue" });
    }

    var prereqset = 0; // add in all the edges
    var prereqwithinset = 0;
    var prereqkey;
    for (var key in json) {
        for (var i = 0; i < json[key].prereqs.length; i++) {
            for (var j = 0; j < json[key].prereqs[i].length; j++) {
                if (json[key].prereqs[i][j] != 0) {
                    if (!graph.hasNode(json[key].prereqs[i][j]) && !(json[key].prereqs[i][j].substring(0, json[key].sub_dept.length) == json[key].sub_dept)) {
                        if (json[key].prereqs[i][j].includes("[O]")) {
                            graph.mergeNode(json[key].prereqs[i][j].substr(0, json[key].prereqs[i][j].length - 4), { x: x, y: y, size: 5, label: json[key].prereqs[i][j].substr(0, json[key].prereqs[i][j].length - 4), color: "blue" });
                            console.log("creating " + json[key].prereqs[i][j].substr(0, json[key].prereqs[i][j].length - 4));
                        }
                        else {
                            graph.mergeNode(json[key].prereqs[i][j], { x: x, y: y, size: 5, label: json[key].prereqs[i][j], color: "blue" });
                        }
                        x++;
                        if (x == 10) {
                            x = 0;
                            y++;
                        }
                        prereqkey =  prereqset.toString() + '.' + prereqwithinset.toString();
                        if (j + 1 != json[key].prereqs[i].length) {
                            prereqwithinset++;
                            if (!json[key].prereqs[i][j].includes("[O]")) {
                                graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                                    color: colors[currColor]
                                });
                            }
                            else {
                                graph.mergeDirectedEdgeWithKey(prereqkey.substr(0, key.length - 4), key, json[key].prereqs[i][j].substring(0, json[key].prereqs[i][j].length - 4), {
                                    color: "black"
                                });
                            }
                        }
                        else if (j + 1 == json[key].prereqs[i].length && i + 1 != json[key].prereqs.length) {
                            prereqset++;
                            prereqwithinset = 0;
                            if (!json[key].prereqs[i][j].includes("[O]")) {
                                graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                                    color: colors[currColor]
                                });
                            }
                            else {
                                graph.mergeDirectedEdgeWithKey(prereqkey.substr(0, key.length - 4), key, json[key].prereqs[i][j].substring(0, json[key].prereqs[i][j].length - 4), {
                                    color: "black"
                                });
                            }
                            currColor = (currColor + 1) % colors.length;
                        }
                        else {
                            prereqset = 10 * Math.floor(prereqset / 10) + 10;
                            prereqwithinset = 0;
                            if (!json[key].prereqs[i][j].includes("[O]")) {
                                graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                                    color: colors[currColor]
                                });
                            }
                            else {
                                graph.mergeDirectedEdgeWithKey(prereqkey.substr(0, key.length - 4), key, json[key].prereqs[i][j].substring(0, json[key].prereqs[i][j].length - 4), {
                                    color: "black"
                                });
                            }
                            currColor = (currColor + 1) % colors.length;
                        }

                    }
                    else if (graph.hasNode(json[key].prereqs[i][j])) {
                        prereqkey =  prereqset.toString() + '.' + prereqwithinset.toString();
                        if (j + 1 != json[key].prereqs[i].length) {
                            prereqwithinset++;
                            if (!json[key].prereqs[i][j].includes("[O]")) {
                                graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                                    color: colors[currColor]
                                });
                            }
                            else {
                                graph.mergeDirectedEdgeWithKey(prereqkey.substr(0, key.length - 4), key.substr, json[key].prereqs[i][j].substring(0, json[key].prereqs[i][j].length - 4), {
                                    color: "black"
                                });
                            }
                        }
                        else if (j + 1 == json[key].prereqs[i].length && i + 1 != json[key].prereqs.length) {
                            prereqset++;
                            prereqwithinset = 0;
                            if (!json[key].prereqs[i][j].includes("[O]")) {
                                graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                                    color: colors[currColor]
                                });
                            }
                            else {
                                graph.mergeDirectedEdgeWithKey(prereqkey.substr(0, key.length - 4), key.substr, json[key].prereqs[i][j].substring(0, json[key].prereqs[i][j].length - 4), {
                                    color: "black"
                                });
                            }
                            currColor = (currColor + 1) % colors.length;
                        }
                        else {
                            prereqset = 10 * Math.floor(prereqset / 10) + 10;
                            prereqwithinset = 0;
                            if (!json[key].prereqs[i][j].includes("[O]")) {
                                graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                                    color: colors[currColor]
                                });
                            }
                            else {
                                graph.mergeDirectedEdgeWithKey(prereqkey.substr(0, key.length - 4), key.substr, json[key].prereqs[i][j].substring(0, json[key].prereqs[i][j].length - 4), {
                                    color: "black"
                                });
                            }
                            currColor = (currColor + 1) % colors.length;
                        }

                    }
                }
            }
        }
    }
    var count = 0;
    const map = new Map();

    graph.forEachNode((node) => {
        if (graph.outDegree(node) == 0) {
            map.set(node, 0);
            count++;
        }
        else {
            map.set(node, -1);
        }
    });



    var sent;
    var max = 1;

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

    // removes all grad courses
    for (var key2 in json) {
        if (graph.hasNode(key2)) {
            if (parseInt(json[key2].number) > 200) {
                graph.dropNode(key2);
                map.delete(key2);
            }
        }
    }


    // remove based on quarters, divisions
    var toInclude = false;
    for (var key2 in json) {
        toInclude = false;
        if (graph.hasNode(key2)) {
            for (var str in quarters) {
                if ((json[key2].offered && major == "All" || json[key2].majors_required_for.includes(major)) &&
                    (division == "Both" || (division == "LD" && parseInt(json[key2].number) < 100) || (division == "UD" && parseInt(json[key2].number) >= 100))) {
                    for (var str2 in json[key2].offered) {
                        if (str2 == str) {
                            toInclude = true;
                        }
                    }
                }
            }
            if (!toInclude) {
                graph.dropNode(key2);
                map.delete(key);
            }
        }
    }


    // remove nodes w/ no neighbors
    graph.forEachNode((node) => {
        if (graph.degree(node) == 0) {
            // graph.dropNode(node);
            // map.delete(node);
        }
    });

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
        if (!json[node] && otherDepartments) {
            graph.updateNode(node, attr => {
                return {
                    ...attr,
                    color: "green"
                };
            });
        }
        else if (!json[node]) {
            graph.dropNode(node);
        }
    });

    for (var key7 in json) {
        if (graph.hasNode(key7) && (json[key7].prereq_description.includes("Consent of instructor") || json[key7].prereq_description.includes("consent of instructor"))) {
            graph.setNodeAttribute(key7, "color", "purple");
            // graph.updateNode(key7 => {
            //     return {
            //         color: "purple"
            //     };
            // });
        }
    }




    // toInclude = false;
    // for (var key2 in json) {
    //     toInclude = false;
    //     if (graph.hasNode(key2)) {
    //         for (var str in quarters) {
    //             if (json[key2].offered) {
    //                 for (var str2 in json[key2].offered) {
    //                     if (str2 == str) {
    //                         toInclude = true;
    //                     }
    //                 }
    //             }
    //         }
    //         if (!toInclude) {
    //             graph.dropNode(key2);
    //             map.delete(key);
    //         }
    //     }
    // }





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

    // graph.forEachNode((node) => {
    //     var x = node.indexOf(" ");
    //     if (parseInt(node.substr(x+1)) > 200) {
    //         graph.dropNode(node);
    //         map.delete(node);
    //     }
    // });







    // graph.forEachNode((key2) => {
    //     console.log("MATH 2A");
    //     for (var str in quarters) {
    //         if (json["MATH 7H"].offered) {
    //             for (var str2 in json["MATH 7H"].offered) {
    //                 if (str2 == str) {
    //                     toInclude = true;
    //                 }
    //             }
    //         }
    //     }
    //     if (!toInclude) {
    //         graph.dropNode(key2);
    //     }
    // });


    return graph;
}
