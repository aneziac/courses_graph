from bs4 import BeautifulSoup as bs
import json
import re
import csv
import requests
from dataclasses import dataclass, asdict
# from datalite import datalite
from typing import List
import os
import logging
import sys
import shutil
from dotenv import load_dotenv


@dataclass
class Department:
    abbreviation: str
    super_dept: str
    url_abbreviation: str
    full_name: str
    college: str


# @datalite(db_path="data/courses.db")
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
    offered: List[str]


def build_depts_list():
    depts_list: List[Department] = []

    with open('scraper/depts.csv') as f:
        reader = csv.reader(f)
        for line in reader:
            line = [x.strip() for x in line]

            depts_list.append(
                Department(
                    abbreviation=line[0],
                    super_dept=line[1],
                    url_abbreviation=line[2],
                    full_name=line[3],
                    college=line[4],
                )
            )

    return depts_list

    # sort departments when new ones are added (no longer needed)
    if False:
        with open('scraper/sorted_depts.csv', 'w') as g:
            for line in sorted(DEPTS, key=lambda x: x.abbreviation):
                vals = asdict(line).values()
                g.write(', '.join(vals) + '\n')


def compile_data(url: str, dept: Department) -> List[Course]:
    r = requests.get(url)

    try:
        assert 200 == r.status_code
    except AssertionError:
        logging.warning(f'[F] Failed to retrieve data for {dept.full_name} at {url}')
        return []

    soup = bs(r.text, features='html.parser')

    result: List[Course] = []

    # Regex generation

    r_abbrev = '\s+'.join(dept.abbreviation.split())
    r_abbrev = r_abbrev.replace('&', '\&amp;')

    r_dept = re.compile(rf'(<b>|AndTitle">)\s+({r_abbrev})\s+.*\.')
    r_description = re.compile(r'(div>|2px;">)\s+(.*\.)\s+<\/div>')
    r_number = re.compile(rf'{r_abbrev}\s+(.*)\.')
    r_prereqs = re.compile(r'Prerequisite:<\/strong> (.*\.)')
    r_units = re.compile(r'\((\d\-*\d*)\)')
    r_comments = re.compile(r'Enrollment Comments:<\/strong> (.*\.)')
    r_title = re.compile(r'(CourseDisplay">\s+|\d{1,3}[A-Z]*\.\s+)([A-Z][^<]*[a-z\)I])\s+(<\/s|<\/b)')
    r_professor = re.compile(r'\(\d\-*\d*\)\s+(.*)\s*<\/')
    r_recommended_prep = re.compile(r'Preparation:<\/strong> (.*\.)<div')

    # Open a file used for debugging
    f = open('scraper/raw.txt', 'w+')

    offered_courses = parse_courses_json(get_courses_json("20232", dept.abbreviation))

    for all_course_info in soup.find_all('div', class_='CourseDisplay'):
        all_course_info = str(all_course_info)
        f.write(all_course_info)

        course_dept = re.findall(r_dept, all_course_info)
        if not course_dept or len(course_dept[0]) < 2:
            continue

        # Apply our compiled regex to a specific course div
        description = re.findall(r_description, all_course_info)
        number = re.findall(r_number, all_course_info)
        prereq_description = re.findall(r_prereqs, all_course_info)
        units = re.findall(r_units, all_course_info)
        comments = re.findall(r_comments, all_course_info)
        title = re.findall(r_title, all_course_info)
        professor = re.findall(r_professor, all_course_info)
        recommended_prep = re.findall(r_recommended_prep, all_course_info)

        if prereq_description:
            prereqs = get_prereqs(prereq_description[0],
                                  f'{dept.abbreviation} {number[0] if number else ""}')
        else:
            prereqs = list()

        description_str = description[0][1] if description else ''
        description_str = description_str.replace('   ', ' ')

        comments_str = comments[0] if comments else ''
        comments_str = comments_str.replace('   ', ' ')

        number_str = number[0] if number else ''

        result.append(
            Course(
                dept=dept.super_dept,
                sub_dept=dept.abbreviation,
                number=number_str,
                prereqs=prereqs,
                prereq_description=(prereq_description[0] if prereq_description else ''),
                comments=comments_str,
                units=(units[0] if units else ''),
                description=description_str,
                title=(title[0][1] if title else ''),
                professor=(professor[0].strip() if professor else ''),
                recommended_prep=(recommended_prep[0] if recommended_prep else ''),
                college=dept.college,
                offered=(['Spring 2023'] if number_str in offered_courses else [])
            )
        )

    f.close()
    return result


def get_prereqs(prereq_description: str, course_name: str = '') -> List[List[str]]:
    current_dept = ''
    and_together = []
    or_together = []
    seen_and = False
    seen_or = False

    for term in re.split(r'(?<=\s)(\d+[A-Z\-]*)(?!u)(?!\.\d)', prereq_description):
        if not term:
            return []

        # check for text in between that
        if not ('0' <= term[0] and '9' >= term[0]):
            if dept := get_dept(term):
                current_dept = dept

            if 'and ' in term:
                seen_and = True
            if 'or ' in term:
                seen_or = True

        # we have a course number
        else:
            if not current_dept:
                continue

            if '-' in term and not 'AA-ZZ' in term:
                end_of_number_i = term.index('-') - 1
                first_req_letter = ord(term[end_of_number_i])
                last_req_letter = ord(term[-1])

                for sequence_letter in range(first_req_letter, last_req_letter + 1):
                    and_together.append([f'{current_dept} {term[:end_of_number_i]}{chr(sequence_letter)}'])

            elif (name := f'{current_dept} {term}') != course_name:
                or_together.append(name)

        if (',' in term and ', or' not in term) or 'and' in term and not '-' in term:
            if or_together:
                and_together.append(or_together.copy())
            or_together.clear()

    if or_together:
        and_together.append(or_together)

    if seen_or and not seen_and and len(and_together) > 1:
        courses = []
        for course_singleton in and_together:
            for course in course_singleton:
                courses.append(course)
        return [courses]

    return and_together


