# Scraper

Web scraper that pulls data from UCSB website and converts it to json files.

# Running
In the root directory, run
```sh
$ ./build_project.sh
```
or run the scraper directly with
```sh
$ python scraper
```

Run tests via pytest.

# Notable issues to fix

## Sequences
- Phys 131

## Repeated Courses
- Geog 13
- Env S 15

## Probabilities
- Courses offered every two years should have probabilities reflecting that
- Test how well predictions do and adjust accordingly

# Ideas
- Size of node changes based on number of students
