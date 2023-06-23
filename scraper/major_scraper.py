from typing import List
from pypdf import PdfReader
from io import BytesIO
import re
import json
from collections import defaultdict
import logging

from base_scraper import Scraper
from prereq_parser import get_prereqs
from readers import build_majors_list
from datatypes import Major


class MajorScraper(Scraper):
    def __init__(self):
        super().__init__('majors', 'majors')

    def get_major_requirements(self, major: Major) -> List[str]:
        # COE
        if major.dept == 'ENGR':
            response = self.fetch(
                f'https://my.sa.ucsb.edu/catalog/Current/Documents/2022_Majors/ENGR/22-23 {major.url_abbrev} Curriculum Sheet.pdf',
                f'[F] Could not find major requirements sheet for {major.name}'
            )

        # L&S
        else:
            url_major_name = '%20'.join(major.url_abbrev.split())

            response = self.fetch(
                f'https://my.sa.ucsb.edu/catalog/Current/Documents/2022_Majors/LS/{major.dept}/{url_major_name}-2022.pdf',
                f'[F] Could not find major requirements sheet for {major.name} ({major.degree})'
            )

        if not response:
            return []

        reader = PdfReader(BytesIO(response.content))
        text = reader.pages[0].extract_text()
        r_requirements = re.compile('(.*?)\s*\.{2,}')

        without_footer = text.split('MAJOR REGULATIONS')[0]
        requirements = re.findall(r_requirements, without_footer)

        return requirements

    # map inversion so that keys are courses. No longer used but may come in handy later
    def write_major_requirements(self) -> None:
        def pair_of_lists():
            return [[], []]

        major_dict = defaultdict(pair_of_lists)

        for major in build_majors_list():
            course_names = [[], []]
            requirements = self.get_major_requirements(major)

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

    def write_json(self, majors: List[Major]):
        department = majors[0].dept.lower()
        filename = f'data/{self.extra_path}/{department}.json'
        if department in self._EXSTING_JSONS:
            return

        with open(filename, 'w+') as f:
            f.write('{')

            for i, major in enumerate(majors):
                f.write(f'"{major.url_abbrev}": {{')
                f.write(f'"name": "{major.name}", "degree": "{major.degree}", "requirements": ')
                f.write(
                    json.dumps(
                        list(map(get_prereqs, self.get_major_requirements(major)))
                    )
                )

                if i != len(majors) - 1:
                    f.write('},')
                f.write('\n')

            f.write('}}')

        logging.info(f'[S] Wrote data for {major.dept} department in {filename}')


def main():
    ms = MajorScraper()
    dept_majors = []
    current_dept = 'Anth'

    for major in build_majors_list():
        if major.dept != current_dept:
            current_dept = major.dept
            ms.write_json(dept_majors)
            dept_majors.clear()

        dept_majors.append(major)


if __name__ == '__main__':
    main()
