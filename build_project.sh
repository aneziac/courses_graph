#!/bin/zsh

read "answer?Build scraping data? (y/n) ";
if [[ "$answer" =~ ^[Yy]$ ]]; then
    if ! (which python); then
        source install_project.sh
    fi
    python scraper/course_scraper.py
fi

read "answer?Build app? (y/n) ";
if [[ "$answer" =~ ^[Yy]$ ]]; then
    if ls | grep CoursesApp; then
        cd CoursesApp
    fi
    if ! (which npx); then
        source install_project.sh
    fi
    npx expo start
fi
