import { CourseGraph } from './CourseGraph';
import exampleData from './exampleData.json';


const courseGraph = new CourseGraph(exampleData);

test('blank data fails', () => {
    expect(() => {
        new CourseGraph(JSON.parse('{}'));
    }).toThrowError();

    expect(() => {
        new CourseGraph(JSON.parse('{ "GREEK 1": {"sub_dept": "GREEK", "prereq_description": ""} }'));
    }).toThrowError();

    expect(() => {
        new CourseGraph(JSON.parse('{ "GREEK 1": {"sub_dept": "GREEK", "prereq_description": "", "prereqs": []} }'));
    }).not.toThrowError();
});

test('nodes constructed', () => {
    expect(courseGraph.graph.hasNode("GREEK 1")).toBe(true);
    expect(courseGraph.graph.hasNode("GREEK 2")).toBe(true);
    expect(courseGraph.graph.hasNode("GREEK 3")).toBe(true);
    expect(courseGraph.graph.hasNode("GREEK 69")).toBe(true);
    expect(courseGraph.graph.hasNode("CLASS 8")).toBe(true);
    expect(courseGraph.graph.hasNode("GREEK 9")).toBe(false);

    expect(courseGraph.graph.order).toBe(6);
});

test('edges constructed', () => {
    expect(courseGraph.graph.hasEdge("GREEK 2", "GREEK 1")).toBe(true);
    expect(courseGraph.graph.hasEdge("GREEK 3", "GREEK 2")).toBe(true);
    expect(courseGraph.graph.hasEdge("GREEK 69", "GREEK 2")).toBe(true);
    expect(courseGraph.graph.hasEdge("GREEK 69", "GREEK 3")).toBe(true);
    expect(courseGraph.graph.hasEdge("GREEK 69", "CLASS 8")).toBe(true);
    expect(courseGraph.graph.hasEdge("GREEK 3", "CLASS 1")).toBe(false);
});

test('nodes colors correct', () => {
    const defaultColor = courseGraph.nodeColors.get("default")!;
    const outsideDept = courseGraph.nodeColors.get("outsideDept")!;
    const noPrereqs = courseGraph.nodeColors.get("noPrereqs")!;
    const instructorConsent = courseGraph.nodeColors.get("instructorConsent")!;

    expect(
        courseGraph.graph.getNodeAttribute("GREEK 1", "color")
    ).toBe(noPrereqs);

    expect(
        courseGraph.graph.getNodeAttribute("GREEK 2", "color")
    ).toBe(defaultColor);

    expect(
        courseGraph.graph.getNodeAttribute("GREEK 3", "color")
    ).toBe(defaultColor);

    expect(
        courseGraph.graph.getNodeAttribute("CLASS 8", "color")
    ).toBe(outsideDept);

    expect(
        courseGraph.graph.getNodeAttribute("GREEK 69", "color")
    ).toBe(instructorConsent);
});

test('edge colors correct', () => {
    let sameColor: string;

    courseGraph.graph.findEdge((_, attr, source, target) => {
        if (source === "GREEK 69" && target === "GREEK 3") {
            sameColor = attr.color;
            return true;
        }
    })

    expect(
        courseGraph.graph.someEdge((_, attr, source, target) => {
            if (source === "GREEK 69" && target === "CLASS 8") {
                return attr.color === sameColor;
            }
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someEdge((_, attr, source, target) => {
            if (source === "GREEK 69" && target === "GREEK 2") {
                return attr.color === sameColor;
            }
        })
    ).toBe(false);
})

test('degree mapping correct', () => {
    const degreeMapping = courseGraph.computeDegreeMapping();

    expect(degreeMapping.get("GREEK 1")).toBe(0);
    expect(degreeMapping.get("GREEK 2")).toBe(1);
    expect(degreeMapping.get("GREEK 3")).toBe(2);
    expect(degreeMapping.get("GREEK 69")).toBe(3);
    expect(degreeMapping.get("CLASS 8")).toBe(0);
    expect(degreeMapping.get("GREEK 200")).toBe(-1);
});

test('position mapping correct', () => {
    expect(courseGraph.graph.getNodeAttribute("GREEK 1", "y")).toBe(0);
    expect(courseGraph.graph.getNodeAttribute("GREEK 2", "y")).toBe(1);
    expect(courseGraph.graph.getNodeAttribute("GREEK 3", "y")).toBe(2);
    expect(courseGraph.graph.getNodeAttribute("GREEK 69", "y")).toBe(3);
    expect(courseGraph.graph.getNodeAttribute("CLASS 8", "y")).toBe(2);
    expect(courseGraph.graph.getNodeAttribute("GREEK 200", "y")).toBe(4);
});
