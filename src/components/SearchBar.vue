<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchItem from './SearchItem.vue'
import { csv } from 'd3-fetch'

const router = useRouter();

interface searchData {
    kind: string;
    text: string;
    alt: string;
}

const searchTerm = ref('');
const searchItems: Ref<Array<searchData>> = ref([]);

csv('../../scraper/depts.csv', (data: Object) => {
    searchItems.value.push({
        kind: 'Dept', text: data[' full name'], alt: data['abbrev'].toLowerCase()
    });
});

csv('../../scraper/majors.csv', (data: Object) => {
    searchItems.value.push({
        kind: data[' degree type'].trim(), text: data[' short name'], alt: data[' full name'].trim().toLowerCase()
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

function toLocalPage(searchResult: searchData) {
    router.push('/' + searchResult.alt);
}
</script>

<template>
    <span class="main-search-bar">
        <input v-model="searchTerm" placeholder="Enter a department or degree program...">
    </span>
    <ul>
        <li v-for="result in searchResults">
            <SearchItem @click="toLocalPage(result)">
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
.main-search-bar {
    text-align: center;
    height: 7vh;
    display: block;
}

input {
    width: 100%;
}

ul {
    list-style: none;
    padding-left: 0em !important;
    overflow: auto;
    height: 100%;
}
</style>
