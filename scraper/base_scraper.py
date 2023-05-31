import json
import requests
from dataclasses import asdict
import logging
from typing import Optional, List, Dict
import sys
import shutil
import os

from datatypes import Course


class Scraper:
    def __init__(self, name):
        argv = sys.argv

        self.overwrite = (len(argv) > 1 and 'o' in argv[1])
        print(f'Scraping {name} with overwrite={self.overwrite}')

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

    def write_json(self, filename: str, courses: List[Course]) -> None:
        with open(filename, 'w+') as f:
            f.write('{')

            for i, course in enumerate(courses):
                f.write(f'"{course.sub_dept} {course.number}": ')
                f.write(json.dumps(asdict(course)))

                if i != len(courses) - 1:
                    f.write(',')
                f.write('\n')

            f.write('}')

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
