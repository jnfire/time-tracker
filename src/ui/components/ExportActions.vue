<!-- src/ui/components/ExportActions.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  dateStr: string;
}>();
const fileInput = ref<HTMLInputElement | null>(null);

// Modal states
const showConfirmModal = ref(false);
const showErrorModal = ref(false);
const pendingImportData = ref<Record<string, any> | null>(null);

const handleExport = () => {
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
  a.download = `time_tracker_backup_${props.dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const triggerImport = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleImport = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target?.result as string;
    try {
      const importedData = JSON.parse(content);
      
      const keys = Object.keys(importedData);
      const isValid = keys.length > 0 && keys.every(k => k.startsWith('mini_tools_time_'));
      
      if (!isValid) {
        showErrorModal.value = true;
        return;
      }

      pendingImportData.value = importedData;
      showConfirmModal.value = true;
    } catch (err) {
      showErrorModal.value = true;
    }
  };

  reader.readAsText(file);
  input.value = '';
};

const executeImport = () => {
  if (!pendingImportData.value) return;

  // Remove existing keys
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('mini_tools_time_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));

  // Insert new keys
  Object.entries(pendingImportData.value).forEach(([k, v]) => {
    localStorage.setItem(k, JSON.stringify(v));
  });

  showConfirmModal.value = false;
  pendingImportData.value = null;

  // Reload page to reset state cleanly
  window.location.reload();
};

const cancelImport = () => {
  showConfirmModal.value = false;
  pendingImportData.value = null;
};
</script>

<template>
  <div class="export-actions">
    <div class="actions-wrapper">
      <button class="btn-secondary export-btn" @click="handleExport">
        {{ $t('export.btnExport') }}
      </button>

      <button class="btn-secondary import-btn" @click="triggerImport">
        {{ $t('export.btnImport') }}
      </button>
      
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none" 
        accept=".json" 
        @change="handleImport" 
      />
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-backdrop" @click.self="cancelImport">
      <div class="modal-content card">
        <div class="modal-header">
          <h3>Confirmar Importación</h3>
          <button class="close-btn" @click="cancelImport">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ $t('export.importConfirm') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cancelImport">{{ $t('summary.btnCancel') }}</button>
          <button class="btn-primary confirm-btn" @click="executeImport">{{ $t('summary.btnSave') }}</button>
        </div>
      </div>
    </div>

    <!-- Custom Error Modal -->
    <div v-if="showErrorModal" class="modal-backdrop" @click.self="showErrorModal = false">
      <div class="modal-content card">
        <div class="modal-header">
          <h3>Error de Importación</h3>
          <button class="close-btn" @click="showErrorModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ $t('export.importErrorInvalid') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showErrorModal = false">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.export-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.actions-wrapper {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.export-btn, .import-btn {
  flex: 1;
  padding: 0.75rem 1rem;
}

/* Modal styling matching TaskModal/EditTimeModal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  text-align: left;
}

.modal-content {
  width: 100%;
  max-width: 450px;
  margin: 1.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.modal-header h3 {
  font-size: 1.2rem;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--text-main);
}

.modal-body {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.confirm-btn {
  background-color: var(--error-color) !important;
  color: #ffffff !important;
}
</style>
