aread = []

with open('aread.txt') as f:
    for course in f.readlines()[::2]:
        aread.append(course.split('-')[0][:-1])

with open('writ.txt') as f:
    for course in f.readlines()[::2]:
        adj = course.split('-')[0][:-1]
        if adj in aread:
            print(adj)
 