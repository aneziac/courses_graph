from dataclasses import dataclass
from ..datatypes import WebsiteCourse


@dataclass
class UCLAWebsiteCourse(WebsiteCourse):
    general_informaiton: str
    course_format: str
    grading: str
    textbook: str
    learning_outcomes: str
