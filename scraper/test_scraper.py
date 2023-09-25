from course_scraper import CourseScraper
from ucsb_api_client import UCSB_API_Client
from major_scraper import MajorScraper
from readers import build_depts_list, build_majors_list
from datatypes import Course
from typing import List
import pytest


cs = CourseScraper()
client = UCSB_API_Client()
ms = MajorScraper()


for dept in build_depts_list():
    if dept.abbreviation == 'MATH':
        math_dept = dept
    elif dept.abbreviation == 'MATH CS':
        ccs_math_dept = dept
    elif dept.abbreviation == 'CH E':
        cheme_dept = dept
    elif dept.abbreviation == 'ED':
        ed_grad_dept = dept
    elif dept.abbreviation == 'EDS':
        env_ds_dept = dept
    elif dept.abbreviation == 'PSTAT':
        pstat_dept = dept


def test_dept_url():
    assert cs.dept_to_url(math_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/ls-intro/math.aspx?DeptTab=Courses'

    assert cs.dept_to_url(ccs_math_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/ccs/Courses.aspx'

    assert cs.dept_to_url(cheme_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/coe/chemengr.aspx?DeptTab=Courses'

    assert cs.dept_to_url(ed_grad_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/ggse/Education.aspx?DeptTab=Courses'

    assert cs.dept_to_url(env_ds_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/bren/?DeptTab=Courses'


def test_compile_data():
    assert cs.compile_data('https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/math.aspx?DeptTab=Courses', math_dept) == []

    math_data = cs.compile_data(cs.dept_to_url(math_dept), math_dept)

    first_course = math_data[0]

    assert first_course.title == 'Calculus with Algebra and Trigonometry'
    assert first_course.dept == 'MATH'
    assert first_course.number == '2A'
    assert first_course.professor == 'STAFF'
    assert first_course.units == '5'
    assert first_course.college == 'L&S'
    assert first_course.description == 'Math 3A with precalculus: A function approach integrating algebra, trigonometry, and ' \
        'differential calculus. Topics include: one-on-one and onto functions; inverse functions; properties and graphs of polynomial, ' \
        'rational, exponential, and logarithmic functions; properties and graphs of trigonometric functions; analytic geometry; functions ' \
        'and limits; derivatives; techniques and applications of differentiation; introduction to integration; logarithmic and trigonometric functions.'

    assert first_course.comments == 'Students who have completed Math 34A will only receive 3 units for Math 2A. Not open for credit to ' \
        'students who have completed Math 3A or 3AS or have passed the AP Calculus AB or BC exams.'

    assert first_course.recommended_prep == ''

    twentieth_course = math_data[20]

    assert twentieth_course.title == 'Modern Euclidean and Noneuclidean Geometry'
    assert twentieth_course.units == '4'
    assert twentieth_course.dept == 'MATH'
    assert twentieth_course.professor == 'STAFF'

    ind_studies = [course for course in math_data if course.number == '199'][0]

    assert ind_studies.title == 'Independent Studies in Mathematics'
    assert ind_studies.units == '1-5'
    assert ind_studies.comments == 'Students must have a cumulative 3.0 for the proceeding 3 quarter(s). Limit of 5 units per quarter and ' \
        '30 units total in all independent studies courses (98/99/99RA/198/199/199AA-ZZ) combined.  Only 8 units in Math 197/199AA-ZZ courses ' \
        'may apply to the major.'
    assert ind_studies.description == 'Coursework consists of academic research supervised by a faculty member on a topic not available ' \
        'in established course offerings.'

    pstat_dept_courses: List[Course] = cs.compile_data(
        cs.dept_to_url(pstat_dept), pstat_dept
    )
    titles = [course.title for course in pstat_dept_courses]

    assert 'Principles of Data Science with R' in titles
    assert 'STOCHASTIC CALCULUS AND APPLICATIONS' in titles


@pytest.mark.noapi
def test_api_client():
    winter_courses = client.get_courses_json('20231')
    assert winter_courses['classes'][0]['title'] == 'INTRO CULT ANTHRO'
    assert set(client.get_offered_courses(math_dept, 2020, 2022)['Spring 2020']['3A']) == set(['QNT', 'C'])


def test_major_scraper():
    anth_major = build_majors_list()[0]
    assert ms.get_major_requirements(anth_major)[2] == 'Anthropology 5'
    assert ms.get_major_requirements(anth_major)[4] == 'I. Ten courses from full A nthropology curriculum'