def get_dept(prereq_substr: str) -> str:
    # returns empty string if dept cannot be found

    # handle CCS courses separately
    if ' CS ' in prereq_substr:
        for dept in DEPTS:
            if dept.college == 'CCS' and dept.super_dept in prereq_substr.upper():
                return dept.abbreviation

    # traverse depts in backwards order to avoid naming conflicts
    for dept in DEPTS:
        name_variations = [dept.abbreviation.lower().capitalize(), dept.abbreviation, dept.full_name]

        for name_variation in name_variations:
            if name_variation + ' ' in prereq_substr + ' ':
                return dept.abbreviation

    return ''


def dept_to_url(dept: Department) -> str:
    base_url = 'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments'
    url = ''

    if dept.college == 'L&S':
        if dept.abbreviation == 'DYNS':
            url = f'{base_url}/{dept.url_abbreviation}.aspx?DeptTab=Courses'
        else:
            url = f'{base_url}/ls-intro/{dept.url_abbreviation}.aspx?DeptTab=Courses'

    elif dept.college == 'COE':
        if dept.abbreviation == 'BIOE':
            url = f'{base_url}/{dept.url_abbreviation}.aspx?DeptTab=Courses'
        else:
            url = f'{base_url}/coe/{dept.url_abbreviation}.aspx?DeptTab=Courses'

    elif dept.college == 'CCS':
        url = f'{base_url}/{dept.url_abbreviation}/Courses.aspx'
    elif dept.college == 'GGSE':
        url = f'{base_url}/ggse/{dept.url_abbreviation}.aspx?DeptTab=Courses'
    elif dept.college == 'BREN':
        url = f'{base_url}/{dept.url_abbreviation}/?DeptTab=Courses'

    if not url:
        raise Exception(f'Could not get url for {dept.full_name}')

    return url


def write_json(dept: Department, overwrite=False):
    dept_words = dept.abbreviation.lower().split(' ')
    if dept.super_dept == 'ED':
        file_dept_abbrev = '_'.join(dept_words)
    else:
        file_dept_abbrev = ''.join(dept_words)

    if not overwrite and file_dept_abbrev in EXISTING_JSONS:
        return

    url = dept_to_url(dept)
    filename = f"CoursesApp/data/{file_dept_abbrev}.json"

    courses = compile_data(url, dept)
    if not courses:
        logging.warning(f'[F] Failed to retrieve data for {dept.full_name}')
        return

    with open(filename, 'w') as f:
        f.write('{')

        courses = compile_data(url, dept)

        for i, course in enumerate(courses):
            # course.create_entry()
            f.write(f'"{course.sub_dept} {course.number}": ')
            f.write(json.dumps(asdict(course)))

            if i != len(courses) - 1:
                f.write(',')
            f.write('\n')

        f.write('}')

    logging.info(f'[S] Wrote data for {dept.full_name} department in {filename}')


def get_existing_jsons() -> List[str]:
    base_path = './CoursesApp/data'
    try:
        ls = os.listdir(base_path)
    except FileNotFoundError:
        ls = os.listdir('.' + base_path)

    return [item[:-5] for item in ls]


def get_courses_json(quarter: str, dept: str) -> str:
    load_dotenv()

    try:
        ucsb_api_key = os.environ['UCSB_API_KEY']
    except KeyError:
        print("Ensure you have access to the API key")
        quit()

    headers = {
        'accept': 'application/json',
        'ucsb-api-version': '3.0',
        'ucsb-api-key': ucsb_api_key,
    }
    params = {
        'quarter': quarter,
        'deptCode': dept,
        'pageNumber': '1',
        'pageSize': '500'
    }

    response = requests.get('https://api.ucsb.edu/academics/curriculums/v3/classes/search', params=params, headers=headers)
    return response.json()


def parse_courses_json(courses: dict) -> List[str]:
    offered_courses = []

    classes = courses['classes']
    for cls in classes:
        offered_courses.append(cls['courseId'].split()[1])
        # offered_courses.append(' '.join(cls['courseId'].split()))

    return offered_courses


DEPTS: List[Department] = build_depts_list()
EXISTING_JSONS: List[str] = get_existing_jsons()


def main(argv: List[str]):
    overwrite = (len(argv) > 1 and 'o' in argv[1])
    print(f'Performing scraping with overwrite={overwrite}')

    logging.basicConfig(
        format='[%(asctime)s] %(message)s',
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S',
        handlers=[
            logging.FileHandler('scraper.log'),
            logging.StreamHandler()
        ]
    )

    if overwrite and 'c' in argv[1]:
        try:
            shutil.rmtree('CoursesApp/data')
        except FileNotFoundError:
            pass
        os.mkdir('CoursesApp/data')

    for dept in DEPTS:
        write_json(dept, overwrite=overwrite)


if __name__ == '__main__':
    # keep math up to date with latest version
    for dept in DEPTS:
        if dept.abbreviation == 'MATH':
            write_json(dept, overwrite=True)

    main(sys.argv)
