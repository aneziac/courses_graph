from typing import List
import os
import csv
from dataclasses import asdict

from datatypes import Department


def build_depts_list(sort=False) -> List[Department]:
    depts = []

    with open('scraper/depts.csv') as f:
        reader = csv.reader(f)
        for line in reader:
            line = [x.strip() for x in line]

            depts.append(
                Department(
                    abbreviation=line[0],
                    super_dept=line[1],
                    url_abbreviation=line[2],
                    full_name=line[3],
                    college=line[4],
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


def get_existing_jsons() -> List[str]:
    base_path = './data'
    try:
        ls = os.listdir(base_path)
    except FileNotFoundError:
        ls = os.listdir('.' + base_path)

    # remove the '.json' part
    return [item[:-5] for item in ls]
