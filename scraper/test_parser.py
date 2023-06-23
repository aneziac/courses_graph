from prereq_parser import get_prereqs


def test_basics():
    assert get_prereqs('Mathematics 2A or 3A or 34A with a grade of C or better.') == \
        [['MATH 2A', 'MATH 3A', 'MATH 34A']]

    assert get_prereqs('Chemical Engineering 170 or Chemical Engineering 107 or MCDB 1A.') == \
        [['CH E 170', 'CH E 107', 'MCDB 1A']]

    assert get_prereqs('Physics CS 34 and 35; consent of instructor; creative studies majors only.') == \
        [['PHYS CS 34'], ['PHYS CS 35']]

    assert get_prereqs('Math 181A or ED 134 with a minimum grade of C.') == \
        [['MATH 181A', 'ED 134']]

    assert get_prereqs(
        'Upper-division standing; completion of 2 upper-division courses in math; consent of instructor and department.'
    ) == []


def test_commas():
    assert get_prereqs('Math 6B, Math 8, and Math 108A or Math 117 each with a letter grade of "C" or higher.') == \
        [['MATH 6B'], ['MATH 8'], ['MATH 108A', 'MATH 117']]


def test_semicolons_two_sentences():
    assert get_prereqs(
        'Mathematics 3C or 3CI or 4A or 4AI, 4B or 4BI or 5A or 5AI; and Math 8 with a grade of "C" or better.'
    ) == [['MATH 3C', 'MATH 3CI', 'MATH 4A', 'MATH 4AI'], ['MATH 4B', 'MATH 4BI', 'MATH 5A', 'MATH 5AI'], ['MATH 8']]

    assert get_prereqs(
        'Math 6A and Math 108A, both with a grade of C or above. Computer Science 8 or 16, or Engineering 3 with a minimum grade of C.'
    ) == [['MATH 6A'], ['MATH 108A'], ['CMPSC 8', 'CMPSC 16', 'ENGR 3']]


def test_dash():
    assert get_prereqs('PSTAT 120A-B and 160A, all completed with a minimum grade of C or better.') == \
        [['PSTAT 120A'], ['PSTAT 120B'], ['PSTAT 160A']]

    assert get_prereqs('Mathematics 3C, 3CI, 4A, or 4AI with a minimum grade of C.') == \
        [['MATH 3C', 'MATH 3CI', 'MATH 4A', 'MATH 4AI']]

    assert get_prereqs('Chemical Engineering 120A-B-C, 140A.') == \
        [['CH E 120A'], ['CH E 120B'], ['CH E 120C'], ['CH E 140A']]


def test_concurrency():
    assert get_prereqs(
        'PSTAT 207A or PSTAT 220A (may be taken concurrently).'
    ) == [['PSTAT 207A [O]', 'PSTAT 220A [O]']]

    assert get_prereqs(
        'SPAN 16B or SPAN 25 (may be taken concurrently).'
    ) == [['SPAN 16B [O]', 'SPAN 25 [O]']]

    assert get_prereqs(
        'Theater 10C; concurrent enrollment in Theater 151A. Consent of instructor.'
    ) == [['THTR 151A [M]'], ['THTR 10C']]

    assert get_prereqs(
        'PSTAT 160A-B, PSTAT 170; PSTAT 160B may be taken concurrently. PSTAT 160A   and PSTAT 170 must be completed with a B- or higher.'
    ) == [['PSTAT 160A'], ['PSTAT 160B [O]'], ['PSTAT 170']]


def test_multi_layer_recursion():
    assert get_prereqs(
        'Mathematics 5A or 5AI and 5B or 5BI with a minimum grade of C; or 4B or 4BI and 6A or 6AI with a minimum' \
            'grade of C; and Math 8 with a minimum grade of C.') == \
                [[['MATH 5A', 'MATH 5AI'], ['MATH 5B', 'MATH 5BI']], [['MATH 4B', 'MATH 4BI'], ['MATH 6A', 'MATH 6AI']], 'MATH 8']

    assert get_prereqs(
        'Mathematics 4B or 4BI, 6A or 6AI, and 6B; or 5A or 5AI, 5B or 5BI and 5C; and Math 117; and, '
        'Computer Science 5AA-ZZ or 10 or 8 or 16 or Engineering 3. A grade of C or above is required in all prerequisite courses.'
    ) == [[['MATH 4B', 'MATH 4BI'], ['MATH 6A', 'MATH 6AI'], ['MATH 6B']], [['MATH 5A', 'MATH 5AI'], ['MATH 5B', 'MATH 5BI'], 'MATH 5C'], \
            ['MATH 117'], ['CMPSC 5AA-ZZ', 'CMPSC 10', 'CMPSC 8', 'CMPSC 16', 'ENGR 3']]
