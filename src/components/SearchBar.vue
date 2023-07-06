<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import SearchItem from './SearchItem.vue'
import { csv } from 'd3-fetch'

interface searchData {
    kind: string;
    text: string;
    alt: string;
}

const searchTerm = ref('');
const searchItems: Ref<Array<searchData>> = ref([]);

csv('../../scraper/depts.csv', (data: Object) => {
    searchItems.value.push({
        kind: 'Dept', text: data[' full name'], alt: data['abbrev']
    });
});

csv('../../scraper/majors.csv', (data: Object) => {
    searchItems.value.push({
        kind: data[' degree type'].trim(), text: data[' short name'], alt: data[' full name']
    });
});

const searchResults = computed(() => {
    if (searchTerm.value) {
        return searchItems.value.filter((s) =>
            s.text.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            s.alt.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    }
    return searchItems.value
})
</script>

<template>
    <div class="main-search-bar">
        <input v-model="searchTerm" placeholder="Enter a department or degree program...">
    </div>
    <ul>
        <li v-for="result in searchResults">
            <SearchItem>
                <template #title>
                    {{ result.text }}
                </template>
                <template #kind>
                    {{ result.kind }}
                </template>
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
    list-style: none;
    padding-left: 0em !important;
    height: 50vh;
    overflow: auto;
    width: 70vw;
    margin: 0 auto;
}
</style>
