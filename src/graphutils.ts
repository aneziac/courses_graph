/*
This is now debugging code only since the javascript has to run client-side.
Use node --loader ts-node/esm ./graphutils.ts
*/

import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'
import createGraph from './creategraph'


function getJSON(path: string) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// returns map with info associated with a particular course
function grabInfo(path: string, course: string) : Map<string, string> {

    var json = JSON.parse(fs.readFileSync(path, 'utf8'));

    const courseInfo: Map<string, string> = new Map();
    courseInfo.set("title", json[course].title);
    courseInfo.set("dept", json[course].dept);
    courseInfo.set("sub_dept", json[course].sub_dept);
    courseInfo.set("number", json[course].number);
    courseInfo.set("prereqs", json[course].prereqs);
    courseInfo.set("comments", json[course].comments);
    courseInfo.set("units", json[course].units);
    courseInfo.set("description", json[course].description);
    courseInfo.set("recommended_prep", json[course].recommended_prep);
    courseInfo.set("professor", json[course].professor);
    courseInfo.set("college", json[course].college);

    return courseInfo;
}

function generatePaths() : Array<string> {
    var paths: Array<string> = [];
    var files = fs.readdirSync('data/');
    for (const file of files) {
        if (file.split('.')[1] == 'json') {
            paths.push('./data/' + file);
        }
    }
    return paths;
}

// below is only called if we run directly with node

function main() {
    var count = 0;
    for (const file of generatePaths()) {
        console.log(file);
        var graph = createGraph(getJSON(file));
        console.log(graph.edges());
        console.log(graph.nodes());
        count += graph.edges().length;
    }
    console.log(count);
}

const nodePath = path.resolve(process.argv[1]);
const modulePath = path.resolve(fileURLToPath(import.meta.url))
if (nodePath === modulePath) {
    main();
}