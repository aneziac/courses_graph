from typing import List
from pypdf import PdfReader
from io import BytesIO
import re
import json
from collections import defaultdict

from base_scraper import Scraper
from prereq_parser import get_prereqs
from readers import build_majors_list


class MajorScraper(Scraper):
    def __init__(self):
        super().__init__('majors')

    def get_major_requirements(self, dept_name: str, major_name: str) -> List[str]:
        if 'Emphasis' in major_name:
            base_name, emphasis = major_name.split('-')
            url_major_name = '%20'.join(base_name.split()) + '%20Major-' + '%20'.join(emphasis.split())

        else:
            url_major_name = '%20'.join(major_name.split()) + '%20Major'

        response = self.fetch(
            f'https://my.sa.ucsb.edu/catalog/Current/Documents/2022_Majors/LS/{dept_name}/{url_major_name}-2022.pdf',
            f'Could not find major requirements sheet for {major_name} in the {dept_name} department'
        )

        if not response:
            return []

        reader = PdfReader(BytesIO(response.content))
        text = reader.pages[0].extract_text()
        r_requirements = re.compile('(.*?)\s*\.{2,}')

        without_footer = text.split('MAJOR REGULATIONS')[0]
        requirements = re.findall(r_requirements, without_footer)

        return requirements

    def write_major_requirements(self):
        def pair_of_lists():
            return [[], []]

        major_dict = defaultdict(pair_of_lists)

        for major in build_majors_list()[:3]:
            course_names = [[], []]
            requirements = self.get_major_requirements(major.dept, major.name)

            for req in requirements:
                for and_list in get_prereqs(req.replace(' -', '-') + '.'):
                    if len(and_list) == 1:
                        course_names[0].append(and_list[0])
                    else:
                        for course in and_list:
                            course_names[1].append(course)

            for i in range(2):
                for course in course_names[i]:
                    major_dict[course][i].append(major.name)

        with open('scraper/major_courses.json', 'w+') as major_courses:
            major_courses.write(json.dumps(major_dict))


# method of interaction with major data
# def majors_required(self, course: str) -> Tuple[List[str], List[str]]:
#     major_courses: dict = json.load(open('scraper/major_courses.json'))
#     try:
#         return major_courses[course]
#     except KeyError:
#         return ([], [])
# required_for, optional_for = self.majors_required(f'{dept.abbreviation} {number}')

if __name__ == '__main__':
    ms = MajorScraper()
    ms.write_major_requirements()
    # print(ms.get_major_requirements('Anth', 'Anthropology'))
