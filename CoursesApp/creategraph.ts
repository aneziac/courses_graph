import DirectedGraph from 'graphology';

// creates graph w/ negative edge keys for postreq direction and w/ positive edge keys for prereq direction



export default function createGraph(json: JSON) : DirectedGraph {
    const graph = new DirectedGraph();

    var x = 0;
    var i = 0;
    var y = 0;

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
                        }
                        graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j]);
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
                        }
                        graph.mergeDirectedEdgeWithKey(prereqkey, key, json[key].prereqs[i][j]);
                    }
                }
            }
        }
    }
    var count = 0;

    const map = new Map();
    // for (var node in graph) {
    graph.forEachNode((node, attributes) => {
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

    while (count < Object.keys(json).length) {
        graph.forEachNode((node, attributes) => {
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
                    console.log(map.get(prereq) + 1);
                    map.set(node, map.get(prereq) + 1);
                    sent = true;
                    count++;
                }});
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
        console.log(map);

    }


    var i = 0;
    for (var key in json) {
        graph.updateNode(key, attr => {
            return {
              ...attr,
              x: i,
              y: map.get(key)
            };
        });
        i++;
    }

    return graph;
}
