from dotenv import load_dotenv
from typing import Dict, List
import logging
import os

from base_scraper import Scraper
from readers import build_depts_list
from datatypes import Department, APICourse, defaultdict_pair


class UCSB_API_Client(Scraper):
    def __init__(self):
        super().__init__('UCSB API')
        self._quarters = ['Winter', 'Spring', 'Summer', 'Fall']

    def get_offered_courses(self, dept: Department, start_year=2020, end_year=2023) -> Dict[str, Dict[str, List[str]]]:
        offered_courses: Dict[str, Dict[str, List[str]]] = {}

        # Look up when courses are offered

        for year in range(start_year, end_year + 1):
            for quarter_i in range(4):
                if year >= 2023 and quarter_i >= 3:  # can't see into the future
                    break

                quarter = f'{self._quarters[quarter_i]} {year}'
                quarter_code = str(year) + str(quarter_i + 1)

                offered_courses[quarter] = self.parse_courses_json(
                    self.get_courses_json(quarter_code, dept.api_name)
                )

        return offered_courses

    def get_courses_json(self, quarter: str, dept: str = '', page_number: int = 1) -> Dict:
        load_dotenv()

        try:
            ucsb_api_key = os.environ['UCSB_API_KEY']

        except KeyError:
            logging.error('Ensure you have access to the API key')
            quit()

        headers = {
            'accept': 'application/json',
            'ucsb-api-version': '3.0',
            'ucsb-api-key': ucsb_api_key,
        }
        params = {
            'quarter': quarter,
            'pageNumber': str(page_number),
            'pageSize': '500'
        }
        if dept:
            params['deptCode'] = dept

        response = self.fetch(
            'https://api.ucsb.edu/academics/curriculums/v3/classes/search',
            f'Could not access UCSB API data for {quarter} {dept}',
            params=params,
            headers=headers
        )
        if not response:
            return {}

        return response.json()

    def parse_courses_json(self, courses: dict) -> Dict[str, List[str]]:
        offered_courses = {}

        classes = courses['classes']
        for cls in classes:
            offered_courses[cls['courseId'].split()[1]] = \
                list(set([x['geCode'].strip() for x in cls['generalEducation']]))

        return offered_courses

    def write_json(self, dept: Department, overwrite=False) -> None:
        filename = f'data/api/{dept.file_abbrev}.json'

        offered_courses = self.get_offered_courses(dept)

        # store courses in a dict first to take advantage of defaultdict
        courses_dict: Dict[str, List[List[str]]] = defaultdict_pair
        courses_list: List[APICourse] = []

        for i, quarter in enumerate(offered_courses.keys()):
            for number in offered_courses[quarter]:
                courses_dict[number][0].append(quarter)

                if i == 0:
                    courses_dict[number][1] = offered_courses[quarter][number]


        for number in courses_dict:
            courses_list.append(APICourse(number, dept.abbreviation, courses_dict[number][0], courses_dict[number][1]))

        super().write_json(filename, courses_list)


if __name__ == '__main__':
    client = UCSB_API_Client()

    for dept in build_depts_list():
        client.write_json(dept, overwrite=client.overwrite)

    # use subjectArea field
    # print(client.get_courses_json('20233', 'GERSL'))
