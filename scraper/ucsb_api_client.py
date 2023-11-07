from dotenv import load_dotenv
import logging
import os
from collections import defaultdict

from base_scraper import Scraper
from readers import build_depts_list
from datatypes import Department, APICourse


class UCSB_API_Client(Scraper):
    def __init__(self):
        super().__init__('UCSB API', 'api')
        self._quarters = ['Winter', 'Spring', 'Summer', 'Fall']

    def get_offered_courses(self, dept: Department, start_year=2018, end_year=2023) -> dict[str, dict[str, list[str]]]:
        offered_courses: dict[str, dict[str, list[str]]] = {}

        # Look up when courses are offered

        for year in range(start_year, end_year + 1):
            for quarter_i in range(4):
                if year >= 2024: # and quarter_i >= 3:  # can't see into the future
                    break

                quarter = f'{self._quarters[quarter_i]} {year}'
                quarter_code = str(year) + str(quarter_i + 1)

                offered_courses[quarter] = self.parse_courses_json(
                    self.get_courses_json(quarter_code, dept.api_name), dept.abbreviation
                )

        return offered_courses

    def get_courses_json(self, quarter: str, dept: str = '', page_number: int = 1) -> dict:
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

    def parse_courses_json(self, courses: dict, dept: str) -> dict[str, list[str]]:
        offered_courses = {}

        classes = courses['classes']
        for cls in classes:
            split_course =  cls['courseId'].rstrip().split()
            dept_name, number = ' '.join(split_course[:-1]), split_course[-1]

            if dept_name != dept:
                continue
            offered_courses[number] = list(set([x['geCode'].strip() for x in cls['generalEducation']]))

        return offered_courses

    def write_json(self, dept: Department) -> None:
        def pair_of_lists():
            return [[], []]

        if not self.write(dept):
            return

        offered_courses = self.get_offered_courses(dept)

        # store courses in a dict first to take advantage of defaultdict
        courses_dict: dict[str, list[list[str]]] = defaultdict(pair_of_lists)
        courses_list: list[APICourse] = []

        for quarter in offered_courses.keys():
            for number in offered_courses[quarter]:
                courses_dict[number][0].append(quarter)

                ge_info = offered_courses[quarter][number]
                if ge_info and not courses_dict[number][1]:
                    courses_dict[number][1] = ge_info

        for number in courses_dict:
            courses_list.append(APICourse(number, dept.abbreviation, courses_dict[number][0], courses_dict[number][1]))

        super().write_json(dept, courses_list)


def main():
    client = UCSB_API_Client()

    for dept in build_depts_list():
        if dept.abbreviation == 'MATH':
            print(client.get_offered_courses(dept))
        # client.write_json(dept)


if __name__ == '__main__':
    main()
