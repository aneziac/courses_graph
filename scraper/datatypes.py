from dataclasses import dataclass
from typing import List


@dataclass
class Department:
    abbreviation: str
    super_dept: str
    url_abbreviation: str
    full_name: str
    college: str
    api_name: str

    @property
    def file_abbrev(self) -> str:
        dept_words = self.abbreviation.lower().split(' ')

        # fix naming conflict caused by the education department
        if self.super_dept == 'ED':
            file_dept_abbrev = '_'.join(dept_words)
        else:
            file_dept_abbrev = ''.join(dept_words)

        return file_dept_abbrev


@dataclass
class Major:
    name: str
    dept: str

@dataclass
class Course:
    number: str
    sub_dept: str


@dataclass
class WebsiteCourse(Course):
    title: str
    dept: str
    prereqs: List[List[str]]
    prereq_description: str
    comments: str
    units: str
    description: str
    recommended_prep: str
    professor: str
    college: str


@dataclass
class APICourse(Course):
    offered: List[str]
    general_education_fields: List[str]


@dataclass
class MajorCourse(Course):
    majors_required_for: List[str]
    majors_optional_for: List[str]
