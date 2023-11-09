import os
import csv
from dataclasses import asdict

from datatypes import Department, Major


def read_csv(filename) -> list[list[str]]:
    result = []

    with open(filename, 'r') as f:
        reader = csv.reader(f)
        for line in reader:
            line = [x.strip() for x in line]
            result.append(line)

    return result[1:]


def build_depts_list(sort=False) -> list[Department]:
    depts = []
    for line in read_csv('public/ucsb/depts.csv'):
        depts.append(
                Department(
                    abbreviation=line[0],
                    super_dept=line[1],
                    url1=line[2],
                    url2=line[3],
                    full_name=line[4],
                    college=line[5],
                    api_name=line[6]
                )
            )

    # sort departments when new ones are added (no longer needed)
    # but may come in handy at some point
    if sort:
        with open('public/ucsb/sorted_depts.csv', 'w+') as g:
            for line in sorted(depts, key=lambda x: x.abbreviation):
                vals = asdict(line).values()
                g.write(', '.join(vals) + '\n')

    return depts


def build_majors_list() -> list[Major]:
    majors = []
    depts = build_depts_list()
    dept_dict = dict(zip([dept.abbreviation for dept in depts], depts))

    for line in read_csv('public/ucsb/majors.csv')[:-1]:
        majors.append(
            Major(
                dept=dept_dict[line[0]],
                full_name=line[1],
                short_name=line[2],
                degree=line[3]
            )
        )

    return majors


def get_existing_jsons(school: str, base_path: str) -> list[str]:
    try:
        os.listdir(f'public/data/{school}')
    except FileNotFoundError:
        os.mkdir(f'public/data/{school}')

    try:
        ls = os.listdir(base_path)
    except FileNotFoundError:
        try:
            ls = os.listdir('.' + base_path)
        except FileNotFoundError:
            os.mkdir(base_path)
            ls = os.listdir(base_path)

    # remove the '.json' part
    return [item[:-5] for item in ls]


def offering_stats():
    total_offerings, total_offered = 0, 0
    for dept in get_existing_jsons('website'):
        offerings = []
        with open(f'public/data/website/{dept}.json', 'r') as f:
            for line in f.readlines():
                offerings.append(line.split(':')[0])

            total_offerings += len(offerings)

        with open(f'public/data/api/{dept}.json', 'r') as f:
            offered = 0
            for line in f.readlines():
                if line.split(':')[0] in offerings:
                    offered += 1

            total_offered += offered

        print(f'{dept} % Offered: ', round(100 * offered / len(offerings), 1))

    print('Total % Offered: ', round(100 * total_offered / total_offerings, 1))


if __name__ == '__main__':
    for major in build_majors_list():
        print(major)
    # offering_stats()
