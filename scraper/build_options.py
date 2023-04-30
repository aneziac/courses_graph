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

        print(f'["{file_dept_abbrev}", "{line[3]}"],')


with open('scraper/majors.csv', 'r') as major_file:
    reader = csv.reader(major_file)
    for line in reader:
        dept, major = line[0], line[1].strip()
        print(f'"{major}",')
