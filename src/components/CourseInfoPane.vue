<script setup lang="ts">
</script>

<template>
    <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered>
      <q-item>
        <q-item-section>
            <q-item-label overline>TITLE</q-item-label>
            <q-item-label>
                <slot name="title"></slot>
            </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
            <q-item-label overline>DESCRIPTION</q-item-label>
            <q-item-label>
                <slot name="description"></slot>
            </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
            <q-item-label overline>PREREQS</q-item-label>
            <q-item-label>
                <slot name="prereqs"></slot>
            </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline>UNITS</q-item-label>
          <q-item-label>
            <slot name="units"></slot>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
