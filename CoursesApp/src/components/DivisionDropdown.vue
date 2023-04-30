<script lang="ts">
import { ref } from 'vue'
const selected = ref('Both')

export default {
    data() {
      return {
        selected: "Both",
        options: [
            "Both",
            "LD",
            "UD"
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
        <span>Selected: {{ selected }}</span>
    </div>
</template>
