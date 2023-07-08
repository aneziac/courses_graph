<script setup lang="ts">
import SearchBar from '../components/SearchBar.vue'
</script>

<template>
    <h1>UCSB Course Prerequisite Graph</h1>
    <div class="search-interface">
        <SearchBar/>
    </div>
</template>

<style>
h1 {
    color:brown;
    font-family: Courier New;
    padding-left: 20px;
    padding-top: 20px;
    text-align: center;
}

.search-interface {
    padding-top: 10vh;
    width: 70vw;
    height: 70vh;
    margin: 0 auto;
    font-size: 25px;
}
</style>
