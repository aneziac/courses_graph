# Scraper

Web scraper that pulls data from UCSB website and converts it to json files.

# Install instructions
Default full installation and build on MacOS / Linux
```sh
$ source build_project.sh
```


# List of bugs

## To do

General
- ED M vs EDM naming conflict
- look into AA-ZZ course prereqs (MAth 104a requires CMPSC 5AA-ZZ)
- handle concurrent prereqs

Courses
**Chem 112B, 146** failing because online is also a possible prereq
**AS AM 8H** not picking up missing period - representative example of larger problem of periods being included in capture
**eacs 199** erroneously lists itself along with eacs 3 + 5 as prereqs (due to 3.5 gpa requirement plus mention of eacs 199 in prereq description)
**earth 155/155L** -- list each other as prereqs [due to requirement for concurrent enrollment]
**ece 227a** -- your code is parsing this line incorrectly in terms of the logic
**ed 191D** -- double edges w/ 191A/B/C/W, edge to itself; also, parsing logic incorrectly, it says A, B, C or W and you are reading this as (A) and (B) and (C or W)
**ed 257a** -- lists 257b as a prereq when it's the other way around
**env s 15bl** -- lists itself as a prereq, also it's concurrent w/ 15
**FEMST 195HA** -- lists itself as a prereq
**FR 10B** -- lists itself as a prereq
**JAP 199** -- lists itself as a prereq
**KOR 199** -- lists itself as a prereq
**LING 3B/C, LING 12** -- list themselves as prereqs
**MCDB 1B** -- triple edge w/ MCDB 1A, lists itself as a prereq
**POLS 155L** -- double edge w/ POLS 155 (due to concurrent enrollment, each is listed as the other's prereq)
**PSTAT 109** -- math 34b/2b/3b all listed as prereqs twice (can be taken simultaneously)
**PSTAT 207A/B/C** -- each of them list the others as prereqs due to phrasing in the thing lol
**thtr 151a** -- thtr 110/111a, both pairs list each other as prereqs of each other due to concurrent enrollment
**thtr 151b** -- thtr 110b/111b, both list each other as prereqs of each other, due to concurrent enrollment
**thtr 151c** -- thtr 110c/111c, both list each other as prereqs of each other, due to concurrent enrollment


## Fixed

**chem 142a** -- chem 142b [double edge]
**chem 142a** -- chem 146 [double edge]
**earth 133** -- math 3a/3b [double edge]
**earth 135** -- math 3a/3b [double edge]
**earth 136** -- math 3a/3b [double edge]
**econ 5** -- math 2b/3b/34b [double edge]
**eemb 128** -- eemb 2/3 [double edge]
**env s 100** -- double edge with ["EEMB 2", "MCDB 1A"]
**env s 122ne** -- writing 109 [double edge]
**env s 128** -- eemb 2/3 [double edge]
**env s 171** -- eemb 2/3 [double edge]
**MATRL 268A** -- ece 162c [double edge]
**MCDB 101L** -- MCDB 101B [double edge]
**MCDB 108A** -- double edge with MCDB 1a/b
**MCDB 108AH** -- double edge with MCDB 108A
**MCDB 108B** -- double edge with MCDB 108A
**MCDB 108C** -- double edge with MCDB 108A/B, PHYS 6C
**MCDB 123** -- double edge with MCDB 108A
**"MCDB 136H"** -- "MCDB 101B" [double edge]
**MCDB 140L** -- quadruple (?) edge with MCDB 101A/B/C
**MCDB 145** -- double edge with MCDB 108A
**MCDB W  108A** -- double edge with MCDB 1A/B
**MUS 115** -- double edge with MUS 3A
**PSTAT 176** -- pstat 160a/b + 170, all have double edges
**PSTAT 276** -- pstat 160a/b + 170, all have doubel edges
**span 4** -- span 3, triple edge
**span 5** -- span 4, triple edge
**span 6** -- span 5, triple edge
**span 8b** -- span 4, triple edge
**span 25** -- span 5, double edge
**tmp 131** -- writ 50, double edge
**tmp 132** -- writ 50, double edge
