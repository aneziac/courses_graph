<script setup lang="ts">
</script>

<template>
    <div class="searchItem">
        <slot name="title"></slot>
        <span class="kind">
            <slot name="kind"></slot>
        </span>
    </div>
</template>

<style>
.searchItem {
    padding-top: 10px;
    padding-bottom: 25px;
    height: 7vh;
    padding-left: 1vw;
    font-size: 20px;
}

.kind {
    margin-left: 10px;
    border-radius: 25px;
    background: #73AD21;
    padding: 5px;
    font-size: 15px;
}

.searchItem:hover {
    background-color: #0c6dec;
    color: rgb(255, 255, 255);
}
</style>
