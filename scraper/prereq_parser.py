from typing import List
import re

from readers import build_depts_list


DEPTS = build_depts_list()


def get_prereqs(prereq_description: str, course_name: str = '') -> List[List[str]]:
    current_dept = ''
    and_together = []
    or_together = []
    seen_and = False
    seen_or = False
    suffixes = {}
    suffix = ''

    for block in re.split(r'(\.|;)\s', prereq_description):
        if 'may be taken concurrently' in block:
            suffixes[block] = ' [O]'
        elif 'concurrent enrollment in' in block:
            suffixes[block] = ' [M]'
        else:
            suffixes[block] = ''

    for term in re.split(r'(?<=\s)(\d+[A-Z\-]*)(?!u)(?!\.\d)', prereq_description)[:-1]:
        if not term:
            return []

        for block in suffixes.keys():
            if term in block:
                suffix = suffixes[block]
                break

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
                    and_together.append([f'{current_dept} {term[:end_of_number_i]}{chr(sequence_letter)}{suffix}'])

            elif suffix == ' [M]':
                and_together.append([f'{current_dept} {term}{suffix}'])

            elif (name := f'{current_dept} {term}') != course_name:
                or_together.append(name + suffix)

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

    for dept in DEPTS:
        name_variations = [dept.abbreviation.lower().capitalize(), dept.abbreviation, dept.full_name]

        for name_variation in name_variations:
            # avoid naming conflicts caused by substrings
            if name_variation + ' ' in prereq_substr + ' ':
                return dept.abbreviation

    return ''
