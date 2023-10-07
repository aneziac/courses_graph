<script setup lang="ts">
import { computed, ref, Ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import SearchItem from './SearchItem.vue';
import { csv } from 'd3-fetch';


const router = useRouter();

interface SearchData {
    degree: string;  // type of degree, or dept
    dept?: string;
    text: string;  // regular name
    alt: string;  // alternate name
    college: string;
}

const searchTerm = ref('');
const searchItems: Ref<Array<SearchData>> = ref([]);
const emit = defineEmits(['focus']);
const props = defineProps(['searchResultCount']);


csv('/depts.csv').then(data => {
    data.forEach(d => {
        searchItems.value.push({
            degree: 'Dept',
            text: d[' full name']!.trim(),
            alt: d['abbrev']!.toLowerCase().trim(),
            college: d[' college']!.trim()
        })
    })
});

csv('/majors.csv').then(data => {
    data.forEach(d => {
        if (!d[' degree type']!) {
            return;
        }

        searchItems.value.push({
            degree: d[' degree type'].trim(),
            dept: d[' dept']!.trim(),
            text: d[' short name']!.trim(),
            alt: d[' full name']!.trim().toLowerCase(),
            college: d['abbrev'] === 'ENGR' ? 'COE' : 'L&S'
        })
    })
});

const searchResults = computed(() => {
    if (searchTerm.value) {
        return searchItems.value.filter((s) =>
            s.text.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            s.alt.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    }
    return searchItems.value;
});

function toLocalPage(searchResult: SearchData) {
    if (searchResult.degree === 'Dept') {
        router.push('/' + searchResult.alt.replaceAll(' ', ''));

    // subpage if we have a degree
    } else {
        let strippedText = searchResult.text.replace(' - ', '-')
                                            .replace(' BA',  '')
                                            .replace(' BS',  '')
                                            .replace(' BFA', '');

        if (!searchResult.text.includes('Pre-')) {
            strippedText += ' ' + searchResult.degree
        }

        let degreeName = strippedText.toLowerCase().replaceAll(' ', '-');
        router.push('/' + searchResult.dept + '/' + degreeName);
    }

    searchTerm.value = '';
}

if (props.searchResultCount > 10) {
    onMounted(() => {
        nextTick(() => {
            document.getElementById('search')!.focus();
        })
    });
}

function startfocus(): void {
    emit("focus", true);
}

function stopfocus(): void {
    setTimeout(() => {
        emit("focus", false)
    }, 150);
}
</script>

<template>
    <span class="main-search-bar">
        <input v-model="searchTerm" placeholder="Enter a department or degree program..."
               id="search" @focusin="startfocus()" @focusout="stopfocus()">
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
    display: inline;
    height: 100%;
}

input {
    width: 100%;
    min-height: 40px;
    font-size: 15px;
}

ul {
    list-style: none;
    padding-left: 0em !important;
    overflow: scroll;
    height: 80%;
}
</style>
