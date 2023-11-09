# courses_graph

Prerequisite visualization of courses at various campuses at the University of California.
This project was originally begun by UCSB students Nate Annau and Ashwin Rajan as part of Coders SB, but it's now open source.

## Design

All data for this project is fetched via `./scraper`, which uses regex to parse through the [old UCSB course catalog](https://my.sa.ucsb.edu/catalog/Current/Index.aspx).
The scraper grabs data from course pages, major sheet pdfs, and the [UCSB API](https://developer.ucsb.edu/).
It should take a few minutes to generate all the necessary data.

Course data is then saved locally as JSON, which is read by the Vue webapp located in `./src`.
Nodes are organized in a hierarchical structure using the constraint based optimization library [WebCola](https://github.com/tgdwyer/WebCola).

Other core libraries used are `beautifulsoup`, `pypdf`, `d3.js`, `Vite`, and `Quasar`.
I'm using `pytest` and `jest` to unittest.

# Contributing

I am happy to consider PRs on this project.

## Developing

I wrote the shell scripts to help with this but I don't know how useful they will be.
In zsh or bash you should be able to run
```sh
% source install_project.sh
```
to pick up dependencies, then
```sh
% python scraper
```
to generate the data.
When that's finished, use
```sh
$ npm run dev
```
to work on the site.
