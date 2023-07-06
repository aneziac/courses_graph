<script setup lang="ts">
import SearchBar from './components/SearchBar.vue'
</script>

<template>
    <h1>UCSB Course Prerequisite Graph</h1>
    <SearchBar>
    </SearchBar>
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
