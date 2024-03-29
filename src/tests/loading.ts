// node file used to test which depts load correctly
import { CourseGraph } from '../CourseGraph';
import { WebsiteCourseJSON } from '../jsontypes';
import { readdirSync, readFileSync } from 'fs';


readdirSync('./public/data/website').forEach(file => {
    const courses = JSON.parse(readFileSync('./public/data/website/' + file, 'utf-8'));
    try {
        new CourseGraph(file.replace('.json', ''), courses as WebsiteCourseJSON);
    } catch (e) {
        console.error(`${file} failed because of ${e}`);
    }
});
