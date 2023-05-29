from dataclasses import dataclass
# from datalite import datalite # used for SQL integration but for now we're using JSON
from typing import List


@dataclass
class Department:
    abbreviation: str
    super_dept: str
    url_abbreviation: str
    full_name: str
    college: str


# @datalite(db_path="data/courses.db")
@dataclass
class WebsiteCourse:
    title: str
    dept: str
    # sub_dept: str
    number: str
    prereqs: List[List[str]]
    prereq_description: str
    comments: str
    units: str
    description: str
    recommended_prep: str
    professor: str
    # college: str
    # offered: List[str]
    # majors_required_for: List[str]
    # majors_optional_for: List[str]
    # general_education_fields: List[str]


@dataclass
class APICourse:
    quarter: str
    year: int
    general_education_fields: List[str]


@dataclass
class Major:
    name: str
    degree_type: str
    dept: Department
    courses: List[List[str]]


@dataclass
class Course:
    title: str
    dept: str
    sub_dept: str
    number: str
    prereqs: List[List[str]]
    prereq_description: str
    comments: str
    units: str
    description: str
    recommended_prep: str
    professor: str
    college: str
    # offered: List[str]
    # majors_required_for: List[str]
    # majors_optional_for: List[str]
    # general_education_fields: List[str]
