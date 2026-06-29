<!-- src/ui/components/ExportActions.vue -->
<script setup lang="ts">
const props = defineProps<{
  dateStr: string;
}>();

const handleExport = () => {
  // Retrieve everything starting with 'mini_tools_time_'
  const exportData: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('mini_tools_time_')) {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          exportData[key] = JSON.parse(val);
        } catch (e) {
          exportData[key] = val;
        }
      }
    }
  }

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `mini_tools_time_tracker_backup_${props.dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="export-actions">
    <button class="btn-secondary export-btn" @click="handleExport">
      {{ $t('export.btnExport') }}
    </button>
  </div>
</template>

<style scoped>
.export-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.export-btn {
  width: 100%;
  max-width: 320px;
  padding: 0.75rem 1rem;
}
</style>
