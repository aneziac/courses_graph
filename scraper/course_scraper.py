from bs4 import BeautifulSoup as bs
import json
import re
import csv
import requests
from dataclasses import dataclass, asdict
from datalite import datalite
from typing import List


"""
Incorrect

ED HSS, ED, Education, History & Social Science, GGSE
"""

@dataclass
class Department:
    abbreviation: str
    super_dept: str
    url_abbreviation: str
    full_name: str
    college: str


DEPTS: List[Department] = []

# @datalite(db_path="data/courses.db")
@dataclass
class Course:
    title: str
    dept: str
    sub_dept: str
    number: str
    prereqs: List[List[str]]
    comments: str
    units: str
    description: str
    recommended_prep: str
    professor: str
    college: str


def compile_data(url: str, dept: Department) -> List[Course]:
    r = requests.get(url)

    try:
        assert 200 == r.status_code
    except AssertionError:
        print(f'Failed to retrieve data at {url}')
        return []

    soup = bs(r.text, features='html.parser')

    result: List[Course] = []

    r_abbrev = '\s+'.join(dept.abbreviation.split())

    r_dept = re.compile(rf'(<b>|AndTitle">)\s+({r_abbrev})\s+.*\.')

    r_description = re.compile(r'(div>|2px;">)\s+(.*\.)\s+<\/div>')
    r_number = re.compile(rf'{r_abbrev}\s+(.*)\.')
    r_prereqs = re.compile(r'Prerequisite:<\/strong> (.*\.)')
    r_units = re.compile(r'\((\d\-*\d*)\)')
    r_comments = re.compile(r'Enrollment Comments:<\/strong> (.*\.)')

    r_title = re.compile(r'(CourseDisplay">\s+|\d{1,3}[A-Z]*\.\s+)([A-Z][^<]*[a-z\)I])\s+(<\/s|<\/b)')
    r_professor = re.compile(r'\(\d\-*\d*\)\s+(.*)\s*<\/')
    r_recommended_prep = re.compile(r'Preparation:<\/strong> (.*\.)<div')

    f = open('scraper/raw.txt', 'w+')

    for all_course_info in soup.find_all('div', class_='CourseDisplay'):
        all_course_info = str(all_course_info)

        course_dept = re.findall(r_dept, all_course_info)
        if not course_dept or len(course_dept[0]) < 2:
            continue

        f.write(all_course_info)

        description = re.findall(r_description, all_course_info)
        number = re.findall(r_number, all_course_info)
        prereq_description = re.findall(r_prereqs, all_course_info)
        units = re.findall(r_units, all_course_info)
        comments = re.findall(r_comments, all_course_info)
        title = re.findall(r_title, all_course_info)
        professor = re.findall(r_professor, all_course_info)
        recommended_prep = re.findall(r_recommended_prep, all_course_info)

        if prereq_description:
            prereqs = get_prereqs(prereq_description[0])
        else:
            prereqs = list()

        description_str = description[0][1] if description else ''
        description_str = description_str.replace('   ', ' ')

        comments_str = comments[0] if comments else ''
        comments_str = comments_str.replace('   ', ' ')

        result.append(
            Course(
                dept=dept.super_dept,
                sub_dept=dept.abbreviation,
                number=(number[0] if number else ''),
                prereqs=prereqs,
                comments=comments_str,
                units=(units[0] if units else ''),
                description=description_str,
                title=(title[0][1] if title else ''),
                professor=(professor[0].strip() if professor else ''),
                recommended_prep=(recommended_prep[0] if recommended_prep else ''),
                college=dept.college
            )
        )

    f.close()
    return result


def get_prereqs(prereq_description: str) -> List[List[str]]:
    current_dept = ''
    and_together = []
    or_together = []

    for term in re.split(r'(\d+[A-Z]*)', prereq_description):
        if not term:
            return []

        # not a course
        if not (ord('0') <= ord(term[0]) and ord('9') >= ord(term[0])):
            for dept in DEPTS[::-1]:
                if dept.abbreviation in term.upper() or dept.full_name in term:
                    current_dept = dept.abbreviation
                    break

        else:
            or_together.append(f'{current_dept} {term}')

        if ',' in term or 'and' in term:
            and_together.append(or_together.copy())
            or_together.clear()

    if or_together:
        and_together.append(or_together)

    return and_together


def dept_to_url(dept: Department) -> str:
    base_url = 'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments'

    if dept.college == 'L&S':
        url = f'{base_url}/ls-intro/{dept.url_abbreviation}.aspx?DeptTab=Courses'
    elif dept.college == 'COE':
        url = f'{base_url}/coe/{dept.url_abbreviation}.aspx?DeptTab=Courses'
    elif dept.college == 'CCS':
        url = f'{base_url}/{dept.url_abbreviation}/Courses.aspx'
    elif dept.college == 'GGSE':
        url = f'{base_url}/ggse/{dept.url_abbreviation}.aspx?DeptTab=Courses'
    elif dept.college == 'BREN':
        url = f'{base_url}/{dept.url_abbreviation}/?DeptTab=Courses'

    return url


def main():
    with open('scraper/depts.csv') as f:
        reader = csv.reader(f)
        for line in reader:
            line = [x.strip() for x in line]

            DEPTS.append(
                Department(
                    abbreviation=line[0],
                    super_dept=line[1],
                    url_abbreviation=line[2],
                    full_name=line[3],
                    college=line[4],
                )
            )

    if False:
        with open('scraper/sorted_depts.csv', 'w') as g:
            for line in sorted(DEPTS, key=lambda x: x.abbreviation):
                vals = asdict(line).values()
                g.write(', '.join(vals) + '\n')

    MATH = Department(
        abbreviation='GREEK',
        super_dept='CLASS',
        url_abbreviation='class',
        full_name='Greek',
        college='L&S'
    )

    with open('data/courses.json', 'w') as f:
        f.write('{')
        for dept in [MATH]: # DEPTS[:15]:
            url = dept_to_url(dept)

            for course in compile_data(url, dept):
                # course.create_entry()
                f.write(f'"{course.sub_dept} {course.number}": ')
                f.write(json.dumps(asdict(course)) + ',\n')

        f.write('}')


main()
