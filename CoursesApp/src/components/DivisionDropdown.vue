<script lang="ts">
import { ref } from 'vue'
const selected = ref('A')

export default {
    data() {
      return {
        selected: null,
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
        <!-- <span>Selected: {{ selected }}</span> -->
    </div>
</template>
