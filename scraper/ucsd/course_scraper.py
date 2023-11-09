from bs4 import BeautifulSoup as bs
import re

from ..datatypes import Department
from .datatypes import UCSDWebsiteCourse
from base_scraper import CourseScraper
from readers import build_depts_list
from prereq_parser import get_prereqs


class UCSDCourseScraper(CourseScraper):
    def __init__(self):
        super().__init__('ucsd')

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
        r_abbrev = r'\s+'.join(dept.abbreviation.split())
        r_abbrev = r_abbrev.replace('&', r'\&amp;')

        self._regexes['NUMBER'] = re.compile(rf'{r_abbrev}\s+(.*)\.')
        self._regexes['DEPT'] = re.compile(rf'(<b>|AndTitle">)\s+({r_abbrev})\s+.*\.')

    def compile_data(self, url: str, dept: Department, debug=False) -> list[UCSDWebsiteCourse]:
        response = self._scraper.fetch(url, f'[F] Failed to retrieve data for {dept.full_name} at {url}')
        if not response:
            return []

        # parse the html with a beautiful soup instance
        soup = bs(response.text, features='html.parser')

        result: list[UCSDWebsiteCourse] = []

        # Open a file used for debugging
        raw = open('scraper/raw.txt', 'w+' if debug else 'a')
        if not debug:
            raw.close()

        # self._compile_dynamic_regex(dept)

        # find our courses using the CSS class found by manually inspecting the ucsb webpage
        for all_course_info in soup.find_all('div', class_='CourseDisplay'):
            all_course_info = str(all_course_info)  # it's easier to work with as a string rather than a custom soup datatype

            if debug:
                raw.write(all_course_info)

            course_dept = re.findall(self._regexes['DEPT'], all_course_info)
            if not course_dept or len(course_dept[0]) < 2:
                continue

            relevant_strings: dict[str, str] = {}

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
                UCSDWebsiteCourse(
                    dept=dept,
                    number=number,
                    prereqs=prereqs,
                    prereq_description=relevant_strings['PREREQS'],
                    comments=relevant_strings['COMMENTS'],
                    units=relevant_strings['UNITS'],
                    description=relevant_strings['DESCRIPTION'],
                    title=relevant_strings['TITLE'],
                )
            )

        if debug:
            raw.close()

        return result

    def dept_to_url(self, dept: Department) -> str:
        return f'https://catalog.ucsd.edu/courses/{dept.abbreviation}.html'


def main():
    cs = UCSDCourseScraper()
    for dept in build_depts_list():
        # keep math up to date with latest version as it's used for testing
        if dept.abbreviation == 'MATH':
            cs.write_json(dept, overwrite=True)
            continue

        cs.write_json(dept)


if __name__ == '__main__':
    main()
