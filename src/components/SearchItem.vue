<script setup lang="ts">
</script>

<template>
    <div class="searchItem">
        <slot>Placeholder</slot>
    </div>
</template>

<style>
.searchItem {
    padding-top: 10px;
    padding-bottom: 25px;
    width: 70vw;
    height: 7vh;
    padding-left: 1vw;
    margin: 0 auto;
    font-size: 20px;
}

.searchItem:hover {
    background-color: #0c6dec;
    color: rgb(255, 255, 255);
}
</style>
