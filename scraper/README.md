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

Run tests via
```sh
$ PYTHONPATH=scraper pytest
```


# List of bugs

## To do

Change major scraper to output shortened names as keys and append major name in url in the website.

**Chem 112B, 146** failing because online is also a possible prereq
**AS AM 8H** not picking up missing period - representative example of larger problem of periods being included in capture
**earth 155/155L** -- list each other as prereqs [due to requirement for concurrent enrollment]
**ece 227a** -- your code is parsing this line incorrectly in terms of the logic
**ed 191D** -- double edges w/ 191A/B/C/W, edge to itself; also, parsing logic incorrectly, it says A, B, C or W and you are reading this as (A) and (B) and (C or W)
**ed 257a** -- lists 257b as a prereq when it's the other way around
**env s 15bl** -- lists itself as a prereq, also it's concurrent w/ 15
**POLS 155L** -- double edge w/ POLS 155 (due to concurrent enrollment, each is listed as the other's prereq)
**PSTAT 109** -- math 34b/2b/3b all listed as prereqs twice (can be taken simultaneously)
**PSTAT 207A/B/C** -- each of them list the others as prereqs due to phrasing in the thing lol
**thtr 151a** -- thtr 110/111a, both pairs list each other as prereqs of each other due to concurrent enrollment
**thtr 151b** -- thtr 110b/111b, both list each other as prereqs of each other, due to concurrent enrollment
**thtr 151c** -- thtr 110c/111c, both list each other as prereqs of each other, due to concurrent enrollment
