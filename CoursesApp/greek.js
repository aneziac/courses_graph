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
        graph.addNode(json[key].number);
        for (var prereq in json[key].prereqs) {
            for (var i = 0; i < json[key].prereqs.length; i++) {
                for (var j = 0; j < json[key].prereqs[i].length; j++) {
                    if (json[key].prereqs[i][j] != 0) {
                        var prereqName = json[key].prereqs[i][j];
                        var prereqNum = prereqName.substring(6);
                        graph.addEdge(json[key].number, prereqNum);

                    }
                }
            }
        }
    }

    console.log(graph.nodes());
    console.log(graph.edges());
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


// createGraph('../data/greek.json');

// function createGraphTwo(path) {
//     const graph = new Graph();

//     var json = JSON.parse(fs.readFileSync('../data/greek.json', 'utf8'));

//     for (var key in json) {
//         graph.addNode(json[key]);
//         for (var prereq in json[key].prereqs) {
//             for (var i = 0; i < json[key].prereqs.length; i++) {
//                 for (var j = 0; j < json[key].prereqs[i].length; j++) {
//                     if (json[key].prereqs[i][j] != 0) {
//                         var prereqName = json[key].prereqs[i][j];
//                         var prereqNum = prereqName.substring(6);
//                         for (var keytwo in json) {
//                             if (json[keytwo].number == prereqNum) {

//                             }
//                         }
//                         graph.addEdge(json[key], prereqNum);

//                     }
//                 }
//             }
//         }
//     }

//     console.log(graph.nodes());
//     console.log(graph.edges());
// }