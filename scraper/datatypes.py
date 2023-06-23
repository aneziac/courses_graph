from dataclasses import dataclass, field
from typing import List
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
    dept: str
    url_abbrev: str
    name: str
    degree: str

    @property
    def file_abbrev(self) -> str:
        stripped = self.name.replace(' - ', ' ').replace(' BA', '').replace(' BS', '')
        words = stripped.lower().split(' ')

        if len(words) == 1:
            base = words[0][:5]

        else:
            base = '_'.join([word[:3] for word in words])

        return base + '_' + self.degree[:2].lower()


@dataclass
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


@dataclass  # hacky way to get property serialization working
class ProbabilityCourse(Course):
    offered_probabilities: List[float] = field(init=False)


@dataclass
class APICourse(ProbabilityCourse):
    offered: List[str]
    general_education_fields: List[str]

    @property
    def offered_probabilities(self) -> List[float]:
        def weight_function(x):
            return x ** 1.2

        start_year = 2018 # int(self.offered[0].split()[1])
        end_year = 2023 # int(self.offered[-1].split()[-1])
        probabilities = [0.0] * 4

        weight_sum = 0
        for year in range(start_year, end_year + 1):
            delta_time = year - start_year + 1
            weight = weight_function(delta_time)
            weight_sum += delta_time * weight

            for i, quarter in enumerate(['Winter', 'Spring', 'Summer', 'Fall']):
                if f'{quarter} {year}' in self.offered:
                    probabilities[i] += delta_time * weight

        for i in range(len(probabilities)):
            probabilities[i] = round(probabilities[i] / weight_sum, 3)

        return probabilities
