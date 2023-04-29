<!--
We can create two-way bindings between state and form inputs using the v-model directive.
-->

<script lang="ts">
import { ref } from 'vue'
const selected = ref('A')

export default {
    data() {
      return {
        selected: null,
        options: [
            "test",
            "hello",
            "ad;f"
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
        <select v-model="selected">
            <option v-for="option in options" :value="option" :text="option">
            </option>
        </select>
        <span>Selected: {{ selected }}</span>
    </div>
</template>

<!-- <template>
    <div>
      <b-form-select
        v-model="selected"
        :options="options"
        class="mb-3"
        value-field="item"
        text-field="name"
        disabled-field="notEnabled"
      ></b-form-select>

      <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
      return {
        selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' },
          { value: { C: '3PO' }, text: 'This is an option with object value' },
          { value: 'd', text: 'This one is disabled', disabled: true }
        ]
      }
    }
  }
</script>

<style>
.ui-bar {
    width: 100vw;
    height: 20vh;
    background-color: aqua;
}
</style> -->
