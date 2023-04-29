// import DirectedGraph from 'graphology';
// // import * as fs from 'fs';
// // import path from 'path';
// // import { fileURLToPath } from 'url'


// // function getJSON(path: string) {
// //     return JSON.parse(fs.readFileSync(path, 'utf8'));
// // }

// // creates graph w/ negative edge keys for postreq direction and w/ positive edge keys for prereq direction



// export default function createGraph(json: JSON) : DirectedGraph {
//     const graph = new DirectedGraph();

//     var x = 0;
//     var i = 0;
//     var y = 0;

//     for (var key in json) { // add in all the nodes first, no edges
//         // FIX THIS CONDITIONAL, BY GETTING NUMBER ISOLATED

//         // var number = "";
//         // for (var i = 0; i < key.length; i++) {
//         //     if ('0' <= key[i] && '9' >= key[i]) {
//         //         number += key[i];
//         //     }
//         // }

//         // if (parseInt(number) < 200)
//             graph.addNode(key, { x: 0, y: 0, size: 5, label: key, color: "blue" });
//     }

//     var prereqset = 0; // add in all the edges
//     var prereqwithinset = 0;
//     var prereqkey;
//     for (var key in json) {
//         console.log(key + " " + graph.hasNode(key));
//         if (graph.hasNode(key)) {
//             for (var i = 0; i < json[key].prereqs.length; i++) {
//                 for (var j = 0; j < json[key].prereqs[i].length; j++) {
//                     if (json[key].prereqs[i][j] != 0) {
//                         // conditions here are wonky
//                         if (!graph.hasNode(json[key].prereqs[i][j]) && !(json[key].prereqs[i][j].substring(0, json[key].sub_dept.length) == json[key].sub_dept)) {
//                             graph.addNode(json[key].prereqs[i][j], { x: x, y: y, size: 5, label: json[key].prereqs[i][j], color: "blue" });
//                             x++;
//                             if (x == 10) {
//                                 x = 0;
//                                 y++;
//                             }
//                             prereqkey =  prereqset.toString() + '.' + prereqwithinset.toString();
//                             if (j + 1 != json[key].prereqs[i].length) {
//                                 prereqwithinset++;
//                             }
//                             else if (j + 1 == json[key].prereqs[i].length && i + 1 != json[key].prereqs.length) {
//                                 prereqset++;
//                                 prereqwithinset = 0;
//                             }
//                             else {
//                                 prereqset = 10 * Math.floor(prereqset / 10) + 10;
//                                 prereqwithinset = 0;
//                             }
//                             graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j]);
//                         }
//                         else if (graph.hasNode(json[key].prereqs[i][j])) {
//                             prereqkey =  prereqset.toString() + '.' + prereqwithinset.toString();
//                             if (j + 1 != json[key].prereqs[i].length) {
//                                 prereqwithinset++;
//                             }
//                             else if (j + 1 == json[key].prereqs[i].length && i + 1 != json[key].prereqs.length) {
//                                 prereqset++;
//                                 prereqwithinset = 0;
//                             }
//                             else {
//                                 prereqset = 10 * Math.floor(prereqset / 10) + 10;
//                                 prereqwithinset = 0;
//                             }
//                             graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j]);
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     var count = 0;

//     const map = new Map();
//     // for (var node in graph) {
//     graph.forEachNode(node => {
//         if (graph.outDegree(node) == 0) {
//             map.set(node, 0);
//             count++;
//         }
//         else {
//             map.set(node, -1);
//         }
//     // }
//     console.log(map);});

//     var sent;

//     while (count < Object.keys(json).length / 2) {
//         graph.forEachNode((node) => {
//             if (map.get(node) == -1) {
//                 sent = false;
//             }
//             else {
//                 sent = true;
//             }
//             console.log(node + " has neighbors " +  graph.outNeighbors(node));
//             graph.outNeighbors(node).forEach(prereq => {
//                 console.log(prereq + " " + map.get(prereq));
//                 if (map.get(prereq) != -1 && !sent) {
//                     console.log(map.get(prereq) + 1);
//                     map.set(node, map.get(prereq) + 1);
//                     sent = true;
//                     count++;
//                 }});
//             // for (var prereq in graph.inNeighbors(key)) {
//             //     if (map.get(prereq) != -1) {
//             //         // map.set(key, map.get(prereq) + 1);
//             //         console.log(prereq);
//             //         console.log(map.get(prereq) + 1);
//             //         count++;
//             //         break;
//             //     }
//             // }
//         });
//         console.log(map);

