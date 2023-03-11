import MultiDirectedGraph from 'graphology';
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";


export default function CoursesGraph() {
    const graph = new MultiDirectedGraph();
    graph.addNode('ab');
    graph.addNode('bc');
    graph.addNode('cd');

    graph.addDirectedEdgeWithKey('ab->bc', 'ab', 'bc');
    graph.addDirectedEdgeWithKey('bc->ab', 'bc', 'ab');
    graph.addDirectedEdgeWithKey('bc->cd', 'bc', 'cd');

    return (
        <Sigma graph={graph} settings={{ drawEdges: true, clone: false }}>
        <RelativeSize initialSize={15} />
        <RandomizeNodePositions />
        </Sigma>
    )
}
