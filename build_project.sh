#!/bin/zsh

read "answer?Build scraping data? (y/n) ";
if [[ "$answer" =~ ^[Yy]$ ]]; then
    if ! (which python); then
        source install_project.sh
    fi
    python scraper/course_scraper.py -o
fi

read "answer?Build app? (y/n) ";
if [[ "$answer" =~ ^[Yy]$ ]]; then
    if ls | grep CoursesApp; then
        cd CoursesApp
    fi
    if ! (which npm); then
        source install_project.sh
    fi
    npm run build
    cd ..
fi
