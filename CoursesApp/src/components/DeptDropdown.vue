<script lang="ts">
import { ref } from 'vue'
const selected = ref('anth')

export default {
    data() {
      return {
        selected: "anth",
        options: [
            ["anth", "Anthropology"],
            ["art", "Art"],
            // ["artcs", "Art (Creative Studies)"],
            // ["arthi", "Art History"],
            ["asam", "Asian American Studies"],
            // ["astro", "Astronomy"],
            // ["bioe", "Biological Engineering"],
            // ["biolcs", "Biology (Creative Studies)"],
            ["blst", "Black Studies"],
            // ["bmse", "Biomolecular Science and Engineering"],
            ["clit", "Comparative Literature"],
            ["che", "Chemical Engineering"],
            ["chst", "Chicana and Chicano Studies"],
            ["chem", "Chemistry and Biochemistry"],
            ["chemcs", "Chemistry (Creative Studies)"],
            ["chin", "Chinese"],
            ["class", "Classics"],
            ["cmpsc", "Computer Science"],
            ["cmptgcs", "Computing (Creative Studies)"],
            // ["cncsp", "Counseling, Clinical, School Psychology"],
            // ["comm", "Communications"],
            ["dance", "Dance"],
            // ["dyns", "Dynamical Neuroscience"],
            ["eacs", "East Asian Cultural Studies"],
            ["earth", "Earth Science"],
            ["ece", "Electrical Computer Engineering"],
            ["econ", "Economics"],
            ["ed", "Education"],
            // ["ed_a", "Education: Visual Art"],
            // ["ed_e", "Education: English"],
            // ["ed_hss", "Education: History & Social Science"],
            // ["ed_ia", "Education: Industrial Technology Arts"],
            // ["ed_l", "Education: Literacy"],
            // ["ed_la", "Education: Language Arts"],
            // ["ed_m", "Education: Mathematics"],
            // ["ed_r", "Education: Reading"],
            // ["ed_s", "Education: Science"],
            // ["ed_st", "Education: Secondary: Science"],
            // ["ed_wl", "Education: World Language"],
            ["eds", "Environmental Data Science"],
            ["eemb", "Ecology, Evolution, and Marine Biology"],
            ["engl", "English"],
            ["engr", "Engineering"],
            ["envs", "Environmental Studies"],
            // ["es", "Exercise Sport"],
            // ["esm", "Environmental Science & Management"],
            // ["ess", "Exercise & Sport Studies"],
            ["famst", "Film and Media Studies"],
            ["femst", "Feminist Studies"],
            ["fr", "French"],
            ["geog", "Geography"],
            ["ger", "German"],
            ["globl", "Global Studies"],
            // ["gps", "Global Peace and Security"],
            ["greek", "Greek"],
            ["heb", "Hebrew"],
            ["hist", "History"],
            // ["int", "Interdisciplinary"],
            // ["intcs", "Interdisciplinary (Creative Studies)"],
            ["ital", "Italian"],
            ["japan", "Japanese"],
            ["kor", "Korean"],
            ["lais", "Latin American and Iberian Studies"],
            ["latin", "Latin"],
            ["ling", "Linguistics"],
            // ["marincs", "Marine Science (Creative Studies)"],
            // ["marsc", "Marine Science"],
            // ["mat", "Media Arts and Technology"],
            ["math", "Mathematics"],
            // ["mathcs", "Mathematics (Creative Studies)"],
            ["matrl", "Materials"],
            ["mcdb", "Molecular, Cellular, and Developmental Biology"],
            ["me", "Mechanical Engineering"],
            // ["mest", "Medieval Studies"],
            // ["mes", "Middle East Studies"],
            ["ms", "Military Science (Army ROTC)"],
            ["mus", "Music"],
            ["phil", "Philosophy"],
            ["phys", "Physics"],
            ["physcs", "Physics (Creative Studies)"],
            ["pols", "Political Science"],
            ["port", "Portuguese"],
            ["pstat", "Statistics & Applied Probability"],
            ["psy", "Psychological & Brain Sciences"],
            ["rgst", "Religious Studies"],
            ["russ", "Russian"],
            // ["shs", "Speech & Hearing Sciences"],
            // ["slav", "Slavic"],
            ["soc", "Sociology"],
            ["span", "Spanish"],
            // ["thtr", "Theater"],
            ["tmp", "Technology Management"],
            // ["w&lcs", "Writing & Literature (Creative Studies)"],
            ["writ", "Writing"],
        ]
      }
    },
    watch: {
        selected: function (value) {
            this.$emit('update', value);
        }
    }
}
</script>

<template>
    <div>
        <select class="form-control form-control-sm" v-model="selected">
            <option v-for="option in options" :value="option[0]" :text="option[1]">
            </option>
        </select>
        <!-- <span>Selected: {{ selected }}</span> -->
    </div>
</template>
