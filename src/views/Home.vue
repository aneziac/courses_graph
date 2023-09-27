<script setup lang="ts">
import SearchBar from '../components/SearchBar.vue'
</script>

<template>
    <div id="main">
        <h3>ucsbcourses.com</h3>
        <div class="search-interface">
            <SearchBar :searchResultCount="999"/>
        </div>
    </div>
</template>

<style>
h3 {
    margin-top: 0px;
    color: brown;
    font-family: Courier New;
    padding-left: 20px;
    padding-top: 20px;
    text-align: center;
}

.search-interface {
    width: 70vw;
    height: 65vh;
    margin: 0 auto;
    font-size: 25px;
}
</style>
