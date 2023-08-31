import { CourseGraph } from './CourseGraph';


const exampleData = `{
    "GREEK 1": {"number": "1", "sub_dept": "GREEK", "title": "Elementary Greek", "dept": "CLASS", "prereqs": [], "prereq_description": "", "comments": "", "units": "5", "description": "The beginning course in classical Greek and first in a three-quarter   sequence introducing fundamentals of grammar, syntax, and reading skills.  Concepts taught using written exercises. Interesting aspects of Ancient  Greek society are introduced.", "recommended_prep": "", "professor": "STAFF", "college": "L&S"},
    "GREEK 2": {"number": "2", "sub_dept": "GREEK", "title": "Elementary Greek", "dept": "CLASS", "prereqs": [["GREEK 1"]], "prereq_description": "Greek 1 with a grade of C or better.", "comments": "", "units": "5", "description": "A continuation of Greek 1. Emphasis on mastering grammar and building  vocabulary.", "recommended_prep": "", "professor": "STAFF", "college": "L&S"},
    "GREEK 3": {"number": "3", "sub_dept": "GREEK", "title": "Intermediate Greek", "dept": "CLASS", "prereqs": [["GREEK 2"]], "prereq_description": "Greek 2 with a grade of C or better.", "comments": "", "units": "5", "description": "A continuation of Greek 2. Emphasis on building a working vocabulary and the syntax of complex sentences. Readings in classical prose introduce   students to ancient Greek literature and culture.", "recommended_prep": "", "professor": "STAFF", "college": "L&S"}
}`

let graph = new CourseGraph(JSON.parse(exampleData));

test('nodes constructed', () => {
    expect(0).toBe(0);
});

test('edges constructed', () => {
    expect(0).toBe(0);
});

test('nodes colors correct', () => {
    expect(0).toBe(0);
});

test('degree mapping correct', () => {
    expect(0).toBe(0);
});

test('position mapping correct', () => {
    expect(0).toBe(0);
});
