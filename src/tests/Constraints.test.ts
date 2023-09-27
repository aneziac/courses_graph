import createConstraints from "../Constraints";
import exampleData from './exampleData.json';
import { CourseGraph } from '../CourseGraph';


const courseGraph = new CourseGraph('greek', exampleData);
const graph = courseGraph.getGraphNumericId();
const constraints = createConstraints(graph);


function getId(name: string): number {
    let id = -1;
    graph.nodes.forEach(node => {
        if (name === node.name) {
            id = node.id;
            return;
        }
    });
    return id;
}

test('getId working', () => {
    expect(getId("HELLO 8")).toBe(-1);
    expect(getId("GREEK 1")).toBe(0);
})


test('alignment constraints created', () => {
    expect(constraints[0])
    .toStrictEqual({"type": "alignment", "axis": "y", "offsets": [
            { node: getId("GREEK 1"), offset: 0 }
        ]}
    );

    expect(constraints[1])
    .toStrictEqual({"type": "alignment", "axis": "y", "offsets": [
            { node: getId("GREEK 2"), offset: 0 }
        ]}
    );

    expect(constraints[2])
    .toStrictEqual({"type": "alignment", "axis": "y", "offsets": [
            { node: getId("GREEK 3"), offset: 0 },
            { node: getId("CLASS 8"), offset: 0 }
        ]}
    );

    expect(constraints[3])
    .toStrictEqual({"type": "alignment", "axis": "y", "offsets": [
            { node: getId("GREEK 69"), offset: 0 }
        ]}
    );

    expect(constraints[4])
    .toStrictEqual({"type": "alignment", "axis": "y", "offsets": [
            { node: getId("GREEK 200"), offset: 0 }
        ]}
    );
});

test.skip('equality constraints created', () => {
    expect(constraints[5])
    .toStrictEqual({"axis": "y", "left": getId("GREEK 1"), "right": getId("GREEK 2"), "gap": 300, "equality": true});

    expect(constraints[6])
    .toStrictEqual({"axis": "y", "left": getId("GREEK 2"), "right": getId("GREEK 3"), "gap": 300, "equality": true});

    expect(constraints[7])
    .toStrictEqual({"axis": "y", "left": getId("GREEK 3"), "right": getId("GREEK 69"), "gap": 300, "equality": true});

    expect(constraints[8])
    .toStrictEqual({"axis": "y", "left": getId("GREEK 69"), "right": getId("GREEK 200"), "gap": 300, "equality": true});

    expect(constraints.length === 9);
});
