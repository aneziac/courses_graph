import csv

with open('scraper/depts.csv') as f:
    reader = csv.reader(f)
    for line in reader:
        line = [x.strip() for x in line]

        dept_words = line[0].lower().split(' ')

        # fix naming conflict caused by the education department
        if line[1].strip() == 'ED':
            file_dept_abbrev = '_'.join(dept_words)
        else:
            file_dept_abbrev = ''.join(dept_words)

        # print(f'["{file_dept_abbrev}", "{line[3]}"],')
        # print(f'import {file_dept_abbrev}_json from "../data/{file_dept_abbrev}.json";')
        print('} else if (dept == "' + file_dept_abbrev + '") {\t\nreturn ' + file_dept_abbrev + '_json;')
        # if (dept == 'anth') {
        #     return anth_json;
        # } else if (dept == 'art') {
        #     return art_json;
        # }


with open('scraper/majors.csv', 'r') as major_file:
    reader = csv.reader(major_file)
    for line in reader:
        dept, major = line[0], line[1].strip()
        print(f'"{major}",')
