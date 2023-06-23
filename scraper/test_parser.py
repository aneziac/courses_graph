from prereq_parser import get_prereqs


def test_basics():
    assert get_prereqs('Mathematics 2A or 3A or 34A with a grade of C or better.') == \
        [['MATH 2A', 'MATH 3A', 'MATH 34A']]

    assert get_prereqs('Chemical Engineering 170 or Chemical Engineering 107 or MCDB 1A.') == \
        [['CH E 170', 'CH E 107', 'MCDB 1A']]

    assert get_prereqs('Math 181A or ED 134 with a minimum grade of C.') == \
        [['MATH 181A', 'ED 134']]

    assert get_prereqs(
        'Geography 3 or 3A and Geography 3B or 4.'
    ) == [['GEOG 3', 'GEOG 3A'], ['GEOG 3B', 'GEOG 4']]


def test_punctuation():
    assert get_prereqs('Math 6B, Math 8, and Math 108A or Math 117 each with a letter grade of "C" or higher.') == \
        [['MATH 6B'], ['MATH 8'], ['MATH 108A', 'MATH 117']]

    assert get_prereqs(
        'Geography 3 or 3A or 3B or 4; or, Environmental Studies 2; or, Earth Science 1; or, Chemistry 1A.'
    ) == [['GEOG 3', 'GEOG 3A', 'GEOG 3B', 'GEOG 4'], ['ES 2'], ['ES 1'], ['CHEM 1A']]


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

    assert get_prereqs('Physics 221A-B-C.') == \
        [['PHYS 221A'], ['PHYS 221B'], ['PHYS 221C']]

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

    assert get_prereqs(
        'Physics 13CL or Physics 20CL or Physics CS 15C. Physics 115A (may be taken concurrently).'
    ) == [['PHYS 13CL', 'PHYS 20CL', 'PHYS CS 15C'], ['PHYS 115A [O]']]

    assert get_prereqs(
        'Co-requisite: Physics 119B'
    ) == [['PHYS 119B [M]']]


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


def test_standing():
    assert get_prereqs(
        'Hist 4B or 4C or 20 or upper-division standing.'
    ) == [['HIST 4B', 'HIST 4C', 'HIST 20', 'UD Standing']]

    assert get_prereqs(
        'History 2B or 4B or Religious Studies 80B or upper-division standing.'
    ) == [['HIST 2B', 'HIST 4B', 'RG ST 80B', 'UD Standing']]

    assert get_prereqs(
        'Graduate standing.'
    ) == [['Grad Standing']]

    assert get_prereqs(
        'Upper-division standing; completion of 2 upper-division courses in math; consent of instructor and department.'
    ) == [['UD Standing'], ['Instructor Permission']]

    assert get_prereqs(
        'Upper division standing in Computer Science, Computer Engineering or Electrical Engineering.'
    ) == [['UD Standing']]

    assert get_prereqs(
        'CMPSC 189A; Senior standing in Computer Science or Computer Engineering.'
    ) == [['CMPSC 189A'], ['Senior Standing']]


def test_instructor_permission():
    assert get_prereqs(
        'HIST 2C or 4C or 17C and upper division standing or by permission from the instructor.'
    ) == [['HIST 2C', 'HIST 4C', 'HIST 17C'], ['UD Standing', 'Instructor Permission']]

    assert get_prereqs(
        'Upper-division standing; consent of instructor.'
    ) == [['UD Standing'], ['Instructor Permission']]

    assert get_prereqs(
        'Consent of instructor; upper-division standing; completion of 2 upper-division courses in physics.'
    ) == [['Instructor Permission'], ['UD Standing']]

    assert get_prereqs(
        'Computer Science 40 and Computer Science 32; consent of instructor.'
    ) == [['CMPSC 40'], ['CMPSC 32'], ['Instructor Permission']]

    assert get_prereqs('Physics CS 34 and 35; consent of instructor; creative studies majors only.') == \
        [['PHYS CS 34'], ['PHYS CS 35'], ['Instructor Permission']]


