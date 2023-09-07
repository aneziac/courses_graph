<script setup lang="ts">
import { computed, ref, Ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import SearchItem from './SearchItem.vue';
import { csv } from 'd3-fetch';

const router = useRouter();

interface searchData {
    degree: string;  // type of degree, or dept
    dept?: string;
    text: string;  // regular name
    alt: string;  // alternate name
    college: string;
}

const searchTerm = ref('');
const searchItems: Ref<Array<searchData>> = ref([]);

csv('../../scraper/depts.csv', (data: Object) => {
    searchItems.value.push({
        degree: 'Dept',
        text: data[' full name'].trim(),
        alt: data['abbrev'].toLowerCase().trim(),
        college: data[' college'].trim()
    });
});

csv('../../scraper/majors.csv', (data: Object) => {
    if (!data[' degree type']) {
        return;
    }

    searchItems.value.push({
        degree: data[' degree type'].trim(),
        dept: data[' dept'].trim(),
        text: data[' short name'].trim(),
        alt: data[' full name'].trim().toLowerCase(),
        college: data['abbrev'] == 'ENGR' ? 'COE' : 'L&S'
    });
});

const searchResults = computed(() => {
    if (searchTerm.value) {
        return searchItems.value.filter((s) =>
            s.text.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            s.alt.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    }
    return searchItems.value;
})

function toLocalPage(searchResult: searchData) {
    if (searchResult.degree === 'Dept') {
        router.push('/' + searchResult.alt.replaceAll(' ', ''));

    // subpage if we have a degree
    } else {
        let strippedText = searchResult.text.replace(' - ', '-')
                                            .replace(' BA', '')
                                            .replace(' BS', '')
                                            .replace(' BFA', '');

        if (!searchResult.text.includes('Pre-')) {
            strippedText += ' ' + searchResult.degree
        }

        let degreeName = strippedText.toLowerCase().replaceAll(' ', '-');
        router.push('/' + searchResult.dept + '/' + degreeName);
    }
}

onMounted(() => {
    nextTick(() => {
        document.getElementById('search').focus();
    })
});
</script>

<template>
    <span class="main-search-bar">
        <input v-model="searchTerm" placeholder="Enter a department or degree program..." id="search">
    </span>
    <ul>
        <li v-for="result in searchResults">
            <SearchItem @click="toLocalPage(result)">
                <template #title>
                    {{ result.text }}
                </template>
                <template #kind>
                    {{ result.degree }}
                </template>
                <template #college>
                    {{ result.college }}
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
