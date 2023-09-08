import { CourseGraph } from './CourseGraph';


const exampleData = `{
    "GREEK 1": {"number": "1", "sub_dept": "GREEK", "title": "Elementary Greek", "dept": "CLASS", "prereqs": [], "prereq_description": ""},
    "GREEK 2": {"number": "2", "sub_dept": "GREEK", "title": "Elementary Greek", "dept": "CLASS", "prereqs": [["GREEK 1"]], "prereq_description": "Greek 1 with a grade of C or better."},
    "GREEK 3": {"number": "3", "sub_dept": "GREEK", "title": "Intermediate Greek", "dept": "CLASS", "prereqs": [["GREEK 2"]], "prereq_description": "Greek 2 with a grade of C or better."},
    "GREEK 69": {"sub_dept": "GREEK", "prereqs": [["GREEK 2"], ["GREEK 3", "CLASS 8"]], "prereq_description": "Consent of instructor"}
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
})

test('nodes constructed', () => {
    expect(
        courseGraph.graph.someNode((node) => {
            return node === "GREEK 1";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode(node => {
            return node === "GREEK 2";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode(node => {
            return node === "GREEK 3";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode(node => {
            return node === "GREEK 69";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode(node => {
            return node === "CLASS 8";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode(node => {
            return node === "GREEK 9";
        })
    ).toBe(false);
});

test('edges constructed', () => {
    expect(
        courseGraph.graph.someEdge((_, __, source, target) => {
            return source === "GREEK 2" && target === "GREEK 1";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someEdge((_, __, source, target) => {
            return source === "GREEK 3" && target === "GREEK 2";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someEdge((_, __, source, target) => {
            return source === "GREEK 69" && target === "GREEK 2";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someEdge((_, __, source, target) => {
            return source === "GREEK 69" && target === "GREEK 3";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someEdge((_, __, source, target) => {
            return source === "GREEK 69" && target === "CLASS 8";
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someEdge((_, __, source, target) => {
            return source === "GREEK 3" && target === "CLASS 1";
        })
    ).toBe(false);
});

test('nodes colors correct', () => {
    let defaultColor = courseGraph.nodeColors.get("default");
    let outsideDept = courseGraph.nodeColors.get("outsideDept");
    let noPrereqs = courseGraph.nodeColors.get("noPrereqs");
    let instructorConsent = courseGraph.nodeColors.get("instructorConsent");

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 1" && attr.color === noPrereqs;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 2" && attr.color === defaultColor;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 3" && attr.color === defaultColor;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "CLASS 8" && attr.color === outsideDept;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 69" && attr.color === instructorConsent;
        })
    ).toBe(true);
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

    expect(
        degreeMapping.get("GREEK 1") === 0 &&
        degreeMapping.get("GREEK 2") === 1 &&
        degreeMapping.get("GREEK 3") === 2 &&
        degreeMapping.get("GREEK 69") === 3 &&
        degreeMapping.get("CLASS 8") === 0
    ).toBe(true);
});

test('position mapping correct', () => {
    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 1" && attr.y === 0;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 2" && attr.y === 1;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 3" && attr.y === 2;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "GREEK 69" && attr.y === 3;
        })
    ).toBe(true);

    expect(
        courseGraph.graph.someNode((node, attr) => {
            return node === "CLASS 8" && attr.y === 0;
        })
    ).toBe(true);
});
