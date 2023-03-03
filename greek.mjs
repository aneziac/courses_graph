import Graph from 'graphology';
import * as fs from 'fs';

const graph = new Graph();

var json = JSON.parse(fs.readFileSync('/Users/ashwin/Documents/courses_graph/greek.json', 'utf8'));

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