from dataclasses import dataclass
from typing import List, Dict
import re


@dataclass(frozen=True)
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


@dataclass(frozen=True)
class Major:
    name: str
    dept: str


@dataclass(frozen=True)
class Course:
    number: str
    sub_dept: str

    # define a logical well-ordering on this set
    @property
    def order(self) -> int:
        digits = re.sub('\D', '', self.number)
        letters = re.sub('\d', '', self.number)

        letter_contribution = 0
        if letters:
            for i, letter in enumerate(letters):
                letter_contribution += (26 ** (len(letters) - i)) * (ord(letter) - ord('A'))


        if not digits:
            return -1
        return int(digits) * (26 ** 4) + letter_contribution


@dataclass(frozen=True)
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


@dataclass(frozen=True)
class APICourse(Course):
    offered: List[str]
    general_education_fields: List[str]


@dataclass(frozen=True)
class MajorCourse(Course):
    majors_required_for: List[str]
    majors_optional_for: List[str]
