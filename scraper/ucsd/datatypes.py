from dataclasses import dataclass
from ..datatypes import WebsiteCourse


@dataclass
class UCSDWebsiteCourse(WebsiteCourse):
    comments: str
