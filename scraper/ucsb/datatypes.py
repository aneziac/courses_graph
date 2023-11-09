from dataclasses import dataclass, field
from ..datatypes import Course, WebsiteCourse


@dataclass
class UCSBWebsiteCourse(WebsiteCourse):
    comments: str
    recommended_prep: str
    professor: str


@dataclass  # hacky way to get property serialization working
class ProbabilityCourse(Course):
    offered_probabilities: list[float] = field(init=False)


@dataclass
class UCSBAPICourse(ProbabilityCourse):
    offered: list[str]
    general_education_fields: list[str]

    @property
    def offered_probabilities(self) -> list[float]:
        def weight_function(x):
            return x ** 1.2

        start_year = 2018  # int(self.offered[0].split()[1])
        end_year = 2023  # int(self.offered[-1].split()[-1])
        probabilities = [0.0] * 4

        weight_sum = 0
        for year in range(start_year, end_year + 1):
            delta_time = year - start_year + 1
            weight = weight_function(delta_time)
            weight_sum += delta_time * weight

            for i, quarter in enumerate(['Winter', 'Spring', 'Summer', 'Fall']):
                if f'{quarter} {year}' in self.offered:
                    probabilities[i] += delta_time * weight

        for i in range(len(probabilities)):
            probabilities[i] = round(probabilities[i] / weight_sum, 3)

        return probabilities
