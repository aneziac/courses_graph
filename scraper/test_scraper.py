import scraper.course_scraper as course_scraper
from typing import List


math_dept = course_scraper.Department(
    abbreviation='MATH',
    super_dept='MATH',
    url_abbreviation='math',
    full_name='Mathematics',
    college='L&S'
)

ccs_math_dept = course_scraper.Department(
    abbreviation='MATH CS',
    super_dept='MATH',
    url_abbreviation='ccs',
    full_name='Mathematics (Creative Studies)',
    college='CCS'
)

cheme_dept = course_scraper.Department(
    abbreviation='CH E',
    super_dept='CH E',
    url_abbreviation='chemengr',
    full_name='Chemical Engineering',
    college='COE'
)

ed_grad_dept = course_scraper.Department(
    abbreviation='ED',
    super_dept='ED',
    url_abbreviation='Education',
    full_name='Education',
    college='GGSE'
)

env_ds_dept = course_scraper.Department(
    abbreviation='EDM',
    super_dept='ESM',
    url_abbreviation='bren',
    full_name='Environmental Data Science',
    college='BREN'
)

pstat_dept = course_scraper.Department(
    abbreviation='PSTAT',
    super_dept='PSTAT',
    url_abbreviation='stats',
    full_name='Statistics & Applied Probability',
    college='L&S'
)

def test_dept_url():
    assert course_scraper.dept_to_url(math_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/ls-intro/math.aspx?DeptTab=Courses'

    assert course_scraper.dept_to_url(ccs_math_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/ccs/Courses.aspx'

    assert course_scraper.dept_to_url(cheme_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/coe/chemengr.aspx?DeptTab=Courses'

    assert course_scraper.dept_to_url(ed_grad_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/ggse/Education.aspx?DeptTab=Courses'

    assert course_scraper.dept_to_url(env_ds_dept) == \
        'https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/bren/?DeptTab=Courses'


def test_get_prereqs():
    assert course_scraper.get_prereqs('Mathematics 2A or 3A or 34A with a grade of C or better.') == \
        [['MATH 2A', 'MATH 3A', 'MATH 34A']]

    assert course_scraper.get_prereqs(
        'Mathematics 3C or 3CI or 4A or 4AI, 4B or 4BI or 5A or 5AI; and Math 8 with a grade of "C" or better.'
    ) == [['MATH 3C', 'MATH 3CI', 'MATH 4A', 'MATH 4AI'], ['MATH 4B', 'MATH 4BI', 'MATH 5A', 'MATH 5AI'], ['MATH 8']]

    assert course_scraper.get_prereqs('Math 6B, Math 8, and Math 108A or Math 117 each with a letter grade of "C" or higher.') == \
        [['MATH 6B'], ['MATH 8'], ['MATH 108A', 'MATH 117']]

    assert course_scraper.get_prereqs(
        'Math 6A and Math 108A, both with a grade of C or above. Computer Science 8 or 16, or Engineering 3 with a minimum grade of C.'
    ) == [['MATH 6A'], ['MATH 108A'], ['CMPSC 8', 'CMPSC 16', 'ENGR 3']]

    assert course_scraper.get_prereqs('PSTAT 120A-B and 160A, all completed with a minimum grade of C or better.') == \
        [['PSTAT 120A'], ['PSTAT 120B'], ['PSTAT 160A']]

    assert course_scraper.get_prereqs('Mathematics 3C, 3CI, 4A, or 4AI with a minimum grade of C.') == \
        [['MATH 3C', 'MATH 3CI', 'MATH 4A', 'MATH 4AI']]

    assert course_scraper.get_prereqs('Chemical Engineering 120A-B-C, 140A.') == \
        [['CH E 120A'], ['CH E 120B'], ['CH E 120C'], ['CH E 140A']]

    assert course_scraper.get_prereqs('Chemical Engineering 170 or Chemical Engineering 107 or MCDB 1A.') == \
        [['CH E 170', 'CH E 107', 'MCDB 1A']]

    assert course_scraper.get_prereqs('Physics CS 34 and 35; consent of instructor; creative studies majors only.') == \
        [['PHYS CS 34'], ['PHYS CS 35']]

    assert course_scraper.get_prereqs('Math 181A or ED 134 with a minimum grade of C.') == \
        [['MATH 181A', 'ED 134']]

    assert course_scraper.get_prereqs(
        'Upper-division standing; completion of 2 upper-division courses in math; consent of instructor and department.'
    ) == []

    assert course_scraper.get_prereqs(
        'Upper division standing; completion of 2 upper division EACS courses; at least one of those two courses taken with' \
            'the instructor for EACS 199; GPA for those two courses 3.5 or higher. ', 'EACS 199'
    ) == []

    assert course_scraper.get_prereqs(
        'PSTAT 207A or PSTAT 220A (may be taken concurrently).'
    ) == [['PSTAT 207A [O]', 'PSTAT 220A [O]']]

    assert course_scraper.get_prereqs(
        'SPAN 16B or SPAN 25 (may be taken concurrently).'
    ) == [['SPAN 16B [O]', 'SPAN 25 [O]']]

    assert course_scraper.get_prereqs(
        'Theater 10C; concurrent enrollment in Theater 151A. Consent of instructor.'
    ) == [['THTR 151A [M]'], ['THTR 10C']]

    assert course_scraper.get_prereqs(
        'PSTAT 160A-B, PSTAT 170; PSTAT 160B may be taken concurrently. PSTAT 160A   and PSTAT 170 must be completed with a B- or higher.'
    ) == [['PSTAT 160A'], ['PSTAT 160B [O]'], ['PSTAT 170']]

    assert course_scraper.get_prereqs(
        'Mathematics 5A or 5AI and 5B or 5BI with a minimum grade of C; or 4B or 4BI and 6A or 6AI with a minimum' \
            'grade of C; and Math 8 with a minimum grade of C.') == \
                [[['MATH 5A', 'MATH 5AI'], ['MATH 5B', 'MATH 5BI']], [['MATH 4B', 'MATH 4BI'], ['MATH 6A', 'MATH 6AI']], 'MATH 8']

    assert course_scraper.get_prereqs(
        'Mathematics 4B or 4BI, 6A or 6AI, and 6B; or 5A or 5AI, 5B or 5BI and 5C; and Math 117; and, '
        'Computer Science 5AA-ZZ or 10 or 8 or 16 or Engineering 3. A grade of C or above is required in all prerequisite courses.'
    ) == [[['MATH 4B', 'MATH 4BI'], ['MATH 6A', 'MATH 6AI'], ['MATH 6B']], [['MATH 5A', 'MATH 5AI'], ['MATH 5B', 'MATH 5BI'], 'MATH 5C'], \
            ['MATH 117'], ['CMPSC 5AA-ZZ', 'CMPSC 10', 'CMPSC 8', 'CMPSC 16', 'ENGR 3']]


def test_compile_data():
    assert course_scraper.compile_data('https://my.sa.ucsb.edu/catalog/Current/CollegesDepartments/math.aspx?DeptTab=Courses', math_dept) == []

    math_data = course_scraper.compile_data(course_scraper.dept_to_url(math_dept), math_dept)

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

    assert first_course.comments == 'Students who have completed Math 34A will only receive 3 units for Math 2A.Not open for credit to ' \
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

    pstat_dept_courses: List[course_scraper.Course] = course_scraper.compile_data(
        course_scraper.dept_to_url(pstat_dept), pstat_dept
    )
    titles = [course.title for course in pstat_dept_courses]

    assert 'Principles of Data Science with R' in titles
    assert 'STOCHASTIC CALCULUS AND APPLICATIONS' in titles
