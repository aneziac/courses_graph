import { CourseGraph } from './CourseGraph';


const exampleData = `{
    "GREEK 1": {"number": "1", "sub_dept": "GREEK", "title": "Elementary Greek", "dept": "CLASS", "prereqs": [], "prereq_description": ""},
    "GREEK 2": {"number": "2", "sub_dept": "GREEK", "title": "Elementary Greek", "dept": "CLASS", "prereqs": [["GREEK 1"]], "prereq_description": "Greek 1 with a grade of C or better."},
    "GREEK 3": {"number": "3", "sub_dept": "GREEK", "title": "Intermediate Greek", "dept": "CLASS", "prereqs": [["GREEK 2"]], "prereq_description": "Greek 2 with a grade of C or better."},
    "GREEK 69": {"sub_dept": "GREEK", "prereqs": [["GREEK 2"], ["GREEK 3", "CLASS 8"]], "prereq_description": "Consent of instructor"},
    "GREEK 200": {"sub_dept": "GREEK", "prereqs": [], "prereq_description": ""}
}`

let courseGraph = new CourseGraph(JSON.parse(exampleData));

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
    let defaultColor = courseGraph.nodeColors.get("default")!;
    let outsideDept = courseGraph.nodeColors.get("outsideDept")!;
    let noPrereqs = courseGraph.nodeColors.get("noPrereqs")!;
    let instructorConsent = courseGraph.nodeColors.get("instructorConsent")!;

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
    let degreeMapping = courseGraph.computeDegreeMapping();

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