//     }


//     var i = 0;
//     for (var key in json) {
//         graph.updateNode(key, attr => {
//             return {
//               ...attr,
//               x: i % 20,
//               y: map.get(key)
//             };
//         });
//         i++;
//     }

//     return graph;
// }


// // returns map with info associated with a particular course
// // function grabInfo(path: string, course: string) : Map<string, string> {

// //     var json = JSON.parse(fs.readFileSync(path, 'utf8'));

// //     const courseInfo: Map<string, string> = new Map();
// //     courseInfo.set("title", json[course].title);
// //     courseInfo.set("dept", json[course].dept);
// //     courseInfo.set("sub_dept", json[course].sub_dept);
// //     courseInfo.set("number", json[course].number);
// //     courseInfo.set("prereqs", json[course].prereqs);
// //     courseInfo.set("comments", json[course].comments);
// //     courseInfo.set("units", json[course].units);
// //     courseInfo.set("description", json[course].description);
// //     courseInfo.set("recommended_prep", json[course].recommended_prep);
// //     courseInfo.set("professor", json[course].professor);
// //     courseInfo.set("college", json[course].college);

// //     return courseInfo;
// // }

// // function generatePaths() : Array<string> {
// //     var paths: Array<string> = [];
// //     var files = fs.readdirSync('data/');
// //     for (const file of files) {
// //         if (file.split('.')[1] == 'json') {
// //             paths.push('./data/' + file);
// //         }
// //     }
// //     return paths;
// // }

// // // below is only called if we run directly with node

// // function main() {
// //     var count = 0;
// //     for (const file of generatePaths()) {
// //         console.log(file);
// //         var graph = createGraph(getJSON(file));
// //         console.log(graph.edges());
// //         console.log(graph.nodes());
// //         count += graph.edges().length;
// //     }
// //     console.log(count);
// // }

// // const nodePath = path.resolve(process.argv[1]);
// // const modulePath = path.resolve(fileURLToPath(import.meta.url))
// // if (nodePath === modulePath) {
// //     main();
// // }


import DirectedGraph from 'graphology';

// creates graph w/ negative edge keys for postreq direction and w/ positive edge keys for prereq direction