def test_majors():
    assert get_prereqs(
        'CMPSC 32 with a grade of C or better; PSTAT 120A or ECE 139; open to computer science, electrical engineering, and computer engineering majors only.'
    ) == [['CMPSC 32'], ['PSTAT 120A', 'ECE 139'], ['Major']]

    assert get_prereqs(
        'Chemical Engineering 10, and 110A-B; open to Engineering majors only.'
    ) == [['CH E 10'], ['CH E 110A'], ['CH E 110B'], ['Major']]


def test_misc():
    assert get_prereqs(
        'Not open to freshmen.'
    ) == [['Non-freshman']]


def test_very_complicated():
    assert get_prereqs(
        'Chemical Engineering 5 (may be taken concurrently); Chemistry 1A-B-C or 2A-B-C; Mathematics 2A or 3A, Mathematics 2B or 3B and Mathematics 4A or 4AI'
    ) == [['CH E 5 [O]'], [[['CHEM 1A'], ['CHEM 1B'], ['CHEM 1C']], [['CHEM 2A'], ['CHEM 2B'], ['CHEM 2C']]], ['MATH 2A', 'MATH 3A'], ['MATH 2B', 'MATH 3B'], ['MATH 4A', 'MATH 4AI']]

    assert get_prereqs('Mathematics 3A-B-C; and, Economics 104A-B, or Economics 205A-B.') == \
        [['MATH 3A'], ['MATH 3B'], ['MATH 3C'], [['ECON 104A', 'ECON 104B'], ['ECON 205', 'ECON 205B']]]


