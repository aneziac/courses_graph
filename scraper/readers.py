from typing import List
import os
import csv
from dataclasses import asdict

from datatypes import Department, Major


def read_csv(filename) -> List[List[str]]:
    result = []

    with open(filename, 'r') as f:
        reader = csv.reader(f)
        for line in reader:
            line = [x.strip() for x in line]
            result.append(line)

    return result


def build_depts_list(sort=False) -> List[Department]:
    depts = []
    for line in read_csv('scraper/depts.csv'):
        depts.append(
                Department(
                    abbreviation=line[0],
                    super_dept=line[1],
                    url_abbreviation=line[2],
                    full_name=line[3],
                    college=line[4],
                    api_name=line[5]
                )
            )

    # sort departments when new ones are added (no longer needed)
    # but may come in handy at some point
    if sort:
        with open('scraper/sorted_depts.csv', 'w+') as g:
            for line in sorted(depts, key=lambda x: x.abbreviation):
                vals = asdict(line).values()
                g.write(', '.join(vals) + '\n')

    return depts


def build_majors_list() -> List[Major]:
    majors = []

    for line in read_csv('scraper/majors.csv'):
        majors.append(
            Major(
                name=line[1],
                dept=line[0]
            )
        )

    return majors


def get_existing_jsons() -> List[str]:
    base_path = './data'
    try:
        ls = os.listdir(base_path)
    except FileNotFoundError:
        ls = os.listdir('.' + base_path)

    # remove the '.json' part
    return [item[:-5] for item in ls]
