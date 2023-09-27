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

      <q-item>
        <q-item-section>
          <q-item-label overline>GE FIELDS</q-item-label>
          <q-item-label>
            <slot name="gefields"></slot>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline>LAST OFFERED</q-item-label>
          <q-item-label>
            <slot name="lastoffered"></slot>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline>OFFERING CHANCES</q-item-label>
          <q-item-label>
            <slot name="offeringchances"></slot>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