def test_all_cs_dept():
    assert get_prereqs(
        'Math 4A with a grade of C or better.'
    ) == [['MATH 4A']]

    assert get_prereqs(
        'Computer Science 5A or Computer Science 8 or ECE 3 with a grade of C or better. '
    ) == [['CMPSC 5A', 'CMPSC 8', 'ECE 3']]

    assert get_prereqs(
        'Computer Science 8 or Engineering 3 with a grade of C or better.'
    ) == [['CMPSC 8', 'ENGR 3']]

    assert get_prereqs(
        'Knowledge of at least one programming language. '
    ) == []

    assert get_prereqs(
        'Mathematics 3A or 2A with a grade of C or better (may be taken concurrently), CS 8 or Engineering 3 or ECE 3 with a grade of C or better, or significant prior programming experience. '
    ) == [['MATH 3A [O]', 'MATH 2A [O]'], ['CMPSC 8', 'ENGR 3', 'ECE 3']]

    assert get_prereqs(
        'Computer Science 16 with a grade of C or better; and Mathematics 3B or 2B with a grade of C or better (may be taken concurrently). '
    ) == [['CMPSC 16'], ['MATH 3B [O]', 'MATH 2B [O]']]

    assert get_prereqs(
        'Computer Science 24 with a grade of C or better '
    ) == [['CMPSC 24']]

    assert get_prereqs(
        'Computer Science 16 with a grade of C or better and Mathematics 4A with a grade of C or better. '
    ) == [['CMPSC 16'], ['MATH 4A']]

    assert get_prereqs(
        'Computer Science 16 with a grade of C or better; and Mathematics 3C or 4A with a grade of C or better. '
    ) == [['CMPSC 16'], ['MATH 3C', 'MATH 4A']]

    assert get_prereqs(
        'Consent of instructor. '
    ) == [['Instructor Permission']]

    assert get_prereqs(
        'Computer Science 40 and Computer Science 32; consent of instructor.'
    ) == [['CMPSC 40'], ['CMPSC 32'], ['Instructor Permission']]

    assert get_prereqs(
        'Mathematics 4B with a grade of C or better; Mathematics 6A with a grade of C or better; Computer Science 24 with a grade of C or better.'
    ) == [['MATH 4B'], ['MATH 6A'], ['CMPSC 24']]

    assert get_prereqs(
        'Computer Science 40 with a grade of C or better; Computer Science 32 with a grade of C or better; PSTAT 120A or ECE 139; open to computer science, computer engineering, and electrical engineering majors only.'
    ) == [['CMPSC 40'], ['CMPSC 32'], ['PSTAT 120A', 'ECE 139'], ['Major']]

    assert get_prereqs(
        'Computer Science 130A.'
    ) == [['CMPSC 130A']]

    assert get_prereqs(
        'Computer Science 40 with a grade of C or better; open to Computer Science and Computer Engineering majors only.'
    ) == [['CMPSC 40'], ['Major']]

    assert get_prereqs(
        'Mathematics 4B with a grade of C or better; Mathematics 6A with a grade of C or better; Computer Science 130A. '
    ) == [['MATH 4B'], ['MATH 6A'], ['CMPSC 130A']]

    assert get_prereqs(
        'Computer Science 32 with a grade of C or better; open to Computer Science majors only.'
    ) == [['CMPSC 32'], ['Major']]

    assert get_prereqs(
        'Upper division standing in Computer Science, Computer Engineering or Electrical Engineering.'
    ) == [['UD Standing']]

    assert get_prereqs(
        'Computer Science 32 with a grade of C or better; Computer Science 64 with a grade of C or better. '
    ) == [['CMPSC 32'], ['CMPSC 64']]

    assert get_prereqs(
        'Computer Science 24 and 32 with a grade of C or better; open to Computer Science and Computer Engineering majors only. '
    ) == [['CMPSC 24'], ['CMPSC 32'], ['Major']]

    assert get_prereqs(
        'Computer Science 64 or Electrical Engineering 154 or Electrical Engineering 154A; Computer Science 130A; and Computer Science 138; open to computer science and computer engineering majors only. '
    ) == [['CMPSC 64', 'ECE 154', 'ECE 154A'], ['CMPSC 130A'], ['CMPSC 138'], ['Major']]

    assert get_prereqs(
        'Computer Science 130A and 138; open to computer science and computer engineering majors only.'
    ) == [['CMPSC 130A'], ['CMPSC 138'], ['Major']]

    assert get_prereqs(
        'Computer Science 130A (may be taken concurrently); or consent of instructor. '
    ) == [['CMPSC 130A [O]', 'Instructor Permission']]

    assert get_prereqs(
        'CMPSC 32 with a grade of C or better; PSTAT 120A or ECE 139; open to computer science, electrical engineering, and computer engineering majors only. '
    ) == [['CMPSC 32'], ['PSTAT 120A', 'ECE 139'], ['Major']]

    assert get_prereqs(
        'Computer Science 176A.'
    ) == [['CMPSC 176A']]

    assert get_prereqs(
        'Computer Science 170 (may be taken concurrently). '
    ) == [['CMPSC 170 [O]']]

    assert get_prereqs(
        'Computer Science 24 with a grade of C or better; Computer Science 40 with a grade of C or better; and PSTAT 120A or 121A or ECE 139 or permission of instructor. '
    ) == [['CMPSC 24'], ['CMPSC 40'], ['PSTAT 120A', 'PSTAT 121A', 'ECE 139', 'Instructor Permission']]

    assert get_prereqs(
        'Computer Science 130A or consent of instructor.'
    ) == [['CMPSC 130A', 'Instructor Permission']]

    assert get_prereqs(
        'Computer Science 56 or Computer Science 156; and Computer Science 130A.'
    ) == [['CMPSC 56', 'CMPSC 156'], ['CMPSC 130A']]

    assert get_prereqs(
        'Computer Science 48 or 56 or 148 or 156 or 172; Senior standing in computer science or computer engineering.'
    ) == [['CMPSC 48', 'CMPSC 56', 'CMPSC 148', 'CMPSC 156', 'CMPSC 172'], ['Senior Standing']]
