<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ValidFormValue } from '@/composables/useAwesomeFormValues';
import AppBar from '@/components/AppBar.vue';
import AwesomeForm from '@/components/AwesomeForm.vue';
import { useI18n } from 'vue-i18n';
import { commonMessages } from '@/plugins/i18n';

const { t } = useI18n({ messages: commonMessages });

const isFormValid = ref<boolean | null>(null);
const validFormValue = ref<ValidFormValue>();
const result = ref<string>();

const canSubmit = computed(() => isFormValid.value === true && validFormValue.value !== undefined);

const submit = () => {
  if (validFormValue.value === undefined) return;
  result.value = JSON.stringify(validFormValue.value, undefined, 2);
};
</script>

<template>
  <VApp>
    <AppBar />
    <VMain>
      <VContainer class="d-flex flex-column gr-4">
        <AwesomeForm
          v-model:is-valid="isFormValid"
          v-model:valid-form-value="validFormValue"
        />

        <VBtn
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ t('送信') }}
        </VBtn>

        <code v-if="result" class="bg-black text-pre-wrap">
          {{ result }}
        </code>
      </VContainer>
    </VMain>
  </VApp>
</template>
