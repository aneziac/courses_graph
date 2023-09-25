import { SerializedCourseGraph } from './CourseGraph';


interface Offset {
    node: number,
    offset: number
}

interface AlignmentConstraint {
    type: string,
    axis: 'x' | 'y',
    offsets: Offset[]
}

interface EqualityConstraint {
    axis: 'x' | 'y',
    left: number,
    right: number,
    gap: number,
    equality: boolean
}

type Constraint = AlignmentConstraint | EqualityConstraint;

interface HeightInfo {
    idsAtHeight: number[]
    idOfMaxDegreeAtHeight: number
}

export default function createConstraints(graph: SerializedCourseGraph): Constraint[] {
    let heightMap: Map<number, HeightInfo> = new Map();
    let constraints: Constraint[] = [];

    graph.nodes.forEach(node => {
        let currentMaxDegree = 0;

        if (!heightMap.has(node.y)) {
            heightMap.set(node.y, <HeightInfo>{
                idsAtHeight: [node.id],
                idOfMaxDegreeAtHeight: node.id
            });
            currentMaxDegree = node.adjacent.length;

        } else {
            let heightInfo = heightMap.get(node.y)!;

            heightInfo.idsAtHeight.push(node.id);
            if (node.adjacent.length > currentMaxDegree) {
                heightInfo.idOfMaxDegreeAtHeight = node.id;
                currentMaxDegree = node.adjacent.length;
            }
        }
    });

    let maxY = 0;

    // alignment constraints
    heightMap.forEach(heightInfo => {
        let offsetsY: Offset[] = [];
        heightInfo.idsAtHeight.forEach(id => {
            offsetsY.push({ "node": id, "offset": 0 })
        });

        constraints.push({ "type": "alignment", "axis": "y", "offsets": offsetsY });
        maxY++;
    });

    for (let i = 0; i < maxY - 1; i++) {
        constraints.push({
            "axis": "y",
            "left": heightMap.get(i)!.idOfMaxDegreeAtHeight,
            "right": heightMap.get(i + 1)!.idOfMaxDegreeAtHeight,
            "gap": 300,
            "equality": true
        });
    }

    return constraints;
}
