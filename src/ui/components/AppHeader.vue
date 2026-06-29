<!-- src/ui/components/AppHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  subtitle: string;
  badges: string[];
  locale: string;
  languages: { code: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:locale', value: string): void;
}>();

const activeLocale = computed({
  get: () => props.locale,
  set: (val) => emit('update:locale', val)
});
</script>

<template>
  <header class="app-header">
    <div class="header-top">
      <h1>{{ title }}</h1>
      <select class="lang-selector" v-model="activeLocale" aria-label="Select language">
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.label }}
        </option>
      </select>
    </div>
    <p class="subtitle">{{ subtitle }}</p>
    <div class="badges">
      <span class="badge" v-for="badge in badges" :key="badge">{{ badge }}</span>
    </div>
  </header>
</template>
