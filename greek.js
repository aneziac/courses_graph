import Graph from 'graphology';

const graph = new Graph();

// Adding some nodes
graph.addNode('John');
graph.addNode('Martha');

// Adding an edge
graph.addEdge('John', 'Martha');

// Displaying useful information about your graph
console.log('Number of nodes', graph.order);
console.log('Number of edges', graph.size);

// Iterating over nodes
graph.forEachNode(node => {
  console.log(node);
});