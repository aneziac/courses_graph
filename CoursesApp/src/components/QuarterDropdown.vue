<script lang="ts">
import { ref } from 'vue'
const selected = ref('A')

export default {
    data() {
      return {
        selected: ["All", "All"],
        options: [
            ["All", "All"],
            [["Summer 2020", "Fall 2020", "Winter 2021", "Spring 2021"], "2020-21 school year"],
            [["Summer 2021", "Fall 2021", "Winter 2022", "Spring 2022"], "2021-22 school year"],
            [["Summer 2022", "Fall 2022", "Winter 2023", "Spring 2023"], "2022-23 school year"],
            ["Summer 2023"]
        ]
      }
    }
}
</script>

<template>
    <div>
        <select v-model="selected">
            <option v-for="option in options" :value="option[0]" :text="option[1]">
            </option>
        </select>
        <!-- <span>Selected: {{ selected }}</span> -->
    </div>
</template>
