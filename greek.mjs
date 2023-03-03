import Graph from 'graphology';
import * as fs from 'fs';

const graph = new Graph();

var json = JSON.parse(fs.readFileSync('/Users/ashwin/Documents/courses_graph/greek.json', 'utf8'));

for (var key in json.jsonData) {
    graph.addNode(key);
    for (var prereqs in json.jsonData[key][5]) {
        graph.addEdge(key, prereqs);
    }
}
