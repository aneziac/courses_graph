// see ../scraper/datatypes.py

interface Course {
    number?: string,
    sub_dept: string
}

export interface WebsiteCourse extends Course {
    title?: string,
    dept?: string,
    prereqs: Array<Array<string>>,
    prereq_description: string,
    comments?: string,
    units?: string,
    description?: string,
    recommended_prep?: string,
    professor?: string,
    college?: string
}

export interface APICourse extends Course {
    offered_probabilities: number[];
    offered: string[];
    general_education_fields: string[];
}

export interface Major {
    dept: string,
    url_abbrev: string,
    name: string,
    degree: string,
    sub_dept: string
}

export type WebsiteCourseJSON = {[key: string]: WebsiteCourse}
export type APICourseJSON = {[key: string]: APICourse}
