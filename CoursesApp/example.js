import MultiDirectedGraph from 'graphology';
import * as fs from 'fs';

const graph = new MultiDirectedGraph();
graph.addNode('ab');
graph.addNode('bc');
graph.addNode('cd');

graph.addDirectedEdgeWithKey('ab->bc', 'ab', 'bc');
graph.addDirectedEdgeWithKey('bc->ab', 'bc', 'ab');
graph.addDirectedEdgeWithKey('bc->cd', 'bc', 'cd');

console.log(graph.nodes());
console.log(graph.edges());