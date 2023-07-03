<script setup lang="ts">
import { computed, ref } from 'vue'
import SearchItem from './components/SearchItem.vue'
import { csv } from 'd3-fetch'

const searchTerm = ref('');
const searchItems = ref([])

csv('../scraper/depts.csv', (data) => {
    searchItems.value.push(data[" full name"]);
});

csv('../scraper/majors.csv', (data) => {
    searchItems.value.push(data[" short name"])
})

const searchResults = computed(() => {
    if (searchTerm.value) {
        return searchItems.value.filter((s) =>
            s.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    }
    return searchItems.value.slice(0, 6);
})
</script>

<template>
  <h1>UCSB Course Prerequisite Graph</h1>
  <div class="main-search-bar">
    <input v-model="searchTerm" placeholder="Enter a department or degree program...">
  </div>
  <ul>
    <li v-for="result in searchResults">
        <SearchItem>
            {{ result }}
        </SearchItem>
    </li>
  </ul>
</template>

<style>
h1 {
    color:brown;
    font-family: Courier New;
    padding-left: 20px;
    padding-top: 20px;
}
.main-search-bar {
    text-align: center;
    margin-top: 15vh;
}
input {
    width: 70vw;
    height: 7vh;
    font-size: 20px;
}
ul {
    list-style-type: none;
}
</style>
