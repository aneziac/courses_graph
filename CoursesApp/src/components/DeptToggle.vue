<script lang="ts">
export default {
    data() {
        return {
           isActive: true
        }
    },
    watch: {
        isActive: function () {
            console.log('hello');
            this.$emit('update');
        }
    }
}
</script>

<template>
    <button :class="{active:isActive}" @click="isActive = !isActive;">
    {{isActive ? 'ALL' : 'DEPT'}}
    </button>
</template>
