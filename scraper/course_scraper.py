from bs4 import BeautifulSoup as bs
import re
from dataclasses import asdict
from typing import List, Dict
import logging


from datatypes import Department, WebsiteCourse
from base_scraper import Scraper, ScraperException
from readers import build_depts_list, get_existing_jsons
from prereq_parser import get_prereqs


class CourseScraper(Scraper):
    def __init__(self):
        self._EXISTING_JSONS: List[str] = get_existing_jsons()
        self._regexes: Dict[str, re.Pattern] = {}

        self._compile_static_regex()
        super().__init__('course website')

    # We separate regex into static which is only compiled once, and regex that changes based on the dept name

    def _compile_static_regex(self):
        self._regexes['PREREQS'] = re.compile(r'Prerequisite:<\/strong> (.*?)\s{3}')
        self._regexes['DESCRIPTION'] = re.compile(r'(div>|2px;">)\s+(.*\.)\s+<\/div>')
        self._regexes['UNITS'] = re.compile(r'\((\d\-*\d*)\)')
        self._regexes['COMMENTS'] = re.compile(r'Enrollment Comments:<\/strong> (.*\.)')
        self._regexes['TITLE'] = re.compile(r'(CourseDisplay">\s+|\d{1,3}[A-Z]*\.\s+)([A-Z][^<]*[A-Za-z\)I])\s+(<\/s|<\/b)')
        self._regexes['PROFESSOR'] = re.compile(r'\(\d\-*\d*\)\s+(.*)\s*<\/')
        self._regexes['RECOMMENDED PREP'] = re.compile(r'Preparation:<\/strong> (.*\.)<div')

    def _compile_dynamic_regex(self, dept: Department):
        # abbreviation for the dept regex
        r_abbrev = '\s+'.join(dept.abbreviation.split())
        r_abbrev = r_abbrev.replace('&', '\&amp;')

        self._regexes['NUMBER'] = re.compile(rf'{r_abbrev}\s+(.*)\.')
        self._regexes['DEPT'] = re.compile(rf'(<b>|AndTitle">)\s+({r_abbrev})\s+.*\.')

    def compile_data(self, url: str, dept: Department, debug=False) -> List[WebsiteCourse]:
        if not (text := self.fetch(url, f'[F] Failed to retrieve data for {dept.full_name} at {url}').text):
            return []

        # parse the html with a beautiful soup instance
        soup = bs(text, features='html.parser')

        result: List[WebsiteCourse] = []

        if debug:
            # Open a file used for debugging
            raw = open('scraper/raw.txt', 'w+')

        self._compile_dynamic_regex(dept)

        # offered_courses: Dict[str, Dict[str, List[str]]] = get_offered_courses(dept.abbreviation)

        # find our courses using the CSS class found by manually inspecting the ucsb webpage
        for all_course_info in soup.find_all('div', class_='CourseDisplay'):
            all_course_info = str(all_course_info)  # it's easier to work with as a string rather than a custom soup datatype

            if debug:
                raw.write(all_course_info)

            course_dept = re.findall(self._regexes['DEPT'], all_course_info)
            if not course_dept or len(course_dept[0]) < 2:
                continue

            relevant_strings: Dict[str, str] = {}

            for regex in self._regexes:
                results = re.findall(self._regexes[regex], all_course_info)
                if not results:
                    clean_string = ''

                else:
                    if isinstance(results[0], tuple):
                        base_string = results[0][1]
                    else:
                        base_string = results[0]

                    clean_string = base_string.replace('   ', ' ').strip()

                relevant_strings[regex] = (clean_string if results else '')

            # we use the number as a local id so it's particularly useful to pull out
            number = relevant_strings['NUMBER']

            # determine prerequisties
            if prereq := relevant_strings['PREREQS']:
                prereqs = get_prereqs(prereq, f'{dept.abbreviation} {number}')
            else:
                prereqs = list()

            # add the course to our list with all relevant metadata
            result.append(
                WebsiteCourse(
                    dept=dept.super_dept,
                    sub_dept=dept.abbreviation,
                    number=number,
                    prereqs=prereqs,
                    prereq_description=relevant_strings['PREREQS'],
                    comments=relevant_strings['COMMENTS'],
                    units=relevant_strings['UNITS'],
                    description=relevant_strings['DESCRIPTION'],
                    title=relevant_strings['TITLE'],
                    professor=relevant_strings['PROFESSOR'],
                    recommended_prep=relevant_strings['RECOMMENDED PREP'],
                    college=dept.college
                )
            )

        if debug:
            raw.close()

        return result

    def dept_to_url(self, dept: Department) -> str:
        base_url = 'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments'
        base_suffix = 'aspx?DeptTab=Courses'
        url = ''

        # weirdly the dynamical neuroscience and biological engineering depts have special urls

        if dept.college == 'L&S':
            if dept.abbreviation == 'DYNS':
                url = f'{base_url}/{dept.url_abbreviation}.{base_suffix}'
            else:
                url = f'{base_url}/ls-intro/{dept.url_abbreviation}.{base_suffix}'

        elif dept.college == 'COE':
            if dept.abbreviation == 'BIOE':
                url = f'{base_url}/{dept.url_abbreviation}.{base_suffix}'
            else:
                url = f'{base_url}/coe/{dept.url_abbreviation}.{base_suffix}'

        # the other colleges have their own patterns
        elif dept.college == 'CCS':
            url = f'{base_url}/{dept.url_abbreviation}/Courses.aspx'
        elif dept.college == 'GGSE':
            url = f'{base_url}/ggse/{dept.url_abbreviation}.{base_suffix}'
        elif dept.college == 'BREN':
            url = f'{base_url}/{dept.url_abbreviation}/?DeptTab=Courses'

        if not url:
            raise ScraperException(f'Could not get url for {dept.full_name}')

        return url


    def write_json(self, dept: Department, overwrite=False) -> None:
        filename = f'data/website/{dept.file_abbrev}.json'
        url = self.dept_to_url(dept)

        courses = self.compile_data(url, dept)
        if not courses:
            logging.warning(f'[F] Failed to retrieve data for {dept.full_name}')
            return

        super().write_json(filename, courses)

        logging.info(f'[S] Wrote data for {dept.full_name} department in {filename}')


if __name__ == '__main__':
    cs = CourseScraper()
    for dept in build_depts_list():
        # keep math up to date with latest version as it's used for testing
        if dept.abbreviation == 'MATH':
            cs.write_json(dept, overwrite=True)
            continue

        cs.write_json(dept, overwrite=cs.overwrite)
