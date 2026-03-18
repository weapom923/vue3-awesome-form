<script setup lang="ts">
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { mdiTranslate } from '@mdi/js';
import type { Locales } from '@/entities/locales';

const { locale } = useI18n<DefaultLocaleMessageSchema, Locales>();

const locales: { value: Locales; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
];
</script>

<template>
  <VAppBar>
    <VAppBarTitle>vue-vuetify-i18n-idea</VAppBarTitle>
    <template #append>
      <VBtn icon>
        <VIcon :icon="mdiTranslate" />
        <VMenu activator="parent">
          <VList>
            <VListItem
              v-for="item in locales"
              :key="item.value"
              :title="item.label"
              :active="locale === item.value"
              @click="locale = item.value"
            />
          </VList>
        </VMenu>
      </VBtn>
    </template>
  </VAppBar>
</template>
