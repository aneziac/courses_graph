from dataclasses import dataclass
import re


@dataclass(frozen=True)
class Department:
    abbreviation: str
    super_dept: str
    url1: str
    url2: str
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
    dept: Department
    full_name: str
    short_name: str
    degree: str

    @property
    def file_abbrev(self) -> str:
        stripped = self.short_name.replace(' - ', ' ').replace(' BA', '').replace(' BS', '')
        words = stripped.lower().split(' ')

        if len(words) == 1:
            base = words[0][:5]

        else:
            base = '_'.join([word[:3] for word in words])

        return base + '_' + self.degree[:2].lower()


@dataclass
class Course:
    number: str
    dept: Department

    # define a logical well-ordering on this set
    @property
    def order(self) -> int:
        digits = re.sub(r'\D', '', self.number)
        letters = re.sub(r'\d', '', self.number)

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
    units: str
    description: str
    prereq_description: str
    prereqs: list[list[str]]
