from dataclasses import dataclass
from ..datatypes import WebsiteCourse


@dataclass
class UCBWebsiteCourse(WebsiteCourse):
    terms_offered: str
    course_format: str
    grading: str
    final_exam: str
    learning_outcomes: str
    credit_restrictions: str
