import DirectedGraph from 'graphology';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'


function getJSON(path: string) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// creates graph w/ negative edge keys for postreq direction and w/ positive edge keys for prereq direction
export default function createGraph(json: JSON) : DirectedGraph {
    const graph = new DirectedGraph();

    var x = 0;
    var y = 0;

    for (var key in json) {
        graph.addNode(key, { x: x, y: y, size: 5, label: key, color: "blue" });
        x += 1;
        if (x == 10) {
            x = 0;
            y++;
        }
    }

    var prereqset = 0;
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
                        graph.mergeEdgeWithKey(prereqkey, key, json[key].prereqs[i][j]);
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
                        graph.mergeEdgeWithKey(prereqkey, key, json[key].prereqs[i][j]);
                    }
                }
            }
        }
    }

    return graph;
}


// returns map with info associated with a particular course
function grabInfo(path: string, course: string) : Map<string, string> {

    var json = JSON.parse(fs.readFileSync(path, 'utf8'));

    const courseInfo: Map<string, string> = new Map();
    courseInfo.set("title", json[course].title);
    courseInfo.set("dept", json[course].dept);
    courseInfo.set("sub_dept", json[course].sub_dept);
    courseInfo.set("number", json[course].number);
    courseInfo.set("prereqs", json[course].prereqs);
    courseInfo.set("comments", json[course].comments);
    courseInfo.set("units", json[course].units);
    courseInfo.set("description", json[course].description);
    courseInfo.set("recommended_prep", json[course].recommended_prep);
    courseInfo.set("professor", json[course].professor);
    courseInfo.set("college", json[course].college);

    return courseInfo;
}

function generatePaths() : Array<string> {
    var paths: Array<string> = [];
    var files = fs.readdirSync('data/');
    for (const file of files) {
        if (file.split('.')[1] == 'json') {
            paths.push('./data/' + file);
        }
    }
    return paths;
}

// below is only called if we run directly with node

function main() {
    var count = 0;
    for (const file of generatePaths()) {
        console.log(file);
        var graph = createGraph(getJSON(file));
        console.log(graph.edges());
        console.log(graph.nodes());
        count += graph.edges().length;
    }
    console.log(count);
}

const nodePath = path.resolve(process.argv[1]);
const modulePath = path.resolve(fileURLToPath(import.meta.url))
if (nodePath === modulePath) {
    main();
}
