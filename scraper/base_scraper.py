from abc import ABC, abstractmethod
import json
import requests
from dataclasses import asdict
import logging
from typing import Optional, Sequence
import sys
import shutil
import os
import re

from datatypes import Course, Department, WebsiteCourse
from readers import get_existing_jsons


class Scraper:
    def __init__(self, name: str, school: str, extra_path: str):
        argv = sys.argv

        self.overwrite = (len(argv) > 1 and 'o' in argv[1])
        print(f'\nScraping {name} with overwrite={self.overwrite}')

        self.base_path = f'public/{school}/data/{extra_path}'

        logging.basicConfig(
            format='[%(asctime)s] %(message)s',
            level=logging.INFO,
            datefmt='%Y-%m-%d %H:%M:%S',
            handlers=[
                logging.FileHandler('scraper.log'),
                logging.StreamHandler()
            ]
        )

        if self.overwrite and 'c' in argv[1]:
            try:
                shutil.rmtree(self.base_path)
            except FileNotFoundError:
                pass
            os.mkdir(self.base_path)

        self._EXISTING_JSONS = get_existing_jsons(school, self.base_path)

    def should_write(self, dept: Department) -> bool:
        return (self.overwrite or dept.file_abbrev not in self._EXISTING_JSONS)

    def write_json(self, dept: Department, courses: Sequence[Course]) -> None:
        filename = f'{self.base_path}/{dept.file_abbrev}.json'

        sorted_courses = sorted(courses, key=lambda course: course.order)

        with open(filename, 'w+') as f:
            f.write('{')

            for i, course in enumerate(sorted_courses):
                f.write(f'"{course.dept.abbreviation} {course.number}": ')
                f.write(json.dumps(asdict(course)))

                if i != len(courses) - 1:
                    f.write(',')
                f.write('\n')

            f.write('}')

        logging.info(f'[S] Wrote data for {dept.full_name} department in {filename}')

    def fetch(self,
              url: str,
              fail_message: str,
              params: dict[str, str] = {},
              headers: dict[str, str] = {}) -> Optional[requests.Response]:
        r = requests.get(url, params=params, headers=headers)

        if 200 != r.status_code:
            logging.warning(fail_message)
            return None

        return r


class ScraperException(Exception):
    pass


class CourseScraper(ABC):
    def __init__(self, school: str):
        self._regexes: dict[str, re.Pattern] = {}

        self._compile_static_regex()
        self._scraper = Scraper('course website', school, 'website')

    # We separate regex into static which is only compiled once, and regex that changes based on the dept name
    @abstractmethod
    def _compile_static_regex(self) -> None:
        raise NotImplementedError

    @abstractmethod
    def dept_to_url(self, dept: Department) -> str:
        raise NotImplementedError

    @abstractmethod
    def compile_data(self, url: str, dept: Department, debug=False) -> list[WebsiteCourse]:
        raise NotImplementedError

    def write_json(self, dept: Department, overwrite=False) -> None:
        if not overwrite and not self._scraper.should_write(dept):
            return

        url = self.dept_to_url(dept)

        courses = self.compile_data(url, dept)
        if not courses:
            logging.warning(f'[F] Failed to retrieve data for {dept.full_name}')
            return

        self._scraper.write_json(dept, courses)
