import json
import requests
from dataclasses import asdict
import logging
from typing import Optional, List, Dict
import sys
import shutil
import os
import re

from datatypes import Course, Department
from readers import get_existing_jsons


class Scraper:
    def __init__(self, name, extra_path):
        argv = sys.argv

        self.overwrite = (len(argv) > 1 and 'o' in argv[1])
        print(f'Scraping {name} with overwrite={self.overwrite}')

        self.extra_path = extra_path

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
                shutil.rmtree('data')
            except FileNotFoundError:
                pass
            os.mkdir('data')

        self._EXSTING_JSONS = get_existing_jsons(extra_path)

    def write(self, dept: Department) -> bool:
        return (self.overwrite or dept.file_abbrev not in self._EXSTING_JSONS)

    def write_json(self, dept: Department, courses: List[Course]) -> None:
        filename = f'data/{self.extra_path}/{dept.file_abbrev}.json'

        sorted_courses = sorted(courses, key=lambda course: course.order)

        with open(filename, 'w+') as f:
            f.write('{')

            for i, course in enumerate(sorted_courses):
                f.write(f'"{course.sub_dept} {course.number}": ')
                f.write(json.dumps(asdict(course)))

                if i != len(courses) - 1:
                    f.write(',')
                f.write('\n')

            f.write('}')

        logging.info(f'[S] Wrote data for {dept.full_name} department in {filename}')

    def fetch(self,
              url: str,
              fail_message: str,
              params: Dict[str, str]={},
              headers: Dict[str, str] = {}) -> Optional[requests.Response]:
        r = requests.get(url, params=params, headers=headers)

        if 200 != r.status_code:
            logging.warning(fail_message)
            return None

        return r

    # generalized inverse mapping

class ScraperException(Exception):
    pass
