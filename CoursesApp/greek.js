import Graph from 'graphology';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'


function generatePaths() {
    var paths = [];
    var files = fs.readdirSync('data/');
    for (const file of files) {
        if (file.split('.')[1] == 'json') {
            paths.push('./data/' + file);
        }
    }
    return paths;
}

function createGraph(path) {
    const graph = new Graph();

    var json = JSON.parse(fs.readFileSync(path, 'utf8'));

    for (var key in json) {
        graph.addNode(key);
    }

    for (var obj in graph) {
        for (var i = 0; i < json[key].prereqs.length; i++) {
            for (var j = 0; j < json[key].prereqs[i].length; j++) {
                if (json[key].prereqs[i][j] != 0) {
                    if (!graph.hasNode(json[key].prereqs[i][j])) {
                        if (!(json[key].prereqs[i][j].sub_dept == json[key].sub_dept)) {
                            graph.addNode(json[key].prereqs[i][j]);
                            graph.addEdge(key, json[key].prereqs[i][j]);
                        }
                    }
                    else if (graph.hasNode(json[key].prereqs[i][j])) {
                        graph.addEdge(key, json[key].prereqs[i][j]);
                    }
                }
            }
        }
    }

    return graph;
}

var graph = createGraph(../)

// returns Graph with nodes with course names (keys from the json file)
// function createGraph(path) {
//     const graph = new Graph();

//     var json = JSON.parse(fs.readFileSync(path, 'utf8'));

//     for (var key in json) {
//         graph.addNode(key);
//         for (var i = 0; i < json[key].prereqs.length; i++) {
//             for (var j = 0; j < json[key].prereqs[i].length; j++) {
//                 if (json[key].prereqs[i][j] != 0) {
//                     if (!graph.hasNode(json[key].prereqs[i][j])) {
//                         graph.addNode(json[key].prereqs[i][j]);
//                     }
//                     graph.addEdge(key, json[key].prereqs[i][j]);
//                 }
//             }
//         }
//     }
//     return graph;
// }

// returns map with info associated with a particular course
function grabInfo(path, course) {

    var json = JSON.parse(fs.readFileSync(path, 'utf8'));

    const courseInfo = new Map();
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

function main() {
    for (const file of generatePaths()) {
        console.log(file);
        createGraph(file);
        break;
    }
}

const nodePath = path.resolve(process.argv[1]);
const modulePath = path.resolve(fileURLToPath(import.meta.url))
if (nodePath === modulePath) {
    main();
}
