<script lang="ts">
import { ref } from 'vue'
const selected = ref('A')

export default {
    data() {
      return {
        selected: ["All"],
        options: [
            "All",
            "Anthropology",
            "Anthropology-Archaeology Emphasis",
            "Anthropology-Biological Emphasis",
            "Anthropology-Cultural Emphasis",
            "Art",
            "Asian American Studies",
            "Chemistry BS",
            "Economics",
            "Biological Sciences BA",
            "Aquatic Biology",
            "Biological Sciences BS",
            "Ecology and Evolution",
            "Physiology",
            "Zoology",
            "English",
            "Environmental Studies BA",
            "French",
            "Italian Studies",
            "Geography",
            "History",
            "History of Public Policy-Law",
            "Mathematics BS",
            "Applied Mathematics",
            "Mathematics BA",
            "Financial Mathematics-Statistics",
            "Physics BS",
            "Physics BA",
        ]
      }
    }
}
</script>

<template>
    <div>
        <select v-model="selected">
            <option v-for="option in options" :value="option" :text="option">
            </option>
        </select>
        <!-- <span>Selected: {{ selected }}</span> -->
    </div>
</template>
