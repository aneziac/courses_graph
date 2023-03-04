import Graph from 'graphology';
import * as fs from 'fs';


function createGraph(path) {
    const graph = new Graph();

    var json = JSON.parse(fs.readFileSync(path, 'utf8'));

    for (var key in json) {
        graph.addNode(key);
        for (var i = 0; i < json[key].prereqs.length; i++) {
            for (var j = 0; j < json[key].prereqs[i].length; j++) {
                if (json[key].prereqs[i][j] != 0) {
                    graph.addEdge(key, json[key].prereqs[i][j]);
                }
            }
        }
    }
    return graph;
}

var graph = createGraph('../data/greek.json');

function grabInfo(path, course) {

    var json = JSON.parse(fs.readFileSync(path, 'utf8'));

    console.log(json[course].title);

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

var courseInfoGreek102 = grabInfo('../data/greek.json', 'GREEK 102');

console.log(courseInfoGreek102.get('title'));
 

// This version creates a graph using the course number instead... bad!

// function createGraph(path) { 
//     const graph = new Graph();

//     var json = JSON.parse(fs.readFileSync(path, 'utf8'));

//     for (var key in json) {
//         graph.addNode(json[key].number);
//             for (var i = 0; i < json[key].prereqs.length; i++) {
//                 for (var j = 0; j < json[key].prereqs[i].length; j++) {
//                     if (json[key].prereqs[i][j] != 0) {
//                         var prereqName = json[key].prereqs[i][j];
//                         var prereqNum = prereqName.substring(6);
//                         graph.addEdge(json[key].number, prereqNum);

//                     }
//                 }
//             }
//     }

//     console.log(graph.nodes());
//     console.log(graph.edges());

//     return graph;
// }

// createGraph('../data/greek.json');

