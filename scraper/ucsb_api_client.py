from dotenv import load_dotenv
from typing import Dict, List
import logging
import os
import requests


def get_offered_courses(dept: str, start_year=2020, end_year=2023) -> Dict[str, Dict[str, List[str]]]:
    offered_courses: Dict[str, Dict[str, List[str]]] = {}
    quarters = ['Winter', 'Spring', 'Summer', 'Fall']

    # Look up when courses are offered

    for year in range(start_year, end_year + 1):
        for quarter_i in range(4):
            if year >= 2023 and quarter_i >= 3:  # can't see into the future
                break

            quarter = f'{quarters[quarter_i]} {year}'
            quarter_code = str(year) + str(quarter_i + 1)

            offered_courses[quarter] = parse_courses_json(
                get_courses_json(quarter_code, dept)
            )

    return offered_courses


def get_courses_json(quarter: str, dept: str = '', page_number: int = 1) -> Dict:
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
        'deptCode': dept,
        'pageNumber': str(page_number),
        'pageSize': '500'
    }
    if dept:
        params['deptCode'] = dept

    response = requests.get('https://api.ucsb.edu/academics/curriculums/v3/classes/search', params=params, headers=headers)

    if response.status_code != 200:
        raise RuntimeError('Could not get data for ', page_number)

    return response.json()


def parse_courses_json(courses: dict) -> Dict[str, List[str]]:
    offered_courses = {}

    classes = courses['classes']
    for cls in classes:
        offered_courses[cls['courseId'].split()[1]] = \
            list(set([x['geCode'].strip() for x in cls['generalEducation']]))

    return offered_courses

            # ges: List[str] = []

            # # come back to this algorithm - gotta be a better way
            # quarters_offered = []
            # for i, quarter in enumerate(offered_courses.keys()):
            #     if number in offered_courses[quarter]:
            #         quarters_offered.append(quarter)
            #         if i == 0:
            #             ges = offered_courses[quarter][number]