export default function createGraph(json: JSON) : DirectedGraph {
    const graph = new DirectedGraph();

    var x = 0;
    var i = 0;
    var y = 0;

    var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    var currColor = 0;

    for (var key in json) { // add in all the nodes first, no edges
        graph.addNode(key, { x: 0, y: 0, size: 5, label: key, color: "blue" });
    }

    var prereqset = 0; // add in all the edges
    var prereqwithinset = 0;
    var prereqkey;
    for (var key in json) {
        for (var i = 0; i < json[key].prereqs.length; i++) {
            for (var j = 0; j < json[key].prereqs[i].length; j++) {
                if (json[key].prereqs[i][j] != 0) {
                    // conditions here are wonky
                    if (!graph.hasNode(json[key].prereqs[i][j]) && !(json[key].prereqs[i][j].substring(0, json[key].sub_dept.length) == json[key].sub_dept)) {
                        // if (json[key].prereqs[i][j].substring(json[key].prereqs[i][j].length - 5) != "AA-ZZ") {
                        //     graph.addNode(json[key].prereqs[i][j]);
                        // }
                        graph.addNode(json[key].prereqs[i][j], { x: x, y: y, size: 5, label: json[key].prereqs[i][j], color: "blue" });
                        x++;
                        if (x == 10) {
                            x = 0;
                            y++;
                        }
                        prereqkey =  prereqset.toString() + '.' + prereqwithinset.toString();
                        if (j + 1 != json[key].prereqs[i].length) {
                            prereqwithinset++;
                        }
                        else if (j + 1 == json[key].prereqs[i].length && i + 1 != json[key].prereqs.length) {
                            prereqset++;
                            prereqwithinset = 0;
                        }
                        else {
                            prereqset = 10 * Math.floor(prereqset / 10) + 10;
                            prereqwithinset = 0;
                            currColor = (currColor + 1) % 6;
                        }
                        graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                            color: colors[currColor]
                        });
                    }
                    else if (graph.hasNode(json[key].prereqs[i][j])) {
                        prereqkey =  prereqset.toString() + '.' + prereqwithinset.toString();
                        if (j + 1 != json[key].prereqs[i].length) {
                            prereqwithinset++;
                        }
                        else if (j + 1 == json[key].prereqs[i].length && i + 1 != json[key].prereqs.length) {
                            prereqset++;
                            prereqwithinset = 0;
                        }
                        else {
                            prereqset = 10 * Math.floor(prereqset / 10) + 10;
                            prereqwithinset = 0;
                            currColor = (currColor + 1) % 6;
                        }
                        graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j], {
                            color: colors[currColor]
                        });
                    }
                }
            }
        }
    }
    var count = 0;
    const map = new Map();
    // for (var node in graph) {
    graph.forEachNode((node) => {
        if (graph.outDegree(node) == 0) {
            map.set(node, 0);
            count++;
        }
        else {
            map.set(node, -1);
        }
    // }
    console.log(map);});

    var sent;
    var max = 1;

    while (count < Object.keys(json).length) {
        graph.forEachNode((node) => {
            max = 1;
            if (map.get(node) == -1) {
                sent = false;
            }
            else {
                sent = true;
            }
            console.log(node + " has neighbors " +  graph.outNeighbors(node));
            graph.outNeighbors(node).forEach(prereq => {
                console.log(prereq + " " + map.get(prereq));
                if (map.get(prereq) != -1 && !sent) {
                    if (max < map.get(prereq)) {
                        max = map.get(prereq);
                    }
                    sent = true;
                    count++;
                }});
            map.set(node, max + 1);
            // for (var prereq in graph.inNeighbors(key)) {
            //     if (map.get(prereq) != -1) {
            //         // map.set(key, map.get(prereq) + 1);
            //         console.log(prereq);
            //         console.log(map.get(prereq) + 1);
            //         count++;
            //         break;
            //     }
            // }
        });
    }


    var i = 0;
    for (var key in json) {
        graph.updateNode(key, attr => {
            return {
              ...attr,
              x: 5 * i,
              y: 10 * map.get(key)
            };
        });
        i++;
    }
    

    graph.forEachNode((node) => {
        var x = node.indexOf(" ");
        if (parseInt(node.substr(x+1)) > 200 || node.substr(node.length - 1) == 'I' || node.substr(node.length - 1) == 'H') {
            graph.dropNode(node);
            map.delete(node);
        }
    });
    console.log(map);

    const numaty = new Map();
    for (var i = 0; i < 10; i++) {
        numaty.set(i, 0);
        graph.forEachNode((node) => {
            console.log(graph.getNodeAttribute(node, y));
            if (map.get(node) == i) {
                numaty.set(i, numaty.get(i) + 1);
            }
        });
    }
    console.log(numaty);

    var counter;
    for (var i = 0; i < 10; i++) {
        counter = 1;
        graph.forEachNode((node) => {
            if (map.get(node) == i) {
                graph.updateNode(node, attr => {
                    return {
                      ...attr,
                      x: counter / numaty.get(i) * 30,
                      y: 3 * map.get(node)
                    };
                });
                counter++;
            }
        });
    }

    graph.forEachNode((node) => {
        var x = node.indexOf(" ");
        if (parseInt(node.substr(x+1)) > 200 || node.substr(node.length - 1) == 'I' || node.substr(node.length - 1) == 'H') {
            graph.dropNode(node);
            map.delete(node);
        }
    });


    // graph.dropNode("MATH 8");
    // graph.dropNode("MATH 6A");
    // graph.dropNode("MATH 4B");
    // graph.dropNode("MATH 6B");
    // graph.dropNode("MATH 4A");
    // graph.dropNode("MATH 2B");
    // graph.dropNode("MATH 2A");
    // graph.dropNode("MATH 3B");
    // graph.dropNode("MATH 3A");
    // graph.dropNode("MATH 34B");
    // graph.dropNode("MATH 34A");
    
    


    return graph;
}
