import './style.css';
import Sigma from "sigma";
import createGraph from "./creategraph";

var local_json = require('./data/math.json');
const container = document.getElementById("sigma-container") as HTMLElement;

let graph = createGraph(local_json);
const renderer = new Sigma(graph, container) //, {
//     allowInvalidContainer: true
// });
